import { pdf } from "@react-pdf/renderer";
import { useQuery } from "@tanstack/react-query";
import {
  BatteryCharging,
  Microchip,
  TowerControlIcon,
  Zap,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { PiEngine } from "react-icons/pi";
import { TbNavigationBolt } from "react-icons/tb";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "../../../../components/custom/buttons/Button";
import site from "../../../../config/site";
import FileService from "../../../../services/fileService";
import { getFichasTecnicas } from "../services/fichasTecnicasService";
import { FichaPdf } from "./FichaPdf";
import { FichaModal } from "./modals/FichaModal";
import defaultgeInsonoro from "/default-ge-insonoro.webp";
import { useTranslation } from "react-i18next";

export const CardModels = ({ modelos, viewType, params }) => {
  const { pathname } = useLocation();
  const visible =
    pathname === "/fichas" || pathname === "/fichas/" ? "block" : "hidden";

  const [selectModeloId, setSelectModeloId] = useState(null);
  const [ficha, setFicha] = useState(false);
  const [openFichaTecnica, setOpenFichaTecnica] = useState(false);
  const [imageUrls, setImageUrls] = useState({});
  const [loadingStates, setLoadingStates] = useState({});
  const [imageCache, setImageCache] = useState({});
  const baseUrl = "https://cotizador.modasa.com.pe/storage/cotizadormodasa/";

  const {
    data: fichaTecnica,
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      "FichaTecnica",
      selectModeloId,
      params.altura,
      params.temperatura,
    ],
    queryFn: () =>
      getFichasTecnicas({
        selectModeloId,
        altura: params.altura,
        temperatura: params.temperatura,
      }),
    retry: false,
    enabled: !!selectModeloId,
  });

  const fetchImageUrlDirectly = async (path, modelId) => {
    if (!path || path === "null" || path.trim() === "") {
      setImageUrls((prev) => ({
        ...prev,
        [modelId]: null,
      }));
      return;
    }

    setLoadingStates((prev) => ({
      ...prev,
      [modelId]: true,
    }));

    try {
      const fullUrl = `${baseUrl}${path}`;

      const response = await fetch(fullUrl, { method: "HEAD" });
      if (!response.ok) {
        throw new Error(
          `No se pudo acceder a uModImgInsonoro en ${fullUrl}: ${response.status}`
        );
      }

      const url = (await FileService.getFileUrl({ fileName: path })) || fullUrl;
      setImageUrls((prev) => ({
        ...prev,
        [modelId]: {
          type: "image",
          url: url,
          name: path.split("/").pop() || "image",
        },
      }));
    } catch (error) {
      console.error(`Error al cargar imagen para el modelo ${modelId}`);
      setImageUrls((prev) => ({
        ...prev,
        [modelId]: null,
      }));
    } finally {
      setLoadingStates((prev) => ({
        ...prev,
        [modelId]: false,
      }));
    }
  };

  useEffect(() => {
    const fetchImages = async () => {
      if (!modelos || modelos.length === 0) {
        return;
      }

      await Promise.all(
        modelos.map(async (model) => {
          const modelId = model.integradora_Id;
          let path = model.uModImgInsonoro || null;

          if (model.imagePreview?.url) {
            setImageUrls((prev) => ({
              ...prev,
              [modelId]: model.imagePreview,
            }));
            setLoadingStates((prev) => ({
              ...prev,
              [modelId]: false,
            }));

            return;
          }

          if (imageCache[modelId]) {
            path = imageCache[modelId];
          } else {
            try {
              const fichaData = await getFichasTecnicas({
                selectModeloId: modelId,
                altura: params.altura,
                temperatura: params.temperatura,
              });

              if (fichaData) {
                path = fichaData?.uModImgInsonoro || null;

                setImageCache((prev) => ({
                  ...prev,
                  [modelId]: path,
                }));
              }
            } catch (error) {
              console.error(
                `Error al obtener uModImgInsonoro para el modelo ${modelId} con getFichasTecnicas:`,
                error.message
              );
            }
          }

          if (path) {
            return fetchImageUrlDirectly(path, modelId);
          }

          setImageUrls((prev) => ({
            ...prev,
            [modelId]: null,
          }));
          setLoadingStates((prev) => ({
            ...prev,
            [modelId]: false,
          }));
          return Promise.resolve();
        })
      );
    };

    fetchImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelos]);

  const handleOpenFichaTecnicaOnNewTab = (id) => {
    setSelectModeloId(id);
    setOpenFichaTecnica(true);
  };

  const handleFichaTecnica = (id) => {
    setSelectModeloId(id);
    setFicha(true);
  };

  const handleClose = () => {
    setFicha(false);
    setSelectModeloId(null);
  };

  const showFichaTecnica = async () => {
    if (
      !fichaTecnica ||
      fichaTecnica === null ||
      (typeof fichaTecnica === "object" &&
        Object.keys(fichaTecnica).length === 0)
    )
      return;

    const blob = await pdf(<FichaPdf ficha={fichaTecnica} />).toBlob();

    const blobUrl = URL.createObjectURL(blob);

    const modelName = fichaTecnica?.sModNombre || "ficha";
    const defaultFileName = `${modelName} - MODASA.pdf`;

    const downloadLink = document.createElement("a");
    downloadLink.href = blobUrl;
    downloadLink.download = defaultFileName;

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    const newWindow = window.open(blobUrl, "_blank");
    if (newWindow === null || typeof newWindow === "undefined") {
      toast.error(
        "Por favor, active las ventanas emergentes (popups) en su navegador para ver el archivo PDF."
      );
    }

    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
    }, 1000);
  };

  React.useEffect(() => {
    if (fichaTecnica && openFichaTecnica) {
      showFichaTecnica();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openFichaTecnica, fichaTecnica]);

  const { t } = useTranslation();

  return (
    <>
      {modelos.map((model) => {
        const modelId = model.integradora_Id;
        const image =
          imageUrls[modelId]?.url ||
          model.imagePreview?.url ||
          defaultgeInsonoro;
        const isLoading = loadingStates[modelId] || false;

        return (
          <div
            key={model.integradora_Id}
            className={`${viewType === "grid"
                ? "group relative flex flex-col bg-white/80 backdrop-blur-xl rounded-lg border border-gray-200/60 overflow-hidden hover:shadow-2xl hover:shadow-gray-200/50 hover:border-gray-300/60 transition-all duration-300 ease-out"
                : "group relative flex flex-row bg-white/80 backdrop-blur-xl rounded-lg border border-gray-200/60 overflow-hidden hover:shadow-2xl hover:shadow-gray-200/50 hover:border-gray-300/60 transition-all duration-300 ease-out"
              }`}
          >
            {/* Image Section */}
            <div
              className={`${viewType === "grid"
                  ? "relative h-36 overflow-hidden bg-gradient-to-b from-gray-50 to-white"
                  : "relative w-24 sm:w-28 md:w-32 h-20 sm:h-24 md:h-28 flex-shrink-0 overflow-hidden bg-gradient-to-br from-gray-50 to-white"
                }`}
            >
              {isLoading ? (
                <div className="w-full h-full flex justify-center items-center">
                  <span className="animate-pulse text-gray-400 text-xs font-medium">
                    {t("common.loading")}...
                  </span>
                </div>
              ) : (
                <img
                  src={image}
                  alt={`Modelo ${model.ModeloGE}`}
                  className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform duration-500 ease-out"
                />
              )}
            </div>

            {/* Content Section */}
            <div
              className={`${viewType === "grid"
                  ? "flex flex-col flex-1 p-3"
                  : "flex flex-row items-center flex-1 gap-3 sm:gap-4 md:gap-6 p-3 md:p-4 min-w-0 overflow-hidden"
                }`}
            >
              {/* Info Section */}
              <div className={`${viewType === "grid"
                  ? "flex flex-col gap-2 flex-1"
                  : "flex flex-col gap-1.5 flex-1 min-w-0"
                }`}>
                {/* Header */}
                <div className={viewType === "grid" ? "" : ""}>
                  <h2 className={`${viewType === "grid"
                      ? "text-base font-semibold tracking-tight text-gray-900 leading-tight"
                      : "text-xs sm:text-sm md:text-base font-semibold tracking-tight text-gray-900 leading-tight"
                    }`}>
                    {model.ModeloGE}
                  </h2>
                  <span className={`inline-block font-medium text-gray-500 uppercase tracking-widest mt-0.5 ${viewType === "grid" ? "text-[9px]" : "text-[8px] sm:text-[9px]"
                    }`}>
                    {model?.Mercado === "NACIONAL"
                      ? t("technical_report.national")
                      : t("technical_report.exportation")}
                  </span>
                </div>

                {/* Power Output & Specifications Combined for List View */}
                {viewType === "list" ? (
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    {/* Prime Power */}
                    <div className="flex items-center gap-1">
                      <Zap className="h-2.5 w-2.5 text-gray-400 flex-shrink-0" />
                      <span className="text-[8px] sm:text-[9px] text-gray-500">Prime:</span>
                      <span className="text-[9px] sm:text-[10px] font-semibold text-gray-900">
                        {Number(model.PrimeKW).toFixed(1)} {site.powerUnits.kilowatt}
                      </span>
                    </div>

                    {/* Standby Power */}
                    <div className="flex items-center gap-1">
                      <BatteryCharging className="h-2.5 w-2.5 text-gray-400 flex-shrink-0" />
                      <span className="text-[8px] sm:text-[9px] text-gray-500">Standby:</span>
                      <span className="text-[9px] sm:text-[10px] font-semibold text-gray-900">
                        {Number(model.StandByKW).toFixed(1)} {site.powerUnits.kilowatt}
                      </span>
                    </div>

                    {/* Motor */}
                    <div className="hidden sm:flex items-center gap-1">
                      <PiEngine className="h-2.5 w-2.5 text-gray-400 flex-shrink-0" />
                      <span className="text-[9px] text-gray-700 truncate max-w-[120px] md:max-w-[150px]" title={model.Motor}>
                        {model.Motor}
                      </span>
                    </div>

                    {/* Alternator */}
                    <div className="hidden md:flex items-center gap-1">
                      <TowerControlIcon className="h-2.5 w-2.5 text-gray-400 flex-shrink-0" />
                      <span className="text-[9px] text-gray-700 truncate max-w-[120px]" title={model?.Alternador}>
                        {model?.Alternador}
                      </span>
                    </div>

                    {/* ITM */}
                    <div className="hidden lg:flex items-center gap-1">
                      <Microchip className="h-2.5 w-2.5 text-gray-400 flex-shrink-0" />
                      <span className="text-[9px] text-gray-500">ITM:</span>
                      <span className="text-[9px] text-gray-900 font-medium">
                        {model.ITMA}A
                      </span>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Power Output - Grid View */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <div className="flex items-center gap-1 text-[10px] font-medium text-gray-500 mb-0.5">
                          <Zap className="h-2.5 w-2.5 text-gray-400" />
                          <span>Prime</span>
                        </div>
                        <p className="text-sm font-semibold tracking-tight text-gray-900 leading-none">
                          {Number(model.PrimeKW).toFixed(1)}
                          <span className="text-[10px] font-medium text-gray-500 ml-0.5">
                            {site.powerUnits.kilowatt}
                          </span>
                        </p>
                        <p className="text-[10px] text-gray-500 mt-0.5">
                          {Number(model.PrimeKVA).toFixed(1)}{" "}
                          {site.powerUnits.kilovoltAmpere}
                        </p>
                      </div>

                      <div>
                        <div className="flex items-center gap-1 text-[10px] font-medium text-gray-500 mb-0.5">
                          <BatteryCharging className="h-2.5 w-2.5 text-gray-400" />
                          <span>Standby</span>
                        </div>
                        <p className="text-sm font-semibold tracking-tight text-gray-900 leading-none">
                          {Number(model.StandByKW).toFixed(1)}
                          <span className="text-[10px] font-medium text-gray-500 ml-0.5">
                            {site.powerUnits.kilowatt}
                          </span>
                        </p>
                        <p className="text-[10px] text-gray-500 mt-0.5">
                          {Number(model.StandByKVA).toFixed(1)}{" "}
                          {site.powerUnits.kilovoltAmpere}
                        </p>
                      </div>
                    </div>

                    {/* Specifications - Grid View */}
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 pt-2 border-t border-gray-200/60">
                      <div>
                        <div className="flex items-center gap-0.5 text-[9px] font-medium text-gray-500 uppercase tracking-wider mb-0.5">
                          <PiEngine className="h-2 w-2 text-gray-400" />
                          {t("technical_report.engine")}
                        </div>
                        <p
                          className="text-[11px] font-medium text-gray-900 leading-tight truncate"
                          title={model.Motor}
                        >
                          {model.Motor}
                        </p>
                      </div>

                      <div>
                        <div className="flex items-center gap-0.5 text-[9px] font-medium text-gray-500 uppercase tracking-wider mb-0.5">
                          <TowerControlIcon className="h-2 w-2 text-gray-400" />
                          {t("technical_report.alternator")}
                        </div>
                        <p
                          className="text-[11px] font-medium text-gray-900 leading-tight truncate"
                          title={model?.Alternador}
                        >
                          {model?.Alternador}
                        </p>
                      </div>

                      <div>
                        <div className="flex items-center gap-0.5 text-[9px] font-medium text-gray-500 uppercase tracking-wider mb-0.5">
                          <Microchip className="h-2 w-2 text-gray-400" />
                          ITM
                        </div>
                        <p className="text-[11px] font-medium text-gray-900 leading-tight">
                          {model.ITMA}A
                        </p>
                      </div>

                      <div>
                        <div className="flex items-center gap-0.5 text-[9px] font-medium text-gray-500 uppercase tracking-wider mb-0.5">
                          <TbNavigationBolt className="h-2 w-2 text-gray-400" />
                          {t("technical_report.max_current")}
                        </div>
                        <p className="text-[11px] font-medium text-gray-900 leading-tight">
                          {model?.CorrienteStandByA
                            ? `${Number.parseInt(model.CorrienteStandByA) || "--"}A`
                            : "--A"}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Actions Section | Fichas Tecnicas Internas*/}
              {visible === "hidden" && (
                <div
                  className={`${viewType === "grid"
                      ? "flex flex-row gap-2 mt-3 pt-3 border-t border-gray-200/60"
                      : "flex flex-col gap-1 flex-shrink-0"
                    }`}
                >
                  {viewType === "grid" ? (
                    <>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          handleOpenFichaTecnicaOnNewTab(model.integradora_Id);
                        }}
                      >
                        {t("technical_report.technical_report")}
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleFichaTecnica(model.integradora_Id);
                        }}
                      >
                        {t("technical_report.more_details")}
                      </Button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          handleOpenFichaTecnicaOnNewTab(model.integradora_Id);
                        }}
                        className="px-2 py-1 text-[8px] sm:text-[10px] font-medium text-white bg-[#004494] hover:bg-[#003366] rounded transition-colors whitespace-nowrap"
                      >
                        {t("technical_report.technical_report")}
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleFichaTecnica(model.integradora_Id);
                        }}
                        className="px-2 py-1 text-[8px] sm:text-[10px] font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition-colors whitespace-nowrap"
                      >
                        {t("technical_report.more_details")}
                      </button>
                    </>
                  )}
                </div>
              )}
              {/* Actions Section | Fichas Tecnicas Web*/}
              {visible === "block" && (
                <div
                  className={`${viewType === "grid"
                      ? "flex flex-col gap-2 mt-3 pt-3 border-t border-gray-200/60"
                      : "flex flex-col gap-1 flex-shrink-0"
                    }`}
                >
                  {viewType === "grid" ? (
                    <>
                      <Link
                        to={`/fichas/cotizar?${new URLSearchParams(
                          model
                        ).toString()}`}
                        className="inline-flex items-center justify-center rounded-[5px] bg-[#FF9F00] text-white text-sm font-semibold px-3 py-2 hover:bg-[#FF8F00] active:scale-[0.98] transition-all duration-200"
                      >
                        {t("technical_report.get_a_quote")}
                      </Link>
                      <section className="flex gap-2">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleOpenFichaTecnicaOnNewTab(model.integradora_Id);
                          }}
                        >
                          {t("technical_report.technical_report")}
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleFichaTecnica(model.integradora_Id);
                          }}
                        >
                          {t("technical_report.more_details")}
                        </Button>
                      </section>
                    </>
                  ) : (
                    <>
                      <Link
                        to={`/fichas/cotizar?${new URLSearchParams(
                          model
                        ).toString()}`}
                        className="inline-flex items-center justify-center px-2 py-1 text-[8px] sm:text-[10px] font-semibold text-white bg-[#FF9F00] hover:bg-[#FF8F00] rounded transition-colors whitespace-nowrap"
                      >
                        {t("technical_report.get_a_quote")}
                      </Link>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          handleOpenFichaTecnicaOnNewTab(model.integradora_Id);
                        }}
                        className="px-2 py-1 text-[8px] sm:text-[10px] font-medium text-white bg-[#004494] hover:bg-[#003366] rounded transition-colors whitespace-nowrap"
                      >
                        {t("technical_report.technical_report")}
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleFichaTecnica(model.integradora_Id);
                        }}
                        className="px-2 py-1 text-[8px] sm:text-[10px] font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition-colors whitespace-nowrap"
                      >
                        {t("technical_report.more_details")}
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}

      {ficha && fichaTecnica && (
        <FichaModal
          visible={ficha}
          onClose={handleClose}
          ficha={fichaTecnica}
          isLoading={isLoading}
          error={error}
        />
      )}
    </>
  );
};
