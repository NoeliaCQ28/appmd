import { create } from "zustand";
import { devtools } from "zustand/middleware";

const initialState = {
  transformersAdded: [],
  discount: 0,
};

export const useTransformersStore = create(
  devtools(
    (set, get) => ({
      ...initialState,
      addTransformer: (item) => {
        set((state) => {
          const isAdded = state.transformersAdded.some(
            (transformer) =>
              transformer.TransformadorId === item.TransformadorId
          );

          if (isAdded) return state;

          return {
            transformersAdded: [...state.transformersAdded, item],
          };
        });
      },
      removeTransformer: (id) => {
        set((state) => {
          return {
            transformersAdded: state.transformersAdded.filter(
              (cell) => cell.TransformadorId !== id
            ),
          };
        });
      },

      updateTransformer: (item) => {
        set((state) => ({
          transformersAdded: state.transformersAdded.map((transformer) =>
            transformer.TransformadorId === item.TransformadorId
              ? {
                  ...transformer,
                  ...item,
                  details: item.details || transformer.details,
                }
              : transformer
          ),
        }));
      },
      updateOperativeCosts: (transformerId, operativeCosts) => {
        set((state) => {
          const transformer = state.transformersAdded.find(
            (t) => t.TransformadorId === transformerId
          );

          if (!transformer) return state;

          const updatedTransformer = {
            ...transformer,
            operativeCosts,
          };

          return {
            ...state,
            transformersAdded: state.transformersAdded.map((t) =>
              t.TransformadorId === transformerId ? updatedTransformer : t
            ),
          };
        });
      },
      clearTransformersAdded: () => {
        set((state) => {
          return {
            transformersAdded: [],
          };
        });
      },
      setDiscount: (discount) => {
        set((state) => {
          return {
            ...state,
            discount,
          };
        });
      },
      addDetail: (id, detail) => {
        set((state) => {
          const transformer = state.transformersAdded.find(
            (transformer) => transformer.TransformadorId === id
          );

          if (!transformer) return state;

          const detailId = detail.id;

          // Check if the detail already exists in the transformer
          const isDetailAdded = transformer.details
            ? transformer.details?.some((d) => d.id === detailId)
            : false;

          // Remove detail if it already exists
          if (isDetailAdded) {
            const updatedDetails = transformer.details.filter(
              (d) => d.id !== detailId
            );

            const updatedTransformer = {
              ...transformer,
              details: updatedDetails,
            };

            return {
              ...state,
              transformersAdded: state.transformersAdded.map((t) =>
                t.TransformadorId === id ? updatedTransformer : t
              ),
            };
          }

          // Add detail if it doesn't exist
          const updatedTransformer = {
            ...transformer,
            details: [...(transformer.details || []), detail],
          };

          return {
            ...state,
            transformersAdded: state.transformersAdded.map((t) =>
              t.TransformadorId === id ? updatedTransformer : t
            ),
          };
        });
      },

      //Inicializar las celdas
      initializeDetails: (editingDetails) => {
        set((state) => ({
          ...state,
          transformersAdded: editingDetails.map((detail) => {
            const { quote_extra_details } = detail; // Destructuring para acceder a quote_extra_details
            return {
              ...detail,
              quantity: Number(detail.nCotDetCantidad),
              finalPrice: quote_extra_details.TransformadorPrecio,
              parcial:
                quote_extra_details.TransformadorPrecio *
                Number(detail.nCotDetCantidad),
            };
          }),
        }));
      },

      updateQuantity: (transformerId, quantity) => {
        set((state) => {
          const transformer = state.transformersAdded.find(
            (t) => t.TransformadorId === transformerId
          );

          if (!transformer) return state;

          const updatedTransformer = {
            ...transformer,
            TransformadorCantidad: quantity,
          };

          return {
            ...state,
            transformersAdded: state.transformersAdded.map((t) =>
              t.TransformadorId === transformerId ? updatedTransformer : t
            ),
          };
        });
      },
    }),
    { name: "useTransformersStore" }
  )
);
