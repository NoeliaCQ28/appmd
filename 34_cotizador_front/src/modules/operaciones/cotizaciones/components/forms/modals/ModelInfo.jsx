import { InputText } from "primereact/inputtext";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "../../../../components/custom/buttons/Button";
import { FileUpload } from "../../../../components/FileUpload";
import { useFile } from "../../../../hooks/useFile";
import FileService from "../../../../services/fileService";
import { useEditData } from "../hooks/useEditData";
import { useInfo } from "../hooks/useInfo";

export const ModelInfo = ({ modelSelected, setIsOpen, isCreating = false }) => {
  const { modeloInfo, editMutateModelo } = useInfo({ modelSelected });
  const { getFileUrlMutate } = useFile();

  const [imageUrls, setImageUrls] = useState({
    abierto: null,
    insonoro: null,
    dimensiones: null,
    dimensionesInsonoro: null,
  });

  const [loadingState, setLoadingState] = useState({
    abierto: false,
    insonoro: false,
    dimensiones: false,
    dimensionesInsonoro: false,
  });

  const [filePreviewData, setFilePreviewData] = useState({
    uModImgAbierto: null,
    uModImgInsonoro: null,
    uModImgDimensiones: null,
    uModImgDimensionesInsonoro: null,
  });

  const [fileData, setFileData] = useState({
    uModImgAbierto: null,
    uModImgInsonoro: null,
    uModImgDimensiones: null,
    uModImgDimensionesInsonoro: null,
  });

  const [fileUrls, setFileUrls] = useState({
    uModImgAbierto: modelSelected?.uModImgAbierto || null,
    uModImgInsonoro: modelSelected?.uModImgInsonoro || null,
    uModImgDimensiones: modelSelected?.uModImgDimensiones || null,
    uModImgDimensionesInsonoro:
      modelSelected?.uModImgDimensionesInsonoro || null,
  });

  const data = useMemo(() => modeloInfo?.[0] || {}, [modeloInfo]);

  const { editData, handleChange, handleSave } = useEditData(
    {
      ...data,
      uModImgAbierto: fileUrls.uModImgAbierto,
      uModImgInsonoro: fileUrls.uModImgInsonoro,
      uModImgDimensiones: fileUrls.uModImgDimensiones,
      uModImgDimensionesInsonoro: fileUrls.uModImgDimensionesInsonoro,
    },
    editMutateModelo
  );

  useEffect(() => {
    const handleFileUploadComplete = (event) => {
      const { fieldName, fileUrl } = event.detail;
      setFileUrls((prev) => ({ ...prev, [fieldName]: fileUrl }));
      handleChange(fieldName, fileUrl);
      toast.success(`Archivo ${fieldName} subido correctamente`);
    };

    const form = document.querySelector("form");
    if (form) {
      form.addEventListener("fileUploadComplete", handleFileUploadComplete);
    }

    return () => {
      if (form) {
        form.removeEventListener(
          "fileUploadComplete",
          handleFileUploadComplete
        );
      }
    };
  }, [handleChange]);

  const fetchImageUrlDirectly = async (path, imageType, fieldName) => {
    if (!path) return;

    setLoadingState((prev) => ({ ...prev, [imageType]: true }));

    try {
      const baseUrl = "https://cotizador.modasa.com.pe/storage/cotizadormodasa/";
      const fullUrl = `${baseUrl}${path}`;
      const response = await fetch(fullUrl, { method: "HEAD" });
      if (!response.ok) {
        throw new Error(`No se pudo acceder a la imagen en ${fullUrl}`);
      }

      const url = (await FileService.getFileUrl({ fileName: path })) || fullUrl;
      setImageUrls((prev) => ({ ...prev, [imageType]: url }));
      setFilePreviewData((prev) => ({
        ...prev,
        [fieldName]: {
          type: "image",
          url: url,
          name: path.split("/").pop() || fieldName,
        },
      }));
    } catch (error) {
      console.error(`Error al cargar imagen de ${imageType}:`, error);
      toast.error(`Error al cargar imagen de ${imageType}`);
      setFilePreviewData((prev) => ({ ...prev, [fieldName]: null }));
    } finally {
      setLoadingState((prev) => ({ ...prev, [imageType]: false }));
    }
  };

  useEffect(() => {
    const fetchAllImages = async () => {
      if (!data.sModNombre && !isCreating) return;

      const imageFields = [
        { path: data.uModImgAbierto, type: "abierto", field: "uModImgAbierto" },
        {
          path: data.uModImgInsonoro,
          type: "insonoro",
          field: "uModImgInsonoro",
        },
        {
          path: data.uModImgDimensiones,
          type: "dimensiones",
          field: "uModImgDimensiones",
        },
        {
          path: data.uModImgDimensionesInsonoro,
          type: "dimensionesInsonoro",
          field: "uModImgDimensionesInsonoro",
        },
      ];

      for (const { path, type, field } of imageFields) {
        if (path) {
          await fetchImageUrlDirectly(path, type, field);
        }
      }
    };

    fetchAllImages();
  }, [data, isCreating]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const inputName = event.target.name;

    if (!file) {
      setFilePreviewData((prev) => ({ ...prev, [inputName]: null }));
      setFileData((prev) => ({ ...prev, [inputName]: null }));
      setFileUrls((prev) => ({ ...prev, [inputName]: null }));
      handleChange(inputName, null);
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/svg+xml",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Por favor, sube una imagen válida (JPEG, PNG, WebP o SVG).");
      return;
    }

    setFileData((prev) => ({ ...prev, [inputName]: file }));

    const reader = new FileReader();
    reader.onload = (e) => {
      setFilePreviewData((prev) => ({
        ...prev,
        [inputName]: { type: "image", url: e.target.result, name: file.name },
      }));
    };
    reader.readAsDataURL(file);
  };

  const removeFilePreview = (name) => {
    const fileInput = document.getElementById(name);
    if (fileInput) fileInput.value = "";

    setFilePreviewData((prev) => ({ ...prev, [name]: null }));
    setFileData((prev) => ({ ...prev, [name]: null }));
    setFileUrls((prev) => ({ ...prev, [name]: null }));
    setImageUrls((prev) => ({
      ...prev,
      [name.replace("uModImg", "").toLowerCase()]: null,
    }));
    handleChange(name, null);
  };

  if (!isCreating && !data.sModNombre) {
    return (
      <div className="flex justify-center items-center p-8 text-blue-600">
        <div className="animate-pulse text-lg">
          Cargando información del modelo...
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSave();
        setIsOpen(false);
      }}
      className="bg-gradient-to-br from-blue-50 to-white rounded-lg shadow-lg p-6 transition-all duration-300"
    >
      <h2 className="text-2xl font-bold mb-6 text-blue-900 pb-3">
        {isCreating ? "Crear Nuevo Modelo" : editData.sModNombre}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Left column */}
        <div className="space-y-5">
          <InfoSection title="Información General">
            <InfoItem
              label="Modelo"
              value={editData.sModNombre}
              onChange={(val) => handleChange("sModNombre", val)}
            />
            <InfoItem
              label="Normas Técnicas"
              value={editData.sModNormaTecnica}
              onChange={(val) => handleChange("sModNormaTecnica", val)}
            />
            <InfoItem
              label="Nivel de Ruido"
              value={editData.sModNiveldeRuido}
              onChange={(val) => handleChange("sModNiveldeRuido", val)}
            />
          </InfoSection>

          <InfoSection title="Consumo de Combustible">
            <InfoItem
              label="Versión Abierta (L/h)"
              value={editData.nModTcombAbierto}
              onChange={(val) => handleChange("nModTcombAbierto", val)}
            />
            <InfoItem
              label="Versión Insonorizada (L/h)"
              value={editData.nModTcombInsonoro}
              onChange={(val) => handleChange("nModTcombInsonoro", val)}
            />
          </InfoSection>

          <InfoSection title="Módulo de control">
            <InfoItem
              label="Módulo de control"
              value={editData.sIntModControl}
              onChange={(val) => handleChange("sIntModControl", val)}
            />
          </InfoSection>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          <InfoSection title="Dimensiones Versión Abierta">
            <InfoItem
              label="Largo (mm)"
              value={editData.nModDimensionesA}
              onChange={(val) => handleChange("nModDimensionesA", val)}
            />
            <InfoItem
              label="Ancho (mm)"
              value={editData.nModDimensionesB}
              onChange={(val) => handleChange("nModDimensionesB", val)}
            />
            <InfoItem
              label="Altura (mm)"
              value={editData.nModDimensionesC}
              onChange={(val) => handleChange("nModDimensionesC", val)}
            />
            <InfoItem
              label="Peso (kg)"
              value={editData.nModDimensionesPeso1}
              onChange={(val) => handleChange("nModDimensionesPeso1", val)}
            />
          </InfoSection>

          <InfoSection title="Dimensiones Versión Insonorizada">
            <InfoItem
              label="Largo (mm)"
              value={editData.nModDimensionesX}
              onChange={(val) => handleChange("nModDimensionesX", val)}
            />
            <InfoItem
              label="Ancho (mm)"
              value={editData.nModDimensionesY}
              onChange={(val) => handleChange("nModDimensionesY", val)}
            />
            <InfoItem
              label="Altura (mm)"
              value={editData.nModDimensionesZ}
              onChange={(val) => handleChange("nModDimensionesZ", val)}
            />
            <InfoItem
              label="Peso (kg)"
              value={editData.nModDimensionesPeso2}
              onChange={(val) => handleChange("nModDimensionesPeso2", val)}
            />
          </InfoSection>
        </div>
      </div>

      {/* Images Section - Diseñadas como Cards */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4 text-blue-800">Imágenes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Versión Abierta */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <h4 className="bg-gray-100 text-gray-800 p-3 font-semibold text-base border-b border-gray-200">
              Versión Abierta
            </h4>
            <div className="p-4">
              <div className="flex items-center mb-3 space-x-4">
                <label className="block">
                  <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md cursor-pointer hover:bg-gray-300 transition-colors text-sm">
                    Seleccionar archivo
                    <input
                      type="file"
                      name="uModImgAbierto"
                      accept="image/*,image/svg+xml"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </span>
                </label>
                {filePreviewData.uModImgAbierto && (
                  <p className="text-sm text-gray-600 truncate">
                    {filePreviewData.uModImgAbierto.name}
                  </p>
                )}
              </div>
              {filePreviewData.uModImgAbierto ? (
                <img
                  src={filePreviewData.uModImgAbierto.url}
                  alt={filePreviewData.uModImgAbierto.name}
                  className="w-full h-40 object-contain rounded-md border border-gray-200 bg-gray-50"
                />
              ) : (
                <div className="flex justify-center items-center h-40 bg-gray-50 rounded-md border border-gray-200">
                  <p className="text-gray-500 text-sm">No hay imagen</p>
                </div>
              )}
            </div>
          </div>

          {/* Versión Insonorizada */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <h4 className="bg-gray-100 text-gray-800 p-3 font-semibold text-base border-b border-gray-200">
              Versión Insonorizada
            </h4>
            <div className="p-4">
              <div className="flex items-center mb-3 space-x-4">
                <label className="block">
                  <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md cursor-pointer hover:bg-gray-300 transition-colors text-sm">
                    Seleccionar archivo
                    <input
                      type="file"
                      name="uModImgInsonoro"
                      accept="image/*,image/svg+xml"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </span>
                </label>
                {filePreviewData.uModImgInsonoro && (
                  <p className="text-sm text-gray-600 truncate">
                    {filePreviewData.uModImgInsonoro.name}
                  </p>
                )}
              </div>
              {filePreviewData.uModImgInsonoro ? (
                <img
                  src={filePreviewData.uModImgInsonoro.url}
                  alt={filePreviewData.uModImgInsonoro.name}
                  className="w-full h-40 object-contain rounded-md border border-gray-200 bg-gray-50"
                />
              ) : (
                <div className="flex justify-center items-center h-40 bg-gray-50 rounded-md border border-gray-200">
                  <p className="text-gray-500 text-sm">No hay imagen</p>
                </div>
              )}
            </div>
          </div>

          {/* Dimensión Abierta */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <h4 className="bg-gray-100 text-gray-800 p-3 font-semibold text-base border-b border-gray-200">
              Dimensión Abierta
            </h4>
            <div className="p-4">
              <div className="flex items-center mb-3 space-x-4">
                <label className="block">
                  <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md cursor-pointer hover:bg-gray-300 transition-colors text-sm">
                    Seleccionar archivo
                    <input
                      type="file"
                      name="uModImgDimensiones"
                      accept="image/*,image/svg+xml"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </span>
                </label>
                {filePreviewData.uModImgDimensiones && (
                  <p className="text-sm text-gray-600 truncate">
                    {filePreviewData.uModImgDimensiones.name}
                  </p>
                )}
              </div>
              {filePreviewData.uModImgDimensiones ? (
                <img
                  src={filePreviewData.uModImgDimensiones.url}
                  alt={filePreviewData.uModImgDimensiones.name}
                  className="w-full h-40 object-contain rounded-md border border-gray-200 bg-gray-50"
                />
              ) : (
                <div className="flex justify-center items-center h-40 bg-gray-50 rounded-md border border-gray-200">
                  <p className="text-gray-500 text-sm">No hay imagen</p>
                </div>
              )}
            </div>
          </div>

          {/* Dimensión Insonorizada */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <h4 className="bg-gray-100 text-gray-800 p-3 font-semibold text-base border-b border-gray-200">
              Dimensión Insonorizada
            </h4>
            <div className="p-4">
              <div className="flex items-center mb-3 space-x-4">
                <label className="block">
                  <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md cursor-pointer hover:bg-gray-300 transition-colors text-sm">
                    Seleccionar archivo
                    <input
                      type="file"
                      name="uModImgDimensionesInsonoro"
                      accept="image/*,image/svg+xml"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </span>
                </label>
                {filePreviewData.uModImgDimensionesInsonoro && (
                  <p className="text-sm text-gray-600 truncate">
                    {filePreviewData.uModImgDimensionesInsonoro.name}
                  </p>
                )}
              </div>
              {filePreviewData.uModImgDimensionesInsonoro ? (
                <img
                  src={filePreviewData.uModImgDimensionesInsonoro.url}
                  alt={filePreviewData.uModImgDimensionesInsonoro.name}
                  className="w-full h-40 object-contain rounded-md border border-gray-200 bg-gray-50"
                />
              ) : (
                <div className="flex justify-center items-center h-40 bg-gray-50 rounded-md border border-gray-200">
                  <p className="text-gray-500 text-sm">No hay imagen</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-6 mt-6">
        <Button type="submit">{isCreating ? "Crear" : "Guardar"}</Button>
        <Button
          type="button"
          onClick={() => setIsOpen(false)}
          variant="destructive"
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
};

const InfoSection = ({ title, children }) => (
  <section className="bg-white rounded-lg p-4 shadow-md border-l-4 border-orange-400">
    <h3 className="text-lg font-semibold mb-3 text-blue-700">{title}</h3>
    <div className="space-y-2">{children}</div>
  </section>
);

const InfoItem = ({ label, value, onChange }) => (
  <div className="flex justify-between items-center py-1">
    <span className="text-blue-900 font-medium">{label}:</span>
    <InputText
      type="text"
      className="p-inputtext-sm w-1/2"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);
