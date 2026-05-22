/** @odoo-module **/

import { registry } from "@web/core/registry";
import { Component, onWillStart, onMounted, useRef } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";
import { standardFieldProps } from "@web/views/fields/standard_field_props";

export class GeoZoneMapWidget extends Component {
    setup() {
        this.orm = useService("orm");
        this.mapRef = useRef("map");
        this.map = null;
        
        console.log('[Map Widget] Setup iniciado');
        console.log('[Map Widget] Props:', this.props);
        
        onMounted(() => {
            console.log('[Map Widget] Componente montado');
            setTimeout(() => this.initMap(), 200);
        });
    }
    
    async initMap() {
        console.log('[Map Widget] Inicializando mapa...');
        const mapElement = this.mapRef.el;
        
        if (!mapElement) {
            console.error('[Map Widget] Elemento del mapa no encontrado');
            return;
        }
        
        console.log('[Map Widget] Dimensiones del elemento:', {
            width: mapElement.offsetWidth,
            height: mapElement.offsetHeight,
            display: window.getComputedStyle(mapElement).display
        });
        
        if (!window.L) {
            console.error('[Map Widget] Leaflet no está cargado');
            return;
        }
        
        console.log('[Map Widget] Creando mapa Leaflet...');
        
        try {
            // Crear mapa centrado en Iquitos
            this.map = L.map(mapElement).setView([-3.75, -73.25], 13);
            
            // Agregar tiles de OpenStreetMap
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 19
            }).addTo(this.map);
            
            // Forzar redibujado del mapa
            setTimeout(() => {
                this.map.invalidateSize();
                console.log('[Map Widget] Mapa redibujado');
            }, 100);
            
            console.log('[Map Widget] Mapa creado exitosamente');
            
            // Cargar y pintar polígono
            await this.loadZonePolygon();
            
            // Cargar y pintar puntos de encuestas
            await this.loadSurveyPoints();
        } catch (e) {
            console.error('[Map Widget] Error creando mapa:', e);
        }
    }
    
    async loadZonePolygon() {
        console.log('[Map Widget] Cargando polígono...');
        const geojsonData = this.props.record.data.geojson_data;
        
        if (!geojsonData) {
            console.warn('[Map Widget] No hay datos GeoJSON');
            return;
        }
        
        try {
            const geojson = JSON.parse(geojsonData);
            console.log('[Map Widget] GeoJSON parseado:', geojson);
            
            const layer = L.geoJSON(geojson, {
                style: {
                    color: '#3388ff',
                    weight: 3,
                    fillOpacity: 0.2
                }
            }).addTo(this.map);
            
            this.map.fitBounds(layer.getBounds());
            console.log('[Map Widget] Polígono cargado');
        } catch (e) {
            console.error('[Map Widget] Error cargando polígono:', e);
        }
    }
    
    async loadSurveyPoints() {
        console.log('[Map Widget] Cargando puntos de encuestas...');
        const zoneId = this.props.record.data.id;
        
        if (!zoneId) {
            console.warn('[Map Widget] No hay ID de zona');
            return;
        }
        
        try {
            const surveys = await this.orm.searchRead(
                "survey.user_input",
                [["geo_zone_id", "=", zoneId], ["state", "=", "done"]],
                ["latitude", "longitude", "create_date", "partner_id"]
            );
            
            console.log('[Map Widget] Encuestas encontradas:', surveys.length);
            
            // Agrupar por coordenadas
            const pointGroups = {};
            surveys.forEach(survey => {
                if (survey.latitude && survey.longitude) {
                    const key = `${survey.latitude},${survey.longitude}`;
                    if (!pointGroups[key]) {
                        pointGroups[key] = [];
                    }
                    pointGroups[key].push(survey);
                }
            });
            
            // Crear marcadores con tooltips agrupados
            Object.entries(pointGroups).forEach(([coords, groupSurveys]) => {
                const [lat, lng] = coords.split(',').map(Number);
                const marker = L.circleMarker([lat, lng], {
                    radius: 6,
                    fillColor: "#ff0000",
                    color: "#fff",
                    weight: 2,
                    opacity: 1,
                    fillOpacity: 0.8
                }).addTo(this.map);
                
                const popupContent = groupSurveys.map(s => {
                    const partner = s.partner_id ? s.partner_id[1] : 'Anónimo';
                    const date = new Date(s.create_date).toLocaleDateString();
                    return `• ${partner} (${date})`;
                }).join('<br>');
                
                const tooltipText = groupSurveys.length > 1 ? `${groupSurveys.length} encuestas` : partners[0];
                marker.bindTooltip(tooltipText, {permanent: false, direction: 'top'});
                marker.bindPopup(`<b>Encuestas:</b><br>${popupContent}`, {maxWidth: 300});
            });
            
            console.log('[Map Widget] Puntos cargados');
        } catch (e) {
            console.error('[Map Widget] Error cargando puntos:', e);
        }
    }
}

GeoZoneMapWidget.template = "survey_geofencing.GeoZoneMapWidget";
GeoZoneMapWidget.props = {
    ...standardFieldProps,
};

registry.category("fields").add("geo_zone_map", GeoZoneMapWidget);
