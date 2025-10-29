import React, { useState, useRef, useEffect } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format, parse, isValid } from "date-fns";
import { es } from "date-fns/locale";

export const DateInput = ({
  value,
  onChange,
  placeholder = "Seleccionar fecha",
  minDate,
  maxDate,
  className = "",
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value || null);
  const [currentMonth, setCurrentMonth] = useState(value || new Date());
  const containerRef = useRef(null);

  useEffect(() => {
    setSelectedDate(value);
    if (value) setCurrentMonth(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const daysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysArray = [];

    // Add empty cells for days before month starts
    const startDayOfWeek = firstDay.getDay();
    for (let i = 0; i < startDayOfWeek; i++) {
      daysArray.push(null);
    }

    // Add all days in month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      daysArray.push(new Date(year, month, day));
    }

    return daysArray;
  };

  const handleDateSelect = (date) => {
    if (!date) return;
    
    const isDisabled = 
      (minDate && date < minDate) || 
      (maxDate && date > maxDate);
    
    if (isDisabled) return;

    setSelectedDate(date);
    onChange?.(date);
    setIsOpen(false);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const isDateDisabled = (date) => {
    if (!date) return false;
    return (minDate && date < minDate) || (maxDate && date > maxDate);
  };

  const isDateSelected = (date) => {
    if (!date || !selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const weekDays = ["D", "L", "M", "X", "J", "V", "S"];

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-3 py-2.5 
          bg-white border border-gray-300 rounded-lg
          cursor-pointer transition-all duration-200
          hover:border-custom-orange focus-within:border-custom-orange 
          focus-within:ring-2 focus-within:ring-custom-orange/20
          ${isOpen ? "border-custom-orange ring-2 ring-custom-orange/20" : ""}
        `}
      >
        <CalendarIcon size={16} className="text-gray-400" />
        <span className={`text-sm flex-1 ${selectedDate ? "text-gray-900" : "text-gray-400"}`}>
          {selectedDate ? format(selectedDate, "dd/MM/yyyy", { locale: es }) : placeholder}
        </span>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden"
            style={{ minWidth: "280px" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <span className="text-sm font-semibold text-gray-900">
                {format(currentMonth, "MMMM yyyy", { locale: es })}
              </span>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="p-3">
              {/* Week days header */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {weekDays.map((day) => (
                  <div
                    key={day}
                    className="text-xs font-semibold text-gray-500 text-center py-1"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Days grid */}
              <div className="grid grid-cols-7 gap-1">
                {daysInMonth(currentMonth).map((date, index) => {
                  const disabled = isDateDisabled(date);
                  const selected = isDateSelected(date);
                  const today = isToday(date);

                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleDateSelect(date)}
                      disabled={!date || disabled}
                      className={`
                        aspect-square p-1 text-sm rounded-lg
                        transition-all duration-150
                        ${!date ? "invisible" : ""}
                        ${disabled ? "text-gray-300 cursor-not-allowed" : ""}
                        ${selected
                          ? "bg-custom-orange text-white font-semibold shadow-md"
                          : !disabled
                          ? "hover:bg-gray-100 text-gray-700"
                          : ""
                        }
                        ${today && !selected ? "ring-2 ring-custom-orange/30" : ""}
                      `}
                    >
                      {date ? date.getDate() : ""}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-2 bg-gray-50">
              <button
                type="button"
                onClick={() => handleDateSelect(new Date())}
                className="w-full py-1.5 text-xs font-medium text-custom-orange hover:bg-custom-orange/10 rounded-lg transition-colors"
              >
                Hoy
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
