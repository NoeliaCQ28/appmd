import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "../../../../../../components/custom/buttons/Button";
import { FormInputText } from "../../../../../../components/custom/inputs/FormInputText";
import { FormSelectText } from "../../../../../../components/custom/selects/FormSelectText";
import { useTransformers } from "../../../../../operaciones/cotizaciones/hooks/useTransformers";

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
    formState: { errors },
  } = useForm();

  const {
    params = [],
    createAccesorioMutate,
    updateAccesorioMutate,
    isPendingCreateAccesorio,
    isPendingUpdateAccesorio,
  } = useTransformers();

  const onSubmit = (data) => {
    createAccesorioMutate(data);
    reset();
    setIsOpen(false);
  };

  const onEdit = (data) => {
    updateAccesorioMutate({
      id: selectedItem?.TransformadorAccedorio_Id,
      data: data,
    });
    reset();
    setIsOpen(false);
  };

  React.useEffect(() => {
    if (isEditMode && selectedItem) {
      reset(selectedItem);
    }
  }, [isEditMode, selectedItem, reset]);

  // Función para manejar el click y evitar la propagación del evento
  const handleButtonClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleSubmit(isEditMode ? onEdit : onSubmit)();
  };

  return (
    <form className="flex flex-col space-y-3">
      <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Controller
          name="sTraAccTipo"
          control={control}
          render={({ field: { onChange, value, ...rest } }) => (
            <FormSelectText
              name="sTraAccTipo"
              label="TIPO"
              placeholder="Seleccione el tipo"
              options={["SIN TIPO", ...(params?.types ?? [])]}
              onChange={onChange}
              value={value}
              {...rest}
            />
          )}
        />

        <FormInputText
          name="sTraAccCodSAP"
          label="CÓDIGO ERP"
          placeholder="Ingrese el código ERP"
          {...register("sTraAccCodSAP")}
        />
      </section>
      <section>
        <FormInputText
          name="sTraAccDescripcion"
          label="DETALLE/DESCRIPCIÓN"
          error={errors.sTraAccDescripcion?.message}
          placeholder="Ingrese el detalle/descripción"
          {...register("sTraAccDescripcion", {
            required: "La descripción es obligatoria",
            minLength: {
              value: 5,
              message: "La descripción debe tener al menos 5 caracteres",
            },
            maxLength: {
              value: 100,
              message: "La descripción no puede exceder los 100 caracteres",
            },
          })}
        />
      </section>
      <section className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <FormInputText
          name="sTraAccUnidad"
          label="UNIDAD"
          error={errors.sTraAccUnidad?.message}
          placeholder="Ingrese la unidad"
          {...register("sTraAccUnidad")}
        />
        <FormInputText
          name="nTraAccPrecio"
          label="PRECIO"
          type="number"
          step="0.01"
          min="0"
          error={errors.nTraAccPrecio?.message}
          defaultValue={0}
          placeholder="Ingrese el precio"
          {...register("nTraAccPrecio")}
        />

        <FormInputText
          name="nTraAccStock"
          label="STOCK"
          type="number"
          step="1"
          min="0"
          defaultValue={0}
          error={errors.nTraAccStock?.message}
          placeholder="Ingrese el stock"
          {...register("nTraAccStock")}
        />
      </section>

      <section className="flex items-center justify-center gap-3">
        <Button
          type="button"
          onClick={handleButtonClick}
          disabled={isPendingCreateAccesorio || isPendingUpdateAccesorio}
        >
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
