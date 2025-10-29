import { FormInputText } from "@components/custom/inputs/FormInputText";
import { Editor } from "primereact/editor";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { Button } from "../../../../../components/custom/buttons/Button";
import { FormSelectText } from "../../../../../components/custom/selects/FormSelectText";
import useQuoteTypes from "../../../../operaciones/cotizaciones/hooks/useQuoteTypes";
import useComercialCondition from "../../hooks/useComercialCondition";
import { Edit2Icon, SaveIcon } from "lucide-react";
import ViewModes from "../../../../../constants/ViewModes";
import useMarket from "../../../../operaciones/cotizaciones/hooks/useMarket";

const commercialConditionHTMLTemplate = `<p><strong>CONDICIONES COMERCIALES</strong></p><p><br></p><p><br></p><p><br></p><p><strong>CONSIDERACIONES</strong></p><p><br></p><p><br></p>`;
const commercialConditionTemplate = `CONDICIONES COMERCIALES



CONSIDERACIONES


`;

const CancelButton = ({ external, onCancelForm }) => {
  if (external) {
    return (
      <Button
        type="button"
        variant="destructive"
        onClick={() => onCancelForm()}
      >
        Cancelar
      </Button>
    );
  }

  return (
    <Link to={"/condiciones-comerciales"}>
      <Button type="button" variant="destructive">
        Cancelar
      </Button>
    </Link>
  );
};

