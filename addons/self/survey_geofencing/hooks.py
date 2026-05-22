# -*- coding: utf-8 -*-
from odoo import api, SUPERUSER_ID

def _create_demo_zones(cr, registry):
    """Crea zonas de ejemplo de Iquitos al instalar el módulo"""
    env = api.Environment(cr, SUPERUSER_ID, {})
    
    zones_data = [
        {
            'name': 'Centro de Iquitos',
            'geojson_data': '{"type":"FeatureCollection","features":[{"type":"Feature","properties":{"name":"Centro de Iquitos"},"geometry":{"type":"Polygon","coordinates":[[[-73.2550,-3.7450],[-73.2450,-3.7450],[-73.2450,-3.7550],[-73.2550,-3.7550],[-73.2550,-3.7450]]]}}]}',
            'active': True,
        },
        {
            'name': 'Belén',
            'geojson_data': '{"type":"FeatureCollection","features":[{"type":"Feature","properties":{"name":"Belén"},"geometry":{"type":"Polygon","coordinates":[[[-73.2650,-3.7600],[-73.2500,-3.7600],[-73.2500,-3.7700],[-73.2650,-3.7700],[-73.2650,-3.7600]]]}}]}',
            'active': True,
        },
        {
            'name': 'Punchana',
            'geojson_data': '{"type":"FeatureCollection","features":[{"type":"Feature","properties":{"name":"Punchana"},"geometry":{"type":"Polygon","coordinates":[[[-73.2400,-3.7300],[-73.2200,-3.7300],[-73.2200,-3.7500],[-73.2400,-3.7500],[-73.2400,-3.7300]]]}}]}',
            'active': True,
        },
        {
            'name': 'San Juan Bautista',
            'geojson_data': '{"type":"FeatureCollection","features":[{"type":"Feature","properties":{"name":"San Juan Bautista"},"geometry":{"type":"Polygon","coordinates":[[[-73.2700,-3.7400],[-73.2550,-3.7400],[-73.2550,-3.7600],[-73.2700,-3.7600],[-73.2700,-3.7400]]]}}]}',
            'active': True,
        },
    ]
    
    GeoZone = env['geo.zone']
    for zone_data in zones_data:
        # Solo crea si no existe
        existing = GeoZone.search([('name', '=', zone_data['name'])], limit=1)
        if not existing:
            GeoZone.create(zone_data)
