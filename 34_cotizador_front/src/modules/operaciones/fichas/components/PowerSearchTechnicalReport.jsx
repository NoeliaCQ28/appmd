import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { InputNumber } from "primereact/inputnumber";
import { ToggleButton } from "primereact/togglebutton";
import React from "react";
import { cn } from "../../../../utils/utils";
import { useDerrateoTechnicalReport } from "../hooks/useDerrateoTechnicalReport";
import site from "../../../../config/site";

export const PowerSearchTechnicalReport = ({
  className,
  powerFactor = 0.8,
  models,
  setModels,
}) => {
  const [powerPrimeTreshold, setPowerPrimeTreshold] = React.useState(20);
  const [powerStandByThreshold, setPowerStandByThreshold] = React.useState(20);
  const { derate, setDerate } = useDerrateoTechnicalReport({
    models: models,
    powerFactor: powerFactor,
  });

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

  const [checkedKVA, setCheckedKVA] = React.useState(false);

  const filterModelsByPowers = React.useMemo(() => {
    const modelsName = models
      .filter((model) => {
        const primeKW = checkedKVA
          ? derate.prime.KW * powerFactor
          : derate.prime.KW;
        const standByKW = checkedKVA
          ? derate.standby.KW * powerFactor
          : derate.standby.KW;

        const modelPrimePowerKW = Number.parseFloat(model.PoteciaPrime);

        const modelStandByPowerKW = Number.parseFloat(model.PotenciaStandby);

        const primePowerFilterRange =
          modelPrimePowerKW >= primeKW - (primeKW * powerPrimeTreshold) / 100 &&
          modelPrimePowerKW <= primeKW + (primeKW * powerPrimeTreshold) / 100;

        const standByPowerFilterRange =
          modelStandByPowerKW >=
            standByKW - (standByKW * powerStandByThreshold) / 100 &&
          modelStandByPowerKW <=
            standByKW + (standByKW * powerStandByThreshold) / 100;

        return primePowerFilterRange && standByPowerFilterRange;
      })
      .map((m) => m.ModeloGE);

    return models.filter((model) => modelsName.includes(model.ModeloGE));
  }, [
    checkedKVA,
    derate.prime.KW,
    derate.standby.KW,
    models,
    powerFactor,
    powerPrimeTreshold,
    powerStandByThreshold,
  ]);

  React.useEffect(() => {
    setModels(filterModelsByPowers);
  }, [filterModelsByPowers, setModels]);

  return (
    <div className={cn("grid grid-cols-5 gap-4", className)}>
      {/* Potencia Prime */}
      <section className="col-span-2">
        <section className="bg-white shadow-sm rounded">
          <div className="relative flex flex-col">
            <label className="uppercase font-medium text-sm">
              Potencia prime
            </label>
            <InputNumber
              label="Potencia prime"
              value={checkedKVA ? derate.prime.KVA : derate.prime.KW ?? 0}
              onChange={(e) => {
                const payload = checkedKVA
                  ? {
                      prime: {
                        KW: e.value * powerFactor,
                        KVA: e.value,
                      },
                    }
                  : {
                      prime: {
                        KW: e.value,
                        KVA: e.value / powerFactor,
                      },
                    };

                setDerate((prev) => ({ ...prev, prime: payload.prime }));
              }}
              inputClassName="text-blue-600 font-bold w-full pr-10 rounded-lg"
              className="w-full mt-2"
              placeholder="Potencia prime"
            />
            {/* <span className="absolute right-20 top-[68%] transform -translate-y-1/2">
              <span className="text-blue-600 font-bold">KW</span>
            </span> */}
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
                Umbral establecido en{" "}
                <span className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded font-mono">
                  +/- {powerPrimeTreshold}
                </span>
              </p>
              <p>
                Rango:{" "}
                <span className="font-semibold">
                  {Number(
                    checkedKVA
                      ? derate.prime.KVA -
                          (derate.prime.KVA * powerPrimeTreshold) / 100
                      : derate.prime.KW -
                          (derate.prime.KW * powerPrimeTreshold) / 100
                  ).toFixed(2)}{" "}
                  {checkedKVA
                    ? site.powerUnits.kilovoltAmpere
                    : site.powerUnits.kilowatt}
                </span>{" "}
                –{" "}
                <span className="font-semibold">
                  {Number(
                    checkedKVA
                      ? derate.prime.KVA +
                          (derate.prime.KVA * powerPrimeTreshold) / 100
                      : derate.prime.KW +
                          (derate.prime.KW * powerPrimeTreshold) / 100
                  ).toFixed(2)}{" "}
                  {checkedKVA
                    ? site.powerUnits.kilovoltAmpere
                    : site.powerUnits.kilowatt}
                </span>
              </p>
              <section>
                <button
                  onClick={() => {
                    // Acción de restablecer si es necesario
                  }}
                  className="text-white font-semibold bg-blue-600 border border-blue-600 rounded-md px-2 py-1 mt-2 focus:outline-none hover:bg-blue-800 hover:text-white transition-colors duration-300"
                >
                  Restablecer
                </button>
              </section>
            </div>
          </div>
        </section>
        {/* <FormInputText
          label={""}
          value={`${Number(derate.prime.KVA ?? 0).toFixed(2)} KVA`}
          placeholder={"Potencia prime"}
          disabled={true}
          className={"mt-7 text-blue-600 font-bold"}
        /> */}
      </section>

      {/* Potencia StandBy */}
      <section className="col-span-2">
        <section className="bg-white shadow-sm rounded">
          <div className="relative flex flex-col">
            <label className="uppercase font-medium text-sm">
              Potencia stand by
            </label>
            <InputNumber
              label="Potencia stand by"
              value={checkedKVA ? derate.standby.KVA : derate.standby.KW ?? 0}
              onChange={(e) => {
                const payload = checkedKVA
                  ? {
                      standby: {
                        KW: e.value * Number.parseFloat(powerFactor),
                        KVA: e.value,
                      },
                    }
                  : {
                      standby: {
                        KW: e.value,
                        KVA: e.value / Number.parseFloat(powerFactor),
                      },
                    };

                setDerate((prev) => ({ ...prev, standby: payload.standby }));
              }}
              inputClassName="text-blue-600 font-bold w-full pr-10  rounded-lg"
              className="w-full mt-2"
              placeholder="Potencia stand by"
            />
            {/* <span className="absolute right-8 top-[68%] transform -translate-y-1/2">
              <span className="text-blue-600 font-bold">KW</span>
            </span> */}

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
                Umbral establecido en{" "}
                <span className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded font-mono">
                  +/- {powerStandByThreshold}
                </span>
              </p>
              <p>
                Rango:{" "}
                <span className="font-semibold">
                  {Number(
                    checkedKVA
                      ? derate.standby.KVA -
                          (derate.standby.KVA * powerStandByThreshold) / 100
                      : derate.standby.KW -
                          (derate.standby.KW * powerStandByThreshold) / 100
                  ).toFixed(2)}{" "}
                  {checkedKVA
                    ? site.powerUnits.kilovoltAmpere
                    : site.powerUnits.kilowatt}
                </span>{" "}
                –{" "}
                <span className="font-semibold">
                  {Number(
                    checkedKVA
                      ? derate.standby.KVA +
                          (derate.standby.KVA * powerStandByThreshold) / 100
                      : derate.standby.KW +
                          (derate.standby.KW * powerStandByThreshold) / 100
                  ).toFixed(2)}{" "}
                  {checkedKVA
                    ? site.powerUnits.kilovoltAmpere
                    : site.powerUnits.kilowatt}
                </span>
              </p>
            </div>
            <section>
              <button
                onClick={() => {
                  // Acción de restablecer si es necesario
                }}
                className="text-white font-semibold bg-blue-600 border border-blue-600 rounded-md px-2 py-1 mt-2 focus:outline-none hover:bg-blue-800 hover:text-white transition-colors duration-300 text-xs"
              >
                Restablecer
              </button>
            </section>
          </div>
        </section>
        {/* <FormInputText
          label={""}
          placeholder={"Potencia stand by"}
          value={`${Number(derate.standby.KVA ?? 0).toFixed(2)} KVA`}
          disabled={true}
          className={"mt-7 text-blue-600 font-bold"}
        /> */}
      </section>
      <section className="flex flex-col items-center ">
        <label htmlFor="unitToggle" className="text-sm font-medium mb-2">
          U. DE MEDIDA
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
