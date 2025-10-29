import React, { useState } from "react";
import { Modal } from "../../../../../../components/modals/Modal";
import useQuoteDetailsItems from "../../../hooks/useQuoteDetailsItems";
import { useGeneratorSet as useGeneratorSet_v2 } from "../../../hooks/v2/useGeneratorSet";
import { GeneratorSetCombination } from "../../v2/GeneratorSetCombination";
import { ComponentCellsCard } from "../ComponentCellsCard";
import { ComponentTransformersCard } from "../ComponentTransformersCard";

const EditQuoteDetailElectrogenos = ({ selectedItem, setOpen }) => {
  const selectedCombination = selectedItem?.quote_extra_details;
  const sIntKey = selectedCombination?.sIntKey;

  const { combinations, getCombinations, isPendingCombinations } =
    useGeneratorSet_v2();

  React.useEffect(() => {
    getCombinations({
      modelo: selectedCombination?.sModNombre,
      voltaje: selectedCombination?.nIntVoltaje,
      altura: selectedCombination?.nIntAltura,
      factorPotencia: selectedCombination?.nIntFP,
      fases: selectedCombination?.nIntFases,
      frecuencia: selectedCombination?.nIntFrecuencia,
      insonoro: selectedCombination?.nIntInsonoro,
      temperatura: selectedCombination?.nIntTemperatura,
      powerThreshold: 20,
      primePower: "Todos",
      standbyPower: "Todos",
      marketId: selectedCombination?.MercadoId,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isPendingCombinations || !combinations?.generatorSets) {
    return <span>Cargando combinaciones...</span>;
  }

  const generatorSet =
    combinations?.generatorSets?.find((ge) => ge.sIntKey === sIntKey) || null;

  return (
    <GeneratorSetCombination
      generatorSet={generatorSet}
      options={{
        isEditMode: true,
        combinationRestored: selectedCombination,
      }}
      setOpen={setOpen}
    />
  );
};

const EditQuoteDetailCables = ({ selectedItem }) => {
  return <span>Aun no implementado</span>;
};

const EditQuoteDetailCeldas = ({ selectedItem }) => {
  const { itemDetails, isLoadingItemDetails, refetchItemDetails } =
    useQuoteDetailsItems({
      quoteId: selectedItem?.Cotizacion_Id,
      quoteDetailId: selectedItem?.nCotDetItem,
    });

  const AccesoriesMapped = React.useMemo(() => {
    const accesories =
      itemDetails?.cells?.map((cell) => cell.accesorios).flat() || [];

    return accesories.map((oc) => {
      // Buscar el nombre del accesorio en selectedItem.otherComponents
      const accesorioInfo = selectedItem?.otherComponents?.find(
        (item) => item.CeldaAccesorio_Id === oc.nCeldaAccesorioId
      );
      return {
        id: oc.nCeldaAccesorioId,
        name: accesorioInfo?.sCelAccDescripcion,
        price: Number.parseFloat(oc.nPrecio),
        total: Number.parseFloat(oc.nTotal),
      };
    });
  }, [itemDetails, selectedItem?.otherComponents]);

  const props = React.useMemo(() => {
    const [firstCell] = itemDetails?.cells || [];
    const {
      Cotizacion_Id,
      nCotDetItem,
      nCotDetCantidad,
      quote_extra_details: { CeldaDescripcion, CeldaId, operativeCosts },
    } = selectedItem;

    const totalPrice =
      Number.parseFloat(firstCell?.nPrecioUnitario) -
        AccesoriesMapped.reduce((acc, curr) => acc + curr.price, 0) || 0;

    return {
      title: CeldaDescripcion,
      description: CeldaDescripcion,
      quoteId: Cotizacion_Id,
      quoteDetailId: nCotDetItem,
      quantity: Number.parseInt(nCotDetCantidad),
      quoteCeldaId: firstCell?.CotizacionDetalleCeldaId,
      deliveryDays: Number.parseInt(firstCell?.nDiasParaEntrega ?? "0"),
      otherComponents: AccesoriesMapped,
      precioCelda: totalPrice,
      celdaId: CeldaId,
      operativeCosts,
    };
  }, [AccesoriesMapped, selectedItem, itemDetails]);

  if (isLoadingItemDetails) {
    return (
      <div className="animate-pulse space-y-4 py-4">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-6"></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
        <div className="h-10 bg-gray-200 rounded w-full"></div>
        <div className="h-32 bg-gray-200 rounded w-full"></div>
        <div className="h-10 bg-gray-200 rounded w-1/3 mt-4"></div>
      </div>
    );
  }

  if (!selectedItem) {
    return <div>No hay detalles disponibles</div>;
  }

  return (
    props && (
      <ComponentCellsCard
        {...props}
        className={"shadow-none px-0"}
        isEditMode={true}
        onSuccessRefetch={refetchItemDetails}
      />
    )
  );
};

const EditQuoteDetailTransformadores = ({ selectedItem }) => {
  const { itemDetails, isLoadingItemDetails, refetchItemDetails } =
    useQuoteDetailsItems({
      quoteId: selectedItem?.Cotizacion_Id,
      quoteDetailId: selectedItem?.nCotDetItem,
    });

  const AccesoriesMapped = React.useMemo(() => {
    const accesories =
      itemDetails?.transformers
        ?.map((transformer) => transformer.accesorios)
        .flat() || [];
    return accesories.map((oc) => {
      // Buscar el nombre del accesorio en selectedItem.otherComponents
      const accesorioInfo = selectedItem?.otherComponents?.find(
        (item) =>
          item.TransformadorAccedorio_Id === oc.nTransformadorAccesorioId
      );

      return {
        id: oc.nTransformadorAccesorioId,
        name: accesorioInfo?.sTraAccDescripcion,
        price: Number.parseFloat(oc.nPrecio),
        total: Number.parseFloat(oc.nTotal),
      };
    });
  }, [itemDetails, selectedItem?.otherComponents]);

  const props = React.useMemo(() => {
    const [firstTransformer] = itemDetails?.transformers || [];
    const {
      Cotizacion_Id,
      nCotDetItem,
      nCotDetCantidad,
      quote_extra_details: {
        TransformadorDescripcion,
        TransformadorId,
        operativeCosts,
      },
    } = selectedItem;

    const totalPrice =
      Number.parseFloat(firstTransformer?.nPrecioUnitario) -
        AccesoriesMapped.reduce((acc, curr) => acc + curr.price, 0) || 0;

    return {
      title: TransformadorDescripcion,
      description: TransformadorDescripcion,
      quoteId: Cotizacion_Id,
      quoteDetailId: nCotDetItem,
      quantity: Number.parseInt(nCotDetCantidad),
      quoteTransformadorId: firstTransformer?.CotizacionDetalleTransformadorId,
      deliveryDays: Number.parseInt(firstTransformer?.nDiasParaEntrega ?? "0"),
      otherComponents: AccesoriesMapped,
      precioTransformer: totalPrice,
      transformerId: TransformadorId,
      operativeCosts,
    };
  }, [AccesoriesMapped, selectedItem, itemDetails]);

  if (isLoadingItemDetails) {
    return (
      <div className="animate-pulse space-y-4 py-4">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-6"></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
        <div className="h-10 bg-gray-200 rounded w-full"></div>
        <div className="h-32 bg-gray-200 rounded w-full"></div>
        <div className="h-10 bg-gray-200 rounded w-1/3 mt-4"></div>
      </div>
    );
  }

  if (!selectedItem) {
    return <div>No hay detalles disponibles</div>;
  }

  return (
    props && (
      <ComponentTransformersCard
        {...props}
        className={"shadow-none px-0"}
        isEditMode={true}
        onSuccessRefetch={refetchItemDetails}
      />
    )
  );
};

const EditQuoteDetail = React.memo(function EditQuoteDetail({
  quotationType,
  selectedItem,
  marketId,
  setOpen,
}) {
  switch (quotationType) {
    case 1:
      return (
        <EditQuoteDetailElectrogenos
          selectedItem={selectedItem}
          marketId={marketId}
          setOpen={setOpen}
        />
      );
    case 2:
      return <EditQuoteDetailCables selectedItem={selectedItem} />;
    case 3:
      return <EditQuoteDetailCeldas selectedItem={selectedItem} />;
    case 4:
      return <EditQuoteDetailTransformadores selectedItem={selectedItem} />;
    default:
      return <span>Debe seleccionar un tipo de cotizador</span>;
  }
});

export const EditQuoteDetailModal = ({
  open,
  setOpen,
  selectedItem,
  marketId,
}) => {
  const [quotationType, setQuotationType] = useState(null);

  React.useEffect(() => {
    setQuotationType(selectedItem?.nCotDetTipo || 1);
  }, [selectedItem]);

  let modalTitle = "";

  switch (quotationType) {
    case 1:
      modalTitle = "Editar grupo electrógeno";
      break;
    case 2:
      modalTitle = "Editar cable";
      break;
    case 3:
      modalTitle = "Editar celda";
      break;
    case 4:
      modalTitle = "Editar transformador";
      break;
    default:
      modalTitle = "Editar detalle de cotización";
  }

  return (
    <Modal title={modalTitle} open={open} setOpen={setOpen} width="max-w-lg">
      {selectedItem ? (
        <EditQuoteDetail
          quotationType={quotationType}
          selectedItem={selectedItem}
          marketId={marketId}
          setOpen={setOpen}
        />
      ) : (
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      )}
    </Modal>
  );
};
