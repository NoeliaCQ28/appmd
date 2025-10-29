import { useQuery, useQueryClient } from "@tanstack/react-query";
import SocietyService from "../services/societyService";

const QUERY_KEY = "societies";

export const useSociety = () => {
  const queryClient = useQueryClient();

  const { fetchAll } = SocietyService;

  const {
    data: societies,
    isLoading: isLoadingSocieties,
    error: errorSocieties,
    refetch,
  } = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: fetchAll,
  });

  return {
    societies,
    isLoadingSocieties,
    errorSocieties,
    refetch,
  };
};
