import { useQuery } from "@tanstack/react-query";
import DistributionChannelService from "../services/distributionChannelService";

const QUERY_KEY = "distributionChannels";

export const useDistributionChannel = () => {
  const { fetchAll } = DistributionChannelService;

  const { data, isLoading, error } = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: fetchAll,
  });

  return {
    distributionChannels: data,
    isLoadingDistributionChannels: isLoading,
    errorDistributionChannels: error,
  };
};
