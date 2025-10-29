import { useTranslation } from "react-i18next";
import { safeString } from "../../../../utils/utils";
import { DatosItems } from "./DatosItems";
import {
  convertTemperature,
  convertUnit,
} from "../../../../utils/unitConversion";
import { currentLanguage } from "../../../../libs/i18n";

export const DatosTecnicos = ({
  ficha,
  imageDimensiones,
  imageDimensionesInsonoro,
  imageTableroControlPrueba,
  loadingDimensiones,
  loadingDimensionesInsonoro,
}) => {
  const { i18n, t } = useTranslation();
  const { code: currentLanguageCode } = currentLanguage(i18n);

  return (
    <div className="bg-gray-200">
      <div className="mt-3 sm:mt-6 pb-3 sm:pb-6">
        <h2 className="bg-[#FF9F00] py-1.5 sm:py-2 px-2 sm:px-4 text-[#FFFFFF] text-base sm:text-lg md:text-xl rounded-sm">
          {t("technical_report_pdf.technical_data")}
        </h2>

        <div className="mt-3 sm:mt-6 px-2 sm:px-4">
          <div className="bg-[#082242] flex w-full sm:w-[20rem] md:w-[25rem] rounded-t-md">
            <span className="border-l-[15px] sm:border-l-[20px] md:border-l-[25px] border-[#FF9F00]"></span>
            <h3 className="text-[#FFFFFF] p-1.5 sm:p-2 text-sm sm:text-base md:text-lg lg:text-xl font-bold uppercase">
              {t("technical_report_pdf.generator_set")}
            </h3>
          </div>
          <div className="bg-[#FFFFFF] p-3 sm:p-4 md:p-6 flex flex-col gap-4 sm:gap-6 lg:gap-8 lg:flex-row items-start lg:items-center rounded-b-md rounded-r-md">
            <div className="flex-1">
              <DatosItems
                label={t("technical_report_pdf.modelo")}
                item={ficha.sModNombre}
                medida={""}
              />
              <DatosItems
                className={"whitespace-nowrap"}
                label={t("technical_report_pdf.motor")}
                item={`${ficha.sMotModelo} ${safeString(
                  ficha.sMotNivelEmision,
                  ""
                )}`}
                medida={""}
              />
              <DatosItems
                label={t("technical_report_pdf.alternator")}
                item={ficha.sAltModelo}
                medida={""}
              />
              <DatosItems
                label={t("technical_report_pdf.control_module")}
                item={` ${
                  ficha.sIntModControl ? ficha.sIntModControl : "No disponible"
                }`}
                medida={""}
              />
              <DatosItems
                label={t("technical_report_pdf.phases")}
                item={ficha.nIntFases}
                medida={""}
              />
              <DatosItems
                label={t("technical_report_pdf.fuel_tank")}
                item={`${safeString(ficha?.nModTcombAbierto)} ${t(
                  "technical_report_pdf.gallons"
                )} - ${safeString(ficha?.nModTcombInsonoro)} ${t(
                  "technical_report_pdf.gallons"
                )}`}
              />
              <DatosItems
                label={t("technical_report_pdf.electric_system")}
                item={`${safeString(ficha?.nMotSisElectrico)} V`}
              />
              <DatosItems
                label={t("technical_report_pdf.frequency")}
                item={ficha.nIntFrecuencia}
                medida={"Hz"}
              />
              <DatosItems
                label={t("technical_report_pdf.cooling_fan_air_flow")}
                item={
                  safeString(ficha.nMotGasRadiadorFA) === "0.0"
                    ? "--"
                    : safeString(
                        currentLanguageCode === "en"
                          ? convertUnit(
                              ficha.nMotGasRadiadorFA,
                              "m3/min",
                              "cfm",
                              1
                            )
                          : ficha.nMotGasRadiadorFA
                      )
                }
                medida={t("units.m3/min")}
              />
              <DatosItems
                label={t("technical_report_pdf.combustion_air_flow")}
                item={safeString(
                  currentLanguageCode === "en"
                    ? convertUnit(ficha.nMotGasCombustionFA, "m3/min", "cfm", 1)
                    : ficha.nMotGasCombustionFA
                )}
                medida={t("units.m3/min")}
              />
              <DatosItems
                label={t("technical_report_pdf.exhaust_gas_flow")}
                item={safeString(
                  currentLanguageCode === "en"
                    ? convertUnit(ficha.nMotGasGasEscFlujo, "m3/min", "cfm", 1)
                    : ficha.nMotGasGasEscFlujo
                )}
                medida={t("units.m3/min")}
              />
              <DatosItems
                label={t("technical_report_pdf.exhaust_gas_temperature")}
                item={safeString(
                  currentLanguageCode === "en"
                    ? convertTemperature(
                        ficha.nMotGasTempGasesEscape,
                        "°C",
                        "°F",
                        1
                      )
                    : ficha.nMotGasTempGasesEscape
                )}
                medida={t("units.temperature")}
              />
            </div>

            <div className="flex items-center justify-start flex-shrink-0 w-full lg:w-auto">
              <div className="flex flex-col gap-2 w-full">
                <div className="rounded-2xl overflow-hidden border">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[500px]">
                      <tbody>
                        <tr>
                          <td className="p-2 sm:p-3 border-r border-gray-200">
                            <div className="text-orange-500 text-xs sm:text-sm">
                              {t("technical_report_pdf.enclosed_genset")} dBA
                              @7m
                            </div>
                          </td>
                          <td className="p-2 sm:p-3 border-r border-gray-200">
                            <div className="text-orange-500 flex flex-col space-y-2 sm:space-y-4 text-xs sm:text-sm">
                              <span className="border-b">
                                {t("technical_report_pdf.noise_level")}
                              </span>
                              <span className="text-gray-700">
                                {ficha.sModNiveldeRuido}
                              </span>
                            </div>
                          </td>
                          <td className="p-2 sm:p-3">
                            <div className="text-orange-500 flex flex-col space-y-2 sm:space-y-4 text-xs sm:text-sm">
                              <span className="border-b">
                                {t("technical_report_pdf.environment_noise")}
                              </span>
                              <span className="text-gray-700">
                                {ficha.sModRuidoAmbiental
                                  ? ficha.sModRuidoAmbiental
                                  : t("common.unavailable")}
                              </span>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <span className="text-xs sm:text-sm text-[#082242] italic pl-1 flex justify-end">
                  {t("technical_report_pdf.reference_noise_level")}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 sm:mt-6 px-2 sm:px-4">
          <div className="bg-[#082242] flex w-full sm:w-[20rem] md:w-[25rem] rounded-t-md">
            <span className="border-l-[15px] sm:border-l-[20px] md:border-l-[25px] border-[#FF9F00]"></span>
            <h3 className="text-[#FFFFFF] p-1.5 sm:p-2 text-sm sm:text-base md:text-lg lg:text-xl font-bold uppercase">
              {t("technical_report_pdf.motor")}
            </h3>
          </div>
          <div className="bg-[#FFFFFF] p-3 sm:p-4 flex flex-col gap-4 sm:gap-6 lg:gap-8 lg:flex-row items-start lg:items-center rounded-b-md rounded-r-md">
            <div className="flex-1">
              <DatosItems
                label={t("technical_report_pdf.number_of_cylinders")}
                item={ficha.sMotNoCilindros}
                medida={""}
              />
              <DatosItems
                label={t("technical_report_pdf.governor_type")}
                item={ficha.sMotSisGobernacion}
                medida={""}
              />
              <DatosItems
                label={t("technical_report_pdf.cycle")}
                item={ficha.sMotCiclo}
                medida={""}
              />
              <DatosItems
                label={t("technical_report_pdf.aspiration")}
                item={ficha.sMotAspiracion}
                medida={""}
              />
              <DatosItems
                label={t("technical_report_pdf.fuel")}
                item={ficha.sMotCombustible}
                medida={""}
              />
              <DatosItems
                label={t("technical_report_pdf.combustion_system")}
                item={ficha.sMotSisCombustion}
                medida={""}
              />
              <DatosItems
                label={t("technical_report_pdf.cooling_method")}
                item={ficha.sMotSisEnfriamiento}
                medida={""}
              />
              <DatosItems
                label={t("technical_report_pdf.bore")}
                item={
                  currentLanguageCode === "en"
                    ? convertUnit(ficha.nMotDiametroPiston, "mm", "in", 1)
                    : ficha.nMotDiametroPiston
                }
                medida={t("units.mm")}
              />
              <DatosItems
                label={t("technical_report_pdf.stroke")}
                item={
                  currentLanguageCode === "en"
                    ? convertUnit(ficha.nMotDesplazamientoPiston, "mm", "in", 1)
                    : ficha.nMotDesplazamientoPiston
                }
                medida={t("units.mm")}
              />
              <DatosItems
                label={t("technical_report_pdf.displacement")}
                item={ficha.nMotCapacidad}
                medida={t("units.cc")}
              />
              <DatosItems
                label={t("technical_report_pdf.compression_ratio")}
                item={safeString(ficha.sMotRelCompresion)}
                medida={""}
              />
              <DatosItems
                label={t("technical_report_pdf.lubrication_system_capacity")}
                item={safeString(
                  convertUnit(ficha.nMotCapSisLubricacion, "l", "gal", 1)
                )}
                medida={"gal"}
              />
              <DatosItems
                label={t("technical_report_pdf.cooling_system_capacity")}
                item={safeString(
                  convertUnit(ficha.nMotCapSisRefrigeracion, "l", "gal", 1)
                )}
                medida={"gal"}
              />
            </div>

            <div className="flex items-center justify-start flex-shrink-0">
              <div className="flex flex-col gap-2">
                <div className="rounded-2xl overflow-hidden border">
                  <table className="w-full">
                    <tbody>
                      <tr>
                        <td
                          className="p-3 border-r border-gray-200"
                          colSpan={3}
                        >
                          <div className="text-orange-500 text-center">
                            {t("technical_report_pdf.fuel_consumption")}
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3 border-r border-gray-200">
                          <div className="text-orange-500 flex flex-col space-y-4">
                            <span className="text-center border-b">
                              {t("technical_report_pdf.engine_speed")}
                            </span>
                            <div className="flex flex-col">
                              <span className="text-gray-700">
                                {`${t(
                                  "technical_report_pdf.standby_power"
                                )} (2)`}
                              </span>
                              <span className="text-gray-700">
                                {`${t("technical_report_pdf.prime_power")}`}
                              </span>
                              <span className="text-gray-700">
                                {`75% ${t(
                                  "technical_report_pdf.prime_power"
                                )} (1)`}
                              </span>
                              <span className="text-gray-700">
                                {`50% ${t(
                                  "technical_report_pdf.prime_power"
                                )} (1)`}
                              </span>
                            </div>
                          </div>
                        </td>
                        {ficha.nIntFrecuencia === 60 ? (
                          <td className="p-3 border-r border-gray-200">
                            <div className="text-orange-500 flex flex-col text-center space-y-4">
                              <span className="text-center border-b">
                                1800 RPM Gal/hr
                              </span>
                              <div className="flex flex-col">
                                <span className="text-gray-700">
                                  {currentLanguageCode === "en"
                                    ? convertUnit(
                                        ficha.nMotConsStandBy1800,
                                        "l",
                                        "gal",
                                        1
                                      )
                                    : ficha.nMotConsStandBy1800}
                                </span>
                                <span className="text-gray-700">
                                  {currentLanguageCode === "en"
                                    ? convertUnit(
                                        ficha.nMotConsPrime1800,
                                        "l",
                                        "gal",
                                        1
                                      )
                                    : ficha.nMotConsPrime1800}
                                </span>
                                <span className="text-gray-700">
                                  {currentLanguageCode === "en"
                                    ? convertUnit(
                                        ficha.nMotConsPrime1800_75porc,
                                        "l",
                                        "gal",
                                        1
                                      )
                                    : ficha.nMotConsPrime1800_75porc}
                                </span>
                                <span className="text-gray-700">
                                  {currentLanguageCode === "en"
                                    ? convertUnit(
                                        ficha.nMotConsPrime1800_50porc,
                                        "l",
                                        "gal",
                                        1
                                      )
                                    : ficha.nMotConsPrime1800_50porc}
                                </span>
                              </div>
                            </div>
                          </td>
                        ) : (
                          <td className="p-3 border-r border-gray-200">
                            <div className="text-orange-500 flex flex-col text-center space-y-4">
                              <span className="text-center border-b">
                                1500 RPM Gal/hr
                              </span>
                              <div className="flex flex-col">
                                <span className="text-gray-700">
                                  {currentLanguageCode === "en"
                                    ? convertUnit(
                                        ficha.nMotConsStandBy1500,
                                        "l",
                                        "gal",
                                        1
                                      )
                                    : ficha.nMotConsStandBy1500}
                                </span>
                                <span className="text-gray-700">
                                  {currentLanguageCode === "en"
                                    ? convertUnit(
                                        ficha.nMotConsPrime1500,
                                        "l",
                                        "gal",
                                        1
                                      )
                                    : ficha.nMotConsPrime1500}
                                </span>
                                <span className="text-gray-700">
                                  {currentLanguageCode === "en"
                                    ? convertUnit(
                                        ficha.nMotConsPrime1500_75porc,
                                        "l",
                                        "gal",
                                        1
                                      )
                                    : ficha.nMotConsPrime1500_75porc}
                                </span>
                                <span className="text-gray-700">
                                  {currentLanguageCode === "en"
                                    ? convertUnit(
                                        ficha.nMotConsPrime1500_50porc,
                                        "l",
                                        "gal",
                                        1
                                      )
                                    : ficha.nMotConsPrime1500_50porc}
                                </span>
                              </div>
                            </div>
                          </td>
                        )}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-10 mt-3 sm:mt-6 px-2 sm:px-4">
          <div className="flex flex-col">
            <div className="bg-[#082242] flex w-full sm:w-[20rem] md:w-[25rem] rounded-t-md">
              <span className="border-l-[15px] sm:border-l-[20px] md:border-l-[25px] border-[#FF9F00]"></span>
              <h3 className="text-[#FFFFFF] p-1.5 sm:p-2 text-sm sm:text-base md:text-lg lg:text-xl font-bold uppercase">
                {t("technical_report_pdf.alternator")}
              </h3>
            </div>
            <div className="bg-[#FFFFFF] p-3 sm:p-4 flex h-full min-h-[150px] sm:min-h-[170px] rounded-b-md rounded-r-md">
              <div className="flex-1">
                <DatosItems
                  label={t("technical_report_pdf.insulation_system")}
                  item={ficha.sAltAislamiento}
                  medida={""}
                />
                <DatosItems
                  label={t("technical_report_pdf.exciter_type")}
                  item={ficha.sAltSistemaExitacion}
                  medida={""}
                />
                <DatosItems
                  label={t("technical_report_pdf.voltage_regulation_card")}
                  item={ficha.sAltTarjetaAVR}
                  medida={""}
                />
                <DatosItems
                  label={t("technical_report_pdf.protection_class")}
                  item={ficha.sAltGradoIP}
                  medida={""}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="bg-[#082242] flex w-full sm:w-[20rem] md:w-[25rem] rounded-t-md">
              <span className="border-l-[15px] sm:border-l-[20px] md:border-l-[25px] border-[#FF9F00]"></span>
              <h3 className="text-[#FFFFFF] p-1.5 sm:p-2 text-sm sm:text-base md:text-lg lg:text-xl font-bold uppercase">
                {t("technical_report_pdf.reference_technical_standards")}
              </h3>
            </div>
            <div className="bg-[#FFFFFF] p-3 sm:p-4 flex h-full min-h-[150px] sm:min-h-[170px] rounded-b-md rounded-r-md">
              <div className="flex-1">
                <DatosItems
                  label={t("technical_report_pdf.motor")}
                  item={ficha.sMotNormasTecnicas}
                  medida={""}
                />
                <DatosItems
                  label={t("technical_report_pdf.alternator")}
                  item={ficha.sAltNormaTecnica}
                  medida={""}
                />
                <DatosItems
                  label={t("technical_report_pdf.generator_set")}
                  item={ficha.sModNormaTecnica}
                  medida={""}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 sm:mt-6 px-2 sm:px-4">
          <div className="bg-[#082242] flex w-full sm:w-[20rem] md:max-w-[25rem] rounded-t-md">
            <span className="border-l-[15px] sm:border-l-[20px] md:border-l-[25px] border-[#FF9F00]"></span>
            <h3 className="text-[#FFFFFF] p-1.5 sm:p-2 text-sm sm:text-base md:text-lg lg:text-xl font-bold uppercase">
              {t("technical_report_pdf.dimensions")}
            </h3>
          </div>
          <div className="bg-[#FFFFFF] p-3 sm:p-4 md:p-6 flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 rounded-b-md rounded-r-md">
            {/* Left Half: Letters and Numbers (50% of the page) */}
            <div className="flex-1 flex flex-col gap-4">
              {/* Grupo Electrógeno Abierto */}
              {ficha?.sTipoFabricacion !== "CHINO" && (
                <div>
                  <div className="bg-[#f3f4f6] px-2 py-1 text-xs sm:text-sm font-semibold mb-2 rounded">
                    {t("technical_report_pdf.generator_set_open")}
                  </div>
                  <div className="flex flex-row">
                    {/* Letters Column */}
                    <div className="w-1/2">
                      <div className="overflow-hidden">
                        <table className="w-full border-collapse text-gray-800">
                          <tbody>
                            <tr>
                              <td className="p-1 font-medium text-xs sm:text-sm h-[28px] sm:h-[32px]">
                                a
                              </td>
                            </tr>
                            <tr>
                              <td className="p-1 font-medium text-xs sm:text-sm h-[28px] sm:h-[32px]">
                                b
                              </td>
                            </tr>
                            <tr>
                              <td className="p-1 font-medium text-xs sm:text-sm h-[28px] sm:h-[32px]">
                                c
                              </td>
                            </tr>
                            <tr>
                              <td className="p-1 font-medium text-xs sm:text-sm h-[28px] sm:h-[32px]">
                                {t("technical_report_pdf.weight")}
                              </td>
                            </tr>
                            <tr>
                              <td className="p-1 font-medium text-xs sm:text-sm h-[28px] sm:h-[32px]">
                                Ø {t("technical_report_pdf.exh")}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Numbers Column */}
                    <div className="w-1/2">
                      <div className="overflow-hidden">
                        <table className="w-full border-collapse text-gray-800">
                          <tbody>
                            <tr>
                              <td className="p-1 text-xs sm:text-sm h-[28px] sm:h-[32px]">
                                {currentLanguageCode === "en"
                                  ? convertUnit(
                                      ficha.nModDimensionesA,
                                      "mm",
                                      "in",
                                      0
                                    )
                                  : ficha.nModDimensionesA || "0.00"}{" "}
                                {t("units.mm")}
                              </td>
                            </tr>
                            <tr>
                              <td className="p-1 text-xs sm:text-sm h-[28px] sm:h-[32px]">
                                {currentLanguageCode === "en"
                                  ? convertUnit(
                                      ficha.nModDimensionesB,
                                      "mm",
                                      "in",
                                      0
                                    )
                                  : ficha.nModDimensionesB || "0.00"}{" "}
                                {t("units.mm")}
                              </td>
                            </tr>
                            <tr>
                              <td className="p-1 text-xs sm:text-sm h-[28px] sm:h-[32px]">
                                {currentLanguageCode === "en"
                                  ? convertUnit(
                                      ficha.nModDimensionesC,
                                      "mm",
                                      "in",
                                      0
                                    )
                                  : ficha.nModDimensionesC || "0.00"}{" "}
                                {t("units.mm")}
                              </td>
                            </tr>
                            <tr>
                              <td className="p-1 text-xs sm:text-sm h-[28px] sm:h-[32px]">
                                {currentLanguageCode === "en"
                                  ? convertUnit(
                                      ficha.nModDimensionesPeso1,
                                      "kg",
                                      "lb",
                                      0
                                    )
                                  : ficha.nModDimensionesPeso1 || "0.00"}{" "}
                                {t("units.kg")}
                              </td>
                            </tr>
                            <tr>
                              <td className="p-1 text-xs sm:text-sm h-[28px] sm:h-[32px]">
                                {ficha.nModDimensionesEsc1 || "0.00"} &quot;
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Grupo Electrógeno Insonoro */}
              <div>
                <div className="bg-[#f3f4f6] px-2 py-1 text-xs sm:text-sm font-semibold mb-2 rounded">
                  {t("technical_report_pdf.generator_set_soundproof")}
                </div>
                <div className="flex flex-row">
                  {/* Letters Column */}
                  <div className="w-1/2">
                    <div className="overflow-hidden">
                      <table className="w-full border-collapse text-gray-800">
                        <tbody>
                          <tr>
                            <td className="p-1 font-medium text-xs sm:text-sm h-[28px] sm:h-[32px]">
                              x
                            </td>
                          </tr>
                          <tr>
                            <td className="p-1 font-medium text-xs sm:text-sm h-[28px] sm:h-[32px]">
                              y
                            </td>
                          </tr>
                          <tr>
                            <td className="p-1 font-medium text-xs sm:text-sm h-[28px] sm:h-[32px]">
                              z
                            </td>
                          </tr>
                          <tr>
                            <td className="p-1 font-medium text-xs sm:text-sm h-[28px] sm:h-[32px]">
                              {t("technical_report_pdf.weight")}
                            </td>
                          </tr>
                          <tr>
                            <td className="p-1 font-medium text-xs sm:text-sm h-[28px] sm:h-[32px]">
                              Ø {t("technical_report_pdf.exh")}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Numbers Column */}
                  <div className="w-1/2">
                    <div className="overflow-hidden">
                      <table className="w-full border-collapse text-gray-800">
                        <tbody>
                          <tr>
                            <td className="p-1 text-xs sm:text-sm h-[28px] sm:h-[32px]">
                              {currentLanguageCode === "en"
                                ? convertUnit(
                                    ficha.nModDimensionesX,
                                    "mm",
                                    "in",
                                    0
                                  )
                                : ficha.nModDimensionesX || "0.00"}{" "}
                              {t("units.mm")}
                            </td>
                          </tr>
                          <tr>
                            <td className="p-1 text-xs sm:text-sm h-[28px] sm:h-[32px]">
                              {currentLanguageCode === "en"
                                ? convertUnit(
                                    ficha.nModDimensionesY,
                                    "mm",
                                    "in",
                                    0
                                  )
                                : ficha.nModDimensionesY || "0.00"}{" "}
                              {t("units.mm")}
                            </td>
                          </tr>
                          <tr>
                            <td className="p-1 text-xs sm:text-sm h-[28px] sm:h-[32px]">
                              {currentLanguageCode === "en"
                                ? convertUnit(
                                    ficha.nModDimensionesZ,
                                    "mm",
                                    "in",
                                    0
                                  )
                                : ficha.nModDimensionesZ || "0.00"}{" "}
                              {t("units.mm")}
                            </td>
                          </tr>
                          <tr>
                            <td className="p-1 text-xs sm:text-sm h-[28px] sm:h-[32px]">
                              {currentLanguageCode === "en"
                                ? convertUnit(
                                    ficha.nModDimensionesPeso2,
                                    "kg",
                                    "lb",
                                    0
                                  )
                                : ficha.nModDimensionesPeso2 || "0.00"}{" "}
                              {t("units.kg")}
                            </td>
                          </tr>
                          <tr>
                            <td className="p-1 text-xs sm:text-sm h-[28px] sm:h-[32px]">
                              {ficha.nModDimensionesEsc2 || "0.00"} &quot;
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Half: Images (50% of the page) */}
            <div className="flex-1 flex flex-col gap-6 self-start">
              {ficha?.sTipoFabricacion !== "CHINO" && (
                <div className="relative">
                  {loadingDimensiones ? (
                    <div className="w-full h-48 flex justify-center items-center bg-gray-100">
                      <span className="animate-pulse text-gray-500 text-sm">
                        {t("common.loading")}...
                      </span>
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={imageDimensiones}
                        alt="Dimensiones Abierto"
                        className="w-full h-32 object-contain"
                      />
                    </div>
                  )}
                </div>
              )}
              <div className="relative">
                {loadingDimensionesInsonoro ? (
                  <div className="w-full h-48 flex justify-center items-center bg-gray-100">
                    <span className="animate-pulse text-gray-500 text-sm">
                      {t("common.loading")}...
                    </span>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={imageDimensionesInsonoro}
                      alt="Dimensiones Insonoro"
                      className="w-full h-48 object-contain"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 sm:mt-6 px-2 sm:px-4">
          <div className="bg-[#082242] flex w-full sm:w-[20rem] md:w-[25rem] rounded-t-md">
            <span className="border-l-[15px] sm:border-l-[20px] md:border-l-[25px] border-[#FF9F00]"></span>
            <h3 className="text-[#FFFFFF] p-1.5 sm:p-2 text-sm sm:text-base md:text-lg lg:text-xl font-bold uppercase">
              {t("technical_report_pdf.control_panel")}
            </h3>
          </div>
          <div className="bg-[#FFFFFF] p-3 sm:p-4 flex flex-col lg:flex-row gap-4 sm:gap-6 rounded-b-md rounded-r-md">
            <div className="flex-1">
              <div className="flex flex-col items-center">
                <div className="relative h-64 lg:h-auto lg:w-72 flex-shrink-0 items-center">
                  <img
                    src={imageTableroControlPrueba}
                    alt="Dimensiones Prueba"
                    className="lg:w-full lg:h-full object-cover text-center"
                  />
                </div>
                <div className="lg:mt-6 overflow-auto">
                  <span className="whitespace-pre-wrap">
                    <p className="text-gray-800 font-normal text-sm text-justify">
                      {t("technical_report_pdf.control_panel_description")}
                    </p>
                  </span>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <div>
                <label className="text-gray-900 font-semibold">
                  {t("technical_report_pdf.measurements")}
                </label>
                <br />
                <div className="overflow-auto scroll-mask-white py-6">
                  <ul className="whitespace-pre-wrap text-gray-800 font-normal max-h-96">
                    {ficha.tablero?.measures?.map((measures, index) => (
                      <li key={index}>
                        {measures?.sTableroMedicionNombre
                          ? `- ${measures.sTableroMedicionNombre}`
                          : "--"}
                      </li>
                    )) || <li>{t("common.unavailable")}</li>}
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex-1">
              <div>
                <label className="text-gray-900 font-semibold">
                  {t("technical_report_pdf.protections")}
                </label>
                <br />
                <div className="overflow-auto scroll-mask-white py-6">
                  <ul className="whitespace-pre-wrap text-gray-800 font-normal max-h-96">
                    {ficha.tablero?.protections?.map((protection, index) => (
                      <li key={index}>
                        {protection?.sTableroProteccionNombre
                          ? `- ${protection.sTableroProteccionNombre}`
                          : "--"}
                      </li>
                    )) || <li>{t("common.unavailable")}</li>}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-10 mt-3 sm:mt-6 px-2 sm:px-4">
          <div className="flex flex-col">
            <div className="bg-[#082242] flex w-full sm:w-[20rem] md:w-[25rem] rounded-t-md">
              <span className="border-l-[15px] sm:border-l-[20px] md:border-l-[25px] border-[#FF9F00]"></span>
              <h3 className="text-[#FFFFFF] p-1.5 sm:p-2 text-sm sm:text-base md:text-lg lg:text-xl font-bold uppercase">
                {t("technical_report_pdf.standard_accessories")}
              </h3>
            </div>
            <div className="bg-[#FFFFFF] p-3 sm:p-4 flex h-full rounded-b-md rounded-r-md">
              <div className="flex-1">
                <div className="overflow-auto scroll-mask-white py-6">
                  <ul className="whitespace-pre-wrap text-gray-800 font-normal max-h-96">
                    {(ficha?.standardEquipment &&
                      ficha.standardEquipment.length > 0 &&
                      ficha.standardEquipment.map(
                        (standardEquipment, index) => (
                          <li key={index}>
                            {standardEquipment?.sEquipamientoEstandarNombre
                              ? `- ${standardEquipment.sEquipamientoEstandarNombre}`
                              : "--"}
                          </li>
                        )
                      )) || <li>{t("common.unavailable")}</li>}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="bg-[#082242] flex w-full sm:w-[20rem] md:w-[25rem] rounded-t-md">
              <span className="border-l-[15px] sm:border-l-[20px] md:border-l-[25px] border-[#FF9F00]"></span>
              <h3 className="text-[#FFFFFF] p-1.5 sm:p-2 text-sm sm:text-base md:text-lg lg:text-xl font-bold uppercase">
                {t("technical_report_pdf.optional_accessories")}
              </h3>
            </div>
            <div className="bg-[#FFFFFF] p-3 sm:p-4 flex h-full rounded-b-md rounded-r-md">
              <div className="flex-1">
                <div className="overflow-auto scroll-mask-white py-3 sm:py-6">
                  <ul className="whitespace-pre-wrap text-gray-800 font-normal max-h-96">
                    {(ficha?.optionals &&
                      ficha.optionals.length > 0 &&
                      ficha.optionals.map((optional, index) => (
                        <li key={index}>
                          {`${
                            optional?.sEquipamientoOpcionalNombre
                              ? `- ${optional.sEquipamientoOpcionalNombre}`
                              : "--"
                          }`}
                        </li>
                      ))) || <li>{t("common.unavailable")}</li>}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
