import React, { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "../../../../../components/custom/buttons/Button";
import { FormInputText } from "../../../../../components/custom/inputs/FormInputText";
import { FormSelectText } from "../../../../../components/custom/selects/FormSelectText";
import { useCables } from "../../../../operaciones/cotizaciones/hooks/useCables";

export const CreateCableForm = ({ setIsOpen, isEditMode, selectedItem }) => {
  const {
    control,
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { create, params, update } = useCables({});

  const onSubmit = (data) => {
    const dataMapped = {
      ...data,
      nCabStock: data.nCabStock || 1,
    };

    create(dataMapped);
    reset();
    setIsOpen(false);
  };

  const onEdit = (data) => {
    update({ id: selectedItem?.CableId, data: data });
    reset();
    setIsOpen(false);
  };

  React.useEffect(() => {
    if (isEditMode && selectedItem) {
      reset({
        CableTipo_Id: selectedItem?.CableTipo_Id || "",
        CableMarca_Id: selectedItem?.CableMarca_Id || "",
        sCabCodSap: selectedItem?.CableCodigoSAP || "",
        sCabNombre: selectedItem?.CableNombre || "",
        sCabDescripcion: selectedItem?.CableDescripcion || "",
        sCabUnidad: selectedItem?.CableUnidad || "",
        nCabPrecio: selectedItem?.CablePrecio || "",
        nCabStock: selectedItem?.CableStock || "",
      });
    }
  }, [isEditMode, selectedItem, reset]);

  const marcasOptions = useMemo(() => {
    return (
      params?.brands?.map((brand) => ({
        label: brand.sCabMarDescripcion,
        value: brand.CableMarca_Id,
      })) || []
    );
  }, [params.brands]);

  const typesOptions = useMemo(() => {
    return (
      params?.types?.map((type) => ({
        label: type.sCabMarDescripcion,
        value: type.CableTipo_Id,
      })) || []
    );
  }, [params.types]);

  return (
    <form
      onSubmit={handleSubmit(isEditMode ? onEdit : onSubmit)}
      className="flex flex-col space-y-3 mt-3"
    >
      <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Controller
          name="CableMarca_Id"
          control={control}
          defaultValue=""
          rules={{
            required: "Marca es requerida",
          }}
          render={({ field: { onChange, value, ...rest } }) => (
            <FormSelectText
              name="CableMarca_Id"
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
          name="CableTipo_Id"
          control={control}
          defaultValue=""
          rules={{
            required: "Tipo es requerido",
          }}
          render={({ field: { onChange, value, ...rest } }) => (
            <FormSelectText
              name="CableTipo_Id"
              label="TIPO"
              placeholder="Seleccione tipo"
              options={typesOptions}
              onChange={onChange}
              value={value}
              {...rest}
            />
          )}
        />
      </section>
      <section>
        <FormInputText
          name="sCabCodSap"
          label="CÓDIGO ERP"
          error={errors.sCabCodSap}
          placeholder="Ingrese el código ERP"
          {...register("sCabCodSap", {
            maxLength: {
              value: 10,
              message: "El número máximo de caracteres es 10",
            },
          })}
        />
      </section>

      <section>
        <FormInputText
          name="sCabNombre"
          label="NOMBRE"
          placeholder="Ingrese el nombre"
          error={errors.sCabNombre}
          {...register("sCabNombre", {
            required: "Nombre es requerido",
          })}
        />
      </section>

      <section>
        <FormInputText
          name="sCabDescripcion"
          label="DESCRIPCIÓN"
          placeholder="Ingrese la descripción"
          error={errors.sCabDescripcion}
          {...register("sCabDescripcion", {
            required: "Descripción es requerida",
          })}
        />
      </section>

      <section className="grid grid-cols-3 gap-3">
        <FormInputText
          name="sCabUnidad"
          label="UNIDAD"
          placeholder="Ingrese la unidad"
          {...register("sCabUnidad")}
        />
        <FormInputText
          name="nCabPrecio"
          label="PRECIO"
          type="number"
          step={0.01}
          placeholder="Ingrese el precio"
          error={errors.nCabPrecio}
          {...register("nCabPrecio", {
            required: "Precio es requerido",
            pattern: {
              value: /^\d+(\.\d{1,2})?$/,
              message: "Ingrese un número válido (ej. 10 o 10.50)",
            },
          })}
        />
        <FormInputText
          name="nCabStock"
          label="STOCK"
          type="number"
          placeholder="Ingrese el stock"
          defaultValue={1}
          min={1}
          step={1}
          error={errors.nCabStock}
          {...register("nCabStock", {
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
