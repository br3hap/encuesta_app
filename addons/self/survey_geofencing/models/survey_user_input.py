# -*- coding: utf-8 -*-
from odoo import models, fields, api
from odoo.exceptions import ValidationError
import logging

_logger = logging.getLogger(__name__)

class SurveyUserInput(models.Model):
    _inherit = 'survey.user_input'
    
    latitude = fields.Float('Latitud', digits=(10, 7))
    longitude = fields.Float('Longitud', digits=(10, 7))
    geo_zone_id = fields.Many2one('geo.zone', 'Zona Detectada', readonly=True)
    location_verified = fields.Boolean('Ubicación Verificada', default=False)
    
    def write(self, vals):
        # Captura y procesa coordenadas
        if 'latitude' in vals or 'longitude' in vals:
            for record in self:
                lat = vals.get('latitude', record.latitude)
                lon = vals.get('longitude', record.longitude)
                
                _logger.info(f"[Geofencing] Procesando coordenadas - Lat: {lat}, Lon: {lon}")
                
                if lat and lon:
                    zone = self._find_zone(lat, lon)
                    if zone:
                        vals['geo_zone_id'] = zone.id
                        vals['location_verified'] = True
                        _logger.info(f"[Geofencing] Zona detectada: {zone.name}")
                    else:
                        _logger.warning(f"[Geofencing] No se encontró zona para las coordenadas")
        
        return super().write(vals)
    
    def _find_zone(self, lat, lon):
        """Encuentra la zona que contiene el punto"""
        zones = self.env['geo.zone'].search([('active', '=', True)])
        for zone in zones:
            if zone.point_in_zone(lat, lon):
                return zone
        return False
