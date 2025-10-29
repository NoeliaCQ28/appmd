import { FormInputText } from "@components/custom/inputs/FormInputText";
import { FormSelectText } from "@components/custom/selects/FormSelectText";
import useLocation from "@hooks/useLocation";
import { InputNumber } from "primereact/inputnumber";
import React from "react";
import { Controller } from "react-hook-form";

export const ClientForm = ({ register, control, errors, selectedItem }) => {
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
      country: "Peru",
    },
  });

  return (
    <div className="flex flex-col py-4">
      <div className="space-y-7">
        <div className="grid grid-cols-1 md:grid-cols-3 space-x-4 space-y-4 md:space-y-0">
          <FormInputText
            label={"Código del cliente"}
            placeholder={"Código del cliente"}
          />
          <FormSelectText
            label={"Ejecutivo"}
            placeholder={"Seleccione ejecutivo"}
          />
          <FormSelectText
            label={"Procedencia"}
            placeholder={"Seleccione procedencia"}
            fi
            lter={true}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 md:space-x-7 space-y-4 md:space-y-0">
          <FormInputText
            label={"Id Cliente"}
            placeholder={"-"}
            disable={true}
          />
          <FormSelectText
            label={"Cliente"}
            placeholder={"Seleccione cliente"}
          />
          <FormSelectText
            label={"Tipo de cliente"}
            placeholder={"Seleccione tipo de cliente"}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 md:space-x-7 space-y-4 md:space-y-0">
          <div className="flex flex-col">
            <label className="uppercase font-medium text-sm">N° de identificación fiscal</label>
            <InputNumber
              className="mt-2"
              placeholder={"Ruc o Dni"}
              useGrouping={false}
            />
          </div>
          <FormInputText label={"Razón social"} placeholder={"Razón social"} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 md:space-x-7 space-y-4 md:space-y-0">
          <FormInputText label={"Proyecto"} placeholder={"Proyecto"} />
          <FormInputText label={"Dirección"} placeholder={"Dirección"} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 md:space-x-7 space-y-4 md:space-y-0">
          <FormInputText
            label={"Nombre del contacto"}
            placeholder={"Nombre del contacto"}
          />
          <div className="flex flex-col">
            <label className="uppercase font-medium text-sm">Teléfono</label>
            <InputNumber
              className="mt-2"
              placeholder={"Teléfono"}
              useGrouping={false}
            />
          </div>
          <FormInputText
            label={"Correo electrónico"}
            placeholder={"Correo electrónico"}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 md:space-x-7 space-y-4 md:space-y-0">
          <Controller
            name="pais"
            control={control}
            rules={{ required: "Debe seleccionar un País" }}
            defaultValue={selectedItem?.sEjePais}
            render={({ field: { onChange, value, ...rest } }) => (
              <FormSelectText
                label={"País"}
                {...rest}
                options={countries}
                {...register("pais", {
                  required: "El país es obligatorio",
                })}
                value={selectedCountry}
                onChange={(e) => {
                  handleCountryChange(e.target.value);
                  onChange(e.target.value ? e.target.value : null);
                }}
                labelName={"país"}
              />
            )}
          />

          <Controller
            name="departamento"
            control={control}
            rules={{ required: "Debe seleccionar un Departamento" }}
            defaultValue={selectedItem?.sEjeDepartamento}
            render={({ field: { onChange, value, ...rest } }) => (
              <FormSelectText
                label={"Deartamento"}
                {...rest}
                options={states}
                {...register("departamento", {
                  required: "El departamento es obligatorio",
                })}
                value={selectedState}
                onChange={(e) => {
                  handleStateChange(e.target.value);
                  onChange(e.target.value ? e.target.value : null);
                }}
                labelName={"departamento"}
              />
            )}
          />
          <Controller
            name="provincia"
            control={control}
            rules={{ required: "Debe seleccionar una Provincia" }}
            defaultValue={selectedItem?.sEjeProvincia}
            render={({ field: { onChange, value, ...rest } }) => (
              <FormSelectText
                label={"Provincia"}
                {...rest}
                options={cities}
                {...register("provincia", {
                  required: "La provincia es obligatoria",
                })}
                value={selectedCity}
                onChange={(e) => {
                  handleCityChange(e.target.value);
                  onChange(e.target.value ? e.target.value : null);
                }}
                labelName={"provincia"}
              />
            )}
          />
        </div>
      </div>
    </div>
  );
};
