import { InputSwitch } from "primereact/inputswitch";
import { forwardRef } from "react";

export const SwitchInput = forwardRef(
  ({ label, checked, onChangeInput, className, disabled = false, ...props }, ref) => {
    return (
      <div className="flex items-center gap-4">
        <InputSwitch
          ref={ref}
          {...props}
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChangeInput(e)}
        />
        <label className={`text-md font-medium ${className}`}>{label}</label>
      </div>
    );
  }
);

SwitchInput.displayName = "SwitchInput";
