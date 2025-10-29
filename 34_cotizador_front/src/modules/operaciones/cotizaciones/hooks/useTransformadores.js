import { create } from "zustand";
import { devtools } from "zustand/middleware";

// Datos de los cables, de prueba porque esto vendra de una api
const transformadores = {
  potencia: "198",
  factor_k: "k-2",
  relacion_tension_primaria: "8",
  relacion_tension_secun: "19",
  altitud: "918",
  grupo_conexion: "91",
  detalle: [
    {
      id: 1,
      codigo: "0192",
      marca: "indeco",
      descripcion: "marca de descripcion tal 1",
      parcial: 1928,
    },
    {
      id: 2,
      codigo: "0192",
      marca: "indeco",
      descripcion: "marca de descripcion tal 2",
      parcial: 1928,
    },
    {
      id: 3,
      codigo: "0192",
      marca: "indeco",
      descripcion: "marca de descripcion tal 3",
      parcial: 1928,
    },
  ],
  descuento: [
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
  ],
};

export const useTransformadoresStore = create(
  devtools(
    (set, get) => ({
      cabeceraTr: {
        potencia: transformadores.potencia,
        factor_k: transformadores.factor_k,
        relacion_tension_primaria: transformadores.relacion_tension_primaria,
        relacion_tension_secun: transformadores.relacion_tension_secun,
        altitud: transformadores.altitud,
        grupo_conexion: transformadores.grupo_conexion,
      },
      transformadores: transformadores.detalle,
      descuentosTr: transformadores.descuento,
      cardResumenTr: [],
      descuentoIdTr: null,
      descuentoTr: 0,

      //Funcion para actualizar la cabecera
      actualizarCabecera: (campo, valor) => {
        set((state) => ({
          cabecera: {
            ...state.cabeceraTr,
            [campo]: valor,
          },
        }));
      },

      //Funcion para agregar cable al cardResumen
      agregarTransformador: (item) => {
        const { descuentoTr } = get();
        set((state) => {
          const isSelected = state.cardResumenTr.some(
            (itemSelect) => itemSelect.id === item.id
          );
          if (isSelected) {
            return {
              cardResumenTr: state.cardResumenTr.filter(
                (selectedItem) => selectedItem.id !== item.id
              ),
            };
          } else {
            const itemWithDiscount = {
              ...item,
              descuentoTr: item.parcial * (descuentoTr / 100),
            };
            return {
              cardResumenTr: [...state.cardResumenTr, itemWithDiscount],
            };
          }
        });
      },

      aplicarDescuento: (discountId) => {
        const selectedDiscount = transformadores.descuento.find(
          (item) => item.id === discountId
        );
        if (selectedDiscount) {
          set({
            descuentoIdTr: discountId,
            descuentoTr: selectedDiscount.value,
          });
        }

        //recalcular el cardResumen para agregar el descuento
        const { cardResumenTr } = get();
        const updatedCardResumen = cardResumenTr.map((item) => ({
          ...item,
          descuentoTr: item.parcial * (selectedDiscount.value / 100),
        }));
        set({ cardResumenTr: updatedCardResumen });
      },
    }),
    {
      name: "useTransformadoresStore",
    }
  )
);
