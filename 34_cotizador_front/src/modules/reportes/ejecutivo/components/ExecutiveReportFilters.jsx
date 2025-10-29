import React from "react";
import { Controller, useForm } from "react-hook-form";
import { FormSelectText } from "../../../../components/custom/selects/FormSelectText";
import { useQuotationStore } from "../../../operaciones/cotizaciones/store/useQuotationStore";
import { Funnel } from "lucide-react";
import { ButtonIcon } from "../../../../components/custom/buttons/ButtonIcon";
import useMarket from "../../../operaciones/cotizaciones/hooks/useMarket";
import { useVendedores } from "../../../catalagos/vendedores/hooks/useVendedores";

export const ExecutiveReportFilters = ({ initialFilters, onSubmit }) => {
  const { types } = useQuotationStore();
  const { markets, isLoadingMarkets, errorMarkets } = useMarket();
  const {
    data: executives,
    isLoading: isLoadingExecutives,
    error: errorExecutives,
  } = useVendedores();

  const { control, handleSubmit, watch, setValue } = useForm({
    defaultValues: initialFilters,
  });

  const selectedMarketId = watch("marketId");

  const quoteTypesOptions = React.useMemo(() => {
    const all = {
      id: 0,
      description: "Todos",
    };

    if (selectedMarketId !== 1 && selectedMarketId !== 0) {
      if (selectedMarketId === 2) {
        setValue("typeOfQuoteId", 1);
      }
      return [all, ...types]
        ?.filter((t) => t.id === 1)
        ?.map((t) => ({ value: t.id, label: t.description }));
    }
    return [all, ...types]?.map((t) => ({ value: t.id, label: t.description }));
  }, [selectedMarketId, types, setValue]);

  const marketOptions = React.useMemo(() => {
    const all = { value: 0, label: "Todos" };
    return [
      all,
      ...(markets?.map((m) => ({
        value: m.MercadoId,
        label: m.sNombre,
      })) || []),
    ];
  }, [markets]);

  const executiveOptions = React.useMemo(() => {
    const all = { value: 0, label: "Todos" };
    return [
      all,
      ...(executives
        ?.filter((e) => e.sEjeNombre?.trim() !== "")
        ?.map((e) => ({
          value: e.Ejecutivo_Id,
          label: `${e.sEjeNombre} - ${e.sEjeSAP}`,
        })) || []),
    ];
  }, [executives]);

  return (
    <form
      className="flex flex-col md:flex-row md:items-center gap-3"
      onSubmit={handleSubmit(onSubmit)}
    >
      {isLoadingMarkets && (
        <div className="w-full md:w-60">
          <div className="text-xs font-medium mb-1">MERCADO</div>
          <div className="h-10 bg-gray-200 animate-pulse rounded"></div>
        </div>
      )}
      {!isLoadingMarkets && errorMarkets && (
        <div className="text-red-500">Error al cargar los mercados</div>
      )}
      {!isLoadingMarkets && !errorMarkets && (
        <Controller
          name="marketId"
          control={control}
          rules={{ required: "Debe seleccionar un Mercado" }}
          render={({ field: { onChange, value, ...rest } }) => (
            <FormSelectText
              label={"Mercado"}
              {...rest}
              options={marketOptions}
              value={value}
              onChange={onChange}
            />
          )}
        />
      )}
      <Controller
        name="typeOfQuoteId"
        control={control}
        rules={{ required: "Debe seleccionar un Tipo de cotizador" }}
        render={({ field: { onChange, value, ...rest } }) => (
          <FormSelectText
            label={"Tipo de cotización"}
            {...rest}
            options={quoteTypesOptions}
            value={value}
            onChange={onChange}
          />
        )}
      />

      {isLoadingExecutives && (
        <div className="w-full md:w-60">
          <div className="text-xs font-medium mb-1">EJECUTIVO</div>
          <div className="h-10 bg-gray-200 animate-pulse rounded"></div>
        </div>
      )}
      {!isLoadingExecutives && errorExecutives && (
        <div className="text-red-500">Error al cargar los ejecutivos</div>
      )}
      {!isLoadingExecutives && !errorExecutives && (
        <Controller
          name="executiveId"
          control={control}
          rules={{ required: "Debe seleccionar un Ejecutivo" }}
          render={({ field: { onChange, value, ...rest } }) => (
            <FormSelectText
              label={"Ejecutivo"}
              {...rest}
              options={executiveOptions}
              value={value}
              onChange={onChange}
              filter
            />
          )}
        />
      )}

      <ButtonIcon
        type="submit"
        icon={<Funnel />}
        color="white"
        className="mt-0 md:mt-6"
      />
    </form>
  );
};
