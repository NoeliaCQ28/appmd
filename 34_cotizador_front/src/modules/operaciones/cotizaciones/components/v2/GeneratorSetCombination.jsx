import {
  BadgeInfo,
  BatteryCharging,
  Check,
  Microchip,
  Package,
  Plus,
  TowerControlIcon,
  Truck,
  Weight,
  Wrench,
  Zap,
} from "lucide-react";
import { Card } from "primereact/card";
import { InputNumber } from "primereact/inputnumber";
import { Sidebar } from "primereact/sidebar";
import React from "react";
import { PiEngine } from "react-icons/pi";
import { TbNavigationBolt } from "react-icons/tb";
import { Button } from "../../../../../components/custom/buttons/Button";
import { RadioText } from "../../../../../components/custom/inputs/RadioText";
import site from "../../../../../config/site";
import { useAuth } from "../../../../../hooks/useAuth";
import { useModal } from "../../../../../hooks/v2/useModal";
import { cn } from "../../../../../utils/utils";
import { useExchange } from "../../hooks/useExchange";
import { useGeneratorSet } from "../../hooks/v2/useGeneratorSet";
import {
  ACTIONS,
  useGeneratorSetCombination,
} from "../../hooks/v2/useGeneratorSetCombination";
import { evalPrices } from "../../utils/v2/utils";
import { AccessoriesGeneratorSetModal } from "../forms/modals/AccessoriesGeneratorSetModal";
import { AlternatorBadget } from "./AlternatorBadget";
import { GeneratorSerCombinationPriceSectionInfo } from "./GeneratorSerCombinationPriceSectionInfo";
import { AlternatorsModal } from "./modals/AlternatorsModal";
import modasaLogo from "/modasa.png";
import chinaFlag from "/chinaFlag.svg";
import Roles from "../../../../../constants/Roles";
import { FormSelectText } from "../../../../../components/custom/selects/FormSelectText";
import { ITMModal } from "./modals/ITMModal";
import { ITMConfigurationBadget } from "./ITMConfigurationBadget";

