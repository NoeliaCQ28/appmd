import React, { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "../../../../../components/custom/buttons/Button";
import { FormInputText } from "../../../../../components/custom/inputs/FormInputText";
import { FormSelectText } from "../../../../../components/custom/selects/FormSelectText";
import { useCells } from "../../../../operaciones/cotizaciones/hooks/useCells";
import { FormTextArea } from "../../../../../components/custom/inputs/FormTextArea";

export const CreateCeldaForm = ({ setIsOpen, isEditMode, selectedItem }) => {
  const {
    control,
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { create, params, update } = useCells({});

  const onSubmit = (data) => {
    create(data);
    reset();
    setIsOpen(false);
  };

  const onEdit = (data) => {
    update({ id: selectedItem?.CeldaId, data: data });
    reset();
    setIsOpen(false);
  };

  React.useEffect(() => {
    if (isEditMode && selectedItem) {
      reset({
        CeldaMarca_Id: selectedItem?.CeldaMarcaId || "",
        nCelModeloId: selectedItem?.CeldaModeloId || "",
        sCelCodSAP: selectedItem?.CeldaCodigoSAP || "",
        sCelDescripcion: selectedItem?.CeldaDescripcion || "",
        sCelTipo: selectedItem?.CeldaTipo || "",
        sCelUnidad: selectedItem?.CeldaUnidad || "",
        nCelPrecio: selectedItem?.CeldaPrecio || "",
        nCelStock: selectedItem?.CeldaStock || "",
        sCelDetalle: selectedItem?.CeldaDetalle || "",
      });
    }
  }, [isEditMode, selectedItem, reset]);

  const marcasOptions = useMemo(() => {
    return (
      params?.brands?.map((brand) => ({
        label: brand.sCelMarDescripcion,
        value: brand.CeldaMarca_Id,
      })) || []
    );
  }, [params.brands]);

  const modelsOptions = useMemo(() => {
    return (
      params?.models?.map((model) => ({
        label: model.sCeldaModeloNombre,
        value: model.CeldaModelo_Id,
      })) || []
    );
  }, [params.models]);

  return (
    <form
      onSubmit={handleSubmit(isEditMode ? onEdit : onSubmit)}
      className="flex flex-col space-y-3 mt-3"
    >
      <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Controller
          name="CeldaMarca_Id"
          control={control}
          defaultValue=""
          render={({ field: { onChange, value, ...rest } }) => (
            <FormSelectText
              name="CeldaMarca_Id"
              label="MARCA"
              placeholder="Seleccione marca"
              options={marcasOptions}
              onChange={onChange}
              value={value}
              {...rest}
            />
          )}
        />

        <Controller
          name="nCelModeloId"
          control={control}
          defaultValue=""
          render={({ field: { onChange, value, ...rest } }) => (
            <FormSelectText
              name="nCelModeloId"
              label="MODELO"
              placeholder="Seleccione modelo"
              options={modelsOptions}
              onChange={onChange}
              value={value}
              {...rest}
            />
          )}
        />
      </section>
      <section>
        <FormInputText
          name="sCelDescripcion"
          label="NOMBRE"
          placeholder="Ingrese el nombre"
          error={errors.sCelDescripcion}
          {...register("sCelDescripcion", {
            required: "Nombre es requerido",
          })}
        />
      </section>
      <section>
        <FormTextArea
          label={"DESCRIPCIÓN"}
          name="sCelDetalle"
          placeholder="Ingrese detalle"
          {...register("sCelDetalle")}
        />
      </section>
      <section className="grid grid-cols-2 gap-3">
        <FormInputText
          name="sCelCodSAP"
          label="CÓDIGO ERP"
          placeholder="Ingrese código ERP"
          error={errors.sCelCodSAP}
          {...register("sCelCodSAP", {
            maxLength: {
              value: 20,
              message: "Máximo de carácteres es 20",
            },
          })}
        />

        <FormInputText
          name="sCelTipo"
          label="TIPO"
          placeholder="Ingrese tipo"
          list="types-option"
          {...register("sCelTipo")}
        />
        <datalist id="types-option">
          {params?.types.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </datalist>
      </section>

      <section className="grid grid-cols-3 gap-3">
        <FormInputText
          name="sCelUnidad"
          label="UNIDAD"
          placeholder="Ingrese la unidad"
          {...register("sCelUnidad")}
        />
        <FormInputText
          name="nCelPrecio"
          label="PRECIO"
          placeholder="Ingrese el precio"
          error={errors.nCelPrecio}
          {...register("nCelPrecio", {
            pattern: {
              value: /^\d+(\.\d{1,2})?$/,
              message: "Ingrese un número válido (ej. 10 o 10.50)",
            },
          })}
        />
        <FormInputText
          name="nCelStock"
          label="STOCK"
          placeholder="Ingrese el stock"
          error={errors.nCelStock}
          {...register("nCelStock", {
            pattern: {
              value: /^\d+(\.\d{1,2})?$/,
              message: "Ingrese un número válido (ej. 10)",
            },
          })}
        />
      </section>

      <section className="flex items-center justify-center gap-3 pt-7">
        <Button type="submit">{isEditMode ? "ACTUALIZAR" : "GUARDAR"}</Button>
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
