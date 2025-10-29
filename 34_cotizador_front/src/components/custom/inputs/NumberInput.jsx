import React, { useState, useEffect } from "react";
import { Plus, Minus } from "lucide-react";

export const NumberInput = ({
  value,
  onChange,
  min = 0,
  max = Infinity,
  step = 1,
  placeholder = "0",
  className = "",
  showButtons = true,
  ...props
}) => {
  const [internalValue, setInternalValue] = useState(value ?? min);

  useEffect(() => {
    setInternalValue(value ?? min);
  }, [value, min]);

  const handleIncrement = () => {
    const newValue = Math.min((internalValue || 0) + step, max);
    setInternalValue(newValue);
    onChange?.(newValue);
  };

  const handleDecrement = () => {
    const newValue = Math.max((internalValue || 0) - step, min);
    setInternalValue(newValue);
    onChange?.(newValue);
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    
    // Allow empty input
    if (inputValue === "") {
      setInternalValue(null);
      onChange?.(null);
      return;
    }

    const numValue = parseFloat(inputValue);
    
    if (!isNaN(numValue)) {
      const clampedValue = Math.max(min, Math.min(numValue, max));
      setInternalValue(clampedValue);
      onChange?.(clampedValue);
    }
  };

  const handleBlur = () => {
    // Ensure value is within bounds on blur
    if (internalValue === null || internalValue === "") {
      setInternalValue(min);
      onChange?.(min);
    } else {
      const clampedValue = Math.max(min, Math.min(internalValue, max));
      setInternalValue(clampedValue);
      onChange?.(clampedValue);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-stretch bg-white border border-gray-300 rounded-lg overflow-hidden transition-all duration-200 hover:border-custom-orange focus-within:border-custom-orange focus-within:ring-2 focus-within:ring-custom-orange/20">
        {showButtons && (
          <button
            type="button"
            onClick={handleDecrement}
            disabled={internalValue <= min}
            className="px-2.5 bg-gray-50 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors border-r border-gray-200 flex items-center justify-center"
          >
            <Minus size={14} className="text-gray-600" />
          </button>
        )}

        <input
          type="number"
          value={internalValue ?? ""}
          onChange={handleInputChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          className="flex-1 min-w-0 px-3 py-2.5 text-sm text-center bg-transparent outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          style={{ width: "60px" }}
          {...props}
        />

        {showButtons && (
          <button
            type="button"
            onClick={handleIncrement}
            disabled={internalValue >= max}
            className="px-2.5 bg-gray-50 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors border-l border-gray-200 flex items-center justify-center"
          >
            <Plus size={14} className="text-gray-600" />
          </button>
        )}
      </div>
    </div>
  );
};
