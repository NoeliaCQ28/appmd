import { useQuotationStore } from "../store/useQuotationStore";
import { composeName, evalPrices } from "../utils/v2/utils";
import { useCablesStore } from "./useCablesStore";
import { useCellsStore } from "./useCellsStore";
import { useIncoterms } from "./useIncoterms";
import useMarket from "./useMarket";
import { useTransformersStore } from "./useTransformersStore";
import React from "react";

const resumeAvailableYetPayload = {
  resume: null,
  isResumeAvailable: false,
};

function evalTotalWithThroughput({ total, throughput }) {
  let throughputAmount = 0;

  if (throughput >= 0 && throughput < 1) {
    throughputAmount = throughput;
  } else if (throughput > 1) {
    throughputAmount = throughput / 100;
  }

  return total / (1 - throughputAmount);
}

export function useResume(details, customType = null) {
  const { quotationType, quote } = useQuotationStore();
  const { discount: cableDiscount } = useCablesStore();
  const { discount: cellDiscount } = useCellsStore();
  const { discount: transformerDiscount } = useTransformersStore();

  const { incoterms, isLoadingIncoterms } = useIncoterms();
  const { markets, isLoadingMarkets } = useMarket();

  const typeToUse = customType != null ? customType : quotationType;

  if (!typeToUse) {
    return resumeAvailableYetPayload;
  }
  if (
    !details ||
    details === null ||
    details.length === 0 ||
    isLoadingIncoterms ||
    isLoadingMarkets
  ) {
    return resumeAvailableYetPayload;
  }

  switch (typeToUse) {
    case 1:
      return GeneratorSetsResume({
        generatorSets: details,
        quote,
        incoterms,
        markets,
      });
    case 2:
      return CablesResume(details, cableDiscount);
    case 3:
      return CeldasResume(details, cellDiscount);
    case 4:
      return TransformadorResume(details, transformerDiscount);
    default:
      return resumeAvailableYetPayload;
  }
}

function GeneratorSetsResume({ generatorSets, quote, incoterms, markets }) {
  const selectedIncoterm = incoterms.find(
    (incoterm) => incoterm.IncotermId === quote?.incotermId
  );

  const selectedMarket = markets.find(
    (market) => Number(market.MercadoId) === Number(quote.marketId)
  );

  const items = generatorSets.map((generatorSet) => {
    const { finalPrice } = evalPrices(
      generatorSet,
      generatorSet.sMercadoNombre
    );

    const accesoriesMapped = generatorSet.accessories?.map((accesory) => {
      return {
        descripcion: `${accesory.name}, ${accesory.description}`,
        parcial: accesory.price,
      };
    });

    const parcial = finalPrice * generatorSet.nIntCantidad;

    return {
      descripcion: composeName(generatorSet),
      parcial: parcial,
      details: accesoriesMapped,
      operativeCosts: generatorSet.operativeCosts,
    };
  });

  let total = items.reduce((acc, item) => acc + item.parcial, 0);

  const market = selectedMarket?.sNombre;

  if (market !== "NACIONAL") {
    const incotermCategory = selectedIncoterm?.sIncotermCategoriaNombre;

    const incotermValue = Number(quote?.incotermValue) || 0;
    const incotermValueInsurance = Number(quote?.incotermValueInsurance) || 0;

    switch (incotermCategory) {
      case "Flete":
        {
          total += incotermValue;
        }
        break;
      case "Flete y Seguros":
        {
          total += incotermValueInsurance;
          total += incotermValue;
        }
        break;
      case "Sin Flete ni Seguros":
        break;
      default:
        break;
    }
  }

  return {
    resume: {
      items: items,
      discount: 0,
      exportationCosts: {
        incoterm: {
          code: selectedIncoterm?.sCodigo,
          category: selectedIncoterm?.sIncotermCategoriaNombre,
          shippingCosts: {
            freight: Number(quote?.incotermValue) || 0,
            insurance: Number(quote?.incotermValueInsurance) || 0,
          },
          description: selectedIncoterm?.sDescripcion,
        },
        marketName: selectedMarket?.sNombre,
      },
      total,
    },
    isResumeAvailable: true,
  };
}

function CablesResume(details, throughput) {
  const items = details.map((detail) => {
    const shippingCost = Number(detail?.operativeCosts?.shipping?.amount) || 0;
    const startupCost = Number(detail?.operativeCosts?.startup?.amount) || 0;
    const cablePrice = Number.parseFloat(detail.CablePrecio) || 0;
    const quantity = Number.parseInt(detail.CableCantidad);

    const operativeCosts = shippingCost + startupCost;

    const parcial = cablePrice + operativeCosts;
    const cablePriceForMargin = cablePrice + shippingCost;

    return {
      descripcion: `${detail.CableNombre}, ${detail.CableDescripcion}`,
      parcial: parcial * quantity,
      parcialForMargin: cablePriceForMargin * quantity,
      operativeCosts: detail?.operativeCosts,
    };
  });

  const parcial = items.reduce((acc, item) => acc + item.parcial, 0);

  const parcialForMargin = items.reduce(
    (acc, item) => acc + item.parcialForMargin,
    0
  );

  const total = evalTotalWithThroughput({
    total: throughput > 0 ? parcialForMargin : parcial,
    throughput: throughput,
  });

  const throughputRest = total - parcial;

  return {
    resume: {
      items,
      discount: throughputRest,
      marginPercentage: throughput,
      isThroughput: true,
      total,
    },
    isResumeAvailable: true,
  };
}

function CeldasResume(cells, throughput) {
  const items = cells.map((cell) => {
    const accesoriosTotalAmount =
      cell.details?.reduce(
        (acc, item) => acc + Number.parseFloat(item.price),
        0
      ) || 0;

    const accesoriosDetails = cell.details?.map((item) => {
      return {
        descripcion: item.description,
        parcial: Number.parseFloat(item.price),
      };
    });

    const shippingCost = Number(cell?.operativeCosts?.shipping?.amount) || 0;
    const startupCost = Number(cell?.operativeCosts?.startup?.amount) || 0;
    const cellPrice = Number.parseFloat(cell.CeldaPrecio) || 0;
    const quantity = Number.parseInt(cell.CeldaCantidad) || 0;

    const operativeCosts = shippingCost + startupCost;
    const totalCellPrice = cellPrice + operativeCosts;

    // Para el cálculo del margen, incluimos envío pero no puesto en marcha
    const cellPriceForMargin = cellPrice + shippingCost;

    return {
      descripcion: `${cell?.CeldaDescripcion}, ${cell?.CeldaDetalle}`,
      parcial:
        (totalCellPrice + Number.parseFloat(accesoriosTotalAmount)) * quantity,
      parcialForMargin:
        (cellPriceForMargin + Number.parseFloat(accesoriosTotalAmount)) *
        quantity,
      details: accesoriosDetails,
      operativeCosts: cell?.operativeCosts,
    };
  });

  const parcial = items.reduce((acc, item) => acc + item.parcial, 0);

  const parcialForMargin = items.reduce(
    (acc, item) => acc + item.parcialForMargin,
    0
  );

  const total = evalTotalWithThroughput({
    total: throughput > 0 ? parcialForMargin : parcial,
    throughput: throughput,
  });

  const throughputRest = total - parcial;

  return {
    resume: {
      items,
      discount: throughputRest,
      marginPercentage: throughput,
      isThroughput: true,
      total,
    },
    isResumeAvailable: true,
  };
}

function TransformadorResume(transformers, throughput) {
  const items = transformers.map((transformer) => {
    const accesoriosTotalAmount =
      transformer.details?.reduce(
        (acc, item) => acc + Number.parseFloat(item.price),
        0
      ) || 0;

    const accesoriosDetails = transformer.details?.map((item) => {
      return {
        descripcion: item.description,
        parcial: Number.parseFloat(item.price),
      };
    });

    const shippingCost =
      Number(transformer?.operativeCosts?.shipping?.amount) || 0;
    const startupCost =
      Number(transformer?.operativeCosts?.startup?.amount) || 0;
    const transformerPrice =
      Number.parseFloat(transformer.TransformadorPrecio) || 0;
    const quantity = Number.parseInt(transformer.TransformadorCantidad) || 0;

    const operativeCosts = shippingCost + startupCost;
    const totalTransformerPrice = transformerPrice + operativeCosts;

    // Para el cálculo del margen, incluimos envío pero no puesto en marcha
    const transformerPriceForMargin = transformerPrice + shippingCost;

    const description =
      transformer?.TransformadorNombre != null &&
      transformer?.TransformadorNombre !== ""
        ? `${transformer?.TransformadorNombre}, ${transformer?.TransformadorDescripcion}`
        : transformer?.TransformadorDescripcion;

    return {
      descripcion: description,
      parcial:
        (totalTransformerPrice + Number.parseFloat(accesoriosTotalAmount)) *
        quantity,
      parcialForMargin:
        (transformerPriceForMargin + Number.parseFloat(accesoriosTotalAmount)) *
        quantity,
      details: accesoriosDetails,
      operativeCosts: transformer?.operativeCosts,
    };
  });

  const parcial = items.reduce((acc, item) => acc + item.parcial, 0);

  const parcialForMargin = items.reduce(
    (acc, item) => acc + item.parcialForMargin,
    0
  );

  const total = evalTotalWithThroughput({
    total: throughput > 0 ? parcialForMargin : parcial,
    throughput: throughput,
  });

  const throughputRest = total - parcial;

  return {
    resume: {
      items,
      discount: throughputRest,
      marginPercentage: throughput,
      isThroughput: true,
      total,
    },
    isResumeAvailable: true,
  };
}
