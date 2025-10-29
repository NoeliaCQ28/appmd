import { create } from "zustand";
import { devtools } from "zustand/middleware";

const initialState = {
  cablesArray: [],
  discount: 0,
};

export const useCablesAddItemsStore = create(
  devtools(
    (set, get) => ({
      ...initialState,

      addCable: (item) => {
        set((state) => {
          const isAdded = state.cablesArray.some(
            (cable) => cable.CableId === item.CableId
          );

          if (isAdded) return state;

          return {
            cablesArray: [...state.cablesArray, item],
          };
        });
      },

      updateCable: (item) => {
        set((state) => ({
          cablesArray: state.cablesArray.map((cable) =>
            cable.CableId === item.CableId ? item : cable
          ),
        }));
      },

      updateQuantity: (cableId, quantity) => {
        set((state) => {
          const cable = state.cablesArray.find((c) => c.CableId === cableId);

          if (!cable) return state;

          const updatedCable = {
            ...cable,
            CableCantidad: quantity,
          };

          return {
            ...state,
            cablesArray: state.cablesArray.map((c) =>
              c.CableId === cableId ? updatedCable : c
            ),
          };
        });
      },

      updateOperativeCosts: (cableId, operativeCosts) => {
        set((state) => {
          const cable = state.cablesArray.find((c) => c.CableId === cableId);

          if (!cable) return state;

          const updatedCable = {
            ...cable,
            operativeCosts,
          };

          return {
            ...state,
            cablesArray: state.cablesArray.map((c) =>
              c.CableId === cableId ? updatedCable : c
            ),
          };
        });
      },
      removeCable: (id) => {
        set((state) => {
          return {
            cablesArray: state.cablesArray.filter(
              (cable) => cable.CableId !== id
            ),
          };
        });
      },
      clearCablesAdded: () => {
        set((state) => {
          return {
            cablesArray: [],
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
