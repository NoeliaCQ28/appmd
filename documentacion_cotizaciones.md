# Documentación de Endpoints - CRUD de Cotizaciones

A continuación se detallan los principales endpoints para la gestión de cotizaciones en el sistema. Todas las rutas requieren autenticación a través del `authMiddleware`.

---

## 1. Listar todas las cotizaciones

Recupera una lista de todas las cotizaciones.

- **Método HTTP y Ruta:** `GET /api/quotes`
- **Función del controlador:** `QuoteController.getAll`
- **Middleware aplicado:** `authMiddleware`
- **Estructura del Request Body:** No aplica.
- **Estructura de la Respuesta (Éxito):**
  ```json
  {
    "code": 200,
    "data": [
      {
        "id": 1,
        "cliente_id": 123,
        "usuario_id": 45,
        "estado": "Pendiente",
        "fecha_creacion": "2023-10-27T10:00:00Z",
        // ... otros campos de la cotización
      }
    ]
  }
  ```
- **Estructura de la Respuesta (Error):**
  ```json
  {
    "code": 404,
    "message": "No se encontraron cotizaciones."
  }
  ```

---

## 2. Obtener una cotización por ID

Recupera una cotización específica por su ID.

- **Método HTTP y Ruta:** `GET /api/quotes/:id`
- **Función del controlador:** `QuoteController.getById`
- **Middleware aplicado:** `authMiddleware`
- **Estructura del Request Body:** No aplica.
- **Estructura de la Respuesta (Éxito):**
  ```json
  {
    "code": 200,
    "data": {
      "id": 1,
      "cliente_id": 123,
      "usuario_id": 45,
      "estado": "Pendiente",
      "detalles": [
        // ... items de la cotización
      ]
      // ... otros campos
    }
  }
  ```- **Estructura de la Respuesta (Error):**
  ```json
  {
    "code": 404,
    "message": "Cotización con ID 999 no encontrada."
  }
  ```

---

## 3. Crear una nueva cotización

Crea una nueva cotización en el sistema.

- **Método HTTP y Ruta:** `POST /api/quotes`
- **Función del controlador:** `QuoteController.create`
- **Middleware aplicado:** `authMiddleware`
- **Estructura esperada del Request Body:**
  ```json
  {
    "cliente_id": 123,
    "moneda_id": 1,
    "condicion_comercial_id": 2,
    "observaciones": "Observaciones de la cotización.",
    "items": [
      {
        "producto_id": 101,
        "cantidad": 2,
        "precio_unitario": 500.00
      }
    ]
    // ... otros campos necesarios para la creación
  }
  ```- **Estructura de la Respuesta (Éxito):**
  ```json
  {
    "code": 201,
    "data": {
      "id": 2, // ID de la nueva cotización
      "cliente_id": 123,
      "usuario_id": 45, // ID del usuario que crea
      "estado": "Pendiente",
      // ... resto de campos
    }
  }
  ```
- **Estructura de la Respuesta (Error):**
  ```json
  {
    "code": 400,
    "message": "Datos de entrada inválidos.",
    "errors": [
      "El campo 'cliente_id' es requerido."
    ]
  }
  ```
- **Estructura de la Respuesta (Error):**
  ```json
  {
    "code": 400,
    "message": "Datos de entrada inválidos para la actualización."
  }
  ```

---

## 4. Actualizar una cotización

Actualiza los datos de una cotización existente.

- **Método HTTP y Ruta:** `PUT /api/quotes/:id`
- **Función del controlador:** `QuoteController.update`
- **Middleware aplicado:** `authMiddleware`
- **Estructura esperada del Request Body:**
  ```json
  {
    "observaciones": "Nuevas observaciones actualizadas.",
    "condicion_comercial_id": 3
    // ... otros campos a actualizar
  }
  ```
- **Estructura de la Respuesta (Error):**
  ```json
  {
    "code": 404,
    "message": "Cotización con ID 999 no encontrada para eliminar."
  }
  ```
- **Estructura de la Respuesta (Éxito):**
  ```json
  {
    "code": 200,
    "data": {
      "id": 1,
      "observaciones": "Nuevas observaciones actualizadas.",
      "condicion_comercial_id": 3,
      // ... resto de campos actualizados
    }
  }
  ```

---

## 5. Eliminar una cotización

Elimina una cotización del sistema.

- **Método HTTP y Ruta:** `DELETE /api/quotes/:id`
- **Función del controlador:** `QuoteController.delete`
- **Middleware aplicado:** `authMiddleware`
- **Estructura del Request Body:** No aplica.
- **Estructura de la Respuesta (Éxito):**
  ```json
  {
    "code": 200,
    "message": "Cotización eliminada exitosamente."
  }