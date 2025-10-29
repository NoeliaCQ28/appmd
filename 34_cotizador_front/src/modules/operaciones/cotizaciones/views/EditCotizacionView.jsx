import React from "react";
import { useParams } from "react-router-dom";
import { QuoteFormSkeleton } from "../../../../components/skeletons/QuoteFormSkeleton";
import useCustomer from "../../../catalagos/clientes/hooks/useCustomer";
import useComercialCondition from "../../../catalagos/condiciones/hooks/useComercialCondition";
import { useVendedores } from "../../../catalagos/vendedores/hooks/useVendedores";
import { EditQuoteForm } from "../components/forms/EditQuoteForm";
import useCurrency from "../hooks/useCurrency";
import { useDistributionChannel } from "../hooks/useDistributionChannel";
import { useIncoterms } from "../hooks/useIncoterms";
import useMarket from "../hooks/useMarket";
import useSingleQuote from "../hooks/useSingleQuote";
import { useExchangeStore } from "../store/useExchangeStore";
import { useQuoteDetailStore } from "../store/useQuoteDetailStore";

export const EditCotizacionView = ({ route }) => {
  const { id } = useParams();

  const { selectedQuote, setQuoteSelected } = useQuoteDetailStore();

  const { quote, isLoading: isLoadingQuote } = useSingleQuote();
  const { setCurrency, setTypeChange, resetExchange } = useExchangeStore();

  React.useEffect(() => {
    if (selectedQuote?.Cotizacon_Id !== id) {
      setQuoteSelected({ Cotizacon_Id: id });
    }
  }, [id, selectedQuote, setQuoteSelected]);

  React.useEffect(() => {
    if (quote && !isLoadingQuote) {
      const currencyCode = quote?.sMonedaCodigo || "USD";
      const currencyDescription =
        quote?.sMonDescripcion || "Dólares Americanos";
      const currencySymbol = quote?.sMonedaSimbolo || "$";
      const exchangeType = Number.parseFloat(quote?.nCotTipoCambio) || 0;

      if (currencyCode && currencyDescription && currencySymbol) {
        setTypeChange(exchangeType);
        setCurrency({
          code: currencyCode,
          description: currencyDescription,
          symbol: currencySymbol,
        });
      }
    }
  }, [quote, isLoadingQuote, setCurrency, setTypeChange]);

  React.useEffect(() => {
    return () => {
      resetExchange();
    };
  }, [resetExchange]);

  const { currencies = [], isLoading: isLoadingCurrencies } = useCurrency();
  const { markets = [], isLoadingMarkets } = useMarket();
  const { data: sellers = [], isLoading: isLoadingSellers } = useVendedores();
  const { data: customers = [], isLoading: isLoadingCustomers } = useCustomer();

  const { data: comercialConditions, isLoading: isComercialConditionsLoading } =
    useComercialCondition();
  const { distributionChannels = [], isLoadingDistributionChannels } =
    useDistributionChannel();
  const { incoterms, isLoadingIncoterms } = useIncoterms();

  const filterSellers = React.useMemo(
    () => sellers.filter((seller) => seller.nEjeEstado === 1),
    [sellers]
  );

  const isLoading =
    isLoadingCurrencies ||
    isLoadingMarkets ||
    isLoadingSellers ||
    isLoadingCustomers ||
    isLoadingQuote ||
    isComercialConditionsLoading ||
    isLoadingDistributionChannels ||
    isLoadingIncoterms;

  return (
    <div>
      <div className="w-full py-8 px-3 md:px-7">
        <h2 className="text-2xl font-semibold">Editar Cotización</h2>
        <div>
          {isLoading ? (
            <QuoteFormSkeleton />
          ) : (
            <EditQuoteForm
              selectedItem={quote}
              currencies={currencies}
              markets={markets}
              sellers={filterSellers}
              customers={customers}
              comercialConditions={comercialConditions}
              distributionChannels={distributionChannels}
              incoterms={incoterms}
            />
          )}
        </div>
      </div>
    </div>
  );
};
