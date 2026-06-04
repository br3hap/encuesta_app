# -*- coding: utf-8 -*-
from odoo import models, fields

class SurveyUserInput(models.Model):
    _inherit = 'survey.user_input'

    company_id = fields.Many2one(
        'res.company',
        string='Compañía',
        related='survey_id.company_id',
        store=True,
        readonly=True,
    )
