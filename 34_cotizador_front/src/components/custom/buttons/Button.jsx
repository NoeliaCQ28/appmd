import { X } from "lucide-react";
import { Button as PrimeButton } from "primereact/button";
import { forwardRef } from "react";
import { Link } from "react-router-dom";

export const ButtonAdd = ({ children, url }) => {
  return (
    <Link
      className="bg-[#0056b8] h-10 w-full sm:h-10 sm:w-52 text-white font-semibold rounded-xl flex items-center justify-center hover:bg-[#004494] transition-colors duration-200"
      to={url}
    >
      {children}
    </Link>
  );
};

export const Button = forwardRef(({ children, ...props }, ref) => {
  const { variant } = props;
  const { type = "button" } = props;

  const getVariant = () => {
    switch (variant) {
      case "primary":
        return "w-full sm:w-auto px-8 py-2.5 text-sm lg:text-md font-medium bg-[#0056b8] hover:bg-[#004494] transform transition-all duration-200 hover:scale-[0.99] shadow-lg hover:shadow-xl focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 border-0";
      case "primary-alt":
        return "bg-[#deddff] text-black border-0 px-8 py-2.5 text-sm lg:text-md transform transition-all duration-200 hover:scale-[0.99]";
      case "secondary":
        return "bg-white border-1 border-[#0056b8] text-[#0056b8] px-8 py-2.5 text-sm lg:text-md transform transition-all duration-200 hover:scale-[0.99]";
      case "secondary-alt":
        return "bg-[#deddff] text-black border-1 border-[#0056b8] px-8 py-2.5 text-sm lg:text-md transform transition-all duration-200 hover:scale-[0.99]";
      case "tertiary":
        return "bg-[#289900] text-white border-0 px-8 py-2.5 text-sm lg:text-md transform transition-all duration-200 hover:scale-[0.99]";
      case "tertiary-alt":
        return "bg-[#e4ffda] text-black border-0 px-8 py-2.5 text-sm lg:text-md transform transition-all duration-200 hover:scale-[0.99]";
      case "destructive":
        return "bg-[#ff1f31] text-white border-0 px-8 py-2.5 text-sm lg:text-md transform transition-all duration-200 hover:scale-[0.99]";
      case "destructive-alt":
        return "bg-[#ffe3e3] text-black border-0 px-8 py-2.5 text-sm lg:text-md transform transition-all duration-200 hover:scale-[0.99]";
      case "primary-alt-2":
        return "bg-[#deddff] text-black border-0 px-8 py-2.5 text-sm lg:text-md transform transition-all duration-200 hover:scale-[0.99]";
      default:
        return "w-full sm:w-auto px-8 py-2.5 text-sm lg:text-md font-medium bg-[#0056b8] hover:bg-[#004494] transform transition-all duration-200 hover:scale-[0.99] shadow-lg hover:shadow-xl focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 border-0"; // primary
    }
  };

  const { className } = props;

  return (
    <PrimeButton
      {...props}
      type={type}
      ref={ref}
      className={`text-xs md:text-md uppercase p-2 px-4 rounded-lg cursor-pointer font-semibold outline-none focus:outline-none focus:ring-0 focus:shadow-none flex items-center justify-center w-full md:w-[178px] duration-200 ease-in-out transition-all line-clamp-1 text-nowrap ${getVariant()} ${className}`}
    >
      {variant === "destructive" && <X className="w-4 h-4 mr-2" />} {children}
    </PrimeButton>
  );
});

Button.displayName = "Button";
