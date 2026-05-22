# Survey Confirm Submit

## Descripción

Este módulo añade una confirmación antes de enviar una encuesta en Odoo 16, permitiendo al usuario confirmar o cancelar el envío, y mejora el comportamiento de las imágenes en las opciones de respuesta.

## Características

### 1. Modal de Confirmación
- Se muestra un modal de confirmación cuando el usuario intenta enviar la encuesta
- El modal incluye:
  - Título con icono de advertencia
  - Mensaje de confirmación
  - Botón "Cancelar y Salir" para cancelar la encuesta
  - Botón "Enviar Encuesta" para confirmar el envío

### 2. Estado de Cancelación
- Añade el estado "Cancelled" (Cancelado) a las respuestas de encuesta
- Al presionar "Cancelar y Salir" en el modal, la encuesta se marca como cancelada
- Permite marcar una encuesta como cancelada desde el backend
- Opción para reactivar encuestas canceladas

### 3. Botones en Backend
- **Cancelar Encuesta**: Marca la respuesta como cancelada
- **Reactivar Encuesta**: Restaura una encuesta cancelada a su estado anterior

### 4. Mejora en Imágenes de Respuesta
- **Desactiva el zoom de imágenes**: Las imágenes en las opciones de respuesta ya no se maximizan al hacer clic
- **Click para seleccionar**: Hacer clic en una imagen ahora solo marca/desmarca la opción correspondiente
- Mejora la experiencia de usuario al completar encuestas con opciones visuales

## Instalación

1. Copiar el módulo en la carpeta de addons de Odoo
2. Actualizar la lista de módulos: Settings > Apps > Update Apps List
3. Buscar "Survey Confirm Submit" e instalar

## Uso

### Para Usuarios (Frontend)
1. Completar la encuesta normalmente
2. Al hacer clic en "Submit" o "Enviar", aparecerá un modal de confirmación
3. Opciones:
   - **Enviar Encuesta**: Confirma y envía la encuesta
   - **Cancelar**: Cierra el modal sin enviar (permite seguir editando)

### Para Administradores (Backend)
1. Ir a Survey > Answers
2. Seleccionar una respuesta
3. Usar los botones:
   - **Cancel Survey**: Para marcar como cancelada
   - **Reactivate Survey**: Para reactivar una cancelada

## Detalles Técnicos

### Archivos Modificados/Creados

- **models/survey_user_input.py**: Extiende el modelo para añadir estado "cancelled"
- **views/survey_template.xml**: Añade el modal de confirmación al template de encuesta
- **views/survey_user_input_views.xml**: Añade botones de cancelar/reactivar en el formulario
- **static/src/js/survey_confirm.js**: Widget JavaScript para interceptar el submit y manejar la confirmación
- **static/src/js/survey_image_no_zoom.js**: Override para desactivar el zoom de imágenes en opciones
- **controllers/main.py**: Controlador para manejar la cancelación

### Compatibilidad

- Odoo 16.0
- Bootstrap 5 (incluido en Odoo 16)

## Autor

Breithner Aquituari

## Licencia

LGPL-3
