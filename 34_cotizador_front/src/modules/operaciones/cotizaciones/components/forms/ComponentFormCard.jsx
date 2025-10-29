import { RadioText } from "@components/custom/inputs/RadioText";
import { useModal } from "@hooks/useModal";
import { useQueryClient } from "@tanstack/react-query";
import { BatteryCharging, Check, Package, Plus, Truck, Wrench, Zap } from "lucide-react";
import { Card } from "primereact/card";
import { InputNumber } from "primereact/inputnumber";
import React from "react";
import { PiEngine } from "react-icons/pi";
import { TbNavigationBolt } from "react-icons/tb";
import { Button } from "../../../../../components/custom/buttons/Button";
import { cn } from "../../../../../utils/utils";
import { useElectrogenoModelForm } from "../../hooks/useElectrogenoModelForm";
import { useElectrogenosStore } from "../../hooks/useElectrogenosStore";
import { useOtherComponents } from "../../hooks/useOtherComponents";
import useQuote from "../../hooks/useQuote";
import useSingleQuote from "../../hooks/useSingleQuote";
import { useExchange } from "./../../hooks/useExchange.js";
import site from "../../../../../config/site.js";
// import { OtrosModal } from "./modals/OtrosModal";

const ComponentFormFooter = ({
  totalPrice,
  onSaveAction,
  onEditAction,
  isAdded,
  isDirty,
  discountValue,
  isEditMode,
}) => {
  const { currency, evalTypeChange } = useExchange();

  const originalPrice = totalPrice / (1 - discountValue / 100);

  if (typeof totalPrice !== "number" || isNaN(totalPrice)) {
    return (
      <section className="flex flex-col space-y-3">
        <section className="flex justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex flex-col space-y-2 w-full">
            <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-6 w-32 bg-gray-200 animate-pulse rounded"></div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-6 w-32 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </section>
        <section className="flex">
          <div className="w-full h-10 bg-gray-200 animate-pulse rounded"></div>
        </section>
      </section>
    );
  }

  return (
    <section className="flex flex-col space-y-3">
      <section
        className={`flex ${
          discountValue > 0 ? "justify-between" : "justify-end"
        } p-3 rounded-lg`}
      >
        {discountValue > 0 && (
          <div className="flex flex-col">
            <span className="text-sm text-gray-600 font-semibold">
              PRECIO ORIGINAL
            </span>
            <span className="text-2xl text-black font-bold line-through">
              {currency.symbol}
              {evalTypeChange(originalPrice)}
            </span>
          </div>
        )}
        <div className="flex flex-col items-end">
          <span className="text-sm text-gray-600 font-semibold">
            {discountValue > 0
              ? `PRECIO FINAL (${discountValue}% dcto.)`
              : "PRECIO FINAL"}
          </span>
          <span className="text-2xl font-bold text-black">
            {currency.symbol}
            {evalTypeChange(totalPrice)}
          </span>
        </div>
      </section>
      <section className="flex flex-col space-y-2">
        <Button
          variant={isAdded || isEditMode ? "tertiary" : "primary"}
          onClick={isEditMode ? onEditAction : onSaveAction}
          disabled={(isEditMode && !isDirty) || originalPrice === 0.0}
          className="w-full flex justify-center items-center md:w-full"
        >
          {isAdded && !isEditMode ? (
            <span className="flex items-center gap-2">
              Agregado <Check />
            </span>
          ) : (
            <span>{isEditMode ? "Editar" : "Agregar"}</span>
          )}
        </Button>
        {isEditMode && isDirty && (
          <span className="text-sm text-gray-600">Cambios no guardados</span>
        )}
        {!isEditMode && originalPrice === 0.0 && (
          <span className="text-sm text-red-600 bg-red-50 p-2 rounded-lg">
            El precio final no puede ser 0.00. Por favor, consultar los preciós
            en el catálogo.
          </span>
        )}
      </section>
    </section>
  );
};

const ComponentFormHeader = ({ modelName, quantity }) => {
  return (
    <div className="flex justify-between items-center gap-3">
      <div className="flex items-center gap-2">
        <span className="font-bold text-md text-black">{modelName}</span>
      </div>
      {quantity && quantity > 1 && (
        <div className="flex items-center bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">
          <Package className="w-3 h-3 mr-1" />
          <span className="text-xs font-medium">×{quantity}</span>
        </div>
      )}
    </div>
  );
};

