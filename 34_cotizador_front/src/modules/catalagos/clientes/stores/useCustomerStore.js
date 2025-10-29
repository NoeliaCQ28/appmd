import { create } from "zustand";
import { devtools } from "zustand/middleware";

const initialState = {
  customerFromSAP: null,
  postalCodesOfLimaPeru: [
    "LIMA 1",
    "LIMA 10",
    "LIMA 11",
    "LIMA 12",
    "LIMA 13",
    "LIMA 14",
    "LIMA 15",
    "LIMA 16",
    "LIMA 17",
    "LIMA 18",
    "LIMA 19",
    "LIMA 2",
    "LIMA 20",
    "LIMA 21",
    "LIMA 22",
    "LIMA 23",
    "LIMA 24",
    "LIMA 25",
    "LIMA 26",
    "LIMA 27",
    "LIMA 28",
    "LIMA 29",
    "LIMA 3",
    "LIMA 30",
    "LIMA 31",
    "LIMA 32",
    "LIMA 33",
    "LIMA 34",
    "LIMA 35",
    "LIMA 36",
    "LIMA 37",
    "LIMA 38",
    "LIMA 39",
    "LIMA 4",
    "LIMA 40",
    "LIMA 41",
    "LIMA 42",
    "LIMA 43",
    "LIMA 5",
    "LIMA 6",
    "LIMA 7",
    "LIMA 8",
    "LIMA 9",
  ]
};

export const useCustomerStore = create(
  devtools(
    (set, get) => ({
      ...initialState,
      setCustomerFromSAP: (item) => {
        set(
          (state) => {
            return {
              ...state,
              customerFromSAP: item,
            };
          },
          undefined,
          "setCustomerFromSAP"
        );
      },
      removeCustomerFromSAP: () => {
        set(
          (state) => {
            return {
              ...state,
              customerFromSAP: undefined,
            };
          },
          undefined,
          "removeCustomerFromSAP"
        );
      },
    }),
    { name: "useCustomerStore" }
  )
);
