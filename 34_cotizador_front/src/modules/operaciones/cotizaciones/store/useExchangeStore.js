import { create } from "zustand";
import { devtools } from "zustand/middleware";

const ACTIONS = {
  SET_TYPE_CHANGE: "SET_TYPE_CHANGE",
  SET_CURRENCY: "SET_CURRENCY",
};

const initialState = {
  typeChange: 1,
  currency: {
    symbol: "$",
    code: "USD",
    description: "Dólares Americanos",
  },
};

export const useExchangeStore = create(
  devtools(
    (set) => ({
      ...initialState,

      setTypeChange: (typeChange) =>
        set({ typeChange }, false, ACTIONS.SET_TYPE_CHANGE),

      setCurrency: (currency) => set({ currency }, false, ACTIONS.SET_CURRENCY),

      resetExchange: () =>
        set(
          {
            ...initialState,
          },
          false,
          "CLEAR_EXCHANGE_STORE"
        ),
    }),
    {
      name: "useExchangeStore",
    }
  )
);