/**
 * GeneratorSetCombination Componente
 *
 * Muestra una combinación de generador con detalles técnicos, opciones de alternador y silenciador.
 * Permite seleccionar alternadores, aplicar descuentos, y gestionar accesorios. ademas de implementar un simulador de combinaciones por alternador.
 *
 * @accesory
 * @param {Object} props - Component props
 * @param {Object} props.generatorSet - Generator set data object from backend API
 * @param {string} props.generatorSet.sIntKey - Identificador unico (e.g., "394-5-200")
 * @param {string} props.generatorSet.sModNombre - Nombre del modelo (e.g., "MP-60")
 * @param {string} props.generatorSet.sMotModelo - Modelo del motor (e.g., "1103A-33TG2")
 * @param {string} props.generatorSet.sMotMarca - Marca del motor (e.g., "PERKINS")
 * @param {number} props.generatorSet.nIntITMA - ITM Amperaje (e.g., 200)
 * @param {Array<Object>} props.generatorSet.combinations - List de combinaciones del GE por cada uno de sus alternadores
 * @param {number} props.generatorSet.combinations[].IntegradoraId - Integradora ID
 * @param {string} props.generatorSet.combinations[].sModNombre - Nombre del modelo de GE
 * @param {number} props.generatorSet.combinations[].nModPesoKgAbierto - Peso en kg (abierto)
 * @param {number} props.generatorSet.combinations[].nModPesoKgInsonoro - Peso en kg (con cabina)
 * @param {number} props.generatorSet.combinations[].nModEstado - Model status
 * @param {number} props.generatorSet.combinations[].nModEliminado - Model deleted flag
 * @param {number} props.generatorSet.combinations[].ModeloGE_Id - Generator model ID
 * @param {string} props.generatorSet.combinations[].sMotModelo - Motor model
 * @param {string} props.generatorSet.combinations[].sMotMarca - Motor brand
 * @param {number} props.generatorSet.combinations[].Motor_Id - Motor ID
 * @param {string} props.generatorSet.combinations[].sAltModelo - Alternator model
 * @param {string} props.generatorSet.combinations[].sAltFamilia - Alternator family
 * @param {string} props.generatorSet.combinations[].sAltCodigoSAP - SAP code for alternator
 * @param {number} props.generatorSet.combinations[].nAltPesoKg - Alternator weight in kg
 * @param {number} props.generatorSet.combinations[].nAltCostoUSD - Alternator cost in USD
 * @param {number} props.generatorSet.combinations[].nAltPrecioUSD - Alternator price in USD
 * @param {number} props.generatorSet.combinations[].nAltNroHilos - Number of alternator wires
 * @param {string} props.generatorSet.combinations[].sAltMarca - Marca del alternador
 * @param {number} props.generatorSet.combinations[].Alternador_Id - Id del alternador
 * @param {string} props.generatorSet.combinations[].sMercadoNombre - Nombre del mercado (Nacional o Exportación)
 * @param {number} props.generatorSet.combinations[].MercadoId - Id del mercado
 * @param {number} props.generatorSet.combinations[].nIntCostoGEAbierto - Open generator cost
 * @param {number} props.generatorSet.combinations[].nIntCostoGECabina - Cabin generator cost
 * @param {number} props.generatorSet.combinations[].nIntPrecioGEAbierto - Open generator price
 * @param {number} props.generatorSet.combinations[].nIntPrecioGECabina - Cabin generator price
 * @param {number} props.generatorSet.combinations[].nIntVoltaje - Voltage rating
 * @param {number} props.generatorSet.combinations[].nIntFrecuencia - Frequency rating (Hz)
 * @param {number} props.generatorSet.combinations[].nIntFases - Number of phases
 * @param {number} props.generatorSet.combinations[].nIntFP - Power factor
 * @param {number} props.generatorSet.combinations[].nIntAltura - Altitude rating
 * @param {number} props.generatorSet.combinations[].nIntITMA - ITM Amperage
 * @param {number} props.generatorSet.combinations[].nIntPrimeKW - Prime power in KW
 * @param {number} props.generatorSet.combinations[].nIntStandBy - Standby power
 * @param {string} props.generatorSet.combinations[].sIntKey - Integration key
 * @param {number} props.generatorSet.combinations[].nIntCostoTotalUSD - Total cost in USD
 * @param {number} props.generatorSet.combinations[].nIntPrecioTotalUSD - Total price in USD
 * @param {number} props.generatorSet.combinations[].nIntPesoTotalKg - Total weight in kg
 * @param {number} props.generatorSet.combinations[].PrimeKW - Prime power in KW
 * @param {number} props.generatorSet.combinations[].PrimeKVA - Prime power in KVA
 * @param {number} props.generatorSet.combinations[].StandByKW - Standby power in KW
 * @param {number} props.generatorSet.combinations[].StandByKVA - Standby power in KVA
 * @param {number} props.generatorSet.combinations[].CorrientePrimeA - Prime current in Amperes
 * @param {number} props.generatorSet.combinations[].CorrienteStandByA - Standby current in Amperes
 * @param {number} props.generatorSet.combinations[].nIntTemperatura - Temperature rating
 * @param {boolean} props.generatorSet.combinations[].nIntInsonoro - Soundproof option
 * @param {number} props.generatorSet.combinations[].nIntSileciadorTipo - Type of silencer 1 for industrial, 2 for residential
 * @param {string} props.generatorSet.combinations[].sIntSileciadorTipo - Type of silencer
 * @param {boolean} props.generatorSet.combinations[].nIntSileciadorPermiteCambio - Allows silencer change
 * @param {Array<Object>} props.generatorSet.combinations[].accessories - Array of accessories for the combination
 * @param {string} props.generatorSet.combinations[].accessories[].name - Name of the accessory
 * @param {string} props.generatorSet.combinations[].accessories[].description - Description of the accessory
 * @param {number} props.generatorSet.combinations[].accessories[].price - Price of the accessory
 * @param {Object} props.generatorSet.combinations[].operativeCosts - Operative costs configuration
 * @param {Object} props.generatorSet.combinations[].operativeCosts.shipping - Shipping cost configuration
 * @param {boolean} props.generatorSet.combinations[].operativeCosts.shipping.isPresent - Whether shipping is included
 * @param {number} props.generatorSet.combinations[].operativeCosts.shipping.amount - Shipping amount (Note: Fixed typo from "ammount")
 * @param {Object} props.generatorSet.combinations[].operativeCosts.startup - Startup cost configuration
 * @param {boolean} props.generatorSet.combinations[].operativeCosts.startup.isPresent - Whether startup service is included
 * @param {number} props.generatorSet.combinations[].operativeCosts.startup.amount - Startup service amount
 * @param {Object} props.generatorSet.combinations[].configuration.alternator - Alternator swap configuration
 * @param {boolean} props.generatorSet.combinations[].configuration.alternator.isPresent - Whether alternator swap is active
 * @param {number|null} props.generatorSet.combinations[].configuration.alternator.alternatorBaseId - Base alternator ID for swap
 * @param {number|null} props.generatorSet.combinations[].configuration.alternator.alternadorSwappedId - Swapped alternator ID
 * @param {Object} props.generatorSet.combinations[].configuration.itm - ITM configuration
 * @param {boolean} props.generatorSet.combinations[].configuration.itm.isPresent - Whether ITM is included
 * @param {number|null} props.generatorSet.combinations[].configuration.itm.itmBaseId - Selected ITM ID
 * @param {Object} props.generatorSet.combinations[].configuration.itm.itmSwappedId - Swapped ITM ID
 *
 * @returns {JSX.Element} Tarjeta con detalles del generador y opciones de configuración
 *
 * @example
 * ```jsx
 * const generatorData = {
 *   sIntKey: "394-5-200",
 *   sModNombre: "MP-60",
 *   sMotModelo: "1103A-33TG2",
 *   sMotMarca: "PERKINS",
 *   nIntITMA: 200,
 *   combinations: [
 *     {
 *       IntegradoraId: 6537,
 *       sModNombre: "MP-60",
 *       nModPesoKgAbierto: 870,
 *       nModPesoKgInsonoro: 1300,
 *       nModEstado: 1,
 *       nModEliminado: 0,
 *       ModeloGE_Id: 394,
 *       sMotModelo: "1103A-33TG2",
 *       sMotMarca: "PERKINS",
 *       Motor_Id: 5,
 *       sAltModelo: "S1L2-Y1",
 *       sAltFamilia: "B",
 *       sAltCodigoSAP: "C16AT000149",
 *       nAltPesoKg: 241,
 *       nAltCostoUSD: 3229.2,
 *       nAltPrecioUSD: 3875.04,
 *       nAltNroHilos: 12,
 *       sAltMarca: "STAMFORD",
 *       Alternador_Id: 140,
 *       sMercadoNombre: "NACIONAL",
 *       MercadoId: 1,
 *       nIntCostoGEAbierto: 8337.21,
 *       nIntCostoGECabina: 1140.31,
 *       nIntPrecioGEAbierto: 21053.57,
 *       nIntPrecioGECabina: 2676.77,
 *       nIntVoltaje: 220,
 *       nIntFrecuencia: 60,
 *       nIntFases: 3,
 *       nIntFP: 0.8,
 *       nIntAltura: 1000,
 *       nIntITMA: 200,
 *       nIntPrimeKW: 55.4,
 *       nIntStandBy: 61,
 *       sIntKey: "394-5-200",
 *       nIntCostoTotalUSD: 9477.52,
 *       nIntPrecioTotalUSD: 23730.34,
 *       nIntPesoTotalKg: 1541,
 *       PrimeKW: 55.44,
 *       PrimeKVA: 69.3,
 *       StandByKW: 60.96,
 *       StandByKVA: 76.2,
 *       CorrientePrimeA: 2968,
 *       CorrienteStandByA: 3283.3,
 *       nIntTemperatura: 30,
 *       nIntInsonoro: true,
 *       nIntSileciadorTipo: 2,
 *       sIntSileciadorTipo: "Residencial",
 *       nIntSileciadorPermiteCambio: false,
 *       sRegimen: "STAND BY",
 *       accessories: [],
 *       operativeCosts: {
 *         shipping: {
 *           isPresent: false,
 *           amount: 0
 *         },
 *         startup: {
 *           isPresent: false,
 *           amount: 0
 *         }
 *       },
 *       configuration: {
 *         alternator: {
 *           isPresent: false,
 *           alternatorBaseId: null,
 *           alternatorSwappedId: null
 *         },
 *         itm: {
 *           isPresent: false,
 *           itmBaseId: null,
 *           itmSwappedId: null
 *         }
 *       }
 *     }
 *   ]
 * };
 *
 * <GeneratorSetCombination generatorSet={generatorData} />
 * ```
 * @since 1.20250724
 * @author @georgegiosue
 */
