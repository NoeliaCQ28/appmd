import { FormSelectText } from "@components/custom/selects/FormSelectText";
import { Globe, LayoutGrid, List, Loader2 } from "lucide-react";
import { Paginator } from "primereact/paginator";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { InputSearch } from "../../../../components/custom/inputs/InputSearch";
import { PowerSearch } from "../../../../components/grupos-electrogenos/PowerSearch";
import { PowerSearchSlider } from "../../../../components/grupos-electrogenos/PowerSearchSlider";
import { FormSkeletonInput } from "../../../../components/skeletons/FormSkeletonInput";
import { TableCounter } from "../../../../components/TableCounter";
import { getFilas } from "../../../../utils/utils";
import useModelsSearch from "../../../catalagos/grupos_electrogenos/hooks/useModelsSearch";
import { useElectrogenosFormData } from "../../cotizaciones/hooks/useElectrogenosFormData";
import { useParametros } from "../../cotizaciones/hooks/useParametros";
import { useFichas } from "../hooks/useFichas";
import { CardModels } from "./CardModels";
import LanguageSwitch from "../../../../components/LanguageSwitch";
import { useTranslation } from "react-i18next";
import { currentLanguage } from "../../../../libs/i18n";
import { convertTemperature } from "../../../../utils/unitConversion";

