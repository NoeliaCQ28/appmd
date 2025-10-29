import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import CellsService from '../services/cellsService';

const QUERY_KEY = 'celdas';

export const useCells = () => {
	const { getParams, searchCells, getAllCells, createCells, updateCells, removeCells, getAllAccesorios, createAccesorio, updateAccesorio, deleteAccesorio } =
		CellsService;

	const queryClient = useQueryClient();

	const {
		data: params,
		isLoading: isLoadingParams,
		error: errorParams,
	} = useQuery({
		queryKey: [QUERY_KEY, 'params'],
		queryFn: getParams,
		onError: (error) => {
			toast.error(`Error al obtener las celdas: ${error.message}`);
		},
	});

	const {
		mutate: search,
		data: cells,
		isPending: isLoadingCells,
		error: errorCells,
	} = useMutation({
		mutationFn: searchCells,
		onSuccess: (data) => {
			toast.success('Celdas encontradas con éxito');
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const {
		data: allCells,
		isLoading: isLoadingGetAllCells,
		error: errorGetAllCells,
	} = useQuery({
		queryKey: [QUERY_KEY],
		queryFn: getAllCells,
	});

	const {
		mutate: create,
		isPending: isPendingCreateCells,
		error: errorCreateCells,
	} = useMutation({
		mutationFn: createCells,
		onSuccess: (data) => {
			toast.success('Celda creada con éxito');
			queryClient.invalidateQueries([QUERY_KEY]);
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const {
		mutate: update,
		isPending: isPendingUpdateCells,
		error: errorUpdatingCells,
	} = useMutation({
		mutationFn: updateCells,
		onSuccess: () => {
			queryClient.invalidateQueries([QUERY_KEY]);

			toast.success('Celda actualizada correctamente');
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const {
		mutate: deleteCells,
		isPending: isPendingDeleteCells,
		error: errorDeletingCells,
	} = useMutation({
		mutationFn: removeCells,
		onSuccess: () => {
			queryClient.invalidateQueries([QUERY_KEY]);

			toast.success('Celda eliminada correctamente');
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const {
		data: accesorios,
		isLoading: isLoadingAccesorios,
		error: errorAccesorios,
	} = useQuery({
		queryKey: [QUERY_KEY, 'accesorios'],
		queryFn: getAllAccesorios,
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

	return {
		params,
		isLoadingParams,
		errorParams,
		search,
		cells,
		isLoadingCells,
		errorCells,
		allCells,
		isLoadingGetAllCells,
		errorGetAllCells,
		create,
		isPendingCreateCells,
		errorCreateCells,
		update,
		isPendingUpdateCells,
		errorUpdatingCells,
		deleteCells,
		isPendingDeleteCells,
		errorDeletingCells,
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