export const GeneratorSetCombination = ({
  className,
  generatorSet,
  options: { isEditMode = false, combinationRestored },
  setOpen,
}) => {
  const { data: user } = useAuth();

  const { changeConfigurationAsync } = useGeneratorSet();

  const {
    combination,
    dispatch,
    onSave,
    onEdit,
    isDirty,
    isAdded,
    workArrangements,
    handleResetConfiguration,
  } = useGeneratorSetCombination({
    generatorSet,
    changeConfigurationAsync,
  });

  React.useEffect(() => {
    if (isEditMode) {
      dispatch({
        type: ACTIONS.SET_COMBINATION,
        combination: combinationRestored,
      });
    }
  }, [combinationRestored, dispatch, isEditMode]);

  const { originalPrice, finalPrice } = evalPrices(
    combination,
    combination.sMercadoNombre
  );

  const { getModalState, openModal, setIsOpen } = useModal();

  const { currency, evalTypeChange } = useExchange();

  const [visible, setVisible] = React.useState(false);

  return (
    <Card
      className={cn(
        "md:w-25rem rounded-2xl shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl",
        isAdded && !isEditMode
          ? "border-[1px] border-green-500 border-dashed bg-gradient-to-br from-green-50/50 to-white"
          : "border border-gray-200/60 bg-white/80",
        isEditMode && "border-none shadow-none hover:shadow-none",
        className
      )}
      title={
        <div className="flex justify-between items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-md text-black">
              {generatorSet.sModNombre}
            </span>
            <section className="text-gray-500 text-xs">
              {combination?.sTipoFabricacion &&
              combination.sTipoFabricacion === "MODASA" ? (
                <img
                  src={modasaLogo}
                  alt="Logo de MODASA"
                  className="inline-block w-14 h-3 mr-1"
                />
              ) : (
                <img
                  src={chinaFlag}
                  alt="Bandera de China"
                  className="inline-block w-4 h-3 mr-1 rounded-sm"
                />
              )}
            </section>
          </div>
          {isEditMode && (
            <div className="flex items-center bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">
              <Package className="w-3 h-3 mr-1" />
              <span className="text-xs font-medium">
                ×{combination.nIntCantidad}
              </span>
            </div>
          )}
        </div>
      }
      subTitle={
        <section className="flex flex-col space-y-4">
          {/* Motor & ITM info */}
          <div className="grid grid-cols-12 gap-6">
            {/* Motor */}
            <div className="flex flex-col col-span-4">
              <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Motor
              </h4>
              <p className="mt-1 text-xs font-semibold text-gray-900 flex items-center gap-1">
                <PiEngine />
                {generatorSet.sMotMarcaVisual} {generatorSet.sMotModelo}
              </p>
            </div>
            <section className="flex items-center justify-between col-span-8 border-l-[2px] pl-4 border-dotted">
              {/* Kit ITM (Amperios) */}
              <div className="flex flex-col h-full">
                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  ITM
                </h4>
                <section className="flex flex-col mt-1 text-xs font-semibold text-gray-900 gap-1">
                  <div className="flex gap-1">
                    <Microchip className="mr-1" width={14} height={14} />
                    <p>KIT - 3X{combination.nIntITMA}</p>
                  </div>
                  {combination.configuration?.itm?.isPresent && (
                    <ITMConfigurationBadget
                      itmId={combination.configuration?.itm?.itmSwappedId}
                      onRemove={async () => {
                        if (isAdded && !isEditMode) return;
                        await handleResetConfiguration("itm");
                      }}
                    />
                  )}
                </section>
              </div>
              {/* Peso de la combinación de GE */}
              {/* <div className="flex flex-col h-full">
                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Peso
                </h4>
                <p className="mt-1 text-xs font-semibold text-gray-900 flex items-center gap-1">
                  <Weight className="mr-1" width={14} height={14} />
                  {combination.nIntPesoTotalKg} Kg
                </p>
              </div> */}
              {/* Corriente de la combinación de GE */}
              <div className="flex flex-col h-full ml-1">
                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Corriente M.
                </h4>
                <section className="flex items-center gap-2 text-xs font-semibold text-gray-900">
                  <TbNavigationBolt className="mr-1" />

                  <p className="mt-1 text-xs font-semibold text-gray-900 flex items-center gap-1">
                    {combination?.CorrienteStandByA != null &&
                    !isNaN(Number(combination.CorrienteStandByA))
                      ? Number(combination.CorrienteStandByA)
                      : "--"}{" "}
                    A
                  </p>
                </section>
              </div>
            </section>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {/* Potencia Prime */}
            <div className="flex items-center bg-gray-100 text-gray-700 px-2 py-1 rounded-lg shadow-sm flex-1 min-w-[140px] md:min-w-0 md:flex-[0.8] min-h-[50px]">
              {/* <Zap className="w-4 h-4 mr-2 text-blue-500" /> */}
              <div className="text-xs">
                <div className="font-semibold">Prime</div>
                <div>
                  {Number(combination.PrimeKW).toFixed(1)}{" "}
                  {site.powerUnits.kilowatt} /{" "}
                  {Number(combination.PrimeKVA).toFixed(1)}{" "}
                  {site.powerUnits.kilovoltAmpere}
                </div>
              </div>
            </div>

            {/* Potencia StandBy */}
            <div className="flex items-center bg-gray-100 text-gray-700 px-2 py-1 rounded-lg shadow-sm flex-1 min-w-[140px] md:min-w-0 md:flex-[0.8] min-h-[50px]">
              {/* <BatteryCharging className="w-4 h-4 mr-2 text-green-500" /> */}
              <div className="text-xs">
                <div className="font-semibold">Standby</div>
                <div>
                  {Number(combination.StandByKW).toFixed(1)}{" "}
                  {site.powerUnits.kilowatt} /{" "}
                  {Number(combination.StandByKVA).toFixed(1)}{" "}
                  {site.powerUnits.kilovoltAmpere}
                </div>
              </div>
            </div>

            {/* Tipo de Trabajo */}
            <FormSelectText
              placeholder="Seleccione una opción"
              parentClassName="flex-1 min-w-[140px] md:min-w-0 md:flex-[1.4]"
              options={workArrangements}
              value={combination.sRegimen || null}
              onChange={(e) => {
                dispatch({
                  type: ACTIONS.SET_WORK_ARRANGEMENT,
                  workArrangement: e.target.value,
                });
              }}
              filter={true}
              disabled={isAdded && !isEditMode}
            />
          </div>
        </section>
      }
      footer={
        <section className="flex flex-col space-y-3">
          <section
            className={`flex ${
              combination?.nIntDescuentoPorcentaje > 0 ||
              combination?.nIntMargenExportacionPorcentaje > 0
                ? "justify-between"
                : "justify-end"
            } p-3 rounded-lg`}
          >
            {combination?.nIntMargenExportacionPorcentaje > 0 && (
              <div className="flex flex-col">
                <span className="text-sm text-gray-600 font-semibold">
                  PRECIO ORIGINAL
                </span>
                <span className="text-2xl text-black font-bold line-through">
                  {currency.code}
                  {evalTypeChange(originalPrice)}
                </span>
              </div>
            )}
            {combination?.nIntDescuentoPorcentaje > 0 && (
              <div className="flex flex-col">
                <span className="text-sm text-gray-600 font-semibold">
                  PRECIO ORIGINAL
                </span>
                <span className="text-2xl text-black font-bold line-through">
                  {currency.code}
                  {evalTypeChange(originalPrice)}
                </span>
              </div>
            )}
            <div className="flex flex-col items-end">
              <section className="flex gap-2">
                <span className="text-sm text-gray-600 font-semibold">
                  {combination.sMercadoNombre === "NACIONAL" && (
                    <div>
                      {combination?.nIntDescuentoPorcentaje > 0
                        ? `PRECIO FINAL (${combination.nIntDescuentoPorcentaje}% dcto.)`
                        : "PRECIO FINAL"}
                    </div>
                  )}
                  {combination.sMercadoNombre === "EXPORTACIÓN" && (
                    <div>
                      {combination?.nIntMargenExportacionPorcentaje > 0
                        ? `PRECIO FINAL (+${combination.nIntMargenExportacionPorcentaje}% margen)`
                        : "PRECIO FINAL"}
                    </div>
                  )}
                </span>

                <div className="card flex justify-content-center">
                  <Sidebar
                    visible={visible}
                    onHide={() => setVisible(false)}
                    position="right"
                  >
                    <GeneratorSerCombinationPriceSectionInfo
                      combination={combination}
                      currency={currency}
                      evalTypeChange={evalTypeChange}
                    />
                  </Sidebar>
                  {user?.role === Roles.ING_VENTAS && (
                    <BadgeInfo
                      className="w-5 h-5 cursor-pointer"
                      type="button"
                      onClick={() => {
                        setVisible(true);
                      }}
                    />
                  )}
                </div>

                <section className=""></section>
              </section>
              <span className="text-2xl font-bold text-black flex gap-1 items-center">
                <span>{currency.code}</span>
                <span>{evalTypeChange(finalPrice)}</span>
              </span>
            </div>
          </section>
          <section className="flex flex-col space-y-2">
            <Button
              variant={isAdded || isEditMode ? "tertiary" : "primary"}
              onClick={(e) => {
                e?.preventDefault();
                if (isEditMode) {
                  onEdit();
                  setOpen(false);
                } else {
                  onSave();
                }
              }}
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
              <span className="text-sm text-gray-600">
                Cambios no guardados
              </span>
            )}
            {!isEditMode && originalPrice === 0.0 && (
              <span className="text-sm text-red-600 bg-red-50 p-2 rounded-lg">
                El precio final no puede ser 0.00. Por favor, consultar los
                preciós en el catálogo.
              </span>
            )}
          </section>
        </section>
      }
    >
      <div className="flex flex-col gap-3">
        <section className="space-y-2 min-h-24">
          {/* Alternadores */}
          <section className="flex flex-col md:flex-row items-center justify-between gap-3">
            <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Alternadores
            </span>
            <Button
              className={`text-xs flex justify-center items-center md:w-fit px-4 py-2 rounded-2xl border border-gray-200 hover:border-gray-300 transition-colors duration-200 ease-in-out`}
              variant={"secondary"}
              disabled={isAdded && !isEditMode}
              onClick={() => {
                openModal("ALTERNATORS_MODAL");
              }}
            >
              <TowerControlIcon strokeWidth={1.25} className="mr-1 w-3 h-3" />{" "}
              Alternadores
            </Button>
          </section>
          <div
            className={
              "space-y-2 " +
              (isAdded || isEditMode ? "parent active" : "parent")
            }
          >
            {generatorSet.combinations
              .map((c) => {
                return {
                  id: c.Alternador_Id,
                  label: `${c.sAltMarca} ${c.sAltModelo}`,
                };
              })
              .map((item) => (
                <section key={item.id} className="flex items-center gap-2">
                  <RadioText
                    value={item.id}
                    label={item.label}
                    disabled={isAdded && !isEditMode}
                    checked={
                      combination.Alternador_Id === item.id &&
                      !combination.configuration?.alternator
                        ?.alternatorSwappedId
                    }
                    className={
                      isAdded && !isEditMode ? "cursor-not-allowed" : ""
                    }
                    onChange={() =>
                      dispatch({
                        type: ACTIONS.SWITCH_ALTERNATOR,
                        alternatorId: item.id,
                      })
                    }
                  />
                  {combination.configuration?.alternator?.alternatorBaseId &&
                    item.id ===
                      combination.configuration?.alternator
                        ?.alternatorBaseId && (
                      <div>
                        <span className="bg-orange-500 text-white text-[8px] px-1.5 py-1 rounded-md font-bold uppercase tracking-wider">
                          BASE
                        </span>
                      </div>
                    )}
                </section>
              ))}
          </div>
          {combination.configuration?.alternator?.alternatorSwappedId !==
            null && (
            <AlternatorBadget
              alternatorId={
                combination.configuration?.alternator?.alternatorSwappedId
              }
              onRemove={async () => {
                if (isAdded && !isEditMode) return;

                await handleResetConfiguration("alternator");
              }}
            />
          )}

          {/* Silenciador */}
          <div className="flex items-center gap-2 mt-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={combination.nIntSileciadorTipo === 2}
                onChange={(e) => {
                  dispatch({
                    type: ACTIONS.SWITCH_SILENCER,
                  });
                }}
                disabled={isAdded || !combination.nIntSileciadorPermiteCambio}
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
              Silenciador {combination.sIntSileciadorTipo || "Industrial"}
            </span>
          </div>
        </section>
        <section className="flex flex-col md:flex-row items-center justify-between gap-3 mb-3">
          <Button
            className={`text-xs flex justify-center items-center md:w-fit px-4 py-2 rounded-2xl border border-gray-200 hover:border-gray-300 transition-colors duration-200 ease-in-out md:h-[40px]`}
            variant={"secondary"}
            disabled={isAdded && !isEditMode}
            onClick={() => {
              openModal("ITMS_MODAL");
            }}
          >
            <Microchip strokeWidth={1.25} className="mr-1 w-3 h-3" /> ITM
          </Button>
          <Button
            className={`text-xs flex justify-center items-center md:w-fit px-4 py-2 rounded-2xl border border-gray-200 hover:border-gray-300 transition-colors duration-200 ease-in-out md:h-[40px]`}
            variant={"secondary"}
            disabled={isAdded && !isEditMode}
            onClick={() => {
              openModal("OTHER_COMPONENTS_MODAL");
            }}
          >
            <Plus strokeWidth={1.25} className="mr-1 w-3 h-3" /> Accesorios
          </Button>
        </section>
      </div>

      {/* Summary of accesories */}
      {combination.accessories?.length > 0 && (
        <section className="space-y-2 p-2 rounded-lg border border-gray-200 border-dashed">
          <span className="text-black font-medium p-3">
            Accesorios agregados
          </span>
          <div className="p-3 rounded-lg space-y-2">
            {combination.accessories?.map((accessory, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-xs text-gray-600">
                  {accessory.name} {accessory?.description}
                </span>
                <span className="text-sm font-medium flex items-center gap-1">
                  <span>{currency.code}</span>
                  <span>{evalTypeChange(accessory.price)}</span>
                </span>
              </div>
            ))}
            <div className="pt-2 border-t-[0.5px] border-gray-950">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-black">Total</span>
                <span className="text-sm font-bold text-primary text-black flex items-center gap-1">
                  <span>{currency.code}</span>
                  <span>
                    {evalTypeChange(
                      combination.accessories?.reduce(
                        (acc, item) => acc + item.price,
                        0
                      )
                    )}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Discount and delivery dais */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <section className="flex flex-col gap-3">
          {/* Descuento (Solo mercado NACIONAL) */}
          {combination.sMercadoNombre === "NACIONAL" && (
            <section className="relative">
              <label className="uppercase font-medium text-sm">DESCUENTO</label>
              <InputNumber
                label="DESCUENTO"
                value={combination.nIntDescuentoPorcentaje}
                min={0}
                max={99.99}
                disabled={isAdded && !isEditMode}
                placeholder="Ing. el descuento"
                className="w-full"
                inputClassName="rounded-lg w-full"
                onChange={(e) => {
                  let discount = e.value;

                  if (discount > 99.99) {
                    discount = 99.99;
                  }

                  dispatch({
                    type: ACTIONS.APPLY_DISCOUNT,
                    discount,
                  });
                }}
              />
              <span className="absolute right-8 top-[45%] translate-y-[1] text-gray-500">
                %
              </span>
            </section>
          )}

          {/* Margen (Solo mercado EXPORTACIÓN) */}
          {combination.sMercadoNombre === "EXPORTACIÓN" && (
            <section className="relative">
              <label className="uppercase font-medium text-sm">MARGEN</label>
              <InputNumber
                label="MARGEN"
                value={combination.nIntMargenExportacionPorcentaje}
                min={0}
                max={99.99}
                disabled={isAdded && !isEditMode}
                placeholder="Ing. el margen"
                className="w-full"
                inputClassName="rounded-lg w-full"
                onChange={(e) => {
                  let margin = e.value;

                  if (margin > 99.99) {
                    margin = 99.99;
                  }

                  dispatch({
                    type: ACTIONS.APPLY_MARGIN,
                    margin,
                  });
                }}
              />
              <span className="absolute right-8 top-[45%] translate-y-[1] text-gray-500">
                %
              </span>
            </section>
          )}

          <section className="flex gap-2 text-sm w-fit md:w-full">
            <Button
              variant="tertiary"
              disabled={isAdded && !isEditMode}
              className={cn(
                "bg-white lg:w-fit rounded-[8px] px-[10px] py-1 text-sm shadow-sm hover:bg-[#e9e7f5] hover:scale-105 duration-500 ease-in-out transition-transform text-[#7e6fd3] md:text-[#7e6fd3] border-[1px] border-[#9184dc] h-[28px]",
                combination.nIntDescuentoPorcentaje === 30
                  ? "border-solid"
                  : "border-dashed"
              )}
              style={{ color: "#7e6fd3" }}
              onClick={() =>
                combination.sMercadoNombre === "EXPORTACIÓN"
                  ? dispatch({ type: ACTIONS.APPLY_MARGIN, margin: 30 })
                  : dispatch({ type: ACTIONS.APPLY_DISCOUNT, discount: 30 })
              }
            >
              <span>30%</span>
            </Button>
            <Button
              variant="tertiary"
              disabled={isAdded && !isEditMode}
              className={cn(
                "bg-white lg:w-fit rounded-[8px] px-[10px] py-1 text-sm shadow-sm hover:bg-[#e9e7f5] hover:scale-105 duration-500 ease-in-out transition-transform text-[#7e6fd3] md:text-[#7e6fd3] border-[1px] border-[#9184dc] h-[28px]",
                combination.nIntDescuentoPorcentaje === 35
                  ? "border-solid"
                  : "border-dashed"
              )}
              style={{ color: "#7e6fd3" }}
              onClick={() =>
                combination.sMercadoNombre === "EXPORTACIÓN"
                  ? dispatch({ type: ACTIONS.APPLY_MARGIN, margin: 35 })
                  : dispatch({ type: ACTIONS.APPLY_DISCOUNT, discount: 35 })
              }
            >
              <span>35%</span>
            </Button>
            <Button
              variant="tertiary"
              disabled={isAdded && !isEditMode}
              className={cn(
                "bg-white lg:w-fit rounded-[8px] px-[10px] py-1 text-sm shadow-sm hover:bg-[#e9e7f5] hover:scale-105 duration-500 ease-in-out transition-transform text-[#7e6fd3] md:text-[#7e6fd3] border-[1px] border-[#9184dc] h-[28px]",
                combination.nIntDescuentoPorcentaje === 40
                  ? "border-solid"
                  : "border-dashed"
              )}
              style={{ color: "#7e6fd3" }}
              onClick={() =>
                combination.sMercadoNombre === "EXPORTACIÓN"
                  ? dispatch({ type: ACTIONS.APPLY_MARGIN, margin: 40 })
                  : dispatch({ type: ACTIONS.APPLY_DISCOUNT, discount: 40 })
              }
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
            value={combination.nIntDiasParaEntrega}
            inputClassName="rounded-lg w-full"
            onChange={(e) => {
              dispatch({
                type: ACTIONS.SET_DELIVERY_DAYS,
                days: e.value,
              });
            }}
          />
          <span className="absolute right-8 top-[45%] md:top-[25%] translate-y-1 text-gray-500">
            Días
          </span>
        </section>
      </section>

      {/* Shipping and Startup Costs */}
      <section className="space-y-1 mt-3 w-full">
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
                      checked={
                        combination.operativeCosts.shipping.isPresent || false
                      }
                      onChange={(e) =>
                        dispatch({
                          type: ACTIONS.SWITCH_OPERATIVE_COSTS_SHIPPING,
                        })
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

            {combination.operativeCosts.shipping.isPresent && (
              <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                <label className="text-xs font-medium text-gray-600 uppercase">
                  Precio de Envío
                </label>
                <div className="relative">
                  <InputNumber
                    value={combination.operativeCosts.shipping.amount || 0}
                    min={0}
                    disabled={isAdded && !isEditMode}
                    placeholder="Ingrese el precio de envío"
                    className="w-full"
                    inputClassName="rounded-lg w-full pl-8"
                    onChange={(e) =>
                      dispatch({
                        type: ACTIONS.SET_OPERATIVE_COSTS_SHIPPING,
                        amount: e.value || 0,
                      })
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
          {combination.sMercadoNombre === "NACIONAL" && (
            <div className=" py-2 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={
                          combination.operativeCosts.startup.isPresent || false
                        }
                        onChange={(e) =>
                          dispatch({
                            type: ACTIONS.SWITCH_OPERATIVE_COSTS_STARTUP,
                          })
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
                    <span className="text-sm font-medium text-gray-700 flex gap-2 items-center line-clamp-1 text-nowrap">
                      <Wrench className="w-4 h-4 text-blue-600" /> P. en Marcha
                    </span>
                  </div>
                </div>
              </div>

              {combination.operativeCosts.startup.isPresent && (
                <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                  <label className="text-xs font-medium text-gray-600 uppercase">
                    Precio de P. en Marcha
                  </label>
                  <div className="relative">
                    <InputNumber
                      value={combination.operativeCosts.startup.amount || 0}
                      min={0}
                      disabled={isAdded && !isEditMode}
                      placeholder="Ingrese el precio de puesta en marcha"
                      className="w-full"
                      inputClassName="rounded-lg w-full pl-8"
                      onChange={(e) =>
                        dispatch({
                          type: ACTIONS.SET_OPERATIVE_COSTS_STARTUP,
                          amount: e.value || 0,
                        })
                      }
                    />
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                      {currency.symbol}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </section>

      <AccessoriesGeneratorSetModal
        open={getModalState("OTHER_COMPONENTS_MODAL")}
        setOpen={(open) => {
          setIsOpen("OTHER_COMPONENTS_MODAL", open);
        }}
        components={combination.accessories}
        addComponent={(accessory) => {
          dispatch({
            type: ACTIONS.ADD_ACCESSORY,
            accessory: accessory,
          });
        }}
        removeComponent={(accessory) => {
          dispatch({
            type: ACTIONS.REMOVE_ACCESSORY,
            accessoryId: accessory.id,
          });
        }}
        clearAll={() => {}}
        integradoraId={combination.IntegradoraId}
      />
      <AlternatorsModal
        open={getModalState("ALTERNATORS_MODAL")}
        setOpen={(open) => {
          setIsOpen("ALTERNATORS_MODAL", open);
        }}
        integradoraId={combination?.IntegradoraId}
        setAlternator={async (alternator) => {
          const alternatorBaseId = combination.Alternador_Id;

          const params = {
            modelo: combination.sModNombre,
            voltaje: combination.nIntVoltaje,
            frecuencia: combination.nIntFrecuencia,
            fases: combination.nIntFases,
            factorPotencia: combination.nIntFP,
            altura: combination.nIntAltura,
            temperatura: combination.nIntTemperatura,
            insonoro: combination.nIntInsonoro,
            powerThreshold: 20,
            primePower: "Todos",
            standbyPower: "Todos",
            marketId: combination.MercadoId,
          };

          const alternatorId = alternator.Alternador_Id;
          const integradoraId = combination.IntegradoraId;

          const combinationSwappedResponse = await changeConfigurationAsync({
            params,
            configuration: {
              alternatorId,
              itmId: combination.nITMId,
            },
            integradoraId,
          });

          const combinationSwapped = combinationSwappedResponse.combination;

          dispatch({
            type: ACTIONS.CHANGE_CONFIGURATION,
            component: "alternator",
            configuration: {
              combination: combinationSwapped,
              alternatorBaseId: alternatorBaseId,
              alternatorSwappedId: alternatorId,
            },
          });
        }}
      />
      <ITMModal
        open={getModalState("ITMS_MODAL")}
        setOpen={(open) => {
          setIsOpen("ITMS_MODAL", open);
        }}
        integradoraId={combination?.IntegradoraId}
        setITM={async (itm) => {
          const itmBaseId = combination.nITMId;

          const params = {
            modelo: combination.sModNombre,
            voltaje: combination.nIntVoltaje,
            frecuencia: combination.nIntFrecuencia,
            fases: combination.nIntFases,
            factorPotencia: combination.nIntFP,
            altura: combination.nIntAltura,
            temperatura: combination.nIntTemperatura,
            insonoro: combination.nIntInsonoro,
            powerThreshold: 20,
            primePower: "Todos",
            standbyPower: "Todos",
            marketId: combination.MercadoId,
          };

          const itmId = itm.nITMId;
          const integradoraId = combination.IntegradoraId;

          const combinationSwappedResponse = await changeConfigurationAsync({
            params,
            configuration: {
              alternatorId: combination.Alternador_Id,
              itmId: itmId,
            },
            integradoraId,
          });
          const combinationSwapped = combinationSwappedResponse.combination;

          dispatch({
            type: ACTIONS.CHANGE_CONFIGURATION,
            component: "itm",
            configuration: {
              combination: combinationSwapped,
              itmBaseId: itmBaseId,
              itmSwappedId: itmId,
            },
          });
        }}
      />
    </Card>
  );
};
