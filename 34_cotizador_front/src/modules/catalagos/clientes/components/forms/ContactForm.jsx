import { FormInputText } from "@components/custom/inputs/FormInputText";
import { Check, Save } from "lucide-react";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "../../../../../components/custom/buttons/Button";
import { FormSelectText } from "../../../../../components/custom/selects/FormSelectText";
import useCustomersContacts from "../../hooks/useCustomerContacts";

export const ContactForm = ({
  isEditMode = false,
  selectedItem,
  customerId,
  setIsOpen,
}) => {
  const initialValues = {
    nombre: selectedItem?.sCliConNombre,
    nombrePila: selectedItem?.sCliConNombrePila,
    cargo: selectedItem?.sCliConCargo,
    departamento: selectedItem?.sCliConDepartamento,
    email: selectedItem?.sCliConCorreo,
    telefono: selectedItem?.sCliConTelefono,
    estado: selectedItem?.nCliEstado,
    eliminado: selectedItem?.nCliEliminado,
  };

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const { createMutate, editMutate, denominationsData, departmentsData } =
    useCustomersContacts(customerId);

  const onSave = (formData) => {
    createMutate({ customer_id: customerId, data: formData });

    reset();
    setIsOpen(false);
  };

  const onEdit = (formData) => {
    editMutate({
      customer_id: customerId,
      contact_id: selectedItem?.Contacto_Id,
      data: formData,
    });
    setIsOpen(false);
  };

  const denominationsOptions = React.useMemo(() => {
    return (
      denominationsData?.map((denomination) => ({
        value: denomination.ContactoDenominacionId,
        label: denomination.ContactoDenominacionDescripcion,
      })) || []
    );
  }, [denominationsData]);

  const departmentsOptions = React.useMemo(() => {
    return (
      departmentsData?.map((department) => ({
        value: department.ConDepartamentoId,
        label: department.ConDepartamentoNombre,
      })) || []
    );
  }, [departmentsData]);

  return (
    <form
      className="flex flex-col py-4 space-y-3 [&_section]:flex [&_section]:items-center [&_section]:gap-3"
      id="contact-form"
    >
      <section>
        <FormInputText
          label={"Nombre del Contacto"}
          required
          disabled={false}
          placeholder={"Ingrese un nombre"}
          {...register("nombre", {
            required: "El Nombre es obligatorio",
          })}
          maxLength={35}
          error={errors.nombre}
          control={control}
          parentClassName="w-full"
        />
        <FormInputText
          label={"Nombre de Pila del Contacto"}
          required
          disabled={false}
          placeholder={"Ingrese un nombre"}
          {...register("nombrePila", {
            required: "El Nombre de pila es obligatorio",
          })}
          maxLength={35}
          error={errors.nombrePila}
          control={control}
          parentClassName="w-full"
        />
      </section>
      <section>
        {/* <FormInputText
          label={"Cargo"}
          placeholder={"Ingrese el cargo"}
          {...register("cargo")}
          error={errors.cargo}
          maxLength={50}
          control={control}
          parentClassName="w-full"
        /> */}
        <Controller
          name="cargo"
          control={control}
          rules={{
            required: "Debe seleccionar un Cargo",
          }}
          render={({ field: { onChange, value, ...rest } }) => (
            <FormSelectText
              label={"Cargo"}
              {...rest}
              placeholder={"Seleccione un cargo"}
              parentClassName="w-full"
              options={denominationsOptions}
              value={value}
              onChange={onChange}
              filter={true}
              required
            />
          )}
        />
        <Controller
          name="departamento"
          control={control}
          rules={{
            required: "Debe seleccionar un Departamento",
          }}
          render={({ field: { onChange, value, ...rest } }) => (
            <FormSelectText
              label={"Departamento"}
              {...rest}
              placeholder={"Seleccione un departamento"}
              parentClassName="w-full"
              options={departmentsOptions}
              value={value}
              onChange={onChange}
              filter={true}
              required
            />
          )}
        />
      </section>
      <section>
        <FormInputText
          label={"Telefono"}
          disabled={false}
          placeholder={"Ingrese un numero de telefono"}
          {...register("telefono", {
            required: "El Telefono es obligatorio",
            maxLength: {
              value: 15,
              message: "El Telefono no debe exceder los 15 digitos",
            },
            setValueAs: (value) => Number(value) || value,
          })}
          required
          maxLength={15}
          error={errors.telefono}
          control={control}
          parentClassName="w-full"
        />
      </section>
      <section>
        <FormInputText
          label={"Correo Electronico"}
          required
          disabled={false}
          placeholder={"Ingrese un correo electronico"}
          {...register("email", {
            required: "El Correo es obligatorio",
            pattern: {
              value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
              message: "El Correo no es valido",
            },
          })}
          type="email"
          error={errors.email}
          control={control}
          parentClassName="w-full"
        />
      </section>{" "}
      <section className="flex flex-col justify-center space-y-2 md:space-y-0 md:space-x-10 md:pt-7 md:flex-row">
        <Button
          type="button"
          onClick={handleSubmit(isEditMode ? onEdit : onSave)}
        >
          {isEditMode ? (
            <Check className="w-4 h-4 mr-2" />
          ) : (
            <Save className="w-5 h-5 mr-2" />
          )}
          {isEditMode ? "Actualizar" : "Registrar"}
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={() => {
            setIsOpen(false);
          }}
        >
          Cancelar
        </Button>
      </section>
    </form>
  );
};
