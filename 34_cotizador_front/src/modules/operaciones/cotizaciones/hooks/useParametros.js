import { useQuery } from "@tanstack/react-query";
import { getParametros } from "../services/ElectrogenosService";

export const useParametros = () => {
  const cabinOptions = [
    { id: 1, description: "ABIERTO", value: "ABIERTO" },
    { id: 2, description: "INSONORO", value: "INSONORO" },
  ];

  const { data } = useQuery({
    queryKey: ["parametros"],
    queryFn: getParametros,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 30,
  });

  return {
    data,
    cabinOptions,
  };
};
