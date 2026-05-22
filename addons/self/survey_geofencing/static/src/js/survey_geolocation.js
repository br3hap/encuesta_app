/** @odoo-module **/

import publicWidget from 'web.public.widget';

publicWidget.registry.SurveyGeolocation = publicWidget.Widget.extend({
    selector: '.o_survey_form',
    
    start: function () {
        this._super.apply(this, arguments);
        this._getLocationAndSave();
    },
    
    _getLocationAndSave: function () {
        const self = this;
        console.log('[Geofencing] Solicitando ubicación...');
        
        if (!navigator.geolocation) {
            console.warn('[Geofencing] Geolocalización no soportada');
            return;
        }
        
        // Obtener answer_token de la URL
        const urlParts = window.location.pathname.split('/');
        const answerToken = urlParts[urlParts.length - 1];
        
        navigator.geolocation.getCurrentPosition(
            function (position) {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                
                console.log('[Geofencing] ¡Ubicación capturada!');
                console.log('[Geofencing] Latitud:', lat);
                console.log('[Geofencing] Longitud:', lon);
                console.log('[Geofencing] Answer token:', answerToken);
                
                // Guardar coordenadas via AJAX
                self._saveCoordinates(answerToken, lat, lon);
            },
            function (error) {
                console.error('[Geofencing] Error:', error.message);
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0
            }
        );
    },
    
    _saveCoordinates: function (answerToken, lat, lon) {
        console.log('[Geofencing] Guardando coordenadas...');
        console.log('[Geofencing] Datos a guardar:', {answerToken, lat, lon});
        
        $.ajax({
            url: '/survey/save_location',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                jsonrpc: '2.0',
                method: 'call',
                params: {
                    answer_token: answerToken,
                    latitude: lat,
                    longitude: lon
                }
            }),
            success: function(response) {
                console.log('[Geofencing] Respuesta:', response);
                
                if (response.result && response.result.success) {
                    console.log('[Geofencing] ¡Coordenadas guardadas exitosamente!');
                    console.log('[Geofencing] User input ID:', response.result.user_input_id);
                    console.log('[Geofencing] Zona detectada:', response.result.zone || 'Ninguna');
                } else {
                    console.error('[Geofencing] Error:', response.result ? response.result.error : 'Unknown error');
                }
            },
            error: function(xhr, status, error) {
                console.error('[Geofencing] Error en AJAX:', {xhr, status, error});
                console.error('[Geofencing] Response text:', xhr.responseText);
            }
        });
    },
});

export default publicWidget.registry.SurveyGeolocation;
