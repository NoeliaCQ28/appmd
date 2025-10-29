# Análisis de la Capa de Red - Aplicación Móvil Android

Este documento detalla las funciones definidas en `ApiService.kt` que están relacionadas con la gestión de cotizaciones, destacando qué endpoints del backend consumen.

---

## Funciones Relacionadas con Cotizaciones

A continuación, se listan las funciones de Retrofit encontradas en la interfaz `ApiService` que interactúan con los endpoints de cotizaciones.

### 1. `getAllQuotes()`

- **Método HTTP:** `GET`
- **Ruta Completa:** `/api/v1/cotizaciones`
- **Parámetros:** Ninguno.
- **Tipo de Retorno:** `Response<List<AllQuoteResponse>>`
- **Análisis:** Esta función se utiliza para obtener la lista completa de cotizaciones y apunta exclusivamente a la **API v1**.

### 2. `createQuote()`

- **Método HTTP:** `POST`
- **Ruta Completa:** `/api/v1/cotizaciones`
- **Parámetros:**
  - `@Body quote: CreateQuoteGeneratorSetRequest`
- **Tipo de Retorno:** `Response<CreateQuoteResponse>`
- **Análisis:** La creación de cotizaciones desde la aplicación móvil se realiza a través de la **API v1**. Esto representa una **discrepancia significativa** con el cliente web, que ya utiliza el endpoint `POST /v2/quote` para esta operación. La app móvil parece estar utilizando una lógica de creación más antigua.

---

## Conclusiones y Discrepancias Notables

1.  **Dependencia de la API v1:** La gestión de cotizaciones en la aplicación móvil (listar y crear) depende completamente de los endpoints de la v1. No se encontraron llamadas a `/v2/quotes` para operaciones de CRUD.
2.  **Desfase con el Cliente Web:** Existe un claro desfase entre la aplicación móvil y el cliente web. Mientras que el cliente web ha migrado las operaciones críticas de creación y obtención de cotizaciones a la v2, la aplicación móvil sigue utilizando la v1 para estas mismas tareas.
3.  **Uso Parcial de la v2:** Es interesante notar que la aplicación móvil **sí consume endpoints de la v2**, pero únicamente para funcionalidades auxiliares relacionadas con la búsqueda y configuración de grupos electrógenos (ej. `POST /api/v2/generator-sets/get-all-combinations`). Esto sugiere que la adopción de la v2 en la app ha sido parcial y enfocada en el módulo de productos, pero aún no ha permeado la gestión principal de cotizaciones.
4.  **Ausencia de Funciones de Actualización/Eliminación:** En el `ApiService.kt` analizado, no se encontraron funciones para actualizar (`@PUT`) o eliminar (`@DELETE`) cotizaciones, lo que podría indicar que estas funcionalidades no están implementadas en la app móvil o se manejan en otra parte del código.