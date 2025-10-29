import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "../../../../../../components/custom/buttons/Button";
import { FormInputText } from "../../../../../../components/custom/inputs/FormInputText";
import { FormSelectText } from "../../../../../../components/custom/selects/FormSelectText";
import { useOptionals } from "../../../../../operaciones/cotizaciones/hooks/useOptionals";
import useModelsSearch from "../../../hooks/useModelsSearch";

import { Checkbox } from "primereact/checkbox";

export const CreateAccesorioForm = ({
  setIsOpen,
  isEditMode,
  selectedItem,
}) => {
  const {
    control,
    register,
    reset,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { isSubmitting },
  } = useForm();
  const { motorBrands = [] } = useModelsSearch();
  const {
    allOptionals,
    createOptional,
    updateOptional,
    allBrands,
    isLoadingAllBrands,
    errorAllBrands,
    allTypes,
    isLoadingAllTypes,
    errorAllTypes,
    evalAccesoryPrice,
  } = useOptionals({});

  const fixedMargin = React.useMemo(
    () => Number(allOptionals?.[0]?.nOpcMargenFijo) || 1,
    [allOptionals]
  );

  const onSubmit = (data) => {
    createOptional(data);
    reset();
    setIsOpen(false);
  };

  const onEdit = (data) => {
    updateOptional({ id: selectedItem?.Opcionales_Id, data: data });
    reset();
    setIsOpen(false);
  };

  React.useEffect(() => {
    if (isEditMode && selectedItem) {
      reset(selectedItem);
    }
  }, [isEditMode, selectedItem, reset]);

  const typeOptions = allTypes?.map((type) => ({
    label: type.sOpcTipo,
    value: type.OpcId,
  }));

  const brands = allBrands?.map((brand) => ({
    label: brand.sOpcMarca,
    value: brand.sOpcMarca,
  }));

  const fabricOptions = [
    { label: "MODASA", value: "MODASA" },
    { label: "CHINA", value: "CHINA" },
  ];

  // Función para manejar el click y evitar la propagación del evento
  const handleButtonClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleSubmit(isEditMode ? onEdit : onSubmit)();
  };

  React.useEffect(() => {
    if (isEditMode) {
      reset({
        ...selectedItem,
        nOpcValorEstandar: selectedItem?.nOpcValorEstandar === 1,
        nOpcPrecio: selectedItem?.nOpcPrecio || "",
        nOpcCosto: selectedItem?.nOpcCosto || "",
      });
    }
  }, [isEditMode, selectedItem, reset]);

  return (
    <form className="flex flex-col space-y-3">
      <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Controller
          name="nOpcTipo"
          rules={{ required: "El tipo es obligatorio" }}
          control={control}
          defaultValue={typeOptions[0].value}
          render={({ field: { onChange, value, ...rest } }) => (
            <FormSelectText
              name="nOpcTipo"
              label="TIPO"
              placeholder="Seleccione el tipo"
              options={typeOptions}
              onChange={onChange}
              value={value}
              required
              {...rest}
            />
          )}
        />

        <Controller
          name="sOpcFabricacion"
          control={control}
          defaultValue={fabricOptions[0].value}
          rules={{ required: "El tipo de fabricación es obligatorio" }}
          render={({ field: { onChange, value, ...rest } }) => (
            <FormSelectText
              name="sOpcFabricacion"
              label="TIPO DE FABRICACIÓN"
              placeholder="Seleccione el tipo de fabricación"
              options={fabricOptions}
              onChange={onChange}
              value={value}
              required
              {...rest}
            />
          )}
        />
      </section>
      <section>
        <FormInputText
          name="sOpcNombre"
          label="NOMBRE DEL ACCESORIO"
          required
          placeholder="Ingrese el nombre del accesorio"
          {...register("sOpcNombre", {
            required: "El nombre del accesorio es obligatorio",
          })}
        />
      </section>
      <section>
        <FormInputText
          name="sOpcDescripcion"
          label="DETALLE/DESCRIPCIÓN"
          placeholder="Ingrese el detalle/descripción"
          {...register("sOpcDescripcion")}
        />
      </section>
      <section className="grid grid-cols-2 gap-3">
        <FormInputText
          defaultValue={selectedItem?.sOpcCodigo || "Todas las Gamas"}
          name="nOpcAplicacion"
          label="TIPO DE APLICACIÓN"
          placeholder="Ingrese el tipo de aplicación"
          required
          {...register("nOpcAplicacion", {
            required: "El tipo de aplicación es obligatorio",
          })}
        />
        <Controller
          name="sOpcMarca"
          control={control}
          rules={{ required: "La marca es obligatorio" }}
          render={({ field: { onChange, value, ...rest } }) => (
            <FormSelectText
              name="sOpcMarca"
              label="MARCA"
              placeholder="Seleccione la marca"
              options={brands}
              onChange={onChange}
              value={value}
              editable
              required
              {...rest}
            />
          )}
        />
      </section>
      <section className="grid grid-cols-3 gap-3">
        <div className="flex items-center gap-2">
          <Controller
            name="nOpcValorEstandar"
            control={control}
            render={({ field: { onChange, value, ...rest } }) => (
              <Checkbox
                inputId="nOpcValorEstandar"
                checked={value}
                onChange={(e) => {
                  const isChecked = e.checked;
                  onChange(e);

                  setValue("nOpcPrecio", isChecked ? "0" : "");
                  setValue("nOpcCosto", isChecked ? "0" : "");
                }}
                {...rest}
              />
            )}
          />

          <label
            htmlFor="nOpcValorEstandar"
            className="ml-2 font-semibold uppercase text-sm"
          >
            VALOR ESTANDAR
          </label>
        </div>
        <FormInputText
          name="nOpcPrecio"
          label="PRECIO US $"
          type="number"
          placeholder="Ingrese el precio"
          value={evalAccesoryPrice({
            fixedMargin: fixedMargin,
            variableMargin: Number(watch("nOpcMargenVariable")),
            cost: Number(watch("nOpcCosto")),
          })}
          disabled
        />
        <FormInputText
          name="nOpcCosto"
          label="COSTO US $"
          type="number"
          min={0}
          step="0.01"
          disabled={watch("nOpcValorEstandar")}
          placeholder="Ingrese el costo"
          {...register("nOpcCosto")}
        />
      </section>
      <section className="grid grid-cols-2 gap-3">
        <Controller
          name="sOpcMarcaGE"
          control={control}
          defaultValue={1}
          render={({ field: { onChange, value, ...rest } }) => (
            <FormSelectText
              name="sOpcMarcaGE"
              label="Marca de Grupo Electrógeno"
              placeholder="Seleccione la marca"
              options={motorBrands.map((mb) => mb.sMotMarca)}
              onChange={onChange}
              value={value}
              {...rest}
            />
          )}
        />
        <FormInputText
          name="sOpcModeloGE"
          label="Modelo de Grupo Electrógeno"
          placeholder="Ingrese el modelo de grupo electrógeno"
          {...register("sOpcModeloGE")}
        />
      </section>
      <section className="grid grid-cols-3 gap-3">
        <FormInputText
          name="nOpcMargenVariable"
          label="Margen Variable (%)"
          type="number"
          min={0}
          step="0.01"
          max={100}
          placeholder="Ingrese el margen variable"
          {...register("nOpcMargenVariable")}
        />
        <FormInputText
          name="nOpcMargenFijo"
          label="Margen Fijo (%)"
          type="number"
          disabled
          placeholder="Ingrese el margen fijo"
          value={fixedMargin}
        />
        <Controller
          name="nOpcEstado"
          control={control}
          defaultValue={1}
          rules={{ required: "El estado es obligatorio" }}
          render={({ field: { onChange, value, ...rest } }) => (
            <FormSelectText
              name="nOpcEstado"
              label="Estado"
              placeholder="Seleccione el estado"
              options={[
                { label: "Habilitado", value: 1 },
                { label: "Deshabilitado", value: 0 },
              ]}
              onChange={onChange}
              value={value}
              required
              {...rest}
            />
          )}
        />
      </section>
      <section className="flex items-center justify-center gap-3">
        <Button type="button" onClick={handleButtonClick}>
          {isEditMode ? "ACTUALIZAR" : "GUARDAR"}
        </Button>
        <Button
          type="button"
          onClick={() => setIsOpen(false)}
          variant="destructive"
        >
          Cancelar
        </Button>
      </section>
    </form>
  );
};
