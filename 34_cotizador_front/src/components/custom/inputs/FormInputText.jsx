import { cn } from "@utils/utils";
import { InputText } from "primereact/inputtext";
import { forwardRef } from "react";

export const FormInputText = forwardRef(
  (
    {
      label,
      placeholder,
      error,
      className,
      parentClassName,
      disabled,
      required,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn("flex flex-col", parentClassName)}>
        <label className="uppercase font-medium text-sm line-clamp-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <InputText
          // value={value}
          // onChange={onChange}
          // id={id}
          placeholder={placeholder}
          className={cn("mt-2 rounded-lg", className)}
          disabled={disabled}
          ref={ref}
          {...props}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
      </div>
    );
  }
);

FormInputText.displayName = "FormInputText";
