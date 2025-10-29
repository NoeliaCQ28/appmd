import { InputTextarea } from "primereact/inputtextarea";
import { forwardRef } from "react";

export const FormTextArea = forwardRef(
  (
    {
      label,
      placeholder,
      value,
      error,
      onChange,
      className,
      disable,
      ...props
    },
    ref
  ) => {
    return (
      <div className="flex flex-col">
        <label className="uppercase font-medium text-sm">{label}</label>
        <InputTextarea
          className={`mt-2 rounded-lg ${className}`}
          rows={2}
          cols={20}
          placeholder={placeholder}
          ref={ref}
          {...props}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
      </div>
    );
  }
);

FormTextArea.displayName = "FormTextArea";
