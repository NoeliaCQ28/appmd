# Análisis de Servicios del Frontend - Consumo de API de Cotizaciones

Este documento detalla cómo los servicios del frontend (`quoteService.js` y `v2/QuoteService.js`) consumen los endpoints del backend para la gestión de cotizaciones.

---

## 1. `quoteService.js` (Servicio Híbrido v1/v2)

Este servicio, aunque ubicado en la estructura de la v1, actúa como un híbrido, consumiendo endpoints de ambas versiones de la API. Esto indica una estrategia de migración progresiva.

### Funciones Clave:

- **`fetchAll()` y `fetchAllOnlyOrders()`**
  - **Endpoint:** `GET /v1/cotizaciones` y `GET /v1/cotizaciones?onlyOrders=true`.
  - **Versión API:** v1.
  - **Análisis:** El listado general de cotizaciones y pedidos sigue dependiendo completamente de la API v1. No hay discrepancias aparentes.

- **`fetchById({ id })`**
  - **Endpoint:** `GET /v2/quote/:id`.
  - **Versión API:** v2.
  - **Análisis:** La obtención de una cotización específica por su ID ya ha sido migrada a la v2. El frontend espera la estructura de datos más detallada que provee este nuevo endpoint.

- **`createQuote(data)`**
  - **Endpoint:** `POST /v2/quote`.
  - **Versión API:** v2.
  - **Análisis:** La creación de nuevas cotizaciones se realiza a través de la API v2. La estructura de `data` que envía el frontend (con una cabecera y un array `details` anidado) es consistente con lo que el `QuoteModel` de la v2 espera.

- **`updateQuote({ id, data })` y `updateStateQuote({ id, data })`**
  - **Endpoint:** `PUT /v1/cotizaciones/:id` y `PUT /v1/cotizaciones/:id/estado`.
  - **Versión API:** v1.
  - **Análisis:** La actualización de la cabecera de la cotización y el cambio de estado aún no han sido migrados a la v2 en el frontend.

- **`addItems(data)`**
  - **Endpoint:** `POST /v1/cotizaciones/:quoteId/detalles/add`.
  - **Versión API:** v1.
  - **Análisis:** Esta función, que permite añadir múltiples items a una cotización, utiliza un endpoint de la v1. La estructura de datos enviada, con un array de `details` que incluye `quote_extra_details`, es compleja y se alinea con la lógica del `quoteDetailsModel.js` de la v1.

---

## 2. `v2/QuoteService.js` (Servicio Específico v2)

Este servicio está dedicado exclusivamente a las nuevas funcionalidades granulares introducidas en la v2.

### Funciones Clave:

- **`updateDetail({ quoteId, quoteDetailId, detail })`**
  - **Endpoint:** `PUT /v2/quote/:quoteId/details/:quoteDetailId`.
  - **Versión API:** v2.
  - **Análisis:** Consume correctamente el endpoint de la v2 para actualizar un único item dentro de una cotización. La estructura de `detail` enviada coincide con la esperada por el backend.

- **`addDetails({ quoteId, details })`**
  - **Endpoint:** `POST /v2/quote/:quoteId/details`.
  - **Versión API:** v2.
  - **Análisis:** Implementa la llamada para añadir nuevos detalles a una cotización existente a través de la API v2, complementando la funcionalidad de `addItems` de la v1.

---

## Conclusiones y Discrepancias

1.  **Estrategia de Migración Híbrida:** La principal conclusión es que el frontend está en un estado de migración. Las operaciones de creación y lectura de cotizaciones individuales (las más complejas) ya usan la v2, mientras que las operaciones de listado y actualización de estado (posiblemente más simples o menos prioritarias para migrar) permanecen en la v1.
2.  **No hay Inconsistencias Obvias:** No se observan discrepancias claras en cuanto a las rutas o las estructuras de datos. El frontend parece estar alineado con el comportamiento esperado de los endpoints del backend que consume en cada caso.
3.  **Oportunidad de Refactorización:** La existencia de dos servicios (`quoteService.js` y `v2/QuoteService.js`) y el consumo mixto de APIs en el servicio de la v1 presentan una oportunidad clara para una futura refactorización. Una vez que la migración del backend esté completa, el frontend podría unificar todas las llamadas en un único servicio v2 y eliminar el código legado.