odoo.define('survey_confirm_submit.no_image_zoom', function (require) {
'use strict';

var publicWidget = require('web.public.widget');

/**
 * Override the survey form widget to prevent image zoom on click.
 * Instead, clicking the image will select the associated answer option.
 */
publicWidget.registry.SurveyFormWidget.include({
    
    /**
     * Override the _onChoiceImgClick method to prevent image zoom.
     * When user clicks on an answer image, it should only select the option,
     * not open the image in a zoom modal.
     * 
     * @override
     * @private
     * @param {Event} ev
     */
    _onChoiceImgClick: function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        
        // Find the label containing this image
        var $img = $(ev.currentTarget);
        var $label = $img.closest('label');
        
        if ($label.length > 0) {
            // Find the input (radio or checkbox) within this label
            var $input = $label.find('input[type="radio"], input[type="checkbox"]');
            
            if ($input.length > 0) {
                // Toggle the checked state
                if ($input.attr('type') === 'radio') {
                    // For radio buttons, just click it (browser will handle the selection)
                    $input.click();
                } else if ($input.attr('type') === 'checkbox') {
                    // For checkboxes, toggle the checked state
                    $input.prop('checked', !$input.prop('checked')).trigger('change');
                }
            }
        }
        
        // Do NOT open the image zoomer
        // (Original code created a SurveyImageZoomer here, we're removing that)
    },
    
});

console.log('[Survey No Image Zoom] Module loaded - images will not zoom on click');

});
