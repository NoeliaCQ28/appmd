import { useModal } from "@hooks/useModal";
import { Check, Package, Plus, Truck, Wrench } from "lucide-react";
import { Card } from "primereact/card";
import { InputNumber } from "primereact/inputnumber";
import React from "react";
import { Button } from "../../../../../components/custom/buttons/Button";
import { cn, formatAmount } from "../../../../../utils/utils";
import { useCellsStore } from "../../hooks/useCellsStore";
import { useExchange } from "../../hooks/useExchange";
import { useOtherComponents } from "../../hooks/useOtherComponents";
import useQuote from "../../hooks/useQuote";
import useSingleQuote from "../../hooks/useSingleQuote";
import { CellsAccesoriosModal } from "./modals/CellsAccesoriosModal";

const ComponentFormFooter = ({
  totalPrice,
  onSaveAction,
  onEditAction,
  isAdded,
  isDirty,
  discountValue,
  isEditMode,
}) => {
  // Calcular precio original basado en el descuento
  const originalPrice = totalPrice / (1 - discountValue / 100);

  // Si no hay precio total válido, mostrar skeleton loader
  if (typeof totalPrice !== "number" || isNaN(totalPrice)) {
    return (
      <section className="flex flex-col space-y-3">
        {/* ... skeleton loading state ... */}
      </section>
    );
  }

  return (
    <section className="flex flex-col space-y-3">
      {/* Sección de precios */}
      <section
        className={`flex ${
          discountValue > 0 ? "justify-between" : "justify-end"
        } p-3 rounded-lg`}
      >
        {/* Mostrar precio original solo si hay descuento */}
        {discountValue > 0 && (
          <div className="flex flex-col">
            <span className="text-sm text-gray-600 font-semibold">
              PRECIO ORIGINAL
            </span>
            <span className="text-2xl text-black font-bold line-through">
              $
              {originalPrice.toLocaleString("es-ES", {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
        )}

        {/* Precio final con o sin descuento */}
        <div className="flex flex-col items-end">
          <span className="text-sm text-gray-600 font-semibold">
            {discountValue > 0
              ? `PRECIO FINAL (${discountValue}% dcto.)`
              : "PRECIO FINAL"}
          </span>
          <span className="text-2xl font-bold text-black">
            ${formatAmount(totalPrice)}
          </span>
        </div>
      </section>

      {/* Botón de acción */}
      <section className="flex">
        <Button
          variant={isAdded || isEditMode ? "tertiary" : "primary"}
          onClick={isEditMode ? onEditAction : onSaveAction}
          // disabled={isEditMode}
          className="w-full flex justify-center items-center"
        >
          {isAdded && !isEditMode ? (
            <span className="flex items-center gap-2">
              Agregado <Check />
            </span>
          ) : (
            <span>{isEditMode ? "Editar" : "Agregar"}</span>
          )}
        </Button>
      </section>
    </section>
  );
};

const ComponentFormHeader = ({ celdaName, quantity }) => {
  return (
    <div className="flex justify-between items-center gap-3">
      <div className="flex items-center gap-2">
        <span className="text-black">{celdaName}</span>
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

export const ComponentCellsCard = ({
  title,
  className,
  quoteId,
  quoteDetailId,
  quoteCeldaId,
  deliveryDays = 0,
  otherComponents,
  quantity = 1,
  isEditMode = false,
  celdaId,
  precioCelda,
  operativeCosts,
  onSuccessRefetch,
}) => {
  const { refetch } = useSingleQuote();
  const { updateDetailOfQuoteMutate } = useQuote();
  const { getModalProps, openModal, closeModal } = useModal();
  const { cellsAdded, addCell, removeCell } = useCellsStore();
  const { currency } = useExchange();

  const { components, addComponent, removeComponent, clearAll, setComponents } =
    useOtherComponents({
      initialComponents: isEditMode
        ? otherComponents
        : cellsAdded.find((detail) => detail.nCotDetItem === quoteDetailId)
            ?.otherComponents || [],
    });

  //esto funciona cuando carga el componente pero falta verificar cuando no se cierra el componente
  React.useEffect(() => {
    setComponents(otherComponents);
  }, [otherComponents, setComponents]);

  const [dias, setDias] = React.useState(deliveryDays);
  const [discount, setDiscount] = React.useState(0);
  const [totalPrice, setTotalPrice] = React.useState(precioCelda);

  // Estados para costos operativos
  const [operativeCostsState, setOperativeCostsState] = React.useState({
    shipping: { isPresent: false, amount: 0 },
    startup: { isPresent: false, amount: 0 },
    ...operativeCosts,
  });

  // Calcular el total de accesorios
  const otherComponentsTotalPrice = React.useMemo(() => {
    return components.reduce((acc, component) => acc + component.price, 0);
  }, [components]);

  // Calcular costos operativos
  const operativeCostsTotalPrice = React.useMemo(() => {
    const shippingCost = operativeCostsState.shipping?.isPresent
      ? Number(operativeCostsState.shipping.amount) || 0
      : 0;
    const startupCost = operativeCostsState.startup?.isPresent
      ? Number(operativeCostsState.startup.amount) || 0
      : 0;
    return shippingCost + startupCost;
  }, [operativeCostsState]);

  // Modificar el precio total base para incluir accesorios y costos operativos
  const precioTotalBase = React.useMemo(() => {
    return precioCelda + otherComponentsTotalPrice;
  }, [precioCelda, otherComponentsTotalPrice]);

  // Efecto para recalcular el precio final cuando cambie el descuento o los accesorios
  React.useEffect(() => {
    const precioConDescuento =
      precioTotalBase - (precioTotalBase * discount) / 100;
    setTotalPrice(precioConDescuento);
  }, [precioTotalBase, discount]);

  // Manejadores para el descuento
  const handleDiscountChange = (value) => {
    setDiscount(value || 0);
  };

  const handleDiscountButtonClick = (percentage) => {
    setDiscount(percentage);
  };

  // Manejador para los días de entrega
  const handleDeliveryDaysChange = (value) => {
    setDias(value || 0);
  };

  return (
    <Card
      className={cn("md:w-25rem border-none", className)}
      title={<ComponentFormHeader celdaName={title} quantity={quantity} />}
      footer={
        <ComponentFormFooter
          totalPrice={totalPrice + operativeCostsTotalPrice}
          discountValue={discount}
          isDirty={discount > 0}
          isEditMode={isEditMode}
          onEditAction={() => {
            const payload = {
              quoteDetailId: quoteDetailId,
              quoteDetailsCeldaId: quoteCeldaId,
              nPrecioUnitario: Number.parseFloat(precioTotalBase),
              nCantidad: quantity,
              nTotal: Number.parseFloat(quantity * precioTotalBase),
              nDiasParaEntrega: Number.parseInt(dias),
              otherComponents: components,
              operativeCosts: operativeCostsState,
            };
            updateDetailOfQuoteMutate(
              {
                quoteId: quoteId,
                quoteDetailId: quoteDetailId,
                data: payload,
              },
              {
                onSuccess: () => {
                  // Limpiar estados después de editar exitosamente
                  clearAll?.(); // Limpiar componentes
                  // setDiscount(0); // Resetear descuento
                  // setDias(0); // Resetear días
                  setTotalPrice(precioCelda); // Resetear precio
                  removeCell?.(celdaId); // Remover celda si es necesario
                  refetch(); // Actualizar datos
                  onSuccessRefetch(); //Actualizar componentes
                },
              }
            );
          }}
        />
      }
    >
      <section className="w-full flex my-5 justify-end">
        <Button
          className="text-xs flex justify-center items-center md:w-[182px]"
          variant={"secondary"}
          // disabled={isAdded && !isEditMode}
          onClick={() => {
            openModal("otherComponents");
          }}
        >
          <Plus strokeWidth={1.25} className="mr-1 w-3 h-3" /> Otros Accesorios
        </Button>
      </section>
      <section></section>

      {components.length > 0 && (
        <section className="space-y-2 p-2 rounded-lg border border-gray-200">
          <span className="text-black font-medium">Accesorios adicionales</span>
          <div className="p-3 rounded-lg space-y-2">
            {components.map((component, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-xs text-gray-600">{component.name}</span>
                <span className="text-sm font-medium">
                  ${formatAmount(component.price)}
                </span>
              </div>
            ))}
            <div className="pt-2 border-t-[0.5px] border-gray-950">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-black">
                  Total adicionales
                </span>
                <span className="text-sm font-bold text-primary text-black">
                  ${formatAmount(otherComponentsTotalPrice)}
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Operative Costs Section */}
      <section className="space-y-3 p-3 rounded-lg border border-gray-200">
        <span className="text-black font-medium">Costos Operativos</span>

        {/* Shipping Section */}
        <div className="bg-gray-50 p-3 rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Envío</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={operativeCostsState.shipping?.isPresent || false}
                onChange={(e) => {
                  setOperativeCostsState((prev) => ({
                    ...prev,
                    shipping: {
                      ...prev.shipping,
                      isPresent: e.target.checked,
                    },
                  }));
                }}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 rounded-full peer transition-colors duration-200 ease-in-out peer-checked:bg-blue-600"></div>
              <div className="absolute left-1 top-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4"></div>
            </label>
          </div>
          {operativeCostsState.shipping?.isPresent && (
            <div className="animate-in slide-in-from-top-2 duration-200">
              <div className="relative">
                <InputNumber
                  value={operativeCostsState.shipping?.amount || 0}
                  min={0}
                  placeholder="Precio de envío"
                  className="w-full"
                  inputClassName="rounded-lg w-full pl-8 text-sm"
                  onChange={(e) => {
                    setOperativeCostsState((prev) => ({
                      ...prev,
                      shipping: {
                        ...prev.shipping,
                        amount: e.value || 0,
                      },
                    }));
                  }}
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                  $
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Startup Section */}
        <div className="bg-gray-50 p-3 rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">
                Puesto en Marcha
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={operativeCostsState.startup?.isPresent || false}
                onChange={(e) => {
                  setOperativeCostsState((prev) => ({
                    ...prev,
                    startup: {
                      ...prev.startup,
                      isPresent: e.target.checked,
                    },
                  }));
                }}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 rounded-full peer transition-colors duration-200 ease-in-out peer-checked:bg-blue-600"></div>
              <div className="absolute left-1 top-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4"></div>
            </label>
          </div>
          {operativeCostsState.startup?.isPresent && (
            <div className="animate-in slide-in-from-top-2 duration-200">
              <div className="relative">
                <InputNumber
                  value={operativeCostsState.startup?.amount || 0}
                  min={0}
                  placeholder="Precio de puesto en marcha"
                  className="w-full"
                  inputClassName="rounded-lg w-full pl-8 text-sm"
                  onChange={(e) => {
                    setOperativeCostsState((prev) => ({
                      ...prev,
                      startup: {
                        ...prev.startup,
                        amount: e.value || 0,
                      },
                    }));
                  }}
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                  $
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Operative Costs Summary - if any costs are present */}
      {operativeCostsTotalPrice > 0 && (
        <section className="space-y-2 p-2 rounded-lg border border-gray-200">
          <span className="text-black font-medium">
            Resumen costos operativos
          </span>
          <div className="p-3 rounded-lg space-y-2">
            {operativeCostsState.shipping?.isPresent && (
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Envío</span>
                <span className="text-sm font-medium">
                  ${formatAmount(operativeCostsState.shipping.amount)}
                </span>
              </div>
            )}
            {operativeCostsState.startup?.isPresent && (
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Puesto en Marcha</span>
                <span className="text-sm font-medium">
                  ${formatAmount(operativeCostsState.startup.amount)}
                </span>
              </div>
            )}
            <div className="pt-2 border-t-[0.5px] border-gray-950">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-black">
                  Total operativos
                </span>
                <span className="text-sm font-bold text-primary text-black">
                  ${formatAmount(operativeCostsTotalPrice)}
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="flex flex-col gap-3">
        <section className="grid grid-cols-1 lg:grid-cols-1 gap-3">
          {/* <section className='flex flex-col gap-3'>
						<section className='relative'>
							<label className='uppercase font-medium text-sm'>DESCUENTO</label>
							<InputNumber
								label='DESCUENTO'
								value={discount}
								min={0}
								max={99.99}
								className='w-full'
								inputClassName='rounded-lg w-full'
								onChange={(e) => handleDiscountChange(e.value)}
							/>
							<span className='absolute right-8 top-[45%] translate-y-1 text-gray-500'>
								%
							</span>
						</section>

						<section className='flex gap-2 text-sm w-fit md:w-full'>
							<Button
								variant='tertiary'
								// disabled={isAdded && !isEditMode}
								className='bg-white lg:w-fit rounded-[8px] px-[10px] py-1 text-sm shadow-sm hover:bg-[#e9e7f5] hover:scale-105 duration-500 ease-in-out transition-transform text-[#7e6fd3] md:text-[#7e6fd3] border-[1px] border-[#9184dc]'
								style={{ color: '#7e6fd3' }}
								onClick={() => handleDiscountButtonClick(30)}
							>
								<span>30%</span>
							</Button>
							<Button
								variant='tertiary'
								// disabled={isAdded && !isEditMode}
								className='bg-white lg:w-fit rounded-[8px] px-[10px] py-1 text-sm shadow-sm hover:bg-[#e9e7f5] hover:scale-105 duration-500 ease-in-out transition-transform text-[#7e6fd3] md:text-[#7e6fd3] border-[1px] border-[#9184dc]'
								style={{ color: '#7e6fd3' }}
								onClick={() => handleDiscountButtonClick(35)}
							>
								<span>35%</span>
							</Button>
							<Button
								variant='tertiary'
								// disabled={isAdded && !isEditMode}
								className='bg-white lg:w-fit rounded-[8px] px-[10px] py-1 text-sm shadow-sm hover:bg-[#e9e7f5] hover:scale-105 duration-500 ease-in-out transition-transform text-[#7e6fd3] md:text-[#7e6fd3] border-[1px] border-[#9184dc]'
								style={{ color: '#7e6fd3' }}
								onClick={() => handleDiscountButtonClick(40)}
							>
								<span>40%</span>
							</Button>
						</section>
					</section> */}

          <section className="relative">
            <label className="uppercase font-medium text-sm">
              FECHA DE ENTREGA
            </label>
            <InputNumber
              label="FECHA DE ENTREGA"
              min={1}
              // disabled={isAdded && !isEditMode}
              className="w-full"
              value={dias}
              inputClassName="rounded-lg w-full"
              onChange={(e) => handleDeliveryDaysChange(e.value)}
            />
            <span className="absolute right-8 top-[45%] md:top-[40%] translate-y-1 text-gray-500">
              Días
            </span>
          </section>
        </section>
        <CellsAccesoriosModal
          {...getModalProps("otherComponents", "open", "setOpen")}
          selectedItem={{ celdaId: celdaId }}
          components={components}
          addComponent={addComponent}
          removeComponent={removeComponent}
          clearAll={clearAll}
          isEditMode={true}
        />
      </div>
    </Card>
  );
};
