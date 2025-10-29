import { cn } from "@utils/utils";
import { Dropdown } from "primereact/dropdown";
import { forwardRef } from "react";

export const FormSelectText = forwardRef(
  (
    {
      label,
      placeholder,
      value,
      onChange,
      className,
      parentClassName,
      filter,
      options,
      icon,
      labelName,
      disabled,
      required = false,
      editable = false,
      error = null
    },
    ref
  ) => {
    return (
      <div className={cn("flex flex-col", parentClassName)}>
        <label className="uppercase font-medium text-sm">{label} {required && <span className="text-red-500">*</span>}</label>
        <Dropdown
          ref={ref}
          value={value}
          onChange={onChange}
          options={options}
          optionLabel={labelName}
          placeholder={placeholder}
          disabled={disabled}
          className={cn("mt-2 rounded-lg", className)}
          filter={filter}
          emptyMessage={"No se encontraron resultados"}
          emptyFilterMessage={"No se encontraron resultados"}
          editable={editable}
          // itemTemplate={(option) => (
          //      <span>
          //           {option[labelName]} {icon}
          //      </span>
          // )}
          // valueTemplate={(option) =>
          //      option ? (
          //        <span>
          //          {option[labelName]} {icon} {/* Valor seleccionado */}
          //        </span>
          //      ) : (
          //        <span>{placeholder}</span> /* Placeholder si no hay valor */
          //      )
          //    }
        />
        {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
      </div>
    );
  }
);

FormSelectText.displayName = "FormSelectText";