export const ComponentFormCard = ({
  formData,
  model,
  className,
  quoteId,
  quoteDetailId,
  quoteGEId,
  discountValue,
  isDiscountIncrement,
  deliveryDays,
  otherComponents,
  operativeCosts,
  quantity = 1,
  isEditMode = false,
  isAppendMode = false,
}) => {
  const {
    components: {
      discounts: { values: discounts },
    },
    details,
    newItems,
    params,
    addDetail,
    addNewItem,
    removeDetail,
    removeNewItem,
  } = useElectrogenosStore();
  const { refetch } = useSingleQuote();
  const { updateDetailOfQuoteMutate } = useQuote();
  const { getModalProps, openModal, closeModal } = useModal();
  const { components, addComponent, removeComponent, clearAll } =
    useOtherComponents({
      initialComponents: isEditMode
        ? otherComponents
        : details.find((detail) => detail.ModeloKey === model.ModeloKey)
            ?.otherComponents || [],
    });
  const { currency, evalTypeChange } = useExchange();
  const [selectedMotor, setSelectedMotor] = React.useState(model.motor);
  const [selectedAlternador, setSelectedAlternador] = React.useState(
    isEditMode
      ? model.alternadores.find(
          (a) => a.Alternador_Id === formData.alternador.Alternador_Id
        )
      : model.alternadores[0]
  );

  const handleResidencialToggle = (checked) => {
    setIsResidencial(checked);
    onHandleChange("isResidencial", checked); // Asegúrate de tener esta función en props
  };

  const queryClient = useQueryClient();

  const isCabinInsonoro = params.cabin?.description === "INSONORO";
  const [isResidencial, setIsResidencial] = React.useState(() => {
    if (isEditMode) return formData.isResidencial;

    if (params.cabin?.description === "INSONORO") return true;
    if (params.cabin?.description === "ABIERTO") return false;

    return false;
  });

  const isCabinOpen = params.cabin?.description === "ABIERTO";

  const isAdded = React.useMemo(() => {
    const existintDetails = isAppendMode ? newItems : details;

    return existintDetails.some((detail) => {
      return detail.ModeloKey === model.ModeloKey;
    });
  }, [details, isAppendMode, model.ModeloKey, newItems]);

  const detailsOfCurrentModel = React.useMemo(() => {
    const existintDetails = isAppendMode ? newItems : details;

    return existintDetails.find(
      (detail) => detail.ModeloKey === model.ModeloKey
    );
  }, [details, isAppendMode, model.ModeloKey, newItems]);

  const discountOnMemory = React.useMemo(() => {
    if (isAdded) {
      if (!detailsOfCurrentModel) return;
      return {
        discount: detailsOfCurrentModel?.discount || discounts[0],
        increaseDiscount: detailsOfCurrentModel?.increaseDiscount || false,
        deliveryDays: detailsOfCurrentModel?.deliveryDays || 15,
      };
    }
    return {
      discount: discounts[0],
      increaseDiscount: false,
      deliveryDays: 15,
    };
  }, [isAdded, detailsOfCurrentModel, discounts]);

  const { data, onHandleChange } = useElectrogenoModelForm({
    discount: isEditMode
      ? {
          value: discountValue,
        }
      : discountOnMemory.discount,
    increaseDiscount: isDiscountIncrement ?? discountOnMemory.increaseDiscount,
    deliveryDays: deliveryDays ?? discountOnMemory.deliveryDays,
    includeShipping: isEditMode
      ? operativeCosts?.shipping?.isPresent || false
      : false,
    shippingPrice: isEditMode
      ? Number(operativeCosts?.shipping?.amount) || 0
      : 0,
    includeStartup: isEditMode
      ? operativeCosts?.startup?.isPresent || false
      : false,
    startupPrice: isEditMode ? Number(operativeCosts?.startup?.amount) || 0 : 0,
    // date: new Date(),
  });

  const initialState = React.useMemo(
    () => ({
      discount: data.discount.value,
      increaseDiscount: data.increaseDiscount,
      deliveryDays: data.deliveryDays,
      alternadorId: selectedAlternador?.Alternador_Id,
      components: components.map((c) => ({ id: c.id, price: c.price })),
      isResidencial: isResidencial,
      includeShipping: data.includeShipping,
      shippingPrice: data.shippingPrice,
      includeStartup: data.includeStartup,
      startupPrice: data.startupPrice,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const isDirty = React.useMemo(() => {
    if (data.discount.value !== initialState.discount) return true;
    if (data.increaseDiscount !== initialState.increaseDiscount) return true;
    if (data.deliveryDays !== initialState.deliveryDays) return true;
    if (selectedAlternador.Alternador_Id !== initialState.alternadorId)
      return true;
    if (isResidencial !== initialState.isResidencial) return true;
    if (data.includeShipping !== initialState.includeShipping) return true;
    if (data.shippingPrice !== initialState.shippingPrice) return true;
    if (data.includeStartup !== initialState.includeStartup) return true;
    if (data.startupPrice !== initialState.startupPrice) return true;

    // comparamos componentes por longitud y suma de precios (o IDs)
    if (components.length !== initialState.components.length) return true;
    const currentSum = components.reduce((sum, c) => sum + c.price, 0);
    const initialSum = initialState.components.reduce(
      (sum, c) => sum + c.price,
      0
    );
    if (currentSum !== initialSum) return true;

    return false;
  }, [
    data.discount.value,
    data.increaseDiscount,
    data.deliveryDays,
    data.includeShipping,
    data.shippingPrice,
    data.includeStartup,
    data.startupPrice,
    selectedAlternador,
    components,
    initialState,
    isResidencial,
  ]);

  const [totalPrice, setTotalPrice] = React.useState(0);

  const otherComponentsTotalPrice = React.useMemo(
    () =>
      components.length > 0
        ? components.reduce((acc, component) => acc + component.price, 0)
        : 0,
    [components]
  );

  React.useEffect(() => {
    const baseTotal =
      Number.parseFloat(selectedAlternador.price) + otherComponentsTotalPrice;
    const additionalServices =
      (data.includeShipping ? data.shippingPrice || 0 : 0) +
      (data.includeStartup ? data.startupPrice || 0 : 0);
    const total = baseTotal + additionalServices;
    const discount = data.discount.value;
    const evalTotalPrice = total - total * (discount / 100);
    setTotalPrice(evalTotalPrice);
  }, [
    data.discount.value,
    data.includeShipping,
    data.shippingPrice,
    data.includeStartup,
    data.startupPrice,
    isCabinOpen,
    otherComponentsTotalPrice,
    quantity,
    selectedAlternador.price,
  ]);

  React.useEffect(() => {
    if (!isEditMode) {
      if (!detailsOfCurrentModel) return;
      setSelectedAlternador(detailsOfCurrentModel.alternador);
      setIsResidencial(detailsOfCurrentModel.isResidencial ?? isCabinInsonoro);
    }
  }, [
    detailsOfCurrentModel,
    isEditMode,
    selectedAlternador,
    setSelectedAlternador,
    isCabinInsonoro,
  ]);

  // const commitComponents = (stagingComponents, stagingRemovedComponents) => {
  //   for (const component of stagingComponents) {
  //     addComponent(component);
  //   }

  //   for (const component of stagingRemovedComponents) {
  //     removeComponent(component);
  //   }

  //   closeModal("otherComponents");
  // };

  return (
    <Card
      title={
        <ComponentFormHeader modelName={model.Modelo} quantity={quantity} />
      }
      subTitle={
        <section className="flex flex-col space-y-4">
          {/* Motor & ITM info */}
          <div className="grid grid-cols-12 gap-6">
            <div className="flex flex-col col-span-7">
              <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Motor
              </h4>
              <p className="mt-1 text-sm font-semibold text-gray-900 flex items-center gap-1">
                <PiEngine />
                {model.motor.Motor}
              </p>
            </div>
            <div className="flex flex-col col-span-5">
              <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                ITM
              </h4>
              <p className="mt-1 text-sm font-semibold text-gray-900 flex items-center gap-1">
                <TbNavigationBolt className="mt-1" />
                {model.nIntITMA ? `${model.nIntITMA}A` : "No especificado"}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center bg-gray-100 text-gray-700 px-3 py-2 rounded-lg shadow-sm">
              <Zap className="w-4 h-4 mr-2 text-blue-500" />
              <div className="text-sm">
                <div className="font-semibold">Prime</div>
                <div>
                  {selectedAlternador.derate.prime.kw} {site.powerUnits.kilowatt} /{" "}
                  {selectedAlternador.derate.prime.kva} {site.powerUnits.kilovoltAmpere}
                </div>
              </div>
            </div>
            <div className="flex items-center bg-gray-100 text-gray-700 px-3 py-2 rounded-lg shadow-sm">
              <BatteryCharging className="w-4 h-4 mr-2 text-green-500" />
              <div className="text-sm">
                <div className="font-semibold">Standby</div>
                <div>
                  {selectedAlternador.derate.standby.kw} {site.powerUnits.kilowatt} /{" "}
                  {selectedAlternador.derate.standby.kva} {site.powerUnits.kilovoltAmpere}
                </div>
              </div>
            </div>
          </div>
        </section>
      }
      footer={
        <ComponentFormFooter
          totalPrice={totalPrice}
          isAdded={isAdded}
          isEditMode={isEditMode}
          isDirty={isDirty}
          discountValue={data.discount.value}
          onEditAction={() => {
            const payload = {
              quoteDetailId,
              quoteGEId,
              params: params,
              model: {
                id: model.ModeloGE_Id,
                name: model.Modelo,
                price: totalPrice,
              },
              motor: selectedMotor,
              alternador: selectedAlternador,
              discount: data.discount,
              increaseDiscount: data.increaseDiscount,
              originalPrice: totalPrice / (1 - data.discount.value / 100),
              deliveryDays: data.deliveryDays,
              finalPrice: totalPrice,
              quantity: quantity,
              otherComponents: components,
              isResidencial: isResidencial,
              operativeCosts: {
                shipping: {
                  isPresent: data.includeShipping || false,
                  amount: data.shippingPrice || 0,
                },
                startup: {
                  isPresent: data.includeStartup || false,
                  amount: data.startupPrice || 0,
                },
              },
              sTipoGrupoElectrogeno:
                components.length > 0
                  ? "Móvil"
                  : isResidencial
                  ? "Insonoro Estacionario"
                  : "Abierto Estacionario",
            };

            updateDetailOfQuoteMutate(
              {
                quoteId: quoteId,
                quoteDetailId: quoteDetailId,
                data: payload,
              },
              {
                onSuccess: () => {
                  queryClient.invalidateQueries({ queryKey: ["quotes"] });

                  refetch();
                },
              }
            );
          }}
          onSaveAction={() => {
            if (isAdded) {
              const remove = isAppendMode ? removeNewItem : removeDetail;
              remove({ ModeloKey: model.ModeloKey });
              return;
            }

            const modelPrice = selectedAlternador.price;

            // Definir el valor de sTipoGrupoElectrogeno con un valor por defecto seguro
            const tipoGrupoElectrogeno =
              components.length > 0
                ? isResidencial
                  ? "Insonoro Móvil"
                  : "Abierto Móvil"
                : isResidencial
                ? "Insonoro Estacionario"
                : "Abierto Estacionario";

            const detail = {
              integradoraId: model.integradora_Id,
              ModeloKey: model.ModeloKey,
              params: params,
              model: {
                id: model.ModeloGE_Id,
                name: model.Modelo,
                price: modelPrice,
              },
              itmA: model.nIntITMA,
              power: {
                primeKW: selectedAlternador.derate.prime.kw,
                primeKVA: selectedAlternador.derate.prime.kva,
                standbyKW: selectedAlternador.derate.standby.kw,
                standbyKVA: selectedAlternador.derate.standby.kva,
              },
              motor: selectedMotor,
              alternador: selectedAlternador,
              discount: data.discount,
              increaseDiscount: data.increaseDiscount,
              originalPrice: totalPrice / (1 - data.discount.value / 100),
              deliveryDays: data.deliveryDays,
              finalPrice: totalPrice,
              quantity: quantity,
              otherComponents: components,
              isResidencial: isResidencial,
              operativeCosts: {
                shipping: {
                  isPresent: data.includeShipping || false,
                  amount: data.shippingPrice || 0,
                },
                startup: {
                  isPresent: data.includeStartup || false,
                  amount: data.startupPrice || 0,
                },
              },
              nParamInsonoro: isResidencial ? 1 : 0,
              sTipoGrupoElectrogeno: tipoGrupoElectrogeno, // Usar la variable asegurada
            };

            isAppendMode ? addNewItem(detail) : addDetail(detail);
          }}
        />
      }
      className={cn(
        "md:w-25rem border-2 rounded-lg shadow-md",
        isAdded && !isEditMode
          ? "border border-green-600 border-dashed"
          : "border-none",
        className
      )}
    >
      <div className="flex flex-col gap-3">
        <section className="space-y-2 min-h-24">
          <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Alternadores
          </span>
          <div
            className={
              "space-y-2 " +
              (isAdded || isEditMode ? "parent active" : "parent")
            }
          >
            {model.alternadores.map((item) => (
              <RadioText
                key={item.Alternador_Id}
                value={item.Alternador_Id}
                label={item.Alternador}
                disabled={isAdded && !isEditMode}
                checked={
                  selectedAlternador.Alternador_Id === item.Alternador_Id
                }
                className={isAdded && !isEditMode ? "cursor-not-allowed" : ""}
                onChange={() => setSelectedAlternador(item)}
              />
            ))}
          </div>
          {/* Silenciador */}
          <div className="flex items-center gap-2 mt-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isResidencial}
                onChange={(e) => handleResidencialToggle(e.target.checked)}
                disabled={isAdded || (!isEditMode && !isCabinOpen)}
                className="sr-only peer"
              />

              <div
                className={cn(
                  "w-11 h-6 bg-gray-200 rounded-full peer transition-colors duration-200 ease-in-out",
                  isAdded
                    ? "peer-checked:bg-green-600"
                    : "peer-checked:bg-blue-600"
                )}
              ></div>
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></div>
            </label>
            <span className="text-sm font-medium text-gray-700">
              {isResidencial
                ? "Silenciador: Residencial"
                : "Silenciador: Industrial"}
            </span>
          </div>
        </section>

        {/* <section className="flex flex-col w-full">
            <label className="uppercase font-medium text-sm">
            Fecha de entrega
            </label>
            <Calendar
            className="mt-2"
            dateFormat="dd/mm/yy"
            value={data.date}
            onChange={(e) => {
              onHandleChange("date", e.value);
            }}
            placeholder={`${new Date().toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}`}
            />
          </section> */}
        <section className="w-full flex my-5 justify-end">
          <Button
            className={`text-xs flex justify-center items-center md:w-fit px-4 py-2 rounded-2xl border border-gray-200 hover:border-gray-300 transition-colors duration-200 ease-in-out`}
            variant={"secondary"}
            disabled={isAdded && !isEditMode}
            onClick={() => {
              openModal("otherComponents");
            }}
          >
            <Plus strokeWidth={1.25} className="mr-1 w-3 h-3" /> Accesorios
          </Button>
        </section>
        <section></section>

        {/* Summary of accesories */}
        {components.length > 0 && (
          <section className="space-y-2 p-2 rounded-lg border border-gray-200 border-dashed">
            <span className="text-black font-medium p-3">
              Accesorios agregados
            </span>
            <div className="p-3 rounded-lg space-y-2">
              {components.map((component, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">
                    {component.name} {component?.description}
                  </span>
                  <span className="text-sm font-medium">
                    {currency.symbol}
                    {evalTypeChange(component.price)}
                  </span>
                </div>
              ))}
              <div className="pt-2 border-t-[0.5px] border-gray-950">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-black">Total</span>
                  <span className="text-sm font-bold text-primary text-black">
                    {currency.symbol}
                    {evalTypeChange(otherComponentsTotalPrice)}
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}
        {/* Discount and delivery dais */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <section className="flex flex-col gap-3">
            <section className="relative">
              <label className="uppercase font-medium text-sm">DESCUENTO</label>
              <InputNumber
                label="DESCUENTO"
                value={data.discount.value}
                min={0}
                max={99.99}
                disabled={isAdded && !isEditMode}
                placeholder="Ingrese el descuento"
                className="w-full"
                inputClassName="rounded-lg w-full"
                onChange={(e) => {
                  let discount = e.value;

                  if (discount > 99.99) {
                    discount = 99.99;
                  }

                  onHandleChange("discount", {
                    value: discount,
                  });
                }}
              />
              <span className="absolute right-8 top-[45%] translate-y-1 text-gray-500">
                %
              </span>
            </section>

            <section className="flex gap-2 text-sm w-fit md:w-full">
              <Button
                variant="tertiary"
                disabled={isAdded && !isEditMode}
                className={cn(
                  "bg-white lg:w-fit rounded-[8px] px-[10px] py-1 text-sm shadow-sm hover:bg-[#e9e7f5] hover:scale-105 duration-500 ease-in-out transition-transform text-[#7e6fd3] md:text-[#7e6fd3] border-[1px] border-[#9184dc] h-[28px]",
                  data.discount.value === 30 ? "border-solid" : "border-dashed"
                )}
                style={{ color: "#7e6fd3" }}
                onClick={() => onHandleChange("discount", { value: 30 })}
              >
                <span>30%</span>
              </Button>
              <Button
                variant="tertiary"
                disabled={isAdded && !isEditMode}
                className={cn(
                  "bg-white lg:w-fit rounded-[8px] px-[10px] py-1 text-sm shadow-sm hover:bg-[#e9e7f5] hover:scale-105 duration-500 ease-in-out transition-transform text-[#7e6fd3] md:text-[#7e6fd3] border-[1px] border-[#9184dc] h-[28px]",
                  data.discount.value === 35 ? "border-solid" : "border-dashed"
                )}
                style={{ color: "#7e6fd3" }}
                onClick={() => onHandleChange("discount", { value: 35 })}
              >
                <span>35%</span>
              </Button>
              <Button
                variant="tertiary"
                disabled={isAdded && !isEditMode}
                className={cn(
                  "bg-white lg:w-fit rounded-[8px] px-[10px] py-1 text-sm shadow-sm hover:bg-[#e9e7f5] hover:scale-105 duration-500 ease-in-out transition-transform text-[#7e6fd3] md:text-[#7e6fd3] border-[1px] border-[#9184dc] h-[28px]",
                  data.discount.value === 40 ? "border-solid" : "border-dashed"
                )}
                style={{ color: "#7e6fd3" }}
                onClick={() => onHandleChange("discount", { value: 40 })}
              >
                <span>40%</span>
              </Button>
            </section>
          </section>

          <section className="relative">
            <label className="uppercase font-medium text-sm">
              FECHA DE ENTREGA
            </label>
            <InputNumber
              label="FECHA DE ENTREGA"
              min={1}
              disabled={isAdded && !isEditMode}
              className="w-full"
              value={data.deliveryDays}
              inputClassName="rounded-lg w-full"
              onChange={(e) => onHandleChange("deliveryDays", e.value)}
            />
            <span className="absolute right-8 top-[45%] md:top-[25%] translate-y-1 text-gray-500">
              Días
            </span>
          </section>
        </section>
        {/* Shipping and Startup Costs */}
        <section className="space-y-1">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Servicios Adicionales
          </h3>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Shipping Section */}
            <div className="py-2 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={data.includeShipping || false}
                        onChange={(e) =>
                          onHandleChange("includeShipping", e.target.checked)
                        }
                        disabled={isAdded && !isEditMode}
                        className="sr-only peer"
                      />
                      <div
                        className={cn(
                          "w-11 h-6 bg-gray-200 rounded-full peer transition-colors duration-200 ease-in-out",
                          isAdded
                            ? "peer-checked:bg-green-600"
                            : "peer-checked:bg-blue-600"
                        )}
                      ></div>
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></div>
                    </label>
                    <span className="text-sm font-medium text-gray-700 flex gap-2 items-center">
                       <Truck className="w-4 h-4 text-blue-600" /> Envío
                    </span>
                  </div>
                </div>
              </div>

              {data.includeShipping && (
                <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                  <label className="text-xs font-medium text-gray-600 uppercase">
                    Precio de Envío
                  </label>
                  <div className="relative">
                    <InputNumber
                      value={data.shippingPrice || 0}
                      min={0}
                      disabled={isAdded && !isEditMode}
                      placeholder="Ingrese el precio de envío"
                      className="w-full"
                      inputClassName="rounded-lg w-full pl-8"
                      onChange={(e) =>
                        onHandleChange("shippingPrice", e.value || 0)
                      }
                    />
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                      {currency.symbol}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Startup Section */}
            <div className=" py-2 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={data.includeStartup || false}
                        onChange={(e) =>
                          onHandleChange("includeStartup", e.target.checked)
                        }
                        disabled={isAdded && !isEditMode}
                        className="sr-only peer"
                      />
                      <div
                        className={cn(
                          "w-11 h-6 bg-gray-200 rounded-full peer transition-colors duration-200 ease-in-out",
                          isAdded
                            ? "peer-checked:bg-green-600"
                            : "peer-checked:bg-blue-600"
                        )}
                      ></div>
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></div>
                    </label>
                    <span className="text-sm font-medium text-gray-700 line-clamp-1 flex gap-2 items-center">
                      <Wrench className="w-4 h-4 text-blue-600" /> Puesto en Marcha
                    </span>
                  </div>
                </div>
              </div>

              {data.includeStartup && (
                <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                  <label className="text-xs font-medium text-gray-600 uppercase">
                    Precio de Puesto en Marcha
                  </label>
                  <div className="relative">
                    <InputNumber
                      value={data.startupPrice || 0}
                      min={0}
                      disabled={isAdded && !isEditMode}
                      placeholder="Ingrese el precio de puesta en marcha"
                      className="w-full"
                      inputClassName="rounded-lg w-full pl-8"
                      onChange={(e) =>
                        onHandleChange("startupPrice", e.value || 0)
                      }
                    />
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                      {currency.symbol}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </section>
        </section>

        {/* Summary of Additional Services */}
        {/* {(data.includeShipping || data.includeStartup) && (
          <div className="p-2 rounded-lg border border-gray-200">
            <h4 className="text-black font-medium p-3">
              Resumen de Servicios Adicionales
            </h4>
            <div className="space-y-1 p-3">
              {data.includeShipping && (
                <div className="flex justify-between items-center text-sm">
                  <span>Envío</span>
                  <span className="font-medium ">
                    {currency.symbol}
                    {evalTypeChange(data.shippingPrice || 0)}
                  </span>
                </div>
              )}
              {data.includeStartup && (
                <div className="flex justify-between items-center text-sm">
                  <span>Puesta en Marcha</span>
                  <span className="font-medium">
                    {currency.symbol}
                    {evalTypeChange(data.startupPrice || 0)}
                  </span>
                </div>
              )}
              {(data.includeShipping || data.includeStartup) && (
                <div className="pt-2 border-t-[0.5px] border-gray-950">
                  <div className="flex justify-between items-center text-sm font-semibold">
                    <span className="text-sm font-medium text-black">
                      Total Servicios
                    </span>
                    <span className="text-sm font-medium text-black">
                      {currency.symbol}
                      {evalTypeChange(
                        (data.shippingPrice || 0) + (data.startupPrice || 0)
                      )}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )} */}

        {/* <section>
          <AccordionDescuento
            headerText={"Descuentos"}
            disabled={isAdded && !isEditMode}
            radioOptions={discounts}
            discountSelected={data.discount.id}
            handleSelected={(discount) => {
              const discountFind = discounts.find((d) => d.id === discount);

              onHandleChange("discount", discountFind);
            }}
            inputLabel={"Descuento"}
            switchLabel={"NOTIFICAR AUMENTO DE DESCUENTO"}
            switchChecked={data.increaseDiscount}
            handleSwitch={(value) => {
              onHandleChange("increaseDiscount", value);
            }}
          />
        </section> */}

        {/* <OtrosModal
          {...getModalProps("otherComponents", "open", "setOpen")}
          components={components}
          // commitComponents={commitComponents}
          addComponent={addComponent}
          removeComponent={removeComponent}
          clearAll={clearAll}
          modelName={model.Modelo}
        /> */}
      </div>
    </Card>
  );
};
