import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import QuoteService from '../services/quoteService';

const useQuoteDetailsItems = ({quoteId, quoteDetailId}) => {
	const queryClient = useQueryClient();

	const { getDetailsItems } = QuoteService;

	const {
		data: itemDetails,
		isLoading: isLoadingItemDetails,
		error: itemDetailsError,
		refetch: refetchItemDetails,
	} = useQuery({
		queryKey: ['quoteItemDetails', quoteId, quoteDetailId],
		queryFn: () => getDetailsItems(quoteId, quoteDetailId),
		enabled: Boolean(quoteId && quoteDetailId),
	});

	return {
		itemDetails,
		isLoadingItemDetails,
		itemDetailsError,
		refetchItemDetails,
	};
};

export default useQuoteDetailsItems;
