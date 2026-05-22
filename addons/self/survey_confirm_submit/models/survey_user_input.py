# -*- coding: utf-8 -*-
import logging

from odoo import models, fields, api, _
from odoo.exceptions import UserError

_logger = logging.getLogger(__name__)


class SurveyUserInput(models.Model):
    _inherit = 'survey.user_input'
    
    # Add 'cancelled' state to the selection field
    state = fields.Selection(
        selection_add=[('cancelled', 'Cancelled')],
        ondelete={'cancelled': 'set default'}
    )
    
    def action_cancel_survey(self):
        """Mark the survey as cancelled"""
        for record in self:
            if record.state == 'cancelled':
                raise UserError(_('This survey is already cancelled.'))
            
            _logger.info('Cancelling survey user input ID: %s (previous state: %s)', record.id, record.state)
            record.write({'state': 'cancelled'})
            
        return True
    
    def action_un_cancel_survey(self):
        """Reactivate a cancelled survey"""
        for record in self:
            if record.state == 'cancelled':
                _logger.info('Reactivating cancelled survey user input ID: %s', record.id)
                # Set back to in_progress if there are answers, otherwise new
                new_state = 'in_progress' if record.user_input_line_ids else 'new'
                record.write({'state': new_state})
                
        return True
