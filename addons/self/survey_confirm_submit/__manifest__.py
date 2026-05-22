# -*- coding: utf-8 -*-
{
    'name': 'Survey Confirm Submit',
    'version': '16.0.1.0.0',
    'summary': 'Add confirmation dialog before submitting surveys with cancellation tracking and disable image zoom',
    'description': """
Survey Confirmation and Cancellation
=====================================

This module adds a confirmation dialog when users try to submit a survey and improves image answer behavior.

Features:
---------
* Modal confirmation dialog before survey submission
* Cancel and exit button to mark survey as cancelled
* Backend buttons to mark surveys as cancelled
* Reactivate cancelled surveys
* New 'Cancelled' state for survey responses
* Disable image zoom on answer options - click to select instead of zooming

Technical:
----------
* Extends survey.user_input model
* Adds JavaScript widget to intercept form submission
* Uses Bootstrap 5 modal
* Custom controller for cancellation handling
    """,
    'author': 'Breithner Aquituari',
    'website': '',
    'category': 'Marketing/Surveys',
    'depends': ['survey'],
    'data': [
        'views/survey_template.xml',
        'views/survey_user_input_views.xml',
    ],
    'assets': {
        'web.assets_frontend': [
            # 'survey_confirm_submit/static/src/css/survey_no_zoom.css',
            'survey_confirm_submit/static/src/js/survey_confirm.js',
            # 'survey_confirm_submit/static/src/js/survey_image_no_zoom.js',
        ],
    },
    'images': [],
    'application': False,
    'installable': True,
    'auto_install': False,
    'license': 'LGPL-3',
}
