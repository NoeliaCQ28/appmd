import { create } from "zustand";

export const useHeaderCotizacion = create((set) => ({
  SelectedHeader: "Todo",
  setSelectHeader: (header) =>
    set(() => ({
      SelectedHeader: header,
    })),
  resetHeader: () =>
    set(
      () => ({
        SelectedHeader: "Todo",
      }),
      null,
      "useHeaderCotizacion/reset"
    ),
}));
