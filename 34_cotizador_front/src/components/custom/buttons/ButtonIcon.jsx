import React, { forwardRef } from "react";

export const ButtonIcon = forwardRef(
  ({ children, icon, size, color, ...props }, ref) => {
    const { variant } = props;
    const { type = "button" } = props;

    const getVariant = () => {
      switch (variant) {
        case "primary":
          return "w-11 h-11 rounded-lg flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transform transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl focus:ring-2 focus:ring-blue-300 focus:ring-offset-2";
        case "primary-alt":
          return "bg-[#deddff] text-black border-0";
        case "secondary":
          return "bg-white border-1 border-[#0055be] text-[#0055be]";
        case "secondary-alt":
          return "bg-[#deddff] text-black border-1 border-[#0055be]";
        case "tertiary":
          return "bg-[#289900] text-white border-0";
        case "tertiary-alt":
          return "bg-[#e4ffda] text-black border-0";
        case "destructive":
          return "bg-[#ff1f31] text-white border-0";
        case "destructive-alt":
          return "bg-[#ffe3e3] text-black border-0";
        case "primary-alt-2":
          return "bg-[#deddff] text-black border-0";
        default:
          return "w-11 h-11 rounded-lg flex items-center justify-center bg-[#0056b8] hover:bg-[#004494] transform transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"; // primary
      }
    };

    const { className } = props;

    return (
      <button
        {...props}
        type={type}
        ref={ref}
        className={`uppercase cursor-pointer font-semibold outline-none focus:outline-none focus:ring-0 focus:shadow-none flex items-center justify-center w-11 h-11 rounded-lg hover:scale-95 duration-500 ease-in-out transition-transform ${getVariant()} ${className}`}
      >
        {icon && React.cloneElement(icon, { color: color, size: size })}
      </button>
    );
  }
);

ButtonIcon.displayName = "ButtonIcon";
