import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import TransformersService from "../services/transformersService";

const QUERY_KEY = "transformadores";

export const useTransformers = () => {
  const {
    getParams,
    searchTransformers,
    getAllTransformers,
    createTransformers,
    updateTransformers,
    removeTransformers,
    getAllAccesorios,
    createAccesorio,
    updateAccesorio,
    deleteAccesorio,
  } = TransformersService;

  const queryClient = useQueryClient();

  const {
    data: params,
    isLoading: isLoadingParams,
    error: errorParams,
  } = useQuery({
    queryKey: [QUERY_KEY, "params"],
    queryFn: getParams,
    onError: (error) => {
      toast.error(
        `Error al obtener los parametros para los transformadores: ${error.message}`
      );
    },
  });

  const {
    data: accesorios,
    isLoading: isLoadingAccesorios,
    error: errorAccesorios,
  } = useQuery({
    queryKey: [QUERY_KEY, "accesorios"],
    queryFn: getAllAccesorios,
    onError: (error) => {
      toast.error(`Error al obtener los accesorios: ${error.message}`);
    },
  });

  const {
    mutate: createAccesorioMutate,
    isPending: isPendingCreateAccesorio,
    error: errorCreateAccesorio,
  } = useMutation({
    mutationFn: createAccesorio,
    onSuccess: (data) => {
      toast.success("Accesorio creado con éxito");
      queryClient.invalidateQueries([QUERY_KEY, "accesorios"]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const {
    mutate: updateAccesorioMutate,
    isPending: isPendingUpdateAccesorio,
    error: errorUpdateAccesorio,
  } = useMutation({
    mutationFn: updateAccesorio,
    onSuccess: (data) => {
      toast.success("Accesorio actualizado con éxito");
      queryClient.invalidateQueries([QUERY_KEY, "accesorios"]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const {
    mutate: deleteAccesorioMutate,
    isPending: isPendingDeleteAccesorio,
    error: errorDeleteAccesorio,
  } = useMutation({
    mutationFn: deleteAccesorio,
    onSuccess: (data) => {
      toast.success("Accesorio eliminado con éxito");
      queryClient.invalidateQueries([QUERY_KEY, "accesorios"]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const {
    mutate: search,
    data: transformers,
    isPending: isLoadingTransformers,
    error: errorTransformers,
  } = useMutation({
    mutationFn: searchTransformers,
    onSuccess: (data) => {
      toast.success("Transformadores encontrados con éxito");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const {
    data: allTransformers,
    isLoading: isLoadingAllTransformers,
    error: errorAllTransformers,
  } = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: getAllTransformers,
    onError: (error) => {
      toast.error(
        `Error al obtener todos los transformadores: ${error.message}`
      );
    },
  });

  const {
    mutate: create,
    isPending: isPendingCreateTransformers,
    error: errorCreateTransformers,
  } = useMutation({
    mutationFn: createTransformers,
    onSuccess: (data) => {
      toast.success("Transformador creada con éxito");
      queryClient.invalidateQueries([QUERY_KEY]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const {
    mutate: update,
    isPending: isPendingUpdateTransformers,
    error: errorUpdatingTransformers,
  } = useMutation({
    mutationFn: updateTransformers,
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY]);

      toast.success("Transformador actualizado correctamente");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const {
    mutate: deleteTransformers,
    isPending: isPendingDeleteTransformers,
    error: errorDeletingTransformers,
  } = useMutation({
    mutationFn: removeTransformers,
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY]);

      toast.success("Transformador eliminado correctamente");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    params,
    isLoadingParams,
    errorParams,
    search,
    transformers,
    isLoadingTransformers,
    errorTransformers,
    allTransformers,
    isLoadingAllTransformers,
    errorAllTransformers,
    create,
    isPendingCreateTransformers,
    errorCreateTransformers,
    update,
    isPendingUpdateTransformers,
    errorUpdatingTransformers,
    deleteTransformers,
    isPendingDeleteTransformers,
    errorDeletingTransformers,
    accesorios,
    isLoadingAccesorios,
    errorAccesorios,
    createAccesorioMutate,
    isPendingCreateAccesorio,
    errorCreateAccesorio,
    updateAccesorioMutate,
    isPendingUpdateAccesorio,
    errorUpdateAccesorio,
    deleteAccesorioMutate,
    isPendingDeleteAccesorio,
    errorDeleteAccesorio,
  };
};
