import { create } from "zustand";
import { devtools } from "zustand/middleware";

// Datos de los cables, de prueba porque esto vendra de una api
const initialState = {
  cellsAdded: [],
  discount: 0,
};

export const useCellsStore = create(
  devtools(
    (set, get) => ({
      ...initialState,
      addCell: (item) => {
        set(
          (state) => {
            const isAdded = state.cellsAdded.some(
              (cell) => cell.CeldaId === item.CeldaId
            );

            if (isAdded) return state;

            return {
              cellsAdded: [...state.cellsAdded, item],
            };
          },
          null,
          "ADD_CELL"
        );
      },
      removeCell: (id) => {
        set(
          (state) => {
            return {
              cellsAdded: state.cellsAdded.filter(
                (cell) => cell.CeldaId !== id
              ),
            };
          },
          null,
          "REMOVE_CELL"
        );
      },
      clearCellsAdded: () => {
        set(
          (state) => {
            return {
              ...state,
              cellsAdded: [],
            };
          },
          null,
          "CLEAR_CELLS_ADDED"
        );
      },

      initializeDetails: (editingDetails) => {
        set(
          (state) => ({
            ...state,
            cellsAdded: editingDetails.map((detail) => {
              const { quote_extra_details } = detail; // Destructuring para acceder a quote_extra_details
              return {
                ...detail,
                quantity: Number(detail.nCotDetCantidad),
                finalPrice: Number(detail.nCotDetPrecioUnitario),
                parcial:
                  Number(detail.nCotDetPrecioUnitario) *
                  Number(detail.nCotDetCantidad),
              };
            }),
          }),
          null,
          "INITIALIZE_DETAILS"
        );
      },

      updateCell: (item) => {
        set(
          (state) => ({
            cellsAdded: state.cellsAdded.map((cell) =>
              cell.CeldaId === item.CeldaId
                ? {
                    ...cell,
                    ...item,
                    details: item.details || cell.details,
                  }
                : cell
            ),
          }),
          null,
          "UPDATE_CELL"
        );
      },
      updateOperativeCosts: (cellId, operativeCosts) => {
        set((state) => {
          const cell = state.cellsAdded.find((c) => c.CeldaId === cellId);

          if (!cell) return state;

          const updatedCell = {
            ...cell,
            operativeCosts,
          };

          return {
            ...state,
            cellsAdded: state.cellsAdded.map((c) =>
              c.CeldaId === cellId ? updatedCell : c
            ),
          };
        });
      },
      setDiscount: (discount) => {
        set(
          (state) => {
            return {
              ...state,
              discount,
            };
          },
          null,
          "SET_DISCOUNT"
        );
      },
      addDetail: (id, detail) => {
        set(
          (state) => {
            const cell = state.cellsAdded.find((cell) => cell.CeldaId === id);

            if (!cell) return state;

            const detailId = detail.id;

            // Check if the detail already exists in the cell
            const isDetailAdded = cell.details
              ? cell.details?.some((d) => d.id === detailId)
              : false;

            // Remove detail if it already exists
            if (isDetailAdded) {
              const updatedDetails = cell.details.filter(
                (d) => d.id !== detailId
              );

              const updatedCell = {
                ...cell,
                details: updatedDetails,
              };

              return {
                ...state,
                cellsAdded: state.cellsAdded.map((t) =>
                  t.CeldaId === id ? updatedCell : t
                ),
              };
            }

            // Add detail if it doesn't exist
            const updatedCell = {
              ...cell,
              details: [...(cell.details || []), detail],
            };

            return {
              ...state,
              cellsAdded: state.cellsAdded.map((t) =>
                t.CeldaId === id ? updatedCell : t
              ),
            };
          },
          null,
          "ADD_DETAIL"
        );
      },
      updateQuantity: (cellId, quantity) => {
        set(
          (state) => {
            const cell = state.cellsAdded.find((c) => c.CeldaId === cellId);

            if (!cell) return state;

            const updatedCell = {
              ...cell,
              CeldaCantidad: quantity,
            };

            return {
              ...state,
              cellsAdded: state.cellsAdded.map((c) =>
                c.CeldaId === cellId ? updatedCell : c
              ),
            };
          },
          null,
          "UPDATE_QUANTITY"
        );
      },
    }),
    { name: "useCellsStore" }
  )
);
