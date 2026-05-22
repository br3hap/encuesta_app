# -*- coding: utf-8 -*-
from odoo import http
from odoo.http import request
import logging

_logger = logging.getLogger(__name__)

class SurveyGeofencingPublic(http.Controller):
    
    @http.route('/survey/save_location', type='json', auth='public', website=True, csrf=False)
    def save_location(self, answer_token, latitude, longitude):
        """Guarda coordenadas para un survey.user_input"""
        try:
            _logger.info(f"[Geofencing] Recibiendo coordenadas - Token: {answer_token}, Lat: {latitude}, Lon: {longitude}")
            
            user_input = request.env['survey.user_input'].sudo().search([
                ('access_token', '=', answer_token)
            ], limit=1)
            
            if user_input:
                user_input.write({
                    'latitude': float(latitude),
                    'longitude': float(longitude),
                })
                _logger.info(f"[Geofencing] Coordenadas guardadas para user_input ID: {user_input.id}")
                _logger.info(f"[Geofencing] Zona detectada: {user_input.geo_zone_id.name if user_input.geo_zone_id else 'Ninguna'}")
                
                return {
                    'success': True,
                    'user_input_id': user_input.id,
                    'zone': user_input.geo_zone_id.name if user_input.geo_zone_id else None
                }
            else:
                _logger.warning(f"[Geofencing] No se encontró user_input con token: {answer_token}")
                return {'success': False, 'error': 'User input not found'}
                
        except Exception as e:
            _logger.error(f"[Geofencing] Error guardando coordenadas: {e}", exc_info=True)
            return {'success': False, 'error': str(e)}
