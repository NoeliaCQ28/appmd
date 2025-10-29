import { create } from "zustand";
import { devtools } from "zustand/middleware";

const initialState = {
  searchFilters: null,
};

export const useGeneratorSetStore = create(
  devtools(
    (set, get) => ({
      ...initialState,
      setSearchFilters: (filters) => {
        set((state) => ({
          ...state,
          searchFilters: filters,
        }));
      },
      clearSearchFilters: () => {
        set((state) => ({
          ...state,
          searchFilters: null,
        }));
      },
    }),
    { name: "useGeneratorSetStore" }
  )
);
