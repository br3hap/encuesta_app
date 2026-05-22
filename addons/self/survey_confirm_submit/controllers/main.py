# -*- coding: utf-8 -*-
import logging

from odoo import http, _
from odoo.http import request

_logger = logging.getLogger(__name__)


class SurveyConfirmSubmitController(http.Controller):
    
    @http.route('/survey/confirm/cancel/<string:survey_token>/<string:answer_token>', 
                type='http', auth='public', website=True, csrf=False)
    def cancel_survey(self, survey_token, answer_token, **kwargs):
        """
        Cancel the survey submission and redirect back to start
        """
        try:
            # Find survey by access token
            survey = request.env['survey.survey'].sudo().search([
                ('access_token', '=', survey_token)
            ], limit=1)
            
            if not survey:
                _logger.warning('Survey not found with token: %s', survey_token)
                return request.render('http_routing.404')
            
            # Find answer by access token
            answer = request.env['survey.user_input'].sudo().search([
                ('access_token', '=', answer_token),
                ('survey_id', '=', survey.id)
            ], limit=1)
            
            if not answer:
                _logger.warning('Answer not found with token: %s for survey: %s', answer_token, survey.id)
                return request.render('http_routing.404')
            
            # Cancel the survey
            _logger.info('Cancelling survey submission for answer: %s', answer.id)
            answer.action_cancel_survey()
            
            # Redirect back to the survey start page
            redirect_url = f'/survey/start/{survey_token}'
            return request.redirect(redirect_url)
            
        except Exception as e:
            _logger.error('Error cancelling survey: %s', str(e), exc_info=True)
            return request.render('http_routing.http_error', {
                'status_code': _('500'),
                'status_message': _('Internal Server Error'),
            })
