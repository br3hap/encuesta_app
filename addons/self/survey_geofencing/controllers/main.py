# -*- coding: utf-8 -*-
from odoo import http
from odoo.http import request
from odoo.addons.survey.controllers.main import Survey
import logging

_logger = logging.getLogger(__name__)

class SurveyGeofencing(Survey):
    
    @http.route(['/survey/submit/<string:survey_token>/<string:answer_token>'], type='json', auth='public', website=True)
    def survey_submit(self, survey_token, answer_token, **post):
        """Hereda survey_submit para capturar lat/lon"""
        # Captura coordenadas del POST
        latitude = post.get('latitude')
        longitude = post.get('longitude')
        
        _logger.info(f"[Geofencing] POST recibido - Lat: {latitude}, Lon: {longitude}")
        _logger.info(f"[Geofencing] Datos POST: {list(post.keys())}")
        
        # Guarda coordenadas antes de procesar
        if latitude and longitude:
            try:
                user_input = request.env['survey.user_input'].sudo().search([
                    ('access_token', '=', answer_token)
                ], limit=1)
                
                if user_input:
                    user_input.write({
                        'latitude': float(latitude),
                        'longitude': float(longitude),
                    })
                    _logger.info(f"[Geofencing] Coordenadas guardadas en user_input ID: {user_input.id}")
            except Exception as e:
                _logger.error(f"[Geofencing] Error guardando coordenadas: {e}", exc_info=True)
        
        # Llama al método original
        return super().survey_submit(survey_token, answer_token, **post)
