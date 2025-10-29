import React from "react";
import { cn } from "../../../utils/utils";

export const RadioText = ({
  label,
  value,
  checked,
  onChange,
  ref,
  disabled = false,
  className = "",
}) => {
  return (
    <div className="flex gap-4">
      <input
        type="radio"
        value={value}
        ref={ref}
        disabled={disabled}
        checked={checked}
        onChange={onChange}
        className={cn("w-5 cursor-pointer custom-radio", className)}
      />
      <label className={disabled ? "text-gray-400" : "text-black"}>{label}</label>
    </div>
  );
};
