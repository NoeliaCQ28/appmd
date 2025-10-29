import React from "react";
import { Button } from "./custom/buttons/Button";
import { FormInputText } from "./custom/inputs/FormInputText";

export const Discount = ({
  setDiscount,
  discount,
  isMargen = false,
  defaultValues = [30, 35, 40],
}) => {
  const handleDiscountChange = (e) => {
    const value = e.target.value;
    if (value >= 0 && value <= 100) {
      setDiscount(value);
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
      <h3 className="text-lg font-medium mb-4 text-gray-800">
        {isMargen ? "Margen" : "Descuento"}
      </h3>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-grow w-full md:w-auto">
          <label
            htmlFor="customDiscount"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {isMargen
              ? "Margen personalizado (%)"
              : "Descuento personalizado (%)"}
          </label>
          <div className="relative">
            <FormInputText onChange={handleDiscountChange} value={discount} />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              %
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-fit mt-7">
          {defaultValues?.map((discount) => (
            <Button
              key={discount}
              variant="tertiary"
              className="bg-white rounded-lg px-5 py-3 text-base shadow-sm hover:bg-[#e9e7f5] hover:scale-105 duration-300 ease-in-out transition-transform text-[#7e6fd3] border-[1px] border-[#9184dc] flex-grow md:flex-grow-0 lg:w-fit"
              style={{ color: "#7e6fd3" }}
              onClick={() => {
                setDiscount(discount);
              }}
            >
              <span className="font-medium">{discount}%</span>
            </Button>
          ))}
        </div>
      </div>

      <p className="text-sm text-gray-500 mt-3">
        Seleccione un {isMargen ? "margen" : "descuento"} predefinido o ingrese
        un valor personalizado para aplicar al presupuesto.
      </p>
    </div>
  );
};
