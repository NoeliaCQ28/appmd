import { useQuery } from "@tanstack/react-query";
import React from "react";
import MarginService from "../../services/v2/MarginService";

const QUERY_KEY = "margins";

const useMargin = ({ generatorSetId, motorBrandId, marketId }) => {
  const { find } = MarginService;

  const {
    data: margins,
    isLoading: isLoadingMargins,
    error: errorMargins,
  } = useQuery({
    queryKey: [QUERY_KEY, generatorSetId, motorBrandId, marketId],
    queryFn: () => find({ generatorSetId, motorBrandId, marketId }),
    enabled: !!generatorSetId && !!motorBrandId && !!marketId,
    retry: 1,
  });

  const evalPrice = React.useCallback(
    (cost) => {
      const costValue = Number(cost) || 0;

      if (!costValue) {
        return 0;
      }

      const margin = margins?.factors?.margin || 1;
      const discount = margins?.factors?.discount || 1;

      const price = costValue / margin / discount;

      return price.toFixed(2);
    },
    [margins?.factors?.discount, margins?.factors?.margin]
  );

  return {
    margins,
    isLoadingMargins,
    errorMargins,
    evalPrice,
  };
};

export default useMargin;
