# -*- coding: utf-8 -*-
from odoo import models, fields, api
import json
import logging

_logger = logging.getLogger(__name__)

class GeoZone(models.Model):
    _name = 'geo.zone'
    _description = 'Zona Geográfica'
    
    name = fields.Char('Nombre', required=True)
    geojson_data = fields.Text('GeoJSON Data', required=True)
    active = fields.Boolean('Activo', default=True)
    color = fields.Integer('Color', default=1)
    
    def point_in_zone(self, lat, lon):
        """Verifica si un punto está dentro de la zona"""
        self.ensure_one()
        try:
            from shapely.geometry import shape, Point
            
            geojson = json.loads(self.geojson_data)
            
            # Maneja diferentes estructuras de GeoJSON
            if 'features' in geojson:
                geometry = geojson['features'][0]['geometry']
            elif 'geometry' in geojson:
                geometry = geojson['geometry']
            else:
                geometry = geojson
            
            polygon = shape(geometry)
            point = Point(lon, lat)
            return polygon.contains(point)
        except Exception as e:
            _logger.error(f"Error verificando punto en zona: {e}")
            return False
