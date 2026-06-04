# -*- coding: utf-8 -*-
from odoo import models, fields

class GeoZoneMapView(models.TransientModel):
    _name = 'geo.zone.map.view'
    _description = 'Vista de Mapa General'

    map_view = fields.Char('Mapa', default='all_zones')
    survey_ids = fields.Many2many('survey.survey', string='Filtrar por Encuesta')
