import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import FileService from "../../../../services/fileService";
import { DatosTecnicos } from "./DatosTecnicos";
import dimensionesPrueba from "/dimensionesPrueba.png";
import geabierto from "/default-ge-abierto.webp";
import geinsonoro from "/default-ge-insonoro.webp";
import imageTableroControlPrueba from "/tableroControlPrueba.png";
import site from "../../../../config/site";
import { safeString } from "../../../../utils/utils";
import { useTranslation } from "react-i18next";

export const FichaTecnica = ({ ficha }) => {
  const baseUrl = "https://cotizador.modasa.com.pe/storage/cotizadormodasa/";

  // Estados para las URLs de las imágenes y el estado de carga
  const [imageUrls, setImageUrls] = useState({
    insonoro: null,
    abierto: null,
    dimensiones: null,
    dimensionesInsonoro: null,
  });

  const [loadingState, setLoadingState] = useState({
    insonoro: false,
    abierto: false,
    dimensiones: false,
    dimensionesInsonoro: false,
  });

  const [selectedImage, setSelectedImage] = useState(null);

  const fetchImageUrlDirectly = async (path, imageType) => {
    if (!path || path === "null" || path.trim() === "") {
      setImageUrls((prev) => ({ ...prev, [imageType]: null }));
      return;
    }

    setLoadingState((prev) => ({ ...prev, [imageType]: true }));

    try {
      const fullUrl = `${baseUrl}${path}`;

      const response = await fetch(fullUrl, { method: "HEAD" });
      if (!response.ok) {
        throw new Error(`No se pudo acceder a la imagen en ${fullUrl}`);
      }

      const url = (await FileService.getFileUrl({ fileName: path })) || fullUrl;
      setImageUrls((prev) => ({ ...prev, [imageType]: url }));
    } catch (error) {
      console.error(`Error al cargar imagen de ${imageType}:`, error);
      toast.error(`Error al cargar imagen de ${imageType}`);
      setImageUrls((prev) => ({ ...prev, [imageType]: null }));
    } finally {
      setLoadingState((prev) => ({ ...prev, [imageType]: false }));
    }
  };

  useEffect(() => {
    const fetchImages = async () => {
      const imageFields = [
        { path: ficha.uModImgInsonoro, type: "insonoro" },
        { path: ficha.uModImgAbierto, type: "abierto" },
        { path: ficha.uModImgDimensiones, type: "dimensiones" },
        {
          path: ficha.uModImgDimensionesInsonoro,
          type: "dimensionesInsonoro",
        },
      ];

      await Promise.all(
        imageFields.map(({ path, type }) => fetchImageUrlDirectly(path, type))
      );
    };

    fetchImages();
  }, [ficha]);

  useEffect(() => {
    if (imageUrls.insonoro || imageUrls.abierto) {
      if (ficha?.sTipoFabricacion === "CHINO") {
        setSelectedImage(imageUrls.insonoro || geinsonoro);
        return;
      }
      setSelectedImage(imageUrls.insonoro || imageUrls.abierto || geinsonoro);
    }
  }, [imageUrls, ficha]);

  const imageInsonoro = imageUrls.insonoro || geinsonoro;
  const imageAbierto = imageUrls.abierto || geabierto;
  const imageDimensiones = imageUrls.dimensiones || dimensionesPrueba;
  const imageDimensionesInsonoro =
    imageUrls.dimensionesInsonoro || dimensionesPrueba;

  const handleImageClick = (image) => {
    if (image) {
      setSelectedImage(image);
    }
  };

  const { t } = useTranslation();

  return (
    <div className=" max-w-7xl mx-auto">
      {/* Header */}
      <div className="p-2 sm:p-4 mb-3 sm:mb-6">
        <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-800">
          <span className="ml-1 sm:ml-2">{ficha?.sModNombre || "N/A"}</span>
        </h2>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-md overflow-hidden border border-gray-200">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6 p-3 lg:p-6">
          {/* Images Section */}
          <div className="space-y-3 sm:space-y-4 lg:space-y-6 col-span-1 lg:col-span-2">
            <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
              {/* Thumbnails */}
              {ficha?.sTipoFabricacion !== "CHINO" && (
                <div className="flex flex-row md:flex-col gap-2 sm:gap-3 justify-start">
                  {loadingState.insonoro ? (
                    <div className="w-16 h-12 sm:w-20 sm:h-16 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center flex-shrink-0">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-300 rounded"></div>
                    </div>
                  ) : (
                    <img
                      src={imageInsonoro}
                      className={`w-16 h-12 sm:w-20 sm:h-16 object-cover rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 border-2 flex-shrink-0 ${
                        selectedImage === imageInsonoro
                          ? "border-orange-500 shadow-md"
                          : "border-gray-200"
                      }`}
                      alt="Insonoro"
                      onClick={() => handleImageClick(imageInsonoro)}
                    />
                  )}

                  {loadingState.abierto ? (
                    <div className="w-16 h-12 sm:w-20 sm:h-16 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center flex-shrink-0">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-300 rounded"></div>
                    </div>
                  ) : (
                    imageAbierto && (
                      <img
                        src={imageAbierto}
                        className={`w-16 h-12 sm:w-20 sm:h-16 object-cover rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 border-2 flex-shrink-0 ${
                          selectedImage === imageAbierto
                            ? "border-orange-500 shadow-md"
                            : "border-gray-200"
                        }`}
                        alt="Abierto"
                        onClick={() => handleImageClick(imageAbierto)}
                      />
                    )
                  )}
                </div>
              )}

              {/* Main Image */}
              <div className="w-full bg-gray-50 rounded-lg overflow-hidden">
                {(loadingState.insonoro && selectedImage === imageInsonoro) ||
                (loadingState.abierto && selectedImage === imageAbierto) ? (
                  <div className="w-full h-48 sm:h-56 md:h-64 flex items-center justify-center">
                    <div className="animate-spin w-6 h-6 sm:w-8 sm:h-8 border-4 border-orange-500 border-t-transparent rounded-full"></div>
                  </div>
                ) : (
                  <img
                    src={selectedImage || geinsonoro}
                    alt="Generador"
                    className="w-full h-48 sm:h-56 md:h-64 lg:h-auto object-contain"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Specifications Table */}
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 col-span-1 lg:col-span-4">
            <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-orange-500 rounded-full mr-1.5 sm:mr-2"></span>
              {t("technical_report.technical_specifications")}
            </h3>

            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <DataTable
                value={[ficha]}
                className="text-[9px] sm:text-sm"
                stripedRows
                size="small"
              >
                <Column
                  header={t("technical_report_pdf.modelo")}
                  field="sModNombre"
                  className="font-medium"
                  headerClassName="bg-gray-100 text-gray-700 font-semibold"
                />
                <Column
                  header="Prime"
                  body={(rowData) => {
                    return (
                      <div className="text-center font-medium">
                        <div className="flex items-center gap-1">
                          {safeString(rowData?.PrimeKW)}
                          {site.powerUnits.kilowatt}
                        </div>
                        <div className="flex items-center gap-1">
                          {safeString(rowData?.PrimeKVA)}
                          {site.powerUnits.kilovoltAmpere}
                        </div>
                      </div>
                    );
                  }}
                  headerClassName="bg-gray-100 text-gray-700 font-semibold"
                />
                <Column
                  header="Stand By"
                  body={(rowData) => {
                    return (
                      <div className="text-center font-medium">
                        <div className="flex items-center gap-1">
                          {safeString(rowData?.StandByKW)}
                          {site.powerUnits.kilowatt}
                        </div>
                        <div className="flex items-center gap-1">
                          {safeString(rowData?.StandByKVA)}
                          {site.powerUnits.kilovoltAmpere}
                        </div>
                      </div>
                    );
                  }}
                  headerClassName="bg-gray-100 text-gray-700 font-semibold"
                />
                <Column
                  header={t("technical_report_pdf.voltage")}
                  body={(rowData) => (
                    <span className="font-medium">
                      {rowData.nIntVoltaje || "N/A"} V
                    </span>
                  )}
                  headerClassName="bg-gray-100 text-gray-700 font-semibold"
                />
                <Column
                  header={t("technical_report_pdf.frequency")}
                  body={(rowData) => (
                    <span className="font-medium">
                      {rowData.nIntFrecuencia || "N/A"} Hz
                    </span>
                  )}
                  headerClassName="bg-gray-100 text-gray-700 font-semibold"
                />
                <Column
                  header={t("technical_report_pdf.power_factor_sort")}
                  body={(rowData) => (
                    <span className="font-medium">
                      {Number(rowData?.nIntFP).toFixed(1) || "N/A"}
                    </span>
                  )}
                  headerClassName="bg-gray-100 text-gray-700 font-semibold"
                />
                <Column
                  header={t("technical_report_pdf.electric_current")}
                  body={(rowData) => (
                    <div className="text-center font-medium whitespace-nowrap">
                      {rowData?.CorrientePrimeA
                        ? Number.parseInt(rowData.CorrientePrimeA)
                        : "N/A"}{" "}
                      A
                    </div>
                  )}
                  headerClassName="bg-gray-100 text-gray-700 font-semibold "
                />
              </DataTable>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Data Component */}
      {ficha && (
        <div className="mt-6">
          <DatosTecnicos
            ficha={ficha}
            imageDimensiones={imageDimensiones}
            imageDimensionesInsonoro={imageDimensionesInsonoro}
            imageTableroControlPrueba={imageTableroControlPrueba}
            loadingDimensiones={loadingState.dimensiones}
            loadingDimensionesInsonoro={loadingState.dimensionesInsonoro}
          />
        </div>
      )}
    </div>
  );
};
