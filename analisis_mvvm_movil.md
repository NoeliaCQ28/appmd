# Análisis de Arquitectura MVVM - Aplicación Móvil Android

Este documento describe el flujo de datos para la funcionalidad de cotizaciones en la aplicación móvil, siguiendo el patrón de arquitectura Model-View-ViewModel (MVVM).

---

## 1. Capa de Repositorio (`QuoteRepository.kt`)

El `QuoteRepository` actúa como la única fuente de verdad para los datos de cotizaciones, abstrayendo el origen de los datos (en este caso, la red).

- **Uso de `ApiService`:**
  - **`getAll()`:** Invoca la función `api.getAllQuotes()`, que realiza una llamada `GET` al endpoint `/api/v1/cotizaciones`.
  - **`save(data)`:** Invoca la función `api.createQuote(quoteMapped)`, que realiza una llamada `POST` al endpoint `/api/v1/cotizaciones`.
- **Mapeo de Datos:** Utiliza un `QuoteGeneratorSetMapper` para transformar los objetos DTO (Data Transfer Objects) de la respuesta de la API en modelos de dominio que la aplicación puede utilizar, y viceversa.
- **Funciones no Implementadas:** Las funciones `delete` y `update` están marcadas con `TODO("Not yet implemented")`, confirmando que la app no soporta la eliminación o actualización de cotizaciones.

---

## 2. Capa de ViewModel (`QuoteViewModel.kt`)

El `QuoteViewModel` prepara y gestiona los datos para la UI, manejando la lógica de presentación y el estado.

- **Funciones Expuestas a la UI:**
  - **`getAllQuotes()`:** Es llamada por la vista para iniciar la carga de la lista de cotizaciones. Internamente, lanza una corrutina que llama a `repository.getAll()`.
  - **`createQuote(quoteHeaderMap)`:** Es llamada por la vista al guardar un formulario. Transforma los datos del formulario a un modelo (`CreateQuoteGeneratorSet`) y luego llama a `repository.save()`.

- **Manejo de Estado:**
  - **`StateFlow`:** Se utiliza para exponer datos que representan un estado. La UI observa estos flujos para actualizarse automáticamente cuando los datos cambian.
    - `val quotes = _quotes.asStateFlow()`: Expone la lista de cotizaciones.
    - `val quoteHeaderMap = _quoteHeaderMap.asStateFlow()`: Expone los datos actuales del formulario de creación.
  - **`SharedFlow`:** Se utiliza para emitir eventos únicos o "efectos secundarios" a la UI, como mostrar un spinner o un mensaje de error.
    - `val fetchState = _fetchState.asSharedFlow()`: Comunica el estado de las operaciones de carga (ej. `Loading`, `Success`, `Error`).

---

## 3. Flujo de Datos y Discrepancias

El flujo de datos sigue un patrón MVVM claro:

1.  **Vista (UI):** Observa los `StateFlow` del `QuoteViewModel` y llama a sus funciones en respuesta a eventos del usuario (ej. `getAllQuotes()` al cargar la pantalla).
2.  **ViewModel:** Recibe la llamada, actualiza el `fetchState` a `Loading`, y delega la operación al `QuoteRepository`.
3.  **Repositorio:** Llama al `ApiService` para ejecutar la solicitud de red.
4.  **ApiService (Retrofit):** Realiza la llamada HTTP al endpoint correspondiente de la **API v1**.
5.  **Retorno:** La respuesta viaja de vuelta a través del Repositorio (donde se mapea), al ViewModel (que actualiza el `StateFlow` de `quotes` y el `fetchState` a `Success` o `Error`), y finalmente la UI se recompone para mostrar los nuevos datos o el estado de error.

**Discrepancia Principal Confirmada:**
El análisis de estas capas confirma la discrepancia identificada en el `ApiService`: toda la lógica de negocio para obtener y crear cotizaciones en la aplicación móvil está construida sobre la **API v1**, a diferencia del cliente web que ya ha migrado estas operaciones a la v2.