export const CondicionesForm = ({
  viewMode = ViewModes.CREATE,
  selectedItem,
  external = false,
  onCancelForm = () => {},
}) => {
  const navigate = useNavigate();

  const defaultValues = {
    tipo: selectedItem?.nConCotTipoId || 1,
    titulo: selectedItem?.sConTitulo || "",
    descripcion: selectedItem?.sConDescripcion || commercialConditionTemplate,
    descripcion_html:
      selectedItem?.sConDescripcionHTML || commercialConditionHTMLTemplate,
    estado: selectedItem?.nConEstado || 1,
    marketId: selectedItem?.nConMercadoId,
  };

  const {
    control,
    register,
    reset,
    formState: { errors },
    watch,
    handleSubmit,
  } = useForm({
    defaultValues: defaultValues,
  });

  const { createMutate, updateMutate } = useComercialCondition();
  const {
    quoteTypes = [],
    isLoadingQuoteTypes,
    errorQuoteTypes,
  } = useQuoteTypes();

  const { markets, isLoadingMarkets, errorMarkets } = useMarket();

  const quoteTypesOptions = React.useMemo(
    () =>
      quoteTypes?.map((qt) => {
        return { label: qt.sCotTipoNombre, value: qt.CotizacionTipoId };
      }),
    [quoteTypes]
  );

  const tipoValue = watch("tipo") || 1;

  const marketsOptions = React.useMemo(() => {
    if (!markets || !Array.isArray(markets)) {
      return [];
    }

    const mappedMarkets = markets.map((m) => ({
      label: m.sNombre,
      value: m.MercadoId,
    }));

    // Si el tipo es diferente de 1, solo mostrar mercado NACIONAL (Cables, Celdas y Transformadores)
    if (tipoValue !== 1) {
      return mappedMarkets.filter((m) => m.label === "NACIONAL");
    }

    return mappedMarkets;
  }, [markets, tipoValue]);

  const onSave = (data) => {
    const { descripcion_html: rawDescription } = data;

    const descripcion_html = rawDescription.htmlValue;
    const descripcion = rawDescription.textValue;

    const dataMapped = {
      ...data,
      descripcion,
      descripcion_html,
    };

    createMutate(dataMapped);

    if (external) {
      onCancelForm();
    } else {
      navigate("/condiciones-comerciales");
    }
  };
  const onEdit = (data) => {
    const { CondicionesComerciales_Id: id } = selectedItem;

    let dataMapped = {
      ...data,
    };

    if (data.descripcion_html.htmlValue && data.descripcion_html.textValue) {
      const { descripcion_html: rawDescription } = data;
      const descripcion_html = rawDescription.htmlValue;
      const descripcion = rawDescription.textValue;

      dataMapped = {
        ...dataMapped,
        descripcion,
        descripcion_html,
      };
    }

    updateMutate({
      id,
      data: dataMapped,
    });

    if (external) {
      onCancelForm();
    } else {
      navigate("/condiciones-comerciales");
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div>
        <div>
          {/* Primera fila: Tipo y Mercado */}
          <section className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6">
            {isLoadingQuoteTypes ? (
              <div className="w-full sm:w-[250px]">
                <div className="text-xs font-medium mb-1">TIPO</div>
                <div className="h-10 bg-gray-200 animate-pulse rounded"></div>
              </div>
            ) : (
              <div className="w-full sm:w-[250px]">
                <Controller
                  name="tipo"
                  control={control}
                  defaultValue=""
                  render={({ field: { onChange, value, ...rest } }) => (
                    <FormSelectText
                      name="tipo"
                      label="TIPO"
                      placeholder="Seleccione el tipo"
                      options={quoteTypesOptions}
                      onChange={onChange}
                      value={value}
                      {...rest}
                      disabled={ViewModes.isReadOnly(viewMode)}
                    />
                  )}
                />
              </div>
            )}

            {isLoadingMarkets && (
              <div className="w-full sm:w-[250px]">
                <div className="text-xs font-medium mb-1">MERCADO</div>
                <div className="h-10 bg-gray-200 animate-pulse rounded"></div>
              </div>
            )}
            {!isLoadingMarkets && (
              <div className="w-full sm:w-[250px]">
                <Controller
                  name="marketId"
                  control={control}
                  render={({ field: { onChange, value, ...rest } }) => {
                    return (
                      <FormSelectText
                        name="marketId"
                        label="MERCADO"
                        placeholder="Seleccione el mercado"
                        options={marketsOptions}
                        onChange={onChange}
                        value={value}
                        {...rest}
                        disabled={ViewModes.isReadOnly(viewMode)}
                      />
                    );
                  }}
                />
              </div>
            )}
          </section>

          {/* Segunda fila: Título */}
          <section className="mt-4">
            <FormInputText
              label={"Titulo"}
              placeholder={"Consideraciones"}
              parentClassName="w-full"
              maxLength={100}
              {...register("titulo", {
                required: "El Titulo es obligatorio",
              })}
              error={errors.titulo}
              control={control}
              disabled={ViewModes.isReadOnly(viewMode)}
            />
          </section>

          <div className="mt-7">
            <Controller
              name="descripcion_html"
              control={control}
              rules={{ required: "La descripción es obligatoria" }}
              render={({ field: { onChange, value, ...rest } }) => (
                <Editor
                  value={value}
                  onTextChange={onChange}
                  style={{ height: "320px" }}
                  placeholder="Escriba aquí..."
                  {...rest}
                  className="textarea"
                  readOnly={ViewModes.isReadOnly(viewMode)}
                  showHeader={!ViewModes.isReadOnly(viewMode)}
                />
              )}
            />
          </div>
        </div>
        {/* Footer */}
        {!ViewModes.isReadOnly(viewMode) && (
          <div className="flex flex-col justify-center space-y-4 md:space-y-0 md:space-x-10 md:py-7 md:flex-row">
            <Button
              type="button"
              onClick={handleSubmit(
                viewMode === ViewModes.EDIT ? onEdit : onSave
              )}
            >
              {viewMode === ViewModes.EDIT ? (
                <Edit2Icon className="w-4 h-4 mr-2" />
              ) : (
                <SaveIcon className="w-4 h-4 mr-2" />
              )}
              {viewMode === ViewModes.EDIT ? "Editar" : "Guardar"}
            </Button>
            <CancelButton external={external} onCancelForm={onCancelForm} />
          </div>
        )}
      </div>
    </form>
  );
};
