# -*- coding: utf-8 -*-
from odoo import models, fields, api
from odoo.exceptions import UserError
import base64
import json
import zipfile
import io
import logging

_logger = logging.getLogger(__name__)

class ImportKmzWizard(models.TransientModel):
    _name = 'import.kmz.wizard'
    _description = 'Importar KMZ/KML'
    
    name = fields.Char('Nombre de la Zona', required=True)
    file = fields.Binary('Archivo KMZ/KML/GeoJSON', required=True)
    filename = fields.Char('Nombre del Archivo')
    
    def action_import(self):
        self.ensure_one()
        
        try:
            file_data = base64.b64decode(self.file)
            filename = self.filename.lower()
            
            if filename.endswith('.kmz'):
                geojson_data = self._convert_kmz_to_geojson(file_data)
            elif filename.endswith('.kml'):
                geojson_data = self._convert_kml_to_geojson(file_data)
            elif filename.endswith('.geojson') or filename.endswith('.json'):
                geojson_data = file_data.decode('utf-8')
            else:
                raise UserError('Formato no soportado. Use KMZ, KML o GeoJSON.')
            
            # Valida que sea JSON válido
            json.loads(geojson_data)
            
            # Crea la zona
            self.env['geo.zone'].create({
                'name': self.name,
                'geojson_data': geojson_data,
            })
            
            return {
                'type': 'ir.actions.client',
                'tag': 'display_notification',
                'params': {
                    'title': 'Éxito',
                    'message': f'Zona "{self.name}" importada correctamente',
                    'type': 'success',
                    'sticky': False,
                }
            }
            
        except Exception as e:
            _logger.error(f"Error importando archivo: {e}")
            raise UserError(f'Error al importar: {str(e)}')
    
    def _convert_kmz_to_geojson(self, kmz_data):
        """Convierte KMZ a GeoJSON"""
        try:
            from fastkml import kml
            import geojson
            from shapely.geometry import mapping
            
            # Extrae KML del KMZ
            with zipfile.ZipFile(io.BytesIO(kmz_data)) as kmz:
                kml_file = None
                for name in kmz.namelist():
                    if name.endswith('.kml'):
                        kml_file = kmz.read(name)
                        break
                
                if not kml_file:
                    raise UserError('No se encontró archivo KML dentro del KMZ')
            
            return self._convert_kml_to_geojson(kml_file)
            
        except ImportError:
            raise UserError('Librería fastkml no instalada. Ejecute: pip install fastkml')
    
    def _convert_kml_to_geojson(self, kml_data):
        """Convierte KML a GeoJSON"""
        try:
            from fastkml import kml
            import geojson
            from shapely.geometry import mapping
            
            k = kml.KML()
            k.from_string(kml_data)
            
            features = []
            for document in k.features():
                for folder in document.features():
                    for placemark in folder.features():
                        if placemark.geometry:
                            feature = geojson.Feature(
                                geometry=mapping(placemark.geometry),
                                properties={'name': placemark.name}
                            )
                            features.append(feature)
            
            if not features:
                raise UserError('No se encontraron geometrías en el archivo')
            
            feature_collection = geojson.FeatureCollection(features)
            return geojson.dumps(feature_collection)
            
        except ImportError:
            raise UserError('Librerías no instaladas. Ejecute: pip install fastkml geojson shapely')
