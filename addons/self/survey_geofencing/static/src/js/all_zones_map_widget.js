/** @odoo-module **/

import { registry } from "@web/core/registry";
import { Component, onMounted, useRef } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";
import { standardFieldProps } from "@web/views/fields/standard_field_props";

export class AllZonesMapWidget extends Component {
    setup() {
        this.orm = useService("orm");
        this.mapRef = useRef("map");
        this.map = null;
        
        onMounted(() => {
            setTimeout(() => this.initMap(), 200);
        });
    }
    
    async initMap() {
        const mapElement = this.mapRef.el;
        if (!mapElement || !window.L) return;
        
        this.map = L.map(mapElement).setView([-3.75, -73.25], 12);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(this.map);
        
        setTimeout(() => this.map.invalidateSize(), 100);
        
        await this.loadAllZones();
        await this.loadAllSurveys();
    }
    
    async loadAllZones() {
        const zones = await this.orm.searchRead("geo.zone", [["active", "=", true]], ["name", "geojson_data", "color"]);
        const allBounds = [];
        
        // Paleta de colores de Odoo (índices 0-11 para valores 1-12)
        const odooColors = [
            '#F06050', // Rojo
            '#F4A460', // Naranja
            '#F7CD1F', // Amarillo
            '#6CC1ED', // Azul claro
            '#814968', // Púrpura
            '#EB7E7F', // Rosa
            '#2C8397', // Azul
            '#475577', // Azul oscuro
            '#D6145F', // Magenta
            '#30C381', // Verde
            '#9365B8', // Violeta
            '#000000'  // Negro
        ];
        
        zones.forEach((zone) => {
            if (zone.geojson_data) {
                try {
                    const geojson = JSON.parse(zone.geojson_data);
                    
                    // Usar color de Odoo o azul por defecto
                    const colorIndex = zone.color ? (zone.color - 1) : 0;
                    const zoneColor = odooColors[colorIndex % odooColors.length];
                    
                    console.log(`Zona: ${zone.name}, Color index: ${zone.color}, Color hex: ${zoneColor}`);
                    
                    const layer = L.geoJSON(geojson, {
                        style: {
                            color: zoneColor,
                            weight: 2,
                            fillColor: zoneColor,
                            fillOpacity: 0.15
                        }
                    }).addTo(this.map);
                    
                    // Agregar etiqueta permanente con el nombre
                    const center = layer.getBounds().getCenter();
                    L.marker(center, {
                        icon: L.divIcon({
                            className: 'zone-label',
                            html: `<div style="background: white; padding: 2px 6px; border: 1px solid ${zoneColor}; border-radius: 3px; font-weight: bold; color: ${zoneColor}; white-space: nowrap; font-size: 12px;">${zone.name}</div>`,
                            iconSize: null
                        })
                    }).addTo(this.map);
                    
                    layer.bindPopup(`<b>${zone.name}</b>`);
                    allBounds.push(layer.getBounds());
                } catch (e) {
                    console.error('Error cargando zona:', zone.name, e);
                }
            }
        });
        
        if (allBounds.length > 0) {
            const group = L.featureGroup(allBounds.map(b => L.rectangle(b)));
            this.map.fitBounds(group.getBounds());
        }
    }
    
    async loadAllSurveys() {
        const surveys = await this.orm.searchRead(
            "survey.user_input",
            [["latitude", "!=", false], ["longitude", "!=", false]],
            ["latitude", "longitude", "create_date", "partner_id", "geo_zone_id"]
        );
        
        surveys.forEach(survey => {
            const marker = L.circleMarker([survey.latitude, survey.longitude], {
                radius: 5,
                fillColor: "#ff0000",
                color: "#fff",
                weight: 1,
                fillOpacity: 0.8
            }).addTo(this.map);
            
            const date = new Date(survey.create_date).toLocaleString();
            const partner = survey.partner_id ? survey.partner_id[1] : 'Anónimo';
            const zone = survey.geo_zone_id ? survey.geo_zone_id[1] : 'Sin zona';
            marker.bindPopup(`<b>${partner}</b><br>${date}<br>Zona: ${zone}`);
        });
    }
}

AllZonesMapWidget.template = "survey_geofencing.AllZonesMapWidget";
AllZonesMapWidget.props = {
    ...standardFieldProps,
};

registry.category("fields").add("all_zones_map", AllZonesMapWidget);
