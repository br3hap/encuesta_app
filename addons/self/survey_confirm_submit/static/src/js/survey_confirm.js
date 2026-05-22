/** @odoo-module **/

import publicWidget from "@web/legacy/js/public/public_widget";

publicWidget.registry.SurveyConfirmSubmit = publicWidget.Widget.extend({
    selector: '.o_survey_form',
    
    /**
     * Initialize and intercept form submission
     */
    start: function () {
        console.log('[Survey Confirm] Widget initialized');
        var self = this;
        var isConfirming = false;
        var pendingSubmitter = null;

        // Find the form
        var $form = this.$el.find('form[role="form"]');
        
        if ($form.length === 0) {
            console.warn('[Survey Confirm] Form not found in selector');
            return this._super.apply(this, arguments);
        }

        console.log('[Survey Confirm] Form found, attaching handlers');

        // Get tokens from form data attributes
        var surveyToken = $form.data('survey-token');
        var answerToken = $form.data('answer-token');
        
        console.log('[Survey Confirm] Survey token:', surveyToken);
        console.log('[Survey Confirm] Answer token:', answerToken);

        // Use event delegation on document to catch all submit button clicks
        $(document).on('click.surveySubmitButton', 'button[type="submit"][value="finish"]', function(e) {
            if (isConfirming) {
                console.log('[Survey Confirm] Already confirming, allowing submit');
                return true;
            }

            console.log('[Survey Confirm] Finish button clicked, preventing default and showing modal');
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            
            pendingSubmitter = this;
            
            // Show modal using jQuery Bootstrap API
            var $modal = $('#surveyConfirmModal');
            if ($modal.length > 0) {
                console.log('[Survey Confirm] Modal element found, showing with jQuery');
                
                // Set cancel URL on the cancel button if tokens are available
                if (surveyToken && answerToken) {
                    var cancelUrl = '/survey/confirm/cancel/' + surveyToken + '/' + answerToken;
                    $('#surveyConfirmCancel').attr('data-cancel-url', cancelUrl);
                    console.log('[Survey Confirm] Cancel URL set:', cancelUrl);
                }
                
                $modal.modal({
                    backdrop: 'static',
                    keyboard: false
                });
                $modal.modal('show');
                console.log('[Survey Confirm] Modal should be visible now');
            } else {
                console.error('[Survey Confirm] Modal element #surveyConfirmModal not found in DOM!');
            }
            
            return false;
        });

        // Handle modal accept button
        $(document).on('click.surveyConfirmAccept', '#surveyConfirmAccept', function() {
            console.log('[Survey Confirm] Accept button clicked');
            
            // Hide modal
            $('#surveyConfirmModal').modal('hide');
            
            // Set confirming flag
            isConfirming = true;
            
            // Small delay to ensure modal is hidden
            setTimeout(function() {
                if (pendingSubmitter && $form.length > 0) {
                    console.log('[Survey Confirm] Submitting form');
                    
                    // Create hidden input to preserve button value
                    var $hiddenInput = $('<input>')
                        .attr('type', 'hidden')
                        .attr('name', pendingSubmitter.name || 'button_submit')
                        .attr('value', 'finish');
                    
                    $form.append($hiddenInput);
                    
                    // Trigger form submit
                    $form[0].submit();
                } else {
                    console.error('[Survey Confirm] Form or submitter not available');
                    isConfirming = false;
                }
            }, 100);
        });

        // Handle modal cancel button - redirect to cancel URL
        $(document).on('click.surveyConfirmCancel', '#surveyConfirmCancel', function() {
            console.log('[Survey Confirm] Cancel button clicked');
            
            var cancelUrl = $(this).attr('data-cancel-url');
            
            if (cancelUrl) {
                console.log('[Survey Confirm] Redirecting to cancel URL:', cancelUrl);
                window.location.href = cancelUrl;
            } else {
                console.log('[Survey Confirm] No cancel URL, just hiding modal');
                $('#surveyConfirmModal').modal('hide');
                pendingSubmitter = null;
                isConfirming = false;
            }
        });

        // Reset flag when modal is hidden
        $('#surveyConfirmModal').on('hidden.bs.modal', function () {
            console.log('[Survey Confirm] Modal hidden');
            if (!isConfirming) {
                pendingSubmitter = null;
            }
        });

        return this._super.apply(this, arguments);
    },

    /**
     * Cleanup
     */
    destroy: function () {
        console.log('[Survey Confirm] Destroying widget');
        $(document).off('.surveySubmitButton');
        $(document).off('.surveyConfirmAccept');
        $(document).off('.surveyConfirmCancel');
        $('#surveyConfirmModal').off('hidden.bs.modal');
        this._super();
    },
});

console.log('[Survey Confirm] Module loaded');
