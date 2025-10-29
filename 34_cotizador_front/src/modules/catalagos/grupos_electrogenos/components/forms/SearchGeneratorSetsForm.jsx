import { Filter } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { FormSelectText } from "../../../../../components/custom/selects/FormSelectText";
import { FormSkeletonInput } from "../../../../../components/skeletons/FormSkeletonInput";
import useModelsSearch from "../../hooks/useModelsSearch";
import { Button } from "../../../../../components/custom/buttons/Button";

export const SearchGeneratorSetsForm = ({ onSearch }) => {
  const initialValues = {
    model: "Todos",
    voltage: "Todos",
    motor_brand: "Todos",
    frecuency: "Todos",
    motor_model: "Todos",
    phases: "Todos",
    alternator_brand: "Todos",
    power_factor: "Todos",
    alternator_model: "Todos",
    market: "NACIONAL",
  };

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const {
    modelsName,
    motorBrands,
    motorModels,
    alternatorBrands,
    alternatorModels,
    voltages,
    frequencies,
    phases,
    powerFactors,
    markets,
    isLoading,
  } = useModelsSearch();

  return (
    <form
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
      onSubmit={handleSubmit(onSearch)}
    >
      {isLoading.models ? (
        <FormSkeletonInput label="MODELO" />
      ) : (
        modelsName &&
        modelsName.length > 0 && (
          <Controller
            name="model"
            control={control}
            rules={{ required: "Debe seleccionar un Modelo" }}
            render={({ field: { onChange, value, ...rest } }) => (
              <FormSelectText
                label={"MODELO"}
                {...rest}
                placeholder="Seleccione un Modelo"
                parentClassName="w-full"
                options={[
                  "Todos",
                  ...modelsName.map((model) => model.sModNombre),
                ]}
                value={value}
                onChange={(e) => {
                  onChange(e.target.value ? e.target.value : null);
                }}
                labelName={"modelo_id"}
                filter={true}
              />
            )}
          />
        )
      )}

      {isLoading.voltages ? (
        <FormSkeletonInput label="VOLTAJE" />
      ) : (
        voltages &&
        voltages.length > 0 && (
          <Controller
            name="voltage"
            control={control}
            rules={{ required: "Debe seleccionar un Voltaje" }}
            render={({ field: { onChange, value, ...rest } }) => (
              <FormSelectText
                label={"VOLTAJE"}
                {...rest}
                placeholder="Seleccione un Voltaje"
                parentClassName="w-full"
                options={[
                  "Todos",
                  ...voltages.map((voltage) => voltage.nIntVoltaje),
                ]}
                value={value}
                onChange={(e) => {
                  onChange(e.target.value ? e.target.value : null);
                }}
                labelName={"voltage"}
                filter={true}
              />
            )}
          />
        )
      )}

      {isLoading.motorBrands ? (
        <FormSkeletonInput label="MARCA MOTOR" />
      ) : (
        motorBrands &&
        motorBrands.length > 0 && (
          <Controller
            name="motor_brand"
            control={control}
            rules={{ required: "Debe seleccionar una Marca" }}
            render={({ field: { onChange, value, ...rest } }) => (
              <FormSelectText
                label={"MARCA MOTOR"}
                {...rest}
                placeholder="Seleccione una Marca"
                parentClassName="w-full"
                options={[
                  "Todos",
                  ...motorBrands.map((brand) => brand.sMotMarca),
                ]}
                value={value}
                onChange={(e) => {
                  onChange(e.target.value ? e.target.value : null);
                }}
                labelName={"motor_brand"}
                filter={true}
              />
            )}
          />
        )
      )}

      {isLoading.frequencies ? (
        <FormSkeletonInput label="FRECUENCIA" />
      ) : (
        frequencies &&
        frequencies.length > 0 && (
          <Controller
            name="frecuency"
            control={control}
            rules={{ required: "Debe seleccionar una Frecuencia" }}
            render={({ field: { onChange, value, ...rest } }) => (
              <FormSelectText
                label={"FRECUENCIA"}
                {...rest}
                placeholder="Seleccione una Frecuencia"
                parentClassName="w-full"
                options={[
                  "Todos",
                  ...frequencies.map((frequency) => frequency.nIntFrecuencia),
                ]}
                value={value}
                onChange={(e) => {
                  onChange(e.target.value ? e.target.value : null);
                }}
                labelName={"frecuency"}
                filter={true}
              />
            )}
          />
        )
      )}

      {isLoading.motorModels ? (
        <FormSkeletonInput label="MODELO DE MOTOR" />
      ) : (
        motorModels &&
        motorModels.length > 0 && (
          <Controller
            name="motor_model"
            control={control}
            rules={{ required: "Debe seleccionar un Modelo de Motor" }}
            render={({ field: { onChange, value, ...rest } }) => (
              <FormSelectText
                label={"MODELO DE MOTOR"}
                {...rest}
                placeholder="Seleccione un Modelo de Motor"
                parentClassName="w-full"
                options={[
                  "Todos",
                  ...motorModels.map((model) => model.sMotModelo),
                ]}
                value={value}
                onChange={(e) => {
                  onChange(e.target.value ? e.target.value : null);
                }}
                labelName={"motor_model"}
                filter={true}
              />
            )}
          />
        )
      )}

      {isLoading.phases ? (
        <FormSkeletonInput label="FASES" />
      ) : (
        phases &&
        phases.length > 0 && (
          <Controller
            name="phases"
            control={control}
            rules={{ required: "Debe seleccionar el número de fases" }}
            render={({ field: { onChange, value, ...rest } }) => (
              <FormSelectText
                label={"FASES"}
                {...rest}
                placeholder="Seleccione un número de fases"
                parentClassName="w-full"
                options={["Todos", ...phases.map((phase) => phase.nIntFases)]}
                value={value}
                onChange={(e) => {
                  onChange(e.target.value ? e.target.value : null);
                }}
                labelName={"phases"}
                filter={true}
              />
            )}
          />
        )
      )}

      {isLoading.alternatorBrands ? (
        <FormSkeletonInput label="MARCA DEL ALTERNADOR" />
      ) : (
        alternatorBrands &&
        alternatorBrands.length > 0 && (
          <Controller
            name="alternator_brand"
            control={control}
            rules={{ required: "Debe seleccionar la marca del alternador" }}
            render={({ field: { onChange, value, ...rest } }) => (
              <FormSelectText
                label={"MARCA DEL ALTERNADOR"}
                {...rest}
                placeholder="Seleccione una Marca de Alternador"
                parentClassName="w-full"
                options={[
                  "Todos",
                  ...Array.from(
                    new Set(alternatorBrands.map((brand) => brand.sAltMarca))
                  ),
                ]}
                value={value}
                onChange={(e) => {
                  onChange(e.target.value ? e.target.value : null);
                }}
                filter={true}
              />
            )}
          />
        )
      )}

      {isLoading.powerFactors ? (
        <FormSkeletonInput label="FACTOR DE POTENCIA" />
      ) : (
        powerFactors &&
        powerFactors.length > 0 && (
          <Controller
            name="power_factor"
            control={control}
            rules={{ required: "Debe seleccionar un Factor de Potencia" }}
            render={({ field: { onChange, value, ...rest } }) => (
              <FormSelectText
                label={"FACTOR DE POTENCIA"}
                {...rest}
                placeholder="Seleccione un Factor de Potencia"
                parentClassName="w-full"
                options={[
                  "Todos",
                  ...powerFactors.map((factor) => factor.nIntFP),
                ]}
                value={value}
                onChange={(e) => {
                  onChange(e.target.value ? e.target.value : null);
                }}
                labelName={"power_factor"}
                filter={true}
              />
            )}
          />
        )
      )}

      {isLoading.alternatorModels ? (
        <FormSkeletonInput label="MODELO DE ALTERNADOR" />
      ) : (
        alternatorModels &&
        alternatorModels.length > 0 && (
          <Controller
            name="alternator_model"
            control={control}
            rules={{ required: "Debe seleccionar un Modelo de Alternador" }}
            render={({ field: { onChange, value, ...rest } }) => (
              <FormSelectText
                label={"MODELO DE ALTERNADOR"}
                {...rest}
                placeholder="Seleccione un Modelo de Alternador"
                parentClassName="w-full"
                options={[
                  "Todos",
                  ...alternatorModels.map((model) => model.sAltModelo),
                ]}
                value={value}
                onChange={(e) => {
                  onChange(e.target.value ? e.target.value : null);
                }}
                labelName={"alternator_model"}
                filter={true}
              />
            )}
          />
        )
      )}

      {isLoading.markets ? (
        <FormSkeletonInput label="MERCADO" />
      ) : (
        markets &&
        markets.length > 0 && (
          <Controller
            name="market"
            control={control}
            rules={{ required: "Debe seleccionar un Mercado" }}
            render={({ field: { onChange, value, ...rest } }) => (
              <FormSelectText
                label={"MERCADO"}
                {...rest}
                placeholder="Seleccione un Mercado"
                parentClassName="w-full"
                options={markets?.map((market) => market.sNombre)}
                value={value}
                onChange={(e) => {
                  onChange(e.target.value ? e.target.value : null);
                }}
                labelName={"market"}
                filter={true}
              />
            )}
          />
        )
      )}

      <section className="flex items-center justify-end mt-4 md:col-span-2 col-span-2">
        <button
          className="bg-[#ff9f00] text-white border-white hover:bg-[#e08b02] mr-2 flex items-center px-4 py-1 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-500 hover:scale-[0.99] shadow-lg hover:shadow-xl focus:ring-2"
          type="submit"
          disabled={isLoading.searching}
        >
          {!isLoading.searching && (
            <Filter size={16} className="inline-block mr-2" />
          )}
          {isLoading.searching ? "Buscando..." : "Filtrar"}
        </button>
      </section>
    </form>
  );
};
