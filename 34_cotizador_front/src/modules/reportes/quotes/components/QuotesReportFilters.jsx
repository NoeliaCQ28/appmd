import React from "react";
import { Controller, useForm } from "react-hook-form";
import { FormSelectText } from "../../../../components/custom/selects/FormSelectText";
import { useQuotationStore } from "../../../operaciones/cotizaciones/store/useQuotationStore";
import { Funnel } from "lucide-react";
import { ButtonIcon } from "../../../../components/custom/buttons/ButtonIcon";
import useMarket from "../../../operaciones/cotizaciones/hooks/useMarket";
import { Calendar } from "primereact/calendar";

const QUOTE_STATES = [
  { value: "Todos", label: "Todos" },
  { value: "BORRADOR", label: "BORRADOR" },
  { value: "REGISTRADA", label: "EMITIDO" },
  { value: "PEDIDO", label: "PEDIDO" },
  { value: "RECHAZADA", label: "RECHAZADA" },
];

export const QuotesReportFilters = ({ initialFilters, onSubmit }) => {
  const { types } = useQuotationStore();
  const { markets, isLoadingMarkets, errorMarkets } = useMarket();

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

  return (
    <form
      className="flex flex-col md:flex-row md:items-center gap-3 flex-wrap"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Fecha Inicio */}
      <div className="flex flex-col w-full md:w-60">
        <label className="text-xs font-medium mb-1">FECHA INICIO</label>
        <Controller
          name="startDate"
          control={control}
          rules={{ required: "Debe seleccionar una fecha de inicio" }}
          render={({ field }) => (
            <Calendar
              {...field}
              dateFormat="yy-mm-dd"
              showIcon
              placeholder="Seleccionar fecha"
              className="w-full"
            />
          )}
        />
      </div>

      {/* Fecha Fin */}
      <div className="flex flex-col w-full md:w-60">
        <label className="text-xs font-medium mb-1">FECHA FIN</label>
        <Controller
          name="endDate"
          control={control}
          rules={{ required: "Debe seleccionar una fecha fin" }}
          render={({ field }) => (
            <Calendar
              {...field}
              dateFormat="yy-mm-dd"
              showIcon
              placeholder="Seleccionar fecha"
              className="w-full"
            />
          )}
        />
      </div>

      {/* Mercado */}
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

      {/* Tipo de Cotización */}
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

      {/* Estado de Cotización */}
      <Controller
        name="quoteState"
        control={control}
        rules={{ required: "Debe seleccionar un Estado" }}
        render={({ field: { onChange, value, ...rest } }) => (
          <FormSelectText
            label={"Estado"}
            {...rest}
            options={QUOTE_STATES}
            value={value}
            onChange={onChange}
          />
        )}
      />

      <ButtonIcon
        type="submit"
        icon={<Funnel />}
        color="white"
        className="mt-0 md:mt-6"
      />
    </form>
  );
};
