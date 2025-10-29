import { useQuotationStore } from "../store/useQuotationStore";
import { useGeneratorSetStore } from "../store/v2/useGeneratorSetStore";
import { evalPrices } from "../utils/v2/utils";
import { useCablesStore } from "./useCablesStore";
import { useCellsStore } from "./useCellsStore";
import { useTransformersStore } from "./useTransformersStore";

const detailsAvailableYetPayload = Object.freeze({
  details: null,
  standardDetails: null,
  isDetailsAvailable: false,
});

export const useDetails = () => {
  const { quotationType } = useQuotationStore();
  const { generatorSetsAdded } = useGeneratorSetStore();
  const { cablesAdded } = useCablesStore();
  const { cellsAdded } = useCellsStore();
  const { transformersAdded } = useTransformersStore();

  if (!quotationType) {
    return detailsAvailableYetPayload;
  }

  switch (quotationType) {
    // Grupos Electrogenos
    case 1:
      return {
        details: generatorSetsAdded,
        standardDetails: generatorSetsAdded.map((geDetail) => {
          return {
            tipo: quotationType,
            cantidad: geDetail.nIntCantidad,
            precio_unitario: evalPrices(geDetail, geDetail.sMercadoNombre).finalPrice,
            producto_id: geDetail.IntegradoraId,
            quote_extra_details: geDetail,
          };
        }),
        isDetailsAvailable: generatorSetsAdded.length > 0,
      };
    // Cables
    case 2:
      return {
        details: cablesAdded,
        standardDetails: cablesAdded.map((cable) => {
          return {
            tipo: quotationType,
            cantidad: Number.parseInt(cable.CableCantidad),
            precio_unitario: Number.parseFloat(cable.CablePrecio),
            producto_id: cable.CableId,
            quote_extra_details: cablesAdded.find(
              (cableAdded) => cableAdded.CableId === cable.CableId
            ),
          };
        }),
        isDetailsAvailable: cablesAdded.length > 0,
      };
    // Celdas
    case 3:
      return {
        details: cellsAdded,
        standardDetails: cellsAdded.map((cell) => {
          const detailsAmount =
            cell?.details?.reduce(
              (acc, detail) => acc + Number.parseFloat(detail.price),
              0
            ) || 0;

          return {
            tipo: quotationType,
            cantidad: cell.CeldaCantidad,
            precio_unitario:
              Number.parseFloat(cell.CeldaPrecio) +
              Number.parseFloat(detailsAmount),
            producto_id: cell.CeldaId,
            quote_extra_details: cellsAdded.find(
              (cellAdded) => cellAdded.CeldaId === cell.CeldaId
            ),
          };
        }),
        isDetailsAvailable: cellsAdded.length > 0,
      };
    // Transformadores
    case 4:
      return {
        details: transformersAdded,
        standardDetails: transformersAdded.map((transformer) => {
          const detailsAmount =
            transformer?.details?.reduce(
              (acc, detail) => acc + Number.parseFloat(detail.price),
              0
            ) || 0;

          return {
            tipo: quotationType,
            cantidad: transformer.TransformadorCantidad,
            precio_unitario:
              Number.parseFloat(transformer.TransformadorPrecio) +
              Number.parseFloat(detailsAmount),
            producto_id: transformer.TransformadorId,
            quote_extra_details: transformersAdded.find(
              (transformerInnerDetail) =>
                transformerInnerDetail.TransformadorId ===
                transformer.TransformadorId
            ),
          };
        }),
        isDetailsAvailable: transformersAdded.length > 0,
      };
    default:
      return detailsAvailableYetPayload;
  }
};
