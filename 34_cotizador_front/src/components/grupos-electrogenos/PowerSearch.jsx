import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { ToggleButton } from "primereact/togglebutton";
import React from "react";
import { cn } from "../../utils/utils";
import { FormInputText } from "../custom/inputs/FormInputText";
import site from "../../config/site";
import { useTranslation } from "react-i18next";

export const PowerSearch = ({
  className,
  powerFactor,
  averageDerate,
  derateRange,
  primePower,
  standbyPower,
  onChangePrimePower,
  onChangeStandbyPower,
  checkedKVA,
  setCheckedKVA,
}) => {
  const [powerTreshold, setPowerPrimeTreshold] = React.useState(20);
  const [isOpenPrimePower, setIsOpenPrimePower] = React.useState(false);
  const [isOpenStandByPower, setIsOpenStandByPower] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const openPrimePower = isMobile ? true : isOpenPrimePower;
  const openStandByPower = isMobile ? true : isOpenStandByPower;

  const { t } = useTranslation();

  return (
    <div className={cn("grid grid-cols-5 gap-4", className)}>
      {/* Potencia Prime */}
      <section className="col-span-2">
        <section className="bg-white shadow-sm rounded">
          <div className="relative flex flex-col">
            <FormInputText
              name="primePower"
              label={t("technical_report.prime_power")}
              value={primePower}
              placeholder={t("technical_report.placeholder.prime_power")}
              onChange={(e) => {
                const primePower = e.target.value;

                onChangePrimePower(primePower);
              }}
            />

            <span className="absolute right-8 top-[68%] transform -translate-y-1/2"></span>
            {!isMobile && (
              <button
                onClick={() => setIsOpenPrimePower(!isOpenPrimePower)}
                className="absolute right-2 top-[70%] transform -translate-y-1/2 focus:outline-none"
                aria-label={
                  openPrimePower ? "Contraer detalles" : "Expandir detalles"
                }
              >
                {openPrimePower ? (
                  <ArrowUpIcon className="w-4 h-4 text-gray-600 transition-transform duration-500" />
                ) : (
                  <ArrowDownIcon className="w-4 h-4 text-gray-600 transition-transform duration-500" />
                )}
              </button>
            )}
          </div>
          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              openPrimePower ? "max-h-24 opacity-100 mt-2" : "max-h-0 opacity-0"
            }`}
          >
            <div className="text-xs text-gray-600">
              <p>
                {t("technical_report.threshold_note")}{" "}
                <span className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded font-mono">
                  +/- {powerTreshold} %
                </span>
              </p>
              <p>
                {t("technical_report.range")}:{" "}
                {derateRange?.prime.kva.min && derateRange?.prime.kw.min ? (
                  <span className="font-semibold">
                    {Number(
                      checkedKVA
                        ? derateRange?.prime.kva.min
                        : derateRange?.prime.kw.min
                    ).toFixed(2)}{" "}
                    {checkedKVA
                      ? site.powerUnits.kilovoltAmpere
                      : site.powerUnits.kilowatt}
                  </span>
                ) : (
                  <span>-</span>
                )}{" "}
                –{" "}
                {derateRange?.prime.kva.max && derateRange?.prime.kw.max ? (
                  <span className="font-semibold">
                    {Number(
                      checkedKVA
                        ? derateRange?.prime.kva.max
                        : derateRange?.prime.kw.max
                    ).toFixed(2)}{" "}
                    {checkedKVA
                      ? site.powerUnits.kilovoltAmpere
                      : site.powerUnits.kilowatt}
                  </span>
                ) : (
                  <span>-</span>
                )}
              </p>
              <section>
                <button
                  onClick={() => {
                    onChangePrimePower("Todos");
                  }}
                  className="text-white font-semibold bg-blue-600 border border-blue-600 rounded-md px-2 py-1 mt-2 focus:outline-none hover:bg-blue-800 hover:text-white transition-colors duration-300"
                >
                  {t("technical_report.reset")}
                </button>
              </section>
            </div>
          </div>
        </section>
      </section>

      {/* Potencia StandBy */}
      <section className="col-span-2">
        <section className="bg-white shadow-sm rounded">
          <div className="relative flex flex-col">
            <FormInputText
              name="standbyPower"
              label={t("technical_report.standby_power")}
              value={standbyPower}
              placeholder={t("technical_report.placeholder.standby_power")}
              onChange={(e) => {
                const standbyPower = e.target.value;

                onChangeStandbyPower(standbyPower);
              }}
            />

            {!isMobile && (
              <button
                onClick={() => setIsOpenStandByPower(!isOpenStandByPower)}
                className="absolute right-2 top-[70%] transform -translate-y-1/2 focus:outline-none"
                aria-label={
                  openStandByPower ? "Contraer detalles" : "Expandir detalles"
                }
              >
                {openStandByPower ? (
                  <ArrowUpIcon className="w-4 h-4 text-gray-600 transition-transform duration-500" />
                ) : (
                  <ArrowDownIcon className="w-4 h-4 text-gray-600 transition-transform duration-500" />
                )}
              </button>
            )}
          </div>
          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              openStandByPower
                ? "max-h-24 opacity-100 mt-2"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="text-xs text-gray-600">
              <p>
                {t("technical_report.threshold_note")}{" "}
                <span className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded font-mono">
                  +/- {powerTreshold} %
                </span>
              </p>
              <p>
                {t("technical_report.range")}:{" "}
                {derateRange?.standby.kva.min && derateRange?.standby.kw.min ? (
                  <span className="font-semibold">
                    {Number(
                      checkedKVA
                        ? derateRange?.standby.kva.min
                        : derateRange?.standby.kw.min
                    ).toFixed(2)}{" "}
                    {checkedKVA
                      ? site.powerUnits.kilovoltAmpere
                      : site.powerUnits.kilowatt}
                  </span>
                ) : (
                  <span>-</span>
                )}{" "}
                –{" "}
                {derateRange?.standby.kva.max && derateRange?.standby.kw.max ? (
                  <span className="font-semibold">
                    {Number(
                      checkedKVA
                        ? derateRange?.standby.kva.max
                        : derateRange?.standby.kw.max
                    ).toFixed(2)}{" "}
                    {checkedKVA
                      ? site.powerUnits.kilovoltAmpere
                      : site.powerUnits.kilowatt}
                  </span>
                ) : (
                  <span>-</span>
                )}
              </p>
            </div>
            <section>
              <button
                onClick={() => {
                  onChangeStandbyPower("Todos");
                }}
                className="text-white font-semibold bg-blue-600 border border-blue-600 rounded-md px-2 py-1 mt-2 focus:outline-none hover:bg-blue-800 hover:text-white transition-colors duration-300 text-xs"
              >
                {t("technical_report.reset")}
              </button>
            </section>
          </div>
        </section>
      </section>
      <section className="flex flex-col items-center ">
        <label
          htmlFor="unitToggle"
          className="text-sm font-medium mb-2 uppercase line-clamp-1"
        >
          {t("technical_report.unity_measure")}
        </label>
        <section className="transition-all duration-400 ease-in-out hover:scale-95 ">
          <ToggleButton
            id="unitToggle"
            role="switch"
            aria-checked={checkedKVA}
            checked={checkedKVA}
            onChange={(e) => setCheckedKVA(e.value)}
            onLabel={site.powerUnits.kilovoltAmpere}
            offLabel={site.powerUnits.kilowatt}
            className={`text-sm font-bold px-3 py-2 rounded-lg border-0 focus:outline-none ${
              checkedKVA
                ? "bg-orange-500 text-white hover:shadow-orange-500 hover:shadow-md"
                : "bg-[#2563eb] text-white hover:shadow-[#2563eb] hover:shadow-md"
            }`}
            style={{ width: "34px", height: "34px" }}
          />
        </section>
      </section>
    </div>
  );
};
