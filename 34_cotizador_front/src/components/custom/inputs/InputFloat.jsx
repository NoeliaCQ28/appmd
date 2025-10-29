import { forwardRef, useEffect, useRef, useState } from "react";

export const InputFloat = forwardRef(
  ({ label, type = "text", id, error, className, ...props }, externalRef) => {
    const internalRef = useRef();
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);

    // Verificar si el input tiene valor al montar (defaultValue inyectado por RHF)
    useEffect(() => {
      if (internalRef.current?.value) {
        setHasValue(true);
      }
    }, []);

    return (
      <div className="w-full max-w-md">
        <div className="relative">
          <input
            ref={(node) => {
              internalRef.current = node;
              // Asignar también el ref externo (para React Hook Form)
              if (typeof externalRef === "function") {
                externalRef(node);
              } else if (externalRef) {
                externalRef.current = node;
              }
            }}
            type={type}
            id={id}
            onFocus={() => setIsFocused(true)}
            onBlur={(e) => {
              setIsFocused(false);
              setHasValue(e.target.value !== "");
              props.onBlur && props.onBlur(e);
            }}
            onChange={(e) => {
              setHasValue(e.target.value !== "");
              props.onChange && props.onChange(e);
            }}
            onAnimationStart={(e) => {
              // Detectar cuando el navegador autocompleta el input
              if (e.animationName === "onAutoFillStart") {
                setHasValue(true);
              } else if (e.animationName === "onAutoFillCancel") {
                setHasValue(false);
              }
            }}
            placeholder=" " // Importante para que se active el pseudo-selector
            className={`
              w-full rounded-lg border-2 border-blue-100 bg-white px-3 py-3 
              text-gray-900 outline-none transition-all focus:border-blue-600
              ${error ? "border-red-500" : ""}
              ${className}
            `}
            {...props}
          />
          <label
            htmlFor={id}
            className={`
              absolute left-3 transition-all duration-200 cursor-pointer
              ${
                isFocused || hasValue
                  ? "-top-2.5 bg-white px-2 text-sm text-blue-600"
                  : "top-4 text-gray-500"
              }
            `}
          >
            {label}
          </label>
        </div>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    );
  }
);

InputFloat.displayName = "InputFloat";
