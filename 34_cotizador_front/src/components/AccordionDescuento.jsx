import { Accordion, AccordionTab } from "primereact/accordion";
import React from "react";
import { RadioText } from "./custom/inputs/RadioText";
import { SwitchInput } from "./custom/inputs/SwitchInput";
import { FormSelectText } from "./custom/selects/FormSelectText";

export const AccordionDescuento = ({
  headerText,
  radioOptions,
  inputLabel,
  switchLabel,
  discountSelected,
  handleSelected,
  switchChecked,
  handleSwitch,
  disabled = false,
}) => {
  const fifty = Math.floor(radioOptions.length * 0.5);
  const leftSide = radioOptions.slice(0, fifty);
  const rightSide = radioOptions.slice(fifty);

  const [option, setOption] = React.useState(null);

  React.useEffect(() => {
    const discountSelectedOnMemory = radioOptions.find(
      (ro) => ro.id === discountSelected
    );
    if (discountSelectedOnMemory) {
      setOption(discountSelectedOnMemory);
    }
  }, [discountSelected, radioOptions]);

  React.useEffect(() => {
    if (discountSelected > 5) {
      handleSwitch(true);
    } else {
      handleSwitch(false);
    }
  }, [discountSelected]);

  return (
    <Accordion className="bg-white rounded-md text-black custom-accordion">
      <AccordionTab
        header={
          <span className="uppercase font-semibold text-black">
            {headerText}
          </span>
        }
        disabled={disabled}
      >
        <div className="space-y-4 parent active">
          {leftSide.map((option) => (
            <RadioText
              key={option.id}
              value={option.value}
              checked={discountSelected === option.id}
              onChange={() => {
                handleSelected(option.id);
              }}
              label={option.descripcion}
            />
          ))}
        </div>
        <div className="flex flex-col gap-3 mt-3 justify-between">
          <FormSelectText
            label={"Cantidad"}
            value={
              discountSelected < 6
                ? "Seleccione otro descuento"
                : option?.descripcion
            }
            options={rightSide.map((option) => option.descripcion) || []}
            labelName={"Cantidad"}
            parentClassName={"w-full"}
            onChange={(e) => {
              setOption(e.value);

              handleSelected(
                radioOptions.find((item) => item.descripcion === e.value).id
              );
            }}
            placeholder={rightSide[0].value}
            filter={true}
          />

          <div className="flex items-center justify-start w-full">
            <SwitchInput
              label={switchLabel}
              checked={switchChecked}
              disabled={true}
              onChangeInput={(e) => handleSwitch(e.value)}
            />
          </div>
        </div>
      </AccordionTab>
    </Accordion>
  );
};
