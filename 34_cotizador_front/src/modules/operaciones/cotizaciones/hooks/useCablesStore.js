import { create } from "zustand";
import { devtools } from "zustand/middleware";

// Datos de los cables, de prueba porque esto vendra de una api
const initialState = {
  cablesAdded: [],
  discount: 0,
};

export const useCablesStore = create(
  devtools(
    (set, get) => ({
      ...initialState,
      addCable: (item) => {
        set((state) => {
          const isAdded = state.cablesAdded.some(
            (cable) => cable.CableId === item.CableId
          );

          if (isAdded) return state;

          const cableWithOperativeCosts = {
            ...item,
            operativeCosts: {
              shipping: { isPresent: false, amount: 0 },
              startup: { isPresent: false, amount: 0 },
            },
          };

          return {
            cablesAdded: [...state.cablesAdded, cableWithOperativeCosts],
          };
        });
      },
      updateCable: (item) => {
        set((state) => ({
          cablesAdded: state.cablesAdded.map((cable) =>
            cable.CableId === item.CableId ? item : cable
          ),
        }));
      },

      //Inicializar los cables
      initializeDetails: (editingDetails) => {
        set((state) => ({
          ...state,
          cablesAdded: editingDetails.map((detail) => {
            const { quote_extra_details } = detail; // Destructuring para acceder a quote_extra_details

            const operativeCosts =
              (Number(quote_extra_details.CableOperativeCosts?.shipping?.amount) || 0) +
              (Number(quote_extra_details.CableOperativeCosts?.startup?.amount) || 0);

            return {
              ...detail,
              quantity: Number(detail.nCotDetCantidad),
              finalPrice: quote_extra_details.CablePrecio + operativeCosts,
              parcial:
                (quote_extra_details.CablePrecio + operativeCosts) *
                Number(detail.nCotDetCantidad),
            };
          }),
        }));
      },

      updateQuantity: (cableId, quantity) => {
        set((state) => {
          const cable = state.cablesAdded.find((c) => c.CableId === cableId);

          if (!cable) return state;

          const updatedCable = {
            ...cable,
            CableCantidad: quantity,
          };

          return {
            ...state,
            cablesAdded: state.cablesAdded.map((c) =>
              c.CableId === cableId ? updatedCable : c
            ),
          };
        });
      },

      updateOperativeCosts: (cableId, operativeCosts) => {
        set((state) => {
          const cable = state.cablesAdded.find((c) => c.CableId === cableId);

          if (!cable) return state;

          const updatedCable = {
            ...cable,
            operativeCosts,
          };

          return {
            ...state,
            cablesAdded: state.cablesAdded.map((c) =>
              c.CableId === cableId ? updatedCable : c
            ),
          };
        });
      },
      removeCable: (id) => {
        set((state) => {
          return {
            cablesAdded: state.cablesAdded.filter(
              (cable) => cable.CableId !== id
            ),
          };
        });
      },
      clearCablesAdded: () => {
        set((state) => {
          return {
            cablesAdded: [],
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
    }),
    { name: "useCablesStore" }
  )
);
