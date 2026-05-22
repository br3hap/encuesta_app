# -*- coding: utf-8 -*-
from odoo import models, fields

class GeoZone(models.Model):
    _inherit = 'geo.zone'
    
    map_view = fields.Char('Mapa', default='map', readonly=True)
