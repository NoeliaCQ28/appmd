import { create } from "zustand";
import { devtools } from "zustand/middleware";

const QUOTATION_TYPES = Object.freeze([
  {
    id: 1,
    description: "Grupos electrógenos",
  },
  {
    id: 2,
    description: "Cables",
  },
  {
    id: 3,
    description: "Celdas",
  },
  {
    id: 4,
    description: "Transformadores",
  },
]);

const ACTIONS = {
  OPEN_MODAL: "OPEN_MODAL",
  CLOSE_MODAL: "CLOSE_MODAL",
  QUOTATION_TYPE: "QUOTATION_TYPE",
  SAVE_QUOTE: "SAVE_QUOTE",
};

const detaultQuote = {
  quotationType: 1, //1
  comercialExecutiveId: 0,
  customerId: 0,
  customerContact: "",
  telephone: "",
  email: "",
  project: "",
  address: "",
  marketId: 1,
  currencyId: 2,
  typeChange: 1,
  date: new Date(),
  validityOffer: 0,
  sending: 0,
  installation: 0,
  comercialConditionId: 1,
  state: 3,
};

const initialState = {
  activeModal: null,
  types: QUOTATION_TYPES,
  quotationType: 1, //1
  quote: detaultQuote,
  filter: {
    show: "me",
  },
};

export const useQuotationStore = create(
  devtools(
    (set) => ({
      ...initialState,

      initializeStore: (type) => {
        set(
          (state) => ({
            ...state,
            quotationType: type,
            quote: {
              ...state.quote,
              quotationType: type,
            },
          }),
          false,
          "INITIALIZE_STORE"
        );
      },

      setQuote(quote) {
        set({ quote }, false, ACTIONS.SAVE_QUOTE);
      },

      clearQuote() {
        set({ quote: detaultQuote });
      },

      openModal: (modalName) =>
        set({ activeModal: modalName }, false, ACTIONS.OPEN_MODAL),

      closeModal: () => set({ activeModal: null }, false, ACTIONS.CLOSE_MODAL),

      setQuotationType: (id) =>
        set({ quotationType: id }, false, ACTIONS.QUOTATION_TYPE),

      setFilter: (filter) =>
        set((state) => ({ ...state, filter }), false, "SET_FILTER"),
    }),
    {
      name: "useQuotationStore",
    }
  )
);
