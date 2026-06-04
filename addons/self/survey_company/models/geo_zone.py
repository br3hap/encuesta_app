# -*- coding: utf-8 -*-
from odoo import models, fields

class GeoZone(models.Model):
    _inherit = 'geo.zone'

    company_id = fields.Many2one(
        'res.company',
        string='Compañía',
        default=lambda self: self.env.company,
    )
