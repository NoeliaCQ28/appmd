import React from "react";
import { Subtitle } from "../Subtitle";
import { FormInputText } from "@components/custom/inputs/FormInputText";

export const MotorForm = () => {
  return (
    <div className="py-6 space-y-7">
      <Subtitle> Motor </Subtitle>

      <div className="grid grid-cols-1 md:grid-cols-3 md:space-x-7 space-y-4 md:space-y-0">
        <FormInputText
          label={"Número de cilindros"}
          placeholder={"Número de cilindros"}
        />
        <FormInputText 
           label={"Sistema de Gobernación"} 
           placeholder={"Sistema de Gobernación"}
        />
        <FormInputText
          label={"Ciclo"}
          placeholder={"Ciclo"}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 md:space-x-7 space-y-4 md:space-y-0">
        <FormInputText
          label={"Aspiración"}
          placeholder={"Aspiración"}
        />
        <FormInputText 
           label={"Combustible"} 
           placeholder={"Combustible"}
        />
        <FormInputText
          label={"Sist. Combustión"}
          placeholder={"Sist. Combustión"}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 md:space-x-7 space-y-4 md:space-y-0">
        <FormInputText
          label={"Sist. Enfriamiento"}
          placeholder={"Sist. Enfriamiento"}
        />
        <FormInputText 
           label={"Diametro de pistón"} 
           placeholder={"Diametro de pistón"}
        />
        <FormInputText
          label={"Desplazamiento de pistón"}
          placeholder={"Desplazamiento de pistón"}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 md:space-x-7 space-y-4 md:space-y-0">
        <FormInputText
          label={"Capacidad"}
          placeholder={"Capacidad"}
        />
        <FormInputText 
           label={"Relación Compresión"} 
           placeholder={"Relación Compresión"}
        />
        <FormInputText
          label={"Cap. Sist. Lubricación"}
          placeholder={"Cap. Sist. Lubricación"}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 md:space-x-7 space-y-4 md:space-y-0">
        <FormInputText
          label={"Cap. Sist. Refrigeración"}
          placeholder={"Cap. Sist. Refrigeración"}
        />
        <FormInputText 
           label={"Velocidad del motor"} 
           placeholder={"Velocidad del motor"}
        />
        <FormInputText
          label={"Combustible potencia stand by"}
          placeholder={"Combustible potencia stand by"}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 md:space-x-7 space-y-4 md:space-y-0">
        <FormInputText
          label={"Combustible potencia prime"}
          placeholder={"Combustible potencia prime"}
        />
        <FormInputText 
           label={"75% Potencia Prime"} 
           placeholder={"75% Potencia Prime"}
        />
        <FormInputText
          label={"50% Potencia Prime"}
          placeholder={"50% Potencia Prime"}
        />
      </div>

    </div>
  )
}
