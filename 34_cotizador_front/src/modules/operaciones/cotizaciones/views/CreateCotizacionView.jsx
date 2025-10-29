import React from "react";
import { QuoteFormSkeleton } from "../../../../components/skeletons/QuoteFormSkeleton";
import { useAuth } from "../../../../hooks/useAuth";
import useCustomer from "../../../catalagos/clientes/hooks/useCustomer";
import useComercialCondition from "../../../catalagos/condiciones/hooks/useComercialCondition";
import { useVendedores } from "../../../catalagos/vendedores/hooks/useVendedores";
import { QuoteForm } from "../components/forms/QuoteForm";
import useCurrency from "../hooks/useCurrency";
import { useDistributionChannel } from "../hooks/useDistributionChannel";
import { useIncoterms } from "../hooks/useIncoterms";
import useMarket from "../hooks/useMarket";

export const CreateCotizacionView = () => {
  const { currencies = [], isLoading: isLoadingCurrencies } = useCurrency();
  const { markets = [], isLoading: isLoadingMarkets } = useMarket();
  const { data: sellers = [], isLoading: isLoadingSellers } = useVendedores();
  const { data: customers = [], isLoading: isLoadingCustomers } = useCustomer();
  const { distributionChannels = [], isLoadingDistributionChannels } =
    useDistributionChannel();
  const { incoterms, isLoadingIncoterms } = useIncoterms();

  const { data: comercialConditions, isLoading: isComercialConditionsLoading } =
    useComercialCondition();

  const { data: user, isLoading: isLoadingUser } = useAuth();

  const filterSellers = React.useMemo(
    () => sellers.filter((seller) => seller.nEjeEstado === 1),
    [sellers]
  );

  const isLoading =
    isLoadingCurrencies ||
    isLoadingMarkets ||
    isLoadingSellers ||
    isLoadingCustomers ||
    isComercialConditionsLoading ||
    isLoadingDistributionChannels ||
    isLoadingIncoterms ||
    isLoadingUser;

  if (isLoading) {
    return <QuoteFormSkeleton />;
  }

  return (
    <div>
      <div className="w-full py-8 px-3 md:px-7">
        <h2 className="text-2xl font-semibold">Crear Cotización</h2>
        <div>
          <QuoteForm
            currencies={currencies}
            markets={markets}
            sellers={filterSellers}
            customers={customers}
            comercialConditions={comercialConditions}
            distributionChannels={distributionChannels}
            incoterms={incoterms}
            user={user}
          />
        </div>
      </div>
    </div>
  );
};
