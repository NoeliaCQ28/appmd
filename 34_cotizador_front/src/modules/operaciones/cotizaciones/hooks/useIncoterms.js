import { useQuery } from "@tanstack/react-query";
import IncotermsService from "../services/incotermsService";

const QUERY_KEY = "incoterms";

export const useIncoterms = () => {
  const { fetchAll } = IncotermsService;

  const { data, isLoading, error } = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: fetchAll,
  });

  return {
    incoterms: data,
    isLoadingIncoterms: isLoading,
    errorIncoterms: error,
  };
};
