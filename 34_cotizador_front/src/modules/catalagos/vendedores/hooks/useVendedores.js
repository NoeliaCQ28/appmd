import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  deleteVendedores,
  getVendedores,
  syncVendedores,
} from "../services/VendedoresService";

export const useVendedores = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["vendedores"],
    queryFn: getVendedores,
  });

  const { mutate: eliminar } = useMutation({
    mutationFn: deleteVendedores,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["vendedores"] });
      toast.success(data);
    },
  });

  const { mutate: sincronizar, isPending: isSyncLoading } = useMutation({
    mutationFn: syncVendedores,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["vendedores"],
      });
      toast.success(data);
    },
  });

  return {
    data,
    isLoading,
    error,
    eliminar,
    sincronizar,
    isSyncLoading,
  };
};