export const SearchFichas = () => {
  const initialValues = {
    modelo: "Todos",
    motorBrandPriceList: "Todos",
    motorBrand: "Todos",
    voltaje: 220,
    frecuencia: 60,
    fases: 3,
    potencia: 0.8,
    altura: 100,
    temperatura: 25,
    powerThreshold: 0.2, // 20% +-
    unity: "kw",
    primePower: "Todos",
    standbyPower: "Todos",
    emisionStandard: "Todos",
    isMotorBrandUL: 2, // 0 = no UL | 1 = UL | 2 = Todos
    powerRange: { regime: "STANDBY", range: { min: 0, max: 0, isAll: true } },
  };

  const { pathname } = useLocation();
  const isFichaRoute = pathname === "/fichas" || pathname === "/fichas/";

  const {
    modelsName,
    motorBrands,
    isLoading: {
      models: isLoadingModelsName,
      motorBrands: isLoadingMotorBrands,
    },
  } = useModelsSearch();

  const [viewType, setViewType] = useState("grid");
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(8); //Muestre 8 por default
  const [isFilterOpen, setIsFilterOpen] = useState(true);

  const { formData, onHandleChange, resetFormData, onReset } = useElectrogenosFormData(initialValues);
  const { data } = useParametros();

  React.useEffect(() => {
    if (isFichaRoute) {
      onHandleChange("isMotorBrandUL", 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    technicalReports,
    findTechnicalReports,
    isPendingFindTechnicalReports,
  } = useFichas({ environment: isFichaRoute ? "PUBLIC" : "INTERNAL" });

  const modelos = React.useMemo(
    () => technicalReports?.generatorSets || [],
    [technicalReports?.generatorSets]
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [checkedKVA, setCheckedKVA] = React.useState(false);

  // Estado para rastrear si la búsqueda inicial fue acotada con el slider
  const [initialSearchPowerRange, setInitialSearchPowerRange] =
    React.useState(null);

  // Filtrar modelos por búsqueda de texto y rango de potencia
  const modelosFiltered = React.useMemo(() => {
    // Filtro por búsqueda de texto
    let filtered = modelos.filter(
      (model) =>
        model.ModeloGE?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.Motor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.Alternador?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Filtro por rango de potencia (si no está en "isAll")
    const { regime, range } = formData.powerRange || {};
    if (
      range &&
      !range.isAll &&
      range.min !== undefined &&
      range.max !== undefined
    ) {
      filtered = filtered.filter((model) => {
        // Determinar el campo de potencia según el régimen
        const powerField = regime === "PRIME" ? "PrimeKW" : "StandByKW";
        const modelPower = Number(model[powerField]) || 0;

        // Comparar según la unidad seleccionada
        const modelPowerInSelectedUnit = checkedKVA
          ? modelPower / Number(formData.potencia || 0.8) // Convertir a KVA
          : modelPower; // Ya está en KW

        return (
          modelPowerInSelectedUnit >= range.min &&
          modelPowerInSelectedUnit <= range.max
        );
      });
    }

    return filtered.sort((a, b) => a.StandByKW - b.StandByKW);
  }, [searchTerm, modelos, formData.powerRange, formData.potencia, checkedKVA]);

  const paginatedModelos = modelosFiltered.slice(first, first + rows);

  const toggleViewType = (type) => {
    setViewType(type);
  };

  const onPageChange = (e) => {
    setFirst(e.first);
    setRows(e.rows);
  };

  const { i18n, t } = useTranslation();
  const { code: currentLanguageCode } = currentLanguage(i18n);

  return (
    <div className="flex flex-col p-2 md:px-4 md:py-4">
      <div
        className={
          isFichaRoute ? "flex flex-col lg:flex-row gap-4" : "space-y-7"
        }
      >
        {/* Sidebar de filtros para /fichas */}
        {isFichaRoute && (
          <aside className="w-full lg:w-80 bg-[#FFFFFF] rounded-md p-4 space-y-4 h-fit lg:sticky lg:top-4 order-1">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-md transition-colors"
                  aria-label="Toggle filters"
                >
                  {isFilterOpen ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  )}
                </button>
                <h2 className="text-lg font-semibold text-gray-800">
                  {t("technical_report.filters")}
                </h2>
              </div>
              <LanguageSwitch />
            </div>

            {/* Filtros en columna */}
            <div
              className={`space-y-4 ${isFilterOpen ? "block" : "hidden lg:block"
                }`}
            >
              {/* UL Certification Checkbox Group */}
              <div className="space-y-2">
                {/* <label className="text-sm font-medium text-gray-700">
                  {t("technical_report.ul_certification")}
                </label> */}
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isMotorBrandUL === 1}
                      onChange={(e) => {
                        onHandleChange(
                          "isMotorBrandUL",
                          e.target.checked ? 1 : 2
                        );
                      }}
                      className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700">
                      {t("technical_report.ul")}
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isMotorBrandUL === 0}
                      onChange={(e) => {
                        onHandleChange(
                          "isMotorBrandUL",
                          e.target.checked ? 0 : 2
                        );
                      }}
                      className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700">
                      {t("technical_report.no_ul")}
                    </span>
                  </label>
                </div>
              </div>
              <FormSelectText
                label={t("technical_report.emission_standards")}
                placeholder={t(
                  "technical_report.placeholder.emission_standards"
                )}
                parentClassName="w-full"
                options={[
                  { label: t("common.all"), value: "Todos" },
                  { label: "EPA", value: "EPA" },
                  { label: "EPA Tier 2", value: "EPA Tier 2" },
                  { label: "EPA Tier 3", value: "EPA Tier 3" },
                  { label: "EPA Tier 4", value: "EPA Tier 4" },
                  { label: "EPA Tier 4 interim", value: "EPA Tier 4 interim" },
                  { label: "EPA Tier 4-Final", value: "EPA Tier 4-Final" },
                ]}
                value={formData.emisionStandard}
                onChange={(e) => {
                  onHandleChange("emisionStandard", e.target.value);
                }}
                filter={true}
              />
              {isLoadingMotorBrands ? (
                <FormSkeletonInput label={t("technical_report.engine_brand")} />
              ) : (
                motorBrands &&
                motorBrands.length > 0 && (
                  <FormSelectText
                    label={t("technical_report.engine_brand")}
                    placeholder={t("technical_report.placeholder.engine_brand")}
                    parentClassName="w-full"
                    options={[
                      { label: t("common.all"), value: "Todos" },
                      ...motorBrands
                        .map((motorBrand) => {
                          return {
                            label: `${motorBrand.sMotMarcaVisual}`,
                            value: motorBrand.sMotMarcaVisual,
                          };
                        })
                        // Unicos
                        .filter(
                          (motorBrand, index, self) =>
                            index ===
                            self.findIndex((b) => b.value === motorBrand.value)
                        )
                        .sort((a, b) => a.label.localeCompare(b.label)),
                    ]}
                    value={formData.motorBrand}
                    onChange={(e) => {
                      onHandleChange("motorBrand", e.target.value);
                    }}
                    editable
                    filter={true}
                  />
                )
              )}

              <FormSelectText
                label={t("technical_report.voltage")}
                options={data?.voltajes
                  .sort((a, b) => a.nIntVoltaje - b.nIntVoltaje)
                  .map((voltaje) => ({
                    label: `${voltaje.nIntVoltaje} V`,
                    value: voltaje.nIntVoltaje,
                  }))}
                placeholder={"Seleccione voltaje"}
                value={formData.voltaje}
                onChange={(e) => onHandleChange("voltaje", e.value)}
                filter={true}
              />

              <FormSelectText
                label={t("technical_report.frequency")}
                options={data?.frecuencias
                  .sort((a, b) => a.nIntFrecuencia - b.nIntFrecuencia)
                  .map((frecuencia) => ({
                    label: `${frecuencia.nIntFrecuencia} Hz`,
                    value: frecuencia.nIntFrecuencia,
                  }))}
                placeholder={"Seleccione frecuencia"}
                value={formData.frecuencia}
                onChange={(e) => onHandleChange("frecuencia", e.value)}
              />

              <FormSelectText
                label={t("technical_report.phases")}
                options={data?.fases
                  .sort((a, b) => a.nIntFases - b.nIntFases)
                  .map((fase) => ({
                    label: `${fase.nIntFases} ${t("technical_report.phases")} ${fase.nIntFases === 1
                      ? `(${t("technical_report.single_phase")})`
                      : `(${t("technical_report.three_phase")})`
                      }`,
                    value: fase.nIntFases,
                  }))}
                value={formData.fases}
                onChange={(e) => {
                  const phases = Number(e.value);
                  onHandleChange("fases", phases);
                  const power = phases === 1 ? 1 : 0.8;
                  onHandleChange("potencia", power);
                }}
                placeholder={"Seleccione fases"}
              />
              {/* 
              <FormSelectText
                label={t("technical_report.power_factor")}
                options={data?.factorPotencias?.map((fp) => Number(fp.nIntFP))}
                value={
                  formData.potencia != null ? Number(formData.potencia) : null
                }
                onChange={(e) => {
                  onHandleChange("potencia", e.value);
                }}
                placeholder={"Seleccione factor de potencia"}
              /> */}

              {/* Búsqueda por potencias con Slider */}
              <div className="w-full">
                <PowerSearchSlider
                  onPowerChange={(powerData) => {
                    // powerData = { regimen, rango: { min, max, isAll } }
                    onHandleChange("powerRange", powerData);
                  }}
                  checkedKVA={checkedKVA}
                  setCheckedKVA={(value) => {
                    setCheckedKVA(value);
                    onHandleChange("unity", value ? "kva" : "kw");
                  }}
                  onReset={onReset}
                />

                {/* Nota informativa si la búsqueda fue acotada */}
                {initialSearchPowerRange &&
                  !initialSearchPowerRange.isAll &&
                  modelos.length > 0 && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <p className="text-xs text-blue-800">
                        <span className="font-semibold">
                          📌 {t("common.note")}:{" "}
                        </span>
                        {t("technical_report.filter_note_initial_range", {
                          regime: initialSearchPowerRange.regime,
                          min: initialSearchPowerRange.min,
                          max: initialSearchPowerRange.max,
                          unit: checkedKVA ? "KVA" : "KW",
                        })}
                      </p>
                    </div>
                  )}
              </div>

              <button
                onClick={() => resetFormData()}
                className="text-xs text-white font-semibold bg-blue-600 border border-blue-600 rounded-md px-2 py-1 mt-1 focus:outline-none hover:bg-blue-800 transition-colors duration-300"
              >
                {t("technical_report.reset")}
              </button>

              {/* Botón de búsqueda */}
              <button
                type="button"
                disabled={isPendingFindTechnicalReports}
                className={`bg-[#FF9F00] p-2 w-full rounded-[5px] font-semibold text-white text-md inline-flex items-center justify-center gap-2 ${isPendingFindTechnicalReports
                  ? "opacity-70 cursor-not-allowed"
                  : "cursor-pointer"
                  }`}
                onClick={() => {
                  // Resetear paginación al hacer nueva búsqueda
                  setFirst(0);

                  // Guardar el rango de potencia de cada busqueda
                  const powerRangeData = formData.powerRange || {};
                  setInitialSearchPowerRange({
                    regime: powerRangeData.regime || "STANDBY",
                    min: powerRangeData.range?.min ?? 0,
                    max: powerRangeData.range?.max ?? 1000,
                    isAll: powerRangeData.range?.isAll ?? true,
                  });

                  findTechnicalReports({
                    modelo: formData.modelo,
                    motorBrand: formData.motorBrand,
                    voltaje: formData.voltaje,
                    frecuencia: formData.frecuencia,
                    fases: formData.fases,
                    potencia: formData.potencia,
                    altura: formData.altura,
                    temperatura: formData.temperatura,
                    powerThreshold: formData.powerThreshold,
                    primePower:
                      formData.primePower === "Todos"
                        ? "Todos"
                        : checkedKVA
                          ? Number.parseFloat(formData.primePower) /
                          Number.parseFloat(formData.potencia)
                          : Number.parseFloat(formData.primePower),
                    standbyPower:
                      formData.standbyPower === "Todos"
                        ? "Todos"
                        : checkedKVA
                          ? Number.parseFloat(formData.standbyPower) /
                          Number.parseFloat(formData.potencia)
                          : Number.parseFloat(formData.standbyPower),
                    powerRange: formData.powerRange,
                    emisionStandard: formData.emisionStandard,
                    isMotorBrandUL: formData.isMotorBrandUL,
                    unity: formData.unity,
                  });
                }}
              >
                {isPendingFindTechnicalReports ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    <span>{t("technical_report.searching")}...</span>
                  </>
                ) : (
                  <span>{t("technical_report.search")}</span>
                )}
              </button>
            </div>
          </aside>
        )}

        {/* Layout original para otras rutas */}
        {!isFichaRoute && (
          <div className="space-y-7 bg-[#FFFFFF] p-3 sm:p-5 rounded-md ">
            <div className="flex items-center justify-center xs:justify-end sm:justify-end pr-0 sm:pr-4">
              <Link
                to="/fichas"
                target="_blank"
                className="inline-flex items-center gap-2 px-3 py-2 mr-2 text-sm font-medium text-orange-700 bg-orange-50 hover:bg-orange-100 rounded-md transition-colors duration-200"
                title="Ir a Fichas de la Web"
              >
                <Globe size={16} />
                <span className="hidden sm:inline">Fichas Web</span>
              </Link>
              <LanguageSwitch className="mr-2" />
              <div className="inline-flex items-center gap-1.5 rounded-md bg-gray-100/60 p-1">
                <button
                  type="button"
                  onClick={() => toggleViewType("list")}
                  className={`p-2.5 rounded-md transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/40 ${viewType === "list"
                    ? "bg-orange-100/80 text-orange-700"
                    : "text-gray-600 hover:bg-gray-200/60"
                    }`}
                  aria-label="Vista de lista"
                  aria-pressed={viewType === "list"}
                  title="Vista de lista"
                >
                  <List size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => toggleViewType("grid")}
                  className={`p-2.5 rounded-md transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/40 ${viewType === "grid"
                    ? "bg-orange-100/80 text-orange-700"
                    : "text-gray-600 hover:bg-gray-200/60"
                    }`}
                  aria-label="Vista de cuadrícula"
                  aria-pressed={viewType === "grid"}
                  title="Vista de cuadrícula"
                >
                  <LayoutGrid size={18} />
                </button>
              </div>
            </div>
            <div
              className={`min-w-0 grid ${!isFichaRoute
                ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
                : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
                } gap-4`}
            >
              {isLoadingModelsName ? (
                <FormSkeletonInput label="MODELO" />
              ) : (
                modelsName &&
                modelsName.length > 0 && (
                  <FormSelectText
                    label={t("technical_report.model")}
                    placeholder="Seleccione un Modelo"
                    parentClassName="w-full"
                    options={[
                      { label: t("common.all"), value: "Todos" },
                      ...modelsName.map((model) => {
                        return {
                          label: model.sModNombre,
                          value: model.sModNombre,
                        };
                      }),
                    ]}
                    value={formData.modelo}
                    onChange={(e) => {
                      onHandleChange("modelo", e.target.value);
                    }}
                    editable
                    filter={true}
                  />
                )
              )}
              {isLoadingMotorBrands ? (
                <FormSkeletonInput label={t("technical_report.engine_brand")} />
              ) : (
                motorBrands &&
                motorBrands.length > 0 && (
                  <FormSelectText
                    label={t("technical_report.engine_brand")}
                    placeholder={t("technical_report.placeholder.engine_brand")}
                    parentClassName="w-full"
                    options={[
                      { label: t("common.all"), value: "Todos" },
                      ...motorBrands
                        .map((motorBrand) => {
                          return {
                            label: `${motorBrand.sMotMarca}`,
                            value: motorBrand.sMotMarca,
                          };
                        })
                        .sort((a, b) => a.label.localeCompare(b.label)),
                    ]}
                    value={formData.motorBrandPriceList}
                    onChange={(e) => {
                      onHandleChange("motorBrandPriceList", e.target.value);
                    }}
                    editable
                    filter={true}
                  />
                )
              )}
              <FormSelectText
                label={t("technical_report.voltage")}
                options={data?.voltajes
                  .sort((a, b) => a.nIntVoltaje - b.nIntVoltaje)
                  .map((voltaje) => ({
                    label: `${voltaje.nIntVoltaje} V`,
                    value: voltaje.nIntVoltaje,
                  }))}
                placeholder={"Seleccione voltaje"}
                value={formData.voltaje}
                onChange={(e) => onHandleChange("voltaje", e.value)}
                filter={true}
              // icon='V'
              />
              <FormSelectText
                label={t("technical_report.frequency")}
                options={data?.frecuencias
                  .sort((a, b) => a.nIntFrecuencia - b.nIntFrecuencia)
                  .map((frecuencia) => ({
                    label: `${frecuencia.nIntFrecuencia} Hz`,
                    value: frecuencia.nIntFrecuencia,
                  }))}
                placeholder={"Seleccione frecuencia"}
                value={formData.frecuencia}
                onChange={(e) => onHandleChange("frecuencia", e.value)}
              // icon='Hz'
              />
              <FormSelectText
                label={t("technical_report.phases")}
                options={data?.fases
                  .sort((a, b) => a.nIntFases - b.nIntFases)
                  .map((fase) => ({
                    label: `${fase.nIntFases} ${t("technical_report.phases")} ${fase.nIntFases === 1
                      ? `(${t("technical_report.single_phase")})`
                      : `(${t("technical_report.three_phase")})`
                      }`,
                    value: fase.nIntFases,
                  }))}
                value={formData.fases}
                onChange={(e) => {
                  const phases = Number(e.value);
                  onHandleChange("fases", phases);
                  const power = phases === 1 ? 1 : 0.8;
                  onHandleChange("potencia", power);
                }}
                placeholder={"Seleccione fases"}
              />

              <FormSelectText
                label={t("technical_report.power_factor")}
                options={data?.factorPotencias?.map((fp) => Number(fp.nIntFP))}
                value={
                  formData.potencia != null ? Number(formData.potencia) : null
                }
                onChange={(e) => {
                  onHandleChange("potencia", e.value);
                }}
                placeholder={"Seleccione factor de potencia"}
              />
            </div>
            <div
              className={`grid ${!isFichaRoute
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2"
                } gap-4`}
            >
              {!isFichaRoute && (
                <>
                  <FormSelectText
                    label={t("technical_report.altitude")}
                    options={data?.alturas
                      .sort((a, b) => a.nIntAltura - b.nIntAltura)
                      .map((altura) => ({
                        label: `${altura.Altura} msnm`,
                        value: altura.Altura,
                      }))}
                    placeholder={"Seleccione altura"}
                    value={formData.altura}
                    onChange={(e) => onHandleChange("altura", e.value)}
                    filter={true}
                  />
                  <FormSelectText
                    label={t("technical_report.temperature")}
                    options={data?.temperaturas.map((temp) => ({
                      label: `${currentLanguageCode === "en"
                        ? convertTemperature(temp.Temperatura, "°C", "°F")
                        : temp.Temperatura
                        } ${t("units.temperature")}`,
                      value: temp.Temperatura,
                    }))}
                    value={formData.temperatura}
                    onChange={(e) => onHandleChange("temperatura", e.value)}
                    placeholder={"Seleccione temperatura"}
                  />
                </>
              )}
              {/* Busqueda por potencias */}
              <section className="col-span-1 sm:col-span-2">
                <PowerSearch
                  className={"md:col-span-2"}
                  powerFactor={Number.parseFloat(formData.potencia)}
                  averageDerate={0}
                  derateRange={technicalReports?.derateRange || null}
                  primePower={formData.primePower}
                  standbyPower={formData.standbyPower}
                  onChangePrimePower={(value) =>
                    onHandleChange("primePower", value)
                  }
                  onChangeStandbyPower={(value) =>
                    onHandleChange("standbyPower", value)
                  }
                  checkedKVA={checkedKVA}
                  setCheckedKVA={(value) => {
                    setCheckedKVA(value);
                    onHandleChange("unity", value ? "kva" : "kw");
                  }}
                />
              </section>
            </div>
            <div className="w-full flex justify-end items-center gap-3">
              <button
                type="button"
                disabled={isPendingFindTechnicalReports}
                className={`bg-[#FF9F00] p-2 w-full sm:w-auto sm:min-w-[12rem] max-w-full rounded-[5px] font-semibold text-white text-md inline-flex items-center justify-center gap-2 ${isPendingFindTechnicalReports
                  ? "opacity-70 cursor-not-allowed"
                  : "cursor-pointer"
                  }`}
                onClick={() => {
                  // Resetear paginación al hacer nueva búsqueda
                  setFirst(0);

                  findTechnicalReports({
                    modelo: formData.modelo,
                    motorBrandPriceList: formData.motorBrandPriceList,
                    voltaje: formData.voltaje,
                    frecuencia: formData.frecuencia,
                    fases: formData.fases,
                    potencia: formData.potencia,
                    altura: formData.altura,
                    temperatura: formData.temperatura,
                    powerThreshold: formData.powerThreshold,
                    primePower:
                      formData.primePower === "Todos"
                        ? "Todos"
                        : checkedKVA
                          ? Number.parseFloat(formData.primePower) /
                          Number.parseFloat(formData.potencia)
                          : Number.parseFloat(formData.primePower),
                    standbyPower:
                      formData.standbyPower === "Todos"
                        ? "Todos"
                        : checkedKVA
                          ? Number.parseFloat(formData.standbyPower) /
                          Number.parseFloat(formData.potencia)
                          : Number.parseFloat(formData.standbyPower),
                    powerRange: formData.powerRange,
                    emisionStandard: formData.emisionStandard,
                    isMotorBrandUL: formData.isMotorBrandUL,
                    unity: formData.unity,
                  });
                }}
              >
                {isPendingFindTechnicalReports ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    <span>{t("technical_report.searching")}...</span>
                  </>
                ) : (
                  <span>{t("technical_report.search")}</span>
                )}
              </button>
            </div>
          </div>
        )}
        {modelos.length > 0 ? (
          <div
            className={`bg-[#FFFFFF] rounded-md ${isFichaRoute ? "flex-1 order-2" : ""
              }`}
          >
            <section className="pt-4 px-3 sm:px-5 flex flex-col gap-3 sm:gap-4">

              <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <section className="relative w-full sm:w-auto sm:flex-1">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg
                      className="w-5 h-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </span>
                  <InputSearch
                    placeholder={t(
                      "technical_report.placeholder.search_tecnical_report"
                    )}
                    onSearch={setSearchTerm}
                  />
                </section>
                <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                  {isFichaRoute && (
                    <div className="inline-flex items-center gap-1.5 rounded-md bg-gray-100/60 p-1 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => toggleViewType("list")}
                        className={`p-2.5 rounded-md transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/40 ${viewType === "list"
                          ? "bg-orange-100/80 text-orange-700"
                          : "text-gray-600 hover:bg-gray-200/60"
                          }`}
                        aria-label="Vista de lista"
                        aria-pressed={viewType === "list"}
                        title="Vista de lista"
                      >
                        <List size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleViewType("grid")}
                        className={`p-2.5 rounded-md transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/40 ${viewType === "grid"
                          ? "bg-orange-100/80 text-orange-700"
                          : "text-gray-600 hover:bg-gray-200/60"
                          }`}
                        aria-label="Vista de cuadrícula"
                        aria-pressed={viewType === "grid"}
                        title="Vista de cuadrícula"
                      >
                        <LayoutGrid size={18} />
                      </button>
                    </div>
                  )}
                  <div className="">
                    <TableCounter
                      title={t("technical_report.technical_total_count")}
                      data={modelos}
                    />
                  </div>
                </div>
              </section>
            </section>
            <div
              className={`${viewType == "grid"
                ? `grid ${isFichaRoute
                  ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
                  : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
                } gap-4 sm:gap-6 p-3 sm:p-5 rounded-md`
                : "w-full flex flex-col gap-4 sm:gap-6 p-3 sm:p-5"
                } flex justify-center`}
            >
              <CardModels
                viewType={viewType}
                modelos={paginatedModelos}
                params={formData}
              />
            </div>
            <div className="px-3 sm:px-5 overflow-x-auto">
              <Paginator
                first={first}
                rows={rows}
                totalRecords={modelos.length}
                rowsPerPageOptions={getFilas(modelos)}
                onPageChange={onPageChange}
                className="min-w-[20rem] w-full sm:w-auto"
              />
            </div>
          </div>
        ) : (
          <section
            className={`bg-[#FFFFFF] rounded-md p-8 sm:p-12 flex flex-col items-center justify-center text-center ${isFichaRoute ? "flex-1 order-2" : ""
              }`}
          >
            <svg
              className="w-32 h-32 sm:w-40 sm:h-40 mb-6 text-orange-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
              {t("technical_report.search_technical_reports")}
            </h3>
            <p className="text-gray-600 max-w-md">
              {t("technical_report.use_filters_to_find")}
            </p>
          </section>
        )}
      </div>
    </div>
  );
};
