import React from "react";
import { formatDistanceToNow, format } from "date-fns";
import { es } from "date-fns/locale";

export const RelativeDate = ({ 
  date, 
  className = "",
  showTime = true 
}) => {
  if (!date) return <span className={className}>-</span>;

  let dateObj;
  try {
    dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return <span className={className}>{date}</span>;
    }
  } catch {
    return <span className={className}>{date}</span>;
  }

  const relativeTime = formatDistanceToNow(dateObj, { 
    addSuffix: true, 
    locale: es 
  });
  
  const fullDateTime = format(
    dateObj, 
    showTime ? "dd/MM/yyyy 'a las' HH:mm:ss" : "dd/MM/yyyy", 
    { locale: es }
  );

  return (
    <div className="group relative inline-block">
      <span className={`cursor-help ${className}`}>
        {relativeTime}
      </span>
      
      {/* Tooltip */}
      <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg whitespace-nowrap pointer-events-none">
        {fullDateTime}
        {/* Arrow */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
          <div className="border-4 border-transparent border-t-gray-900" />
        </div>
      </div>
    </div>
  );
};
