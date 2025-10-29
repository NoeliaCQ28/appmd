# Análisis de Vistas del Frontend - Flujo de Datos de Cotizaciones

Este documento describe cómo las vistas de React (`CreateCotizacionView`, `EditCotizacionView`) y el componente `QuoteForm` gestionan los datos del formulario y la interacción con los servicios.

---

## 1. Arquitectura de Componentes

- **Vistas Contenedoras (`CreateCotizacionView`, `EditCotizacionView`):**
  - Su rol principal es actuar como "contenedores inteligentes".
  - Utilizan una serie de *custom hooks* (ej. `useCustomer`, `useCurrency`, `useVendedores`) para obtener todos los datos maestros necesarios para los campos de selección del formulario.
  - No contienen lógica de formulario directamente. Su responsabilidad es pasar estos datos como `props` al componente de presentación.
  - `EditCotizacionView` adicionalmente obtiene los datos de la cotización a editar y los utiliza para inicializar los *stores* de Zustand relevantes.

- **Componente de Formulario (`QuoteForm.jsx`):**
  - Es el componente "inteligente" que centraliza toda la lógica de la interfaz de usuario.
  - Recibe los datos maestros (clientes, vendedores, etc.) como `props`.
  - Es responsable de la recolección de datos, el manejo del estado de los items y la invocación de los servicios al guardar.

---

## 2. Recolección de Datos del Formulario

- **`react-hook-form`:** La librería `react-hook-form` es la base para gestionar el estado de los campos de la cabecera de la cotización (cliente, proyecto, moneda, etc.).
  - Los campos se registran mediante el hook `register` o se integran con componentes de UI a través del componente `Controller`.
  - Esto proporciona una gestión eficiente del estado, validación y seguimiento de errores.

---

## 3. Manejo del Estado de los Detalles (Items)

- **Stores de Zustand Específicos por Producto:** El estado de los items (los productos añadidos a la cotización) **no** se gestiona en `react-hook-form`. En su lugar, se utiliza una estrategia de stores de Zustand dedicados:
  - `useElectrogenosStore`
  - `useCablesStore`
  - `useCellsStore`
  - `useTransformersStore`
  - `useGeneratorSetStore` (para la v2)
- **Desacoplamiento:** Esta arquitectura desacopla la lógica compleja de cada tipo de producto. Cuando un usuario añade un grupo electrógeno, por ejemplo, el estado de ese item se gestiona exclusivamente en `useElectrogenosStore` o `useGeneratorSetStore`. El `QuoteForm` simplemente lee de estos stores para mostrar los detalles en la tabla.

---

## 4. Invocación de Servicios al Guardar

El proceso al hacer clic en el botón "Guardar" en `QuoteForm.jsx` es el siguiente:

1.  **`onSave(data)`:** Se invoca la función `handleSubmit` de `react-hook-form`, que a su vez llama a `onSave` con los datos de la cabecera del formulario.
2.  **`generateQuotePayload`:** Se llama a una función de utilidad clave, `generateQuotePayload`. Esta función es crucial, ya que:
    - Recibe los datos de la cabecera del formulario.
    - Accede a los diferentes stores de Zustand para obtener la lista de items (`details`) de cada tipo de producto.
    - Unifica y transforma todos estos datos en una única estructura (`payload`) que coincide con la que espera la API del backend.
3.  **`createMutate(payload)`:** Se invoca la función `createMutate` (proveniente del hook `useQuote`, que utiliza React Query). Esta función es la que finalmente llama a `quoteService.createQuote(payload)`, enviando la solicitud al endpoint `POST /v2/quote` del backend.

---

## 5. Uso de Zustand (`useQuotationStore`)

- **Store de Orquestación:** El store `useQuotationStore` **sí se utiliza**, pero no para gestionar el estado completo del formulario. Su rol es más de orquestación y gestión del estado de la UI a nivel de página:
  - `activeModal`: Controla qué modal (ej. "Añadir Grupo Electrógeno", "Añadir Cables") está actualmente abierto.
  - `quotationType`: Almacena el tipo de cotización seleccionado (GE, Cables, etc.), lo que permite al formulario y otros componentes reaccionar dinámicamente.
  - `quote`: Mantiene una copia del estado de la cabecera de la cotización, que se utiliza para pasar datos entre la vista del formulario y la vista de "añadir combinaciones".