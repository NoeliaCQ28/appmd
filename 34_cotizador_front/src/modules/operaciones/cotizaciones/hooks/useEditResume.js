import { composeName } from "../utils/v2/utils";

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

export function useEditResume({
  details,
  quotationType,
  globalDiscount,
  globalMargen,
  exportationCosts,
}) {
  if (!quotationType) {
    return resumeAvailableYetPayload;
  }

  if (!details || details === null || details.length === 0) {
    return resumeAvailableYetPayload;
  }

  switch (quotationType) {
    case 1:
      return ElectrogenosResume({
        generatorSets: details,
        exportationCosts: exportationCosts,
      });
    case 2:
      return CablesResume({ cables: details, throughput: globalMargen });
    case 3:
      return CeldasResume({ cells: details, throughput: globalMargen });
    case 4:
      return TransformadorResume({
        transformers: details,
        throughput: globalMargen,
      });
    default:
      return resumeAvailableYetPayload;
  }
}

function ElectrogenosResume({ generatorSets, exportationCosts }) {
  const items = generatorSets.map((generatorSet) => {
    const { quote_extra_details } = generatorSet;

    const accesoriosDetails =
      quote_extra_details.accessories?.map((item) => {
        return {
          descripcion: `${item.name}${
            item.description ? ": " + item.description : ""
          }`,
          parcial: Number.parseFloat(item.price),
        };
      }) || [];

    return {
      descripcion: composeName(quote_extra_details, true),
      parcial: Number(generatorSet?.nCotDetImporte) || 0,
      details: accesoriosDetails,
      operativeCosts: quote_extra_details?.operativeCosts,
    };
  });

  let total = items.reduce((acc, item) => acc + item.parcial, 0);

  if (exportationCosts?.marketName !== "NACIONAL") {
    switch (exportationCosts?.incoterm?.category) {
      case "Flete":
        total += exportationCosts?.incoterm?.shippingCosts?.freight || 0;
        break;
      case "Flete y Seguros":
        total +=
          (exportationCosts?.incoterm?.shippingCosts?.freight || 0) +
          (exportationCosts?.incoterm?.shippingCosts?.insurance || 0);
        break;
      case "Sin Flete ni Seguros":
        break;
      default:
        break;
    }
  }

  const itemsWithCurrency = items.map((item) => {
    return {
      ...item,
      parcial: Number.parseFloat(item.parcial).toFixed(2),
    };
  });

  return {
    resume: {
      items: itemsWithCurrency,
      discount: 0,
      exportationCosts,
      total,
    },
    isResumeAvailable: true,
  };
}

function CablesResume({ cables, throughput }) {
  const items = cables.map((cable) => {
    const { quote_extra_details } = cable;

    const shippingCost =
      Number(quote_extra_details?.operativeCosts?.shipping?.amount) || 0;
    const startupCost =
      Number(quote_extra_details?.operativeCosts?.startup?.amount) || 0;
    const cablePrice = Number.parseFloat(cable?.nCotDetPrecioUnitario) || 0;

    const quantity = Number.parseInt(quote_extra_details?.CableCantidad) || 0;

    const totalOperativeCosts = shippingCost + startupCost;

    const price = cablePrice + totalOperativeCosts;

    const priceForMargin = (cablePrice + shippingCost) * quantity;

    return {
      descripcion: `${quote_extra_details?.CableNombre}, ${quote_extra_details?.CableDescripcion}`,
      parcial: price * quantity,
      priceForMargin,
      operativeCosts: quote_extra_details?.operativeCosts,
    };
  });

  const parcial = items.reduce((acc, item) => acc + item.parcial, 0);
  const parcialForMargin = items.reduce(
    (acc, item) => acc + item.priceForMargin,
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
      isThroughput: true,
      marginPercentage: throughput,
      total,
    },
    isResumeAvailable: true,
  };
}

function CeldasResume({ cells, throughput }) {
  const items = cells.map((cell) => {
    const accesoriosTotalAmount =
      cell.otherComponents?.reduce(
        (acc, item) => acc + Number.parseFloat(item.nCelAccPrecio),
        0
      ) || 0;

    const accesoriosDetails = cell.otherComponents?.map((item) => {
      return {
        descripcion: item.sCelAccDescripcion,
        parcial: Number.parseFloat(item.nCelAccPrecio),
      };
    });

    const { quote_extra_details } = cell;

    const shippingCost =
      Number(quote_extra_details?.operativeCosts?.shipping?.amount) || 0;
    const startupCost =
      Number(quote_extra_details?.operativeCosts?.startup?.amount) || 0;
    const cellPrice = Number.parseFloat(cell?.nCotDetPrecioUnitario) || 0;
    const quantity = Number.parseInt(cell.nCotDetCantidad) || 0;

    const operativeCosts = shippingCost + startupCost;
    const totalCellPrice = cellPrice + operativeCosts;

    // Para el cálculo del margen, incluimos envío pero no puesto en marcha
    const cellPriceForMargin = cellPrice + shippingCost;

    return {
      descripcion: `${quote_extra_details?.CeldaDescripcion}, ${quote_extra_details?.CeldaDetalle}`,
      parcial: totalCellPrice * quantity,
      parcialForMargin: cellPriceForMargin * quantity,
      details: accesoriosDetails,
      operativeCosts: quote_extra_details?.operativeCosts,
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

function TransformadorResume({ transformers, throughput }) {
  const items = transformers.map((transformer) => {
    const accesoriosTotalAmount =
      transformer.otherComponents?.reduce(
        (acc, item) => acc + Number.parseFloat(item.nTraAccPrecio),
        0
      ) || 0;

    const accesoriosDetails = transformer.otherComponents?.map((item) => {
      return {
        descripcion: item.sTraAccDescripcion,
        parcial: Number.parseFloat(item.nTraAccPrecio),
      };
    });

    const { quote_extra_details } = transformer;

    const shippingCost =
      Number(quote_extra_details?.operativeCosts?.shipping?.amount) || 0;
    const startupCost =
      Number(quote_extra_details?.operativeCosts?.startup?.amount) || 0;
    const transformerPrice = Number.parseFloat(
      transformer?.nCotDetPrecioUnitario || 0
    );
    const quantity = Number.parseInt(
      quote_extra_details?.TransformadorCantidad || 0
    );

    const operativeCosts = shippingCost + startupCost;
    const totalTransformerPrice = transformerPrice + operativeCosts;

    // Para el cálculo del margen, incluimos envío pero no puesto en marcha
    const transformerPriceForMargin = transformerPrice + shippingCost;

    const description =
      quote_extra_details?.TransformadorNombre != null &&
      quote_extra_details?.TransformadorNombre !== ""
        ? `${quote_extra_details?.TransformadorNombre}, ${quote_extra_details?.TransformadorDescripcion}`
        : quote_extra_details?.TransformadorDescripcion;

    return {
      descripcion: description,
      parcial: totalTransformerPrice * quantity,
      parcialForMargin: transformerPriceForMargin * quantity,
      details: accesoriosDetails,
      operativeCosts: quote_extra_details?.operativeCosts,
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
