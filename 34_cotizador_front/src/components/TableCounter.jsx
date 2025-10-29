import { Hash } from "lucide-react";
import { useTranslation } from "react-i18next";

export const TableCounter = ({
  title,
  data,
  variant = "default",
  size = "sm",
  showIcon = true,
  className,
}) => {
  const variants = {
    default: "bg-slate-50 text-slate-700 border-slate-200 border-dashed",
    primary: "bg-blue-50 text-blue-700 border-blue-200",
    modasa: "bg-orange-50 text-orange-700 border-orange-200",
    secondary: "bg-gray-50 text-gray-700 border-gray-200",
    success: "bg-green-50 text-green-700 border-green-200",
    warning: "bg-yellow-50 text-yellow-700 border-yellow-200",
    destructive: "bg-red-50 text-red-700 border-red-200",
  };

  const sizes = {
    xs: "px-2 py-1 text-xs",
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-2.5 text-lg",
  };

  const count = Array.isArray(data) ? data.length : data || 0;

  const { t } = useTranslation();

  return (
    <div
      className={`
      inline-flex items-center gap-2 rounded-lg border font-medium text-xs
      transition-all duration-200 hover:shadow-sm
      ${variants[variant]} 
      ${sizes[size]} ${className}
    `}
    >
      {showIcon && <Hash className="h-4 w-4 opacity-60" />}
      <span className="opacity-80 text-[9px] sm:text-xs font-medium">
        {t("common.total_of")} {title}:
      </span>
      <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-md min-w-[2rem] text-center">
        {count.toLocaleString()}
      </span>
    </div>
  );
};
