# Documentación de Endpoints - CRUD de Cotizaciones (v2)

Esta documentación cubre la versión 2 de los endpoints para la gestión de cotizaciones, destacando las diferencias y mejoras respecto a la v1. Todas las rutas requieren autenticación.

---

## Diferencias Notables con la v1

- **Gestión Granular de Detalles:** La v2 introduce endpoints específicos para añadir y actualizar items (detalles) de una cotización de forma individual, sin tener que enviar la cotización completa.
- **Contexto de Petición (`ctx`):** Se pasa un objeto de contexto a las operaciones del modelo, lo que permite un manejo más avanzado de la lógica de negocio (ej. permisos, logging).
- **Endpoints de Listado y Eliminación:** En los archivos analizados, no se encontraron endpoints para listar todas las cotizaciones (`GET /`) ni para eliminar una cotización (`DELETE /:id`), sugiriendo que estas operaciones pueden estar en otro módulo o haber sido replanteadas.

---

## 1. Crear una nueva cotización

Crea una nueva cotización. La estructura del body parece ser más compleja y anidada que en la v1.

- **Método HTTP y Ruta:** `POST /api/v2/quotes`
- **Función del controlador:** `QuoteController.create`
- **Estructura esperada del Request Body:**
  ```json
  {
    "cliente_id": 123,
    "moneda_id": 1,
    // ... otros campos de la cabecera de la cotización
    "details": [
      {
        "producto_id": 101,
        "cantidad": 2,
        "precio_unitario": 500.00,
        "margen": 0.15, // Posible nuevo campo para cálculos de precios
        // ... otros campos del detalle
      }
    ]
  }
  ```
- **Estructura de la Respuesta (Éxito):**
  ```json
  {
    "code": 201,
    "data": {
      "id": 10, // Nuevo ID de la cotización
      // ... datos de la cotización creada
    }
  }
  ```

---

## 2. Obtener detalles de una cotización

Recupera los detalles completos de una cotización específica por su ID.

- **Método HTTP y Ruta:** `GET /api/v2/quotes/:quoteId`
- **Función del controlador:** `QuoteController.getById`
- **Estructura de la Respuesta (Éxito):**
  ```json
  {
    "code": 200,
    "data": {
      "id": 10,
      "cliente_id": 123,
      "details": [
        {
          "id": 1,
          "producto_id": 101,
          "cantidad": 2,
          "precio_calculado": 575.00 // Posible campo calculado en la v2
        }
      ]
      // ... otros campos
    }
  }
  ```

---

## 3. Añadir detalles a una cotización

Añade uno o más items (detalles) a una cotización existente.

- **Método HTTP y Ruta:** `POST /api/v2/quotes/:quoteId/details`
- **Función del controlador:** `QuoteController.addDetails`
- **Estructura esperada del Request Body:**
  ```json
  [
    {
      "producto_id": 102,
      "cantidad": 1,
      "precio_unitario": 1200.00,
      "margen": 0.20
    }
  ]
  ```
- **Estructura de la Respuesta (Éxito):**
  ```json
  {
    "code": 201,
    "data": {
      // ... detalles de los items añadidos
    }
  }
  ```

---

## 4. Actualizar un detalle de la cotización

Actualiza un item específico dentro de una cotización.

- **Método HTTP y Ruta:** `PUT /api/v2/quotes/:quoteId/details/:quoteDetailId`
- **Función del controlador:** `QuoteController.updateDetail`
- **Estructura esperada del Request Body:**
  ```json
  {
    "cantidad": 3,
    "margen": 0.18
    // ... otros campos del detalle a actualizar
  }
  ```
- **Estructura de la Respuesta (Éxito):**
  ```json
  {
    "code": 200,
    "data": {
      "id": 1,
      "cantidad": 3,
      "margen": 0.18,
      "precio_recalculado": 600.00 // Precio actualizado
    }
  }