import { FormInputText } from "@components/custom/inputs/FormInputText";
import { SwitchInput } from "@components/custom/inputs/SwitchInput";
import { FormSelectText } from "@components/custom/selects/FormSelectText";
import useLocation from "@hooks/useLocation";
import React from "react";
import { Controller } from "react-hook-form";
import useUsuarios from "../../../usuarios/hooks/useUsuarios";

export const VendedoresForm = ({ register, control, errors, selectedItem }) => {
  const {
    countries,
    states,
    cities,
    selectedCountry,
    selectedState,
    selectedCity,
    handleCountryChange,
    handleStateChange,
    handleCityChange,
  } = useLocation({
    initialValues: {
      country: selectedItem?.sEjePais || "Peru",
      state: selectedItem?.sEjeDepartamento,
      city: selectedItem?.sEjeProvincia,
    },
  });

  const { users = [], isLoadingUsers, errorUsers } = useUsuarios();

  const usersOptions = React.useMemo(() => {
    // Primero crear todas las opciones
    const options = users.map((user) => ({
      value: user.Usuario_Id,
      label: user.sUsuNombre,
    }));

    // Ordenar para que el usuario "N/A" esté primero
    return options.sort((a, b) => {
      if (a.label === "N/A") return -1;
      if (b.label === "N/A") return 1;
      return a.label.localeCompare(b.label);
    });
  }, [users]);

  return (
    <div className="flex flex-col py-4 space-y-3 [&_section]:flex [&_section]:items-center [&_section]:gap-3">
      <section>
        <Controller
          name="usuario_asignado_id"
          control={control}
          rules={{ required: "Debe seleccionar un Usuario" }}
          render={({ field: { onChange, value, ...rest } }) => (
            <FormSelectText
              name="usuario_asignado_id"
              label={"Usuario Asignado"}
              parentClassName="w-full md:w-1/3"
              options={usersOptions}
              placeholder="Seleccione un usuario"
              value={value}
              onChange={onChange}
              filter={true}
              {...rest}
            />
          )}
        />
        <FormInputText
          label={"Codigo del ejecutivo"}
          disabled={false}
          placeholder={"Ingrese el código"}
          {...register("codigo")}
          maxLength={10}
          error={errors.codigo}
          control={control}
          parentClassName="w-1/3"
          defaultValue={selectedItem?.sEjeCodigo}
        />
        <FormInputText
          label={"Codigo ERP"}
          disabled={false}
          placeholder={"Ingrese código ERP"}
          {...register("sap")}
          error={errors.codigo}
          control={control}
          parentClassName="w-1/3"
          defaultValue={selectedItem?.sEjeSAP}
        />
      </section>
      <section>
        <FormInputText
          label={"Nombre y Apellido"}
          placeholder={"Ingrese nombre del ejecutivo"}
          {...register("nombre", {
            required: "Nombre es obligatorio",
          })}
          error={errors.nombre}
          control={control}
          parentClassName="w-full"
          defaultValue={selectedItem?.sEjeNombre}
        />
      </section>
      <section>
        <FormInputText
          label={"Telefono"}
          placeholder={"Telefono del ejecutivo"}
          // {...register("telefono", {
          //   required: "Telefono es obligatorio",
          // })}
          {...register("telefono")}
          maxLength={15}
          error={errors.telefono}
          control={control}
          parentClassName="w-1/2"
          defaultValue={selectedItem?.nEjeTelefono}
        />
        <FormInputText
          label={"Correo"}
          type="email"
          placeholder={"Ingrese correo electronico"}
          // {...register("correo", {
          //   required: "Correo es obligatorio",
          // })}
          {...register("correo")}
          control={control}
          parentClassName="w-1/2"
          error={errors.correo}
          defaultValue={selectedItem?.sEjeCorreo}
        />
      </section>
      <section className="flex-col md:flex-row">
        <Controller
          name="pais"
          control={control}
          defaultValue={selectedItem?.sEjePais}
          render={({ field: { onChange, value, ...rest } }) => (
            <FormSelectText
              label={"País"}
              {...rest}
              parentClassName="w-full md:w-1/3"
              options={countries}
              value={selectedCountry}
              onChange={(e) => {
                handleCountryChange(e.target.value);
                onChange(e.target.value ? e.target.value : null);
              }}
              labelName={"país"}
              filter={true}
            />
          )}
        />

        <Controller
          name="departamento"
          control={control}
          defaultValue={selectedItem?.sEjeDepartamento}
          render={({ field: { onChange, value, ...rest } }) => (
            <FormSelectText
              label={"Deartamento"}
              {...rest}
              placeholder="Seleccione un departamento"
              parentClassName="w-full md:w-1/3"
              options={states}
              value={selectedState}
              onChange={(e) => {
                handleStateChange(e.target.value);
                onChange(e.target.value ? e.target.value : null);
              }}
              labelName={"departamento"}
              filter={true}
            />
          )}
        />
        <Controller
          name="provincia"
          control={control}
          defaultValue={selectedItem?.sEjeProvincia}
          render={({ field: { onChange, value, ...rest } }) => (
            <FormSelectText
              label={"Provincia"}
              {...rest}
              parentClassName="w-full md:w-1/3"
              placeholder="Seleccione una provincia"
              options={cities}
              value={selectedCity}
              onChange={(e) => {
                handleCityChange(e.target.value);
                onChange(e.target.value ? e.target.value : null);
              }}
              labelName={"provincia"}
              filter={true}
            />
          )}
        />
      </section>
      <section>
        <Controller
          name="estado"
          control={control}
          rules={{ required: "Debe seleccionar un estado" }}
          defaultValue={selectedItem?.nEjeEstado === 1 || true}
          render={({ field: { onChange, value, ...rest } }) => (
            <SwitchInput
              label="Ejecutivo Habilitado"
              checked={value === 1}
              onChangeInput={(e) => {
                onChange(e.target.value === true ? 1 : 0);
              }}
              {...rest}
            />
          )}
        />
      </section>
    </div>
  );
};
