# -*- coding: utf-8 -*-
{
    'name': 'Survey Geofencing',
    'version': '16.0.2.0.0',
    'category': 'Marketing/Surveys',
    'summary': 'Zonificación geográfica para encuestas',
    'description': """
        Permite importar zonas desde KMZ/GeoJSON y validar la ubicación
        del usuario al enviar encuestas.
    """,
    'depends': ['survey', 'web'],
    'data': [
        'security/ir.model.access.csv',
        'views/geo_zone_views.xml',
        'views/geo_zone_map_view_views.xml',
        'views/survey_user_input_views.xml',
        # 'wizard/import_kmz_wizard_views.xml',
    ],
    'demo': [
        'data/demo_data.xml',
    ],
    'assets': {
        'web.assets_frontend': [
            'survey_geofencing/static/src/js/survey_geolocation.js',
        ],
        'web.assets_backend': [
            'survey_geofencing/static/src/lib/leaflet.css',
            'survey_geofencing/static/src/lib/leaflet.js',
            'survey_geofencing/static/src/css/geo_zone_map.css',
            'survey_geofencing/static/src/js/geo_zone_map_widget.js',
            'survey_geofencing/static/src/js/all_zones_map_widget.js',
            'survey_geofencing/static/src/xml/geo_zone_map_widget.xml',
            'survey_geofencing/static/src/xml/all_zones_map_widget.xml',
        ],
    },
    'external_dependencies': {
        'python': ['shapely', 'fastkml', 'geojson'],
    },
    'post_init_hook': '_create_demo_zones',
    'installable': True,
    'application': False,
    'license': 'LGPL-3',
}
