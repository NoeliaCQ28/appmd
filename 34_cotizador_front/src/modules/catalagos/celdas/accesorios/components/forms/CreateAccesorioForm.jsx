import { InputTextarea } from "primereact/inputtextarea";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "../../../../../../components/custom/buttons/Button";
import { FormInputText } from "../../../../../../components/custom/inputs/FormInputText";
import { FormSelectText } from "../../../../../../components/custom/selects/FormSelectText";
import { useCells } from "../../../../../operaciones/cotizaciones/hooks/useCells";

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
  } = useCells();

  const onSubmit = (data) => {
    createAccesorioMutate(data);
    reset();
    setIsOpen(false);
  };

  const onEdit = (data) => {
    updateAccesorioMutate({
      id: selectedItem?.CeldaAccesorio_Id,
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

  const cellBrands = React.useMemo(
    () =>
      params?.brands.map((brand) => {
        return {
          label: brand?.sCelMarDescripcion,
          value: Number.parseInt(brand?.CeldaMarca_Id),
        };
      }),
    [params]
  );

  return (
    <form className="flex flex-col space-y-3">
      <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Controller
          name="CeldaMarca_Id"
          control={control}
          render={({ field: { onChange, value, ...rest } }) => (
            <FormSelectText
              name="CeldaMarca_Id"
              label="MARCA"
              placeholder="Seleccione el tipo"
              options={cellBrands ?? []}
              onChange={onChange}
              value={value}
              {...rest}
            />
          )}
        />

        <FormInputText
          name="sCelAccCodSAP"
          label="CÓDIGO ERP"
          placeholder="Ingrese el código ERP"
          {...register("sCelAccCodSAP")}
        />
      </section>
      <section className="flex flex-col gap-3">
        <FormInputText
          name="sCelAccDescripcion"
          label="DESCRIPCIÓN"
          error={errors.sCelAccDescripcion?.message}
          placeholder="Ingrese la descripción"
          {...register("sCelAccDescripcion", {
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
        <section className="flex flex-col gap-3">
          <label className="uppercase font-medium text-sm">DETALLE</label>
          <InputTextarea
            name="sCelAccDetalle"
            label="DETALLE"
            rows={8}
            className="rounded-lg"
            error={errors.sCelAccDetalle?.message}
            placeholder="Ingrese el detalle"
            {...register("sCelAccDetalle", {
              maxLength: {
                value: 100,
                message: "El detalle no puede exceder los 200 caracteres",
              },
            })}
          />
        </section>
      </section>
      <section className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <FormInputText
          name="sCelAccUnidad"
          label="UNIDAD"
          error={errors.sCelAccUnidad?.message}
          placeholder="Ingrese la unidad"
          {...register("sCelAccUnidad")}
        />
        <FormInputText
          name="nCelAccPrecio"
          label="PRECIO"
          type="number"
          step="0.01"
          min="0"
          error={errors.nCelAccPrecio?.message}
          defaultValue={0}
          placeholder="Ingrese el precio"
          {...register("nCelAccPrecio")}
        />

        <FormInputText
          name="nCelAccStock"
          label="STOCK"
          type="number"
          step="1"
          min="0"
          defaultValue={0}
          error={errors.nCelAccStock?.message}
          placeholder="Ingrese el stock"
          {...register("nCelAccStock")}
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
