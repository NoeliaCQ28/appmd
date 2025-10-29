import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import CablesService from '../services/cablesService';

const QUERY_KEY = 'cables';

export const useCables = () => {
	const { getParams, searchCables, createCable, getAllCables, updateCable, removeCable } =
		CablesService;

	const queryClient = useQueryClient();

	const {
		data: params,
		isLoading: isLoadingParams,
		error: errorParams,
	} = useQuery({
		queryKey: [QUERY_KEY, 'params'],
		queryFn: getParams,
		onError: (error) => {
			toast.error(`Error al obtener cables: ${error.message}`);
		},
	});

	const {
		mutate: search,
		data: cables,
		isPending: isLoadingCables,
		error: errorCables,
	} = useMutation({
		mutationFn: searchCables,
		queryKey: [QUERY_KEY, 'search'],
		onSuccess: (data) => {
			toast.success('Cables encontrados con éxito');
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const {
		data: allCables,
		isLoading: isLoadingGetAllCables,
		error: errorGetAllCables,
	} = useQuery({
		queryKey: [QUERY_KEY],
		queryFn: getAllCables,
	});

	const {
		mutate: create,
		isPending: isPendingCreateCable,
		error: errorCreateCable,
	} = useMutation({
		mutationFn: createCable,
		onSuccess: (data) => {
			toast.success('Cable creado con éxito');
			queryClient.invalidateQueries([QUERY_KEY]);
			queryClient.invalidateQueries([QUERY_KEY, 'search']);
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const {
		mutate: update,
		isPending: isPendingUpdateCable,
		error: errorUpdatingCable,
	} = useMutation({
		mutationFn: updateCable,
		onSuccess: () => {
			queryClient.invalidateQueries([QUERY_KEY]);
			queryClient.invalidateQueries([QUERY_KEY, 'search']);

			toast.success('Cable actualizado correctamente');
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const {
		mutate: deleteCable,
		isPending: isPendingDeleteCable,
		error: errorDeletingCable,
	} = useMutation({
		mutationFn: removeCable,
		onSuccess: () => {
			queryClient.invalidateQueries([QUERY_KEY]);
			queryClient.invalidateQueries([QUERY_KEY, 'search']);

			toast.success('Cable eliminado correctamente');
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
		cables,
		isLoadingCables,
		errorCables,
		create,
		isPendingCreateCable,
		errorCreateCable,
		allCables,
		isLoadingGetAllCables,
		errorGetAllCables,
		update,
		isPendingUpdateCable,
		errorUpdatingCable,
		deleteCable,
		isPendingDeleteCable,
		errorDeletingCable,
	};
};
