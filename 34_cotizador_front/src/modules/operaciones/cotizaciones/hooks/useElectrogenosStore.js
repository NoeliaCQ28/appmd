import { create } from "zustand";
import { devtools } from "zustand/middleware";

const components = {
  features: {
    values: [
      {
        id: 1,
        descripcion: "SOLO PRODUCTO",
        value: "SOLO PRODUCTO",
      },
      {
        id: 2,
        descripcion: "PRODUCTO + TABLERO",
        value: "PRODUCTO + TABLERO",
      },
      {
        id: 3,
        descripcion: "SOLO TABLERO",
        value: "SOLO TABLERO",
      },
    ],
  },
  discounts: {
    values: [
      {
        id: 1,
        descripcion: "Sin descuento",
        value: 0,
      },
      {
        id: 2,
        descripcion: "10 %",
        value: 10,
      },
      {
        id: 3,
        descripcion: "20 %",
        value: 20,
      },
      {
        id: 4,
        descripcion: "30 %",
        value: 30,
      },
      {
        id: 5,
        descripcion: "40 %",
        value: 40,
      },
      {
        id: 6,
        descripcion: "50 %",
        value: 50,
      },

      {
        id: 7,
        descripcion: "60 %",
        value: 60,
      },
      {
        id: 8,
        descripcion: "70 %",
        value: 70,
      },
      {
        id: 9,
        descripcion: "80 %",
        value: 80,
      },
      {
        id: 10,
        descripcion: "90 %",
        value: 90,
      },
      {
        id: 11,
        descripcion: "100 %",
        value: 100,
      },
    ],
  },
  others: {
    values: [
      {
        id: 1,
        descripcion: "Calentador de admision aire",
        parcial: 500,
      },
      {
        id: 2,
        descripcion: "Relay de expansion 2",
        parcial: 500,
      },
      {
        id: 3,
        descripcion: "Calentador de refrigerante + termostato",
        parcial: 500,
      },
      {
        id: 4,
        descripcion: "Medidor electrico de nivel de combustible",
        parcial: 500,
      },
    ],
  },
};

const initialState = {
  params: {
    voltaje: 220,
    frecuencia: 60,
    fases: 3,
    factorPotencia: 0.8,
    altura: 1000,
    temperatura: 0,
    cabin: {
      id: 1,
      description: "ABIERTO",
      value: "ABIERTO",
    },
    nParamInsonoro: 0,
  },
  components,
  details: [],
  newItems: [], // New array for items to be added
  discount: 0,
};

export const useElectrogenosStore = create(
  devtools(
    (set, get) => ({
      ...initialState,

      setParams: (params) => {
        set((state) => {
          return {
            ...state,
            params,
          };
        });
      },

      addDetail: (detail) => {
        set((state) => {
          return {
            ...state,
            details: [...state.details, detail],
          };
        });
      },

      removeDetail: ({ ModeloKey }) => {
        set((state) => {
          return {
            ...state,
            details: state.details.filter(
              (detail) => detail.ModeloKey !== ModeloKey
            ),
          };
        });
      },

      clearDetails: () => {
        set((state) => {
          return {
            ...state,
            details: [],
          };
        });
      },

      // Agregar función para inicializar detalles en modo edición
      initializeDetails: (editingDetails) => {
        set((state) => ({
          ...state,
          details:
            editingDetails
              ?.filter((detail) => detail.quote_extra_details)
              .map((detail) => {
                const { quote_extra_details } = detail; // Destructuring para acceder a quote_extra_details
                return {
                  ...detail,
                  ModeloKey: `${quote_extra_details.nIntegradoraId}-${quote_extra_details.nParamInsonoro}`,
                  quantity: Number(detail.nCotDetCantidad),
                  finalPrice: quote_extra_details.nPrecioFinal,
                  parcial:
                    quote_extra_details.nPrecioFinal *
                    Number(detail.nCotDetCantidad),
                };
              }) || [],
        }));
      },

      updateQuantity: (id, quantity, isEdit = false) => {
        set((state) => {
          return {
            ...state,
            details: state.details.map((detail) => {
              //solo cuando estamos editando
              if (isEdit) {
                const isMatch = id === detail.nCotDetItem;
                if (isMatch) {
                  return {
                    ...detail,
                    quantity: Number(quantity),
                    nCotDetCantidad: Number(quantity),
                    quote_extra_details: {
                      ...detail.quote_extra_details,
                      nCantidad: Number(quantity),
                    },
                    parcial:
                      detail.quote_extra_details.nPrecioFinal *
                      Number(quantity),
                  };
                }
              } else {
                const isMatch = id === detail.ModeloKey;
                if (isMatch) {
                  return {
                    ...detail,
                    quantity: Number(quantity),
                  };
                }
              }
              return detail;

              // const detailFinded = id === detail.ModeloKey;

              // return detailFinded ? { ...detail, quantity: quantity } : detail;
            }),
          };
        });
      },

      addNewItem: (detail) => {
        set((state) => {
          return {
            ...state,
            newItems: [...state.newItems, detail],
          };
        });
      },

      removeNewItem: ({ ModeloKey }) => {
        set((state) => {
          return {
            ...state,
            newItems: state.newItems.filter(
              (item) => item.ModeloKey !== ModeloKey
            ),
          };
        });
      },

      clearNewItems: () => {
        set((state) => {
          return {
            ...state,
            newItems: [],
          };
        });
      },
    }),
    {
      name: "useElectrogenosStore",
    }
  )
);
