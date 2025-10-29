import { create } from "zustand";
import { devtools } from "zustand/middleware";

const initialState = {
  detailsForDelete: [],
  selectedQuote: null,
};

export const useQuoteDetailStore = create(
  devtools(
    (set) => ({
      ...initialState,

      addDetailForDelete(detail) {
        set((state) => ({
          ...state,
          detailsForDelete: [...state.detailsForDelete, detail],
        }));
      },

      removeDetailForDelete(id) {
        set((state) => ({
          ...state,
          detailsForDelete: state.detailsForDelete.filter(
            (detail) => detail.id !== id
          ),
        }));
      },

      removeAllDetailsForDelete() {
        set((state) => ({
          ...state,
          detailsForDelete: [],
        }));
      },

      setQuoteSelected(quote) {
        set((state) => ({
          ...state,
          selectedQuote: quote,
        }));
      },
    }),
    {
      name: "useQuoteDetailStore",
    }
  )
);
