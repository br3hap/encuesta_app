# Ejemplos de Zonas Geográficas - Iquitos, Perú

## 1. Crear manualmente desde Odoo

Ve a **Geofencing > Zonas Geográficas > Crear** y pega uno de estos GeoJSON:

### Zona Centro de Iquitos
```json
{
  "type": "FeatureCollection",
  "features": [{
    "type": "Feature",
    "properties": {"name": "Centro de Iquitos"},
    "geometry": {
      "type": "Polygon",
      "coordinates": [[
        [-73.2550, -3.7450],
        [-73.2450, -3.7450],
        [-73.2450, -3.7550],
        [-73.2550, -3.7550],
        [-73.2550, -3.7450]
      ]]
    }
  }]
}
```

### Zona Belén
```json
{
  "type": "FeatureCollection",
  "features": [{
    "type": "Feature",
    "properties": {"name": "Belén"},
    "geometry": {
      "type": "Polygon",
      "coordinates": [[
        [-73.2650, -3.7600],
        [-73.2500, -3.7600],
        [-73.2500, -3.7700],
        [-73.2650, -3.7700],
        [-73.2650, -3.7600]
      ]]
    }
  }]
}
```

### Zona Punchana
```json
{
  "type": "FeatureCollection",
  "features": [{
    "type": "Feature",
    "properties": {"name": "Punchana"},
    "geometry": {
      "type": "Polygon",
      "coordinates": [[
        [-73.2400, -3.7300],
        [-73.2200, -3.7300],
        [-73.2200, -3.7500],
        [-73.2400, -3.7500],
        [-73.2400, -3.7300]
      ]]
    }
  }]
}
```

### Zona San Juan Bautista
```json
{
  "type": "FeatureCollection",
  "features": [{
    "type": "Feature",
    "properties": {"name": "San Juan Bautista"},
    "geometry": {
      "type": "Polygon",
      "coordinates": [[
        [-73.2700, -3.7400],
        [-73.2550, -3.7400],
        [-73.2550, -3.7600],
        [-73.2700, -3.7600],
        [-73.2700, -3.7400]
      ]]
    }
  }]
}
```

## 2. Descargar KMZ de ejemplo

Puedes obtener archivos KMZ de:

- **Google My Maps**: https://www.google.com/maps/d/
  1. Crea un mapa centrado en Iquitos (-3.7500, -73.2500)
  2. Dibuja polígonos sobre los distritos
  3. Exporta como KML/KMZ

- **geojson.io**: https://geojson.io/
  1. Centra el mapa en Iquitos
  2. Dibuja polígonos
  3. Copia el GeoJSON generado

## 3. Coordenadas de prueba en Iquitos

Para probar que un punto está dentro de una zona:

**Centro de Iquitos:**
- Latitud: -3.7500
- Longitud: -73.2500

**Belén:**
- Latitud: -3.7650
- Longitud: -73.2575

**Punchana:**
- Latitud: -3.7400
- Longitud: -73.2300

**San Juan Bautista:**
- Latitud: -3.7500
- Longitud: -73.2625

## 4. Instalar datos demo

Los datos demo se instalan automáticamente al instalar el módulo.
Si ya lo instalaste, actualiza con:

```bash
docker exec odoo16survey odoo -u survey_geofencing -d postgres --stop-after-init
```

O desde la interfaz: Apps > Survey Geofencing > Actualizar
