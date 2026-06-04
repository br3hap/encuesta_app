/** @odoo-module **/

import { registry } from "@web/core/registry";
import { Component, onMounted, useRef, onWillUpdateProps, onWillUnmount } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";
import { standardFieldProps } from "@web/views/fields/standard_field_props";

export class AllZonesMapWidget extends Component {
    setup() {
        this.orm = useService("orm");
        this.mapRef = useRef("map");
        this.map = null;
        this.surveyMarkersLayer = null;
        this._lastSurveyIds = [];
        this._pollInterval = null;

        onMounted(() => {
            setTimeout(() => this.initMap(), 200);
            this._pollInterval = setInterval(() => this._checkSurveyChange(), 500);
        });

        onWillUnmount(() => {
            if (this._pollInterval) clearInterval(this._pollInterval);
        });
    }

    _getSurveyIds() {
        return this.props.record.data.survey_ids?.currentIds || [];
    }

    _checkSurveyChange() {
        const current = JSON.stringify(this._getSurveyIds());
        const last = JSON.stringify(this._lastSurveyIds);
        if (current !== last && this.map) {
            this._lastSurveyIds = this._getSurveyIds();
            this.reloadSurveys(this._lastSurveyIds);
        }
    }

    async initMap() {
        const mapElement = this.mapRef.el;
        if (!mapElement || !window.L) return;

        this.map = L.map(mapElement).setView([-3.75, -73.25], 12);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(this.map);

        this.surveyMarkersLayer = L.layerGroup().addTo(this.map);
        setTimeout(() => this.map.invalidateSize(), 100);

        await this.loadAllZones();
        this._lastSurveyIds = this._getSurveyIds();
        await this.reloadSurveys(this._lastSurveyIds);
    }

    async loadAllZones() {
        const zones = await this.orm.searchRead("geo.zone", [["active", "=", true]], ["name", "geojson_data", "color"]);
        const allBounds = [];
        const odooColors = [
            '#F06050', '#F4A460', '#F7CD1F', '#6CC1ED', '#814968', '#EB7E7F',
            '#2C8397', '#475577', '#D6145F', '#30C381', '#9365B8', '#000000'
        ];

        zones.forEach((zone) => {
            if (!zone.geojson_data) return;
            try {
                const geojson = JSON.parse(zone.geojson_data);
                const zoneColor = odooColors[((zone.color || 1) - 1) % odooColors.length];

                const layer = L.geoJSON(geojson, {
                    style: { color: zoneColor, weight: 2, fillColor: zoneColor, fillOpacity: 0.15 }
                }).addTo(this.map);

                const center = layer.getBounds().getCenter();
                L.marker(center, {
                    icon: L.divIcon({
                        className: 'zone-label',
                        html: `<div style="background:white;padding:2px 6px;border:1px solid ${zoneColor};border-radius:3px;font-weight:bold;color:${zoneColor};white-space:nowrap;font-size:12px;">${zone.name}</div>`,
                        iconSize: null
                    })
                }).addTo(this.map);

                layer.bindPopup(`<b>${zone.name}</b>`);
                allBounds.push(layer.getBounds());
            } catch (e) {
                console.error('Error cargando zona:', zone.name, e);
            }
        });

        if (allBounds.length > 0) {
            const group = L.featureGroup(allBounds.map(b => L.rectangle(b)));
            this.map.fitBounds(group.getBounds());
        }
    }

    async reloadSurveys(surveyIds) {
        if (!this.surveyMarkersLayer) return;
        this.surveyMarkersLayer.clearLayers();

        const domain = [["latitude", "!=", false], ["longitude", "!=", false]];
        if (surveyIds && surveyIds.length > 0) {
            domain.push(["survey_id", "in", surveyIds]);
        }

        const inputs = await this.orm.searchRead(
            "survey.user_input",
            domain,
            ["latitude", "longitude", "create_date", "partner_id", "geo_zone_id", "survey_id"]
        );

        inputs.forEach(input => {
            const marker = L.circleMarker([input.latitude, input.longitude], {
                radius: 5, fillColor: "#ff0000", color: "#fff", weight: 1, fillOpacity: 0.8
            });
            const date = new Date(input.create_date).toLocaleString();
            const partner = input.partner_id ? input.partner_id[1] : 'Anónimo';
            const zone = input.geo_zone_id ? input.geo_zone_id[1] : 'Sin zona';
            const survey = input.survey_id ? input.survey_id[1] : '';
            marker.bindPopup(`<b>${partner}</b><br>${survey}<br>${date}<br>Zona: ${zone}`);
            this.surveyMarkersLayer.addLayer(marker);
        });
    }
}

AllZonesMapWidget.template = "survey_geofencing.AllZonesMapWidget";
AllZonesMapWidget.props = { ...standardFieldProps };

registry.category("fields").add("all_zones_map", AllZonesMapWidget);
