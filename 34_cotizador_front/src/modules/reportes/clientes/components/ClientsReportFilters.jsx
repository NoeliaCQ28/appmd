import React from "react";
import { Controller, useForm } from "react-hook-form";
import { FormSelectText } from "../../../../components/custom/selects/FormSelectText";
import { Funnel } from "lucide-react";
import { ButtonIcon } from "../../../../components/custom/buttons/ButtonIcon";
import { useCustomerBranch } from "../../../catalagos/clientes/hooks/useCustomerBranch";
import { CustomerOrigin } from "../../../catalagos/clientes/components/forms/customerOrigin";

export const ClientsReportFilters = ({ initialFilters, onSubmit }) => {
  const { control, handleSubmit } = useForm({
    defaultValues: initialFilters,
  });

  const {
    customerBranches,
    isLoading: isLoadingCustomerBranches,
    error: isErrorCustomerBranches,
  } = useCustomerBranch();

  const branchOptions = React.useMemo(() => {
    return customerBranches?.map((branch) => ({
      value: branch.RamoDescripcion,
      label: branch.RamoDescripcion,
    }));
  }, [customerBranches]);

  const customerSources = Object.entries(CustomerOrigin).map(([key, _]) => ({
    value: key,
    label: key,
  }));

  return (
    <form
      className="flex flex-col md:flex-row md:items-center gap-3"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Controller
        name="source"
        control={control}
        render={({ field: { onChange, value, ...rest } }) => (
          <FormSelectText
            label={"Procedencia"}
            {...rest}
            options={[{ value: "Todos", label: "Todos" }, ...customerSources]}
            value={value}
            onChange={onChange}
          />
        )}
      />

      {isLoadingCustomerBranches && <div>Cargando ramas...</div>}
      {isErrorCustomerBranches && <p>Error al cargar ramas</p>}

      {!isLoadingCustomerBranches && !isErrorCustomerBranches && (
        <Controller
          name="industry"
          control={control}
          render={({ field: { onChange, value, ...rest } }) => (
            <FormSelectText
              label={"Rubro"}
              {...rest}
              options={[{ value: "Todos", label: "Todos" }, ...branchOptions]}
              value={value}
              onChange={onChange}
              filter
            />
          )}
        />
      )}

      <ButtonIcon
        type="submit"
        icon={<Funnel />}
        color="white"
        className="mt-0 md:mt-6"
      />
    </form>
  );
};
