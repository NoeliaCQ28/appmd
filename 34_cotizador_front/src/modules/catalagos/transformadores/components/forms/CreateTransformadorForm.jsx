import React, { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "../../../../../components/custom/buttons/Button";
import { FormInputText } from "../../../../../components/custom/inputs/FormInputText";
import { FormSelectText } from "../../../../../components/custom/selects/FormSelectText";
import { FormTextArea } from "../../../../../components/custom/inputs/FormTextArea";
import { useTransformers } from "../../../../operaciones/cotizaciones/hooks/useTransformers";

export const CreateTransformadorForm = ({
  setIsOpen,
  isEditMode,
  selectedItem,
}) => {
  const {
    control,
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { create, params, update } = useTransformers({});

  const onSubmit = (data) => {
    create(data);
    reset();
    setIsOpen(false);
  };

  const onEdit = (data) => {
    update({ id: selectedItem?.TransformadorId, data: data });
    reset();
    setIsOpen(false);
  };

  React.useEffect(() => {
    if (isEditMode && selectedItem) {
      reset({
        TransformadorMarca_Id: selectedItem?.TransformadorMarcaId || "",
        sTraDescripcion: selectedItem?.TransformadorDescripcion || "",
        sTraNombre: selectedItem?.TransformadorNombre || "",
        sTraCodigoSAP: selectedItem?.TransformadorCodigoSAP || "",
        sTraTipo: selectedItem?.TransformadorTipo || "",
        sTraUnidad: selectedItem?.TransformadorUnidad || "",
        nTraPrecio: selectedItem?.TransformadorPrecio || "",
        nTraStock: selectedItem?.TransformadorStock || "",
      });
    }
  }, [isEditMode, selectedItem, reset]);

  const marcasOptions = useMemo(() => {
    return (
      params?.brands?.map((brand) => ({
        label: brand.sTraMarDescripcion,
        value: brand.TransformadorMarca_Id,
      })) || []
    );
  }, [params.brands]);

  return (
    <form
      onSubmit={handleSubmit(isEditMode ? onEdit : onSubmit)}
      className="flex flex-col space-y-3 mt-3"
    >
      <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Controller
          name="TransformadorMarca_Id"
          control={control}
          defaultValue=""
          rules={{
            required: "Marca es requerida",
          }}
          render={({ field: { onChange, value, ...rest } }) => (
            <FormSelectText
              name="TransformadorMarca_Id"
              label="MARCA*"
              placeholder="Seleccione marca"
              options={marcasOptions}
              onChange={onChange}
              value={value}
              {...rest}
            />
          )}
        />

        <FormInputText
          name="sTraTipo"
          label="TIPO*"
          placeholder="Ingrese tipo"
          list="types-option"
          {...register("sTraTipo", {
            required: "Tipo es requerido",
          })}
          maxLength={10}
        />
        <datalist id="types-option">
          {params?.types.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </datalist>
      </section>
      <section>
        <FormTextArea
          label={"NOMBRE"}
          name="sTraNombre"
          placeholder="Ingrese el nombre"
          error={errors.sTraNombre}
          {...register("sTraNombre", {
            required: "Nombre es requerido",
          })}
          maxLength={100}
        />
      </section>
      <section>
        <FormTextArea
          label={"DESCRIPCIÓN"}
          name="sTraDescripcion"
          placeholder="Ingrese la descripción"
          error={errors.sTraDescripcion}
          {...register("sTraDescripcion", {
            required: "Descripción es requerida",
          })}
        />
      </section>
      <section className="grid grid-cols-2 gap-3">
        <FormInputText
          name="sTraCodigoSAP"
          label="CÓDIGO ERP"
          placeholder="Ingrese código ERP"
          error={errors.sTraCodigoSAP}
          {...register("sTraCodigoSAP", {
            maxLength: {
              value: 20,
              message: "Máximo de carácteres es 20",
            },
          })}
        />

        <FormInputText
          name="sTraUnidad"
          label="UNIDAD"
          placeholder="Ingrese unidad"
          {...register("sTraUnidad")}
        />
      </section>

      <section className="grid grid-cols-2 gap-3">
        <FormInputText
          name="nTraPrecio"
          label="PRECIO"
          placeholder="Ingrese precio"
          error={errors.nTraPrecio}
          {...register("nTraPrecio", {
            required: "Precio es requerido",
            pattern: {
              value: /^\d+(\.\d{1,2})?$/,
              message: "Ingrese un número válido (ej. 10 o 10.50)",
            },
          })}
        />
        <FormInputText
          name="nTraStock"
          label="STOCK"
          placeholder="Ingrese stock"
          error={errors.nTraStock}
          {...register("nTraStock", {
            required: "Stock es requerido",
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
