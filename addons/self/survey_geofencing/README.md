# Survey Geofencing - Odoo 16

Módulo para zonificación geográfica de encuestas en Odoo 16.

## Características

- Importa zonas desde archivos KMZ, KML o GeoJSON
- Captura automáticamente la ubicación del usuario al responder encuestas
- Verifica si el usuario está dentro de una zona definida
- Almacena coordenadas y zona detectada en cada respuesta

## Instalación

### 1. Instalar dependencias Python

```bash
pip install shapely fastkml geojson lxml
```

### 2. Instalar el módulo

1. Copiar la carpeta `survey_geofencing` a `addons/self/`
2. Actualizar lista de aplicaciones en Odoo
3. Instalar el módulo "Survey Geofencing"

## Uso

### Importar Zonas

1. Ir a **Geofencing > Importar KMZ/GeoJSON**
2. Ingresar nombre de la zona
3. Subir archivo KMZ, KML o GeoJSON
4. Clic en "Importar"

### Ver Zonas

- Ir a **Geofencing > Zonas Geográficas**
- Ver/editar zonas importadas

### Verificar Ubicación en Encuestas

1. El usuario responde una encuesta desde su navegador
2. El navegador solicita permiso de ubicación
3. Al enviar la encuesta, se capturan coordenadas
4. El sistema verifica automáticamente en qué zona está
5. Los datos se guardan en la respuesta

### Ver Datos de Ubicación

- Ir a **Encuestas > Respuestas**
- Abrir una respuesta
- Ver sección "Geolocalización" con:
  - Latitud
  - Longitud
  - Zona detectada
  - Estado de verificación

## Notas Técnicas

- Usa Geolocation API del navegador (requiere HTTPS en producción)
- Algoritmo point-in-polygon con Shapely
- Compatible con Polygon y MultiPolygon de GeoJSON
- Los campos de ubicación se agregan automáticamente al formulario de encuesta

## Troubleshooting

**Error: Librerías no instaladas**
```bash
pip install shapely fastkml geojson lxml
```

**Geolocalización no funciona**
- Verificar que el sitio use HTTPS
- Verificar permisos del navegador
- Revisar consola JavaScript para errores

**Zona no detectada**
- Verificar que el GeoJSON sea válido
- Verificar que las coordenadas estén en formato correcto (lon, lat)
- Revisar logs de Odoo para errores
