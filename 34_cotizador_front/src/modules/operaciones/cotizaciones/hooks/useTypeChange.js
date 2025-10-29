import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getTypeChange } from "../services/typeChangeService";

const QUERY_KEY = "type-change";

export const useTypeChange = (fecha) => {
 
     const queryClient = useQueryClient();
     const { data, isLoading, error } = useQuery({
       queryKey: [QUERY_KEY, fecha],
       queryFn: () => getTypeChange(fecha),
     });

  return {
     data,
     isLoading,
     error,
     refetch: () => {
       queryClient.invalidateQueries([QUERY_KEY, fecha]);
     },
  };
};
