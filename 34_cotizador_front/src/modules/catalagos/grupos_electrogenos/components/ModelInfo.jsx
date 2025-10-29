import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "../../../../components/custom/buttons/Button";
import { FormInputText } from "../../../../components/custom/inputs/FormInputText";
import { useFile } from "../../../../hooks/useFile";
import FileService from "../../../../services/fileService";
import { useEditData } from "../hooks/useEditData";
import { useInfo } from "../hooks/useInfo";
// Centralized base URL for files (should come from .env)
const FILES_BASE_URL =
  import.meta.env.VITE_FILES_BASE_URL ||
  "https://cotizador.modasa.com.pe/storage/cotizadormodasa/";

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

  // Inicializar fileUrls con las rutas relativas
  const [fileUrls, setFileUrls] = useState({
    uModImgAbierto: null,
    uModImgInsonoro: null,
    uModImgDimensiones: null,
    uModImgDimensionesInsonoro: null,
  });

  // Memoize data to ensure stability
  const data = modeloInfo?.[0];

  // Initialize editData with the stable data
  const { editData, handleChange, handleSave } = useEditData(
    data,
    editMutateModelo
  );

  // Sincronizar fileUrls con los valores más recientes de modeloInfo (rutas relativas)
  useEffect(() => {
    if (data) {
      setFileUrls({
        uModImgAbierto: data.uModImgAbierto || null,
        uModImgInsonoro: data.uModImgInsonoro || null,
        uModImgDimensiones: data.uModImgDimensiones || null,
        uModImgDimensionesInsonoro: data.uModImgDimensionesInsonoro || null,
      });
    }
  }, [data]);

  // Update editData with fileUrls when they change
  useEffect(() => {
    const fieldsToUpdate = [
      { field: "uModImgAbierto", value: fileUrls.uModImgAbierto },
      { field: "uModImgInsonoro", value: fileUrls.uModImgInsonoro },
      { field: "uModImgDimensiones", value: fileUrls.uModImgDimensiones },
      {
        field: "uModImgDimensionesInsonoro",
        value: fileUrls.uModImgDimensionesInsonoro,
      },
    ];

    fieldsToUpdate.forEach(({ field, value }) => {
      if (value !== undefined && value !== null && editData[field] !== value) {
        handleChange(field, value);
      }
    });
    // editData intentionally omitted to avoid infinite loop when updating derived state
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileUrls, handleChange]);

  useEffect(() => {
    const handleFileUploadComplete = (event) => {
      const { fieldName, fileUrl } = event.detail;
      setFileUrls((prev) => ({ ...prev, [fieldName]: fileUrl }));
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
  }, []);

  const fetchImageUrlDirectly = async (path, imageType, fieldName) => {
    if (!path) return;

    setLoadingState((prev) => ({ ...prev, [imageType]: true }));

    try {
      const baseUrl = FILES_BASE_URL;

      // Eliminar duplicaciones en la ruta
      let normalizedPath = path;
      const prefix = "grupos_electrogenos/cabina-insonorizada/";
      if (normalizedPath.startsWith(prefix + prefix)) {
        normalizedPath = normalizedPath.replace(prefix + prefix, prefix);
      } else if (
        normalizedPath.startsWith(prefix + "grupos_electrogenos/dimensiones/")
      ) {
        normalizedPath = normalizedPath.replace(
          prefix + "grupos_electrogenos/dimensiones/",
          "grupos_electrogenos/dimensiones/"
        );
      } else if (
        normalizedPath.startsWith(
          prefix + "grupos_electrogenos/cabina-abierta/"
        )
      ) {
        normalizedPath = normalizedPath.replace(
          prefix + "grupos_electrogenos/cabina-abierta/",
          "grupos_electrogenos/cabina-abierta/"
        );
      }

      const fullUrl = `${baseUrl}${normalizedPath}`; // URL corregida

      // Intentar cargar la imagen directamente sin solicitud HEAD
      const img = new Image();
      img.src = fullUrl;

      await new Promise((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () =>
          reject(new Error(`No se pudo cargar la imagen en ${fullUrl}`));
      });

      // Usar la URL completa para mostrar la imagen
      const url =
        (await FileService.getFileUrl({ fileName: normalizedPath })) || fullUrl;
      setImageUrls((prev) => ({ ...prev, [imageType]: url }));
      setFilePreviewData((prev) => ({
        ...prev,
        [fieldName]: {
          type: "image",
          url: url, // URL completa para el preview
          name: path.split("/").pop() || fieldName,
        },
      }));
      // Guardar solo la ruta relativa en fileUrls
      setFileUrls((prev) => ({ ...prev, [fieldName]: path }));
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
      if (!data?.sModNombre && !isCreating) return;

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

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("El archivo es demasiado grande. El tamaño máximo es 5MB.");
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

  const handleSaveWithImages = async (e) => {
    e.preventDefault();

    try {
      // Crear un objeto para los datos actualizados, empezando con los valores actuales de editData
      let updatedData = { ...editData };

      // Subir todas las imágenes antes de guardar
      const fields = [
        {
          name: "uModImgAbierto",
          subfolder: "grupos_electrogenos/cabina-abierta",
        },
        {
          name: "uModImgInsonoro",
          subfolder: "grupos_electrogenos/cabina-insonorizada",
        },
        {
          name: "uModImgDimensiones",
          subfolder: "grupos_electrogenos/dimensiones",
        },
        {
          name: "uModImgDimensionesInsonoro",
          subfolder: "grupos_electrogenos/dimensiones",
        },
      ];

      for (const { name, subfolder } of fields) {
        const file = fileData[name];
        if (file) {
          const response = await FileService.uploadFile({
            file: file,
            folder: subfolder,
            modelId: modelSelected?.ModeloGEId,
            fieldName: name,
            userId: 1, // Reemplazar con un user_id dinámico
          });

          let fileUrl;
          if (typeof response === "string") {
            fileUrl = response;
          } else {
            fileUrl = response?.url;
          }

          if (!fileUrl) {
            throw new Error(`No se recibió una URL válida para ${name}`);
          }

          // Asegurarnos de que fileUrl sea solo la ruta relativa
          const relativePath = fileUrl.startsWith(FILES_BASE_URL)
            ? fileUrl.replace(FILES_BASE_URL, "")
            : fileUrl;

          // Actualizar fileUrls y editData con la ruta relativa
          setFileUrls((prev) => ({ ...prev, [name]: relativePath }));
          handleChange(name, relativePath);

          // Actualizar el campo correspondiente en updatedData con la ruta relativa
          updatedData[name] = relativePath;

          const event = new CustomEvent("fileUploadComplete", {
            detail: { fieldName: name, fileUrl: relativePath },
          });
          document.querySelector("form")?.dispatchEvent(event);
        }
      }

      // Guardar solo los datos modificados
      await editMutateModelo(updatedData);
      setIsOpen(false);
      toast.success("Modelo actualizado correctamente");
    } catch (error) {
      toast.error("Error al guardar el modelo: " + error.message);
    }
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

  if (!data) {
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
      onSubmit={handleSaveWithImages}
      className="transition-all duration-300"
    >
      <h2 className="text-2xl font-bold mb-3">
        {isCreating ? "Crear Nuevo Modelo" : editData.sModNombre}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Columna izquierda */}
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
              label="Versión Abierta (Gal)"
              value={editData.nModTcombAbierto}
              onChange={(val) => handleChange("nModTcombAbierto", val)}
              keyfilter="int"
              type="number"
              step="1"
            />
            <InfoItem
              label="Versión Insonorizada (Gal)"
              value={editData.nModTcombInsonoro}
              onChange={(val) => handleChange("nModTcombInsonoro", val)}
              keyfilter="int"
              type="number"
              step="1"
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

        {/* Columna derecha */}
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

      {/* Sección de Imágenes - Diseñadas como Tarjetas */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Imágenes</h3>
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
              {loadingState.abierto ? (
                <div className="flex justify-center items-center h-40">
                  <p className="text-gray-500 text-sm">Cargando imagen...</p>
                </div>
              ) : filePreviewData.uModImgAbierto ? (
                <img
                  src={filePreviewData.uModImgAbierto.url}
                  alt={filePreviewData.uModImgAbierto.name}
                  className="w-full h-40 object-contain rounded-md border border-gray-200 bg-gray-50"
                />
              ) : imageUrls.abierto ? (
                <img
                  src={imageUrls.abierto}
                  alt="Versión Abierta"
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
              {loadingState.insonoro ? (
                <div className="flex justify-center items-center h-40">
                  <p className="text-gray-500 text-sm">Cargando imagen...</p>
                </div>
              ) : filePreviewData.uModImgInsonoro ? (
                <img
                  src={filePreviewData.uModImgInsonoro.url}
                  alt={filePreviewData.uModImgInsonoro.name}
                  className="w-full h-40 object-contain rounded-md border border-gray-200 bg-gray-50"
                />
              ) : imageUrls.insonoro ? (
                <img
                  src={imageUrls.insonoro}
                  alt="Versión Insonorizada"
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
              {loadingState.dimensiones ? (
                <div className="flex justify-center items-center h-40">
                  <p className="text-gray-500 text-sm">Cargando imagen...</p>
                </div>
              ) : filePreviewData.uModImgDimensiones ? (
                <img
                  src={filePreviewData.uModImgDimensiones.url}
                  alt={filePreviewData.uModImgDimensiones.name}
                  className="w-full h-40 object-contain rounded-md border border-gray-200 bg-gray-50"
                />
              ) : imageUrls.dimensiones ? (
                <img
                  src={imageUrls.dimensiones}
                  alt="Dimensión Abierta"
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
              {loadingState.dimensionesInsonoro ? (
                <div className="flex justify-center items-center h-40">
                  <p className="text-gray-500 text-sm">Cargando imagen...</p>
                </div>
              ) : filePreviewData.uModImgDimensionesInsonoro ? (
                <img
                  src={filePreviewData.uModImgDimensionesInsonoro.url}
                  alt={filePreviewData.uModImgDimensionesInsonoro.name}
                  className="w-full h-40 object-contain rounded-md border border-gray-200 bg-gray-50"
                />
              ) : imageUrls.dimensionesInsonoro ? (
                <img
                  src={imageUrls.dimensionesInsonoro}
                  alt="Dimensión Insonorizada"
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
  <section className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
    <h3 className="text-sm font-semibold mb-3 text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-2">
      {title}
    </h3>
    <div className="space-y-2">{children}</div>
  </section>
);

const InfoItem = ({ label, value, onChange, disabled, ...rest }) => (
  <div className="w-full">
    <FormInputText
      type="text"
      label={label}
      className="p-input w-full text-xs"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      {...rest}
    />
  </div>
);
