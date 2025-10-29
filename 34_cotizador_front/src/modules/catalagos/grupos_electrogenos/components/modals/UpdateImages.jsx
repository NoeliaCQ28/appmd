import React, { useState, useMemo, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Checkbox } from "primereact/checkbox";
import { InputText } from "primereact/inputtext";
import { Button } from "../../../../../components/custom/buttons/Button";
import { toast } from "react-toastify";
import FileService from "../../../../../services/fileService";
import { useQueryClient } from "@tanstack/react-query";
import { useInfo } from "../../hooks/useInfo";
import { Modal } from "../../../../../components/modals/Modal";

const user_id = 1;

const UpdateImages = ({ isOpen, setIsOpen, models }) => {
  const queryClient = useQueryClient();
  const [modalFilterQuery, setModalFilterQuery] = useState("");
  const [selectedModels, setSelectedModels] = useState([]);
  const [fileData, setFileData] = useState({
    uModImgAbierto: null,
    uModImgInsonoro: null,
    uModImgDimensiones: null,
    uModImgDimensionesInsonoro: null,
  });
  const [filePreviewData, setFilePreviewData] = useState({
    uModImgAbierto: null,
    uModImgInsonoro: null,
    uModImgDimensiones: null,
    uModImgDimensionesInsonoro: null,
  });
  const [fileUrls, setFileUrls] = useState({
    uModImgAbierto: null,
    uModImgInsonoro: null,
    uModImgDimensiones: null,
    uModImgDimensionesInsonoro: null,
  });
  const [isUploading, setIsUploading] = useState(false);
  const [loadingState, setLoadingState] = useState({
    uModImgAbierto: false,
    uModImgInsonoro: false,
    uModImgDimensiones: false,
    uModImgDimensionesInsonoro: false,
  });

  const { editMutateModelImages } = useInfo({
    modelSelected: models[0] || {},
  });

  const uniqueModels = useMemo(() => {
    const seen = new Set();
    const filtered = models.filter((model) => {
      if (seen.has(model.Modelo)) return false;
      seen.add(model.Modelo);
      return true;
    });

    if (!modalFilterQuery.trim()) return filtered;

    const query = modalFilterQuery.toLowerCase();
    return filtered.filter((model) =>
      model.Modelo?.toLowerCase().includes(query)
    );
  }, [models, modalFilterQuery]);

  const onModelChange = (model) => {
    const updatedSelection = selectedModels.includes(model)
      ? selectedModels.filter((m) => m !== model)
      : [...selectedModels, model];
    setSelectedModels(updatedSelection);
  };

  const fetchImageUrlDirectly = async (path, imageType, fieldName) => {
    if (!path) return;

    setLoadingState((prev) => ({ ...prev, [fieldName]: true }));

    try {
      const baseUrl = "https://cotizador.modasa.com.pe/storage/cotizadormodasa/";
      const fullPath = path.startsWith("http") ? path : `${baseUrl}${path}`;
      const response = await fetch(fullPath, { method: "HEAD" });
      if (!response.ok) {
        throw new Error(`No se pudo acceder a la imagen en ${fullPath}`);
      }

      const url =
        (await FileService.getFileUrl({ fileName: path })) || fullPath;
      setFilePreviewData((prev) => ({
        ...prev,
        [fieldName]: { type: "image", url, name: path.split("/").pop() },
      }));
      setFileUrls((prev) => ({
        ...prev,
        [fieldName]: url,
      }));
    } catch (error) {
      console.error(`Error al cargar imagen de ${imageType}:`, error);
      toast.error(`Error al cargar imagen de ${imageType}`);
      setFilePreviewData((prev) => ({ ...prev, [fieldName]: null }));
    } finally {
      setLoadingState((prev) => ({ ...prev, [fieldName]: false }));
    }
  };

  useEffect(() => {
    const fetchFirstImages = async () => {
      for (const model of uniqueModels) {
        const imageFields = [
          {
            path: model.uModImgAbierto,
            type: "abierto",
            field: "uModImgAbierto",
          },
          {
            path: model.uModImgInsonoro,
            type: "insonoro",
            field: "uModImgInsonoro",
          },
          {
            path: model.uModImgDimensiones,
            type: "dimensiones",
            field: "uModImgDimensiones",
          },
          {
            path: model.uModImgDimensionesInsonoro,
            type: "dimensionesInsonoro",
            field: "uModImgDimensionesInsonoro",
          },
        ];

        for (const { path, type, field } of imageFields) {
          if (path) {
            const paths = path.split(",").filter(Boolean);
            if (paths.length > 0) {
              await fetchImageUrlDirectly(paths[0], type, field);
            }
          }
        }
      }
    };

    fetchFirstImages();
  }, [uniqueModels]);

  const handleFileChange = (fieldName, event) => {
    const files = Array.from(event.target.files);
    if (!files.length) {
      setFilePreviewData((prev) => ({ ...prev, [fieldName]: null }));
      setFileData((prev) => ({ ...prev, [fieldName]: null }));
      setFileUrls((prev) => ({ ...prev, [fieldName]: null }));
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/svg+xml",
    ];
    const maxSize = 5 * 1024 * 1024;

    const file = files[0]; // Solo toma el primer archivo
    if (!allowedTypes.includes(file.type)) {
      toast.error(
        `El archivo ${file.name} no es válido. Usa JPEG, PNG, WebP o SVG.`
      );
      return;
    }
    if (file.size > maxSize) {
      toast.error(`El archivo ${file.name} es demasiado grande. Máximo 5MB.`);
      return;
    }

    setFileData((prev) => ({
      ...prev,
      [fieldName]: file,
    }));

    const reader = new FileReader();
    reader.onload = (e) =>
      setFilePreviewData((prev) => ({
        ...prev,
        [fieldName]: { type: "image", url: e.target.result, name: file.name },
      }));
    reader.readAsDataURL(file);
  };

  const handleSaveImages = async (e) => {
    e.preventDefault();

    if (selectedModels.length === 0) {
      toast.warn("Por favor, selecciona al menos un modelo.");
      return;
    }

    const hasImages = Object.values(fileData).some((file) => file !== null);
    if (!hasImages) {
      toast.warn("Por favor, selecciona al menos una imagen.");
      return;
    }

    setIsUploading(true);
    try {
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

      const uploadedUrls = {};

      for (const { name, subfolder } of fields) {
        const file = fileData[name];
        if (file) {
          const response = await FileService.uploadFile({
            file,
            folder: subfolder,
            modelId: models.find((m) => m.Modelo === selectedModels[0])
              ?.ModeloGEId,
            fieldName: name,
            userId: user_id,
          });

          let fileUrl = typeof response === "string" ? response : response?.url;
          if (!fileUrl) {
            throw new Error(`No se recibió una URL válida para ${file.name}`);
          }

          const relativePath = fileUrl.startsWith(
            "https://cotizador.modasa.com.pe/storage/cotizadormodasa/"
          )
            ? fileUrl.replace("https://cotizador.modasa.com.pe/storage/cotizadormodasa/", "")
            : fileUrl;

          uploadedUrls[name] = relativePath;
        }
      }

      for (const model of selectedModels) {
        const modelData = models.find((m) => m.Modelo === model);
        if (
          !modelData ||
          !modelData.ModeloGEId ||
          isNaN(modelData.ModeloGEId)
        ) {
          throw new Error(`ModeloGEId inválido para el modelo ${model}`);
        }

        const updatedData = {
          ModeloGEId: Number(modelData.ModeloGEId),
          uModImgAbierto: uploadedUrls.uModImgAbierto || null,
          uModImgInsonoro: uploadedUrls.uModImgInsonoro || null,
          uModImgDimensiones: uploadedUrls.uModImgDimensiones || null,
          uModImgDimensionesInsonoro:
            uploadedUrls.uModImgDimensionesInsonoro || null,
          user_id,
        };

        await editMutateModelImages(updatedData);
      }

      setIsOpen(false);
      setSelectedModels([]);
      setFileData({
        uModImgAbierto: null,
        uModImgInsonoro: null,
        uModImgDimensiones: null,
        uModImgDimensionesInsonoro: null,
      });
      setFilePreviewData({
        uModImgAbierto: null,
        uModImgInsonoro: null,
        uModImgDimensiones: null,
        uModImgDimensionesInsonoro: null,
      });
      setFileUrls({
        uModImgAbierto: null,
        uModImgInsonoro: null,
        uModImgDimensiones: null,
        uModImgDimensionesInsonoro: null,
      });
      toast.success("Imágenes actualizadas correctamente");
      queryClient.invalidateQueries(["info-modelo"]);
    } catch (error) {
      console.error("Error al guardar las imágenes:", error);
      const errorMessage = error.message.includes("ModeloGEId")
        ? "El ID del modelo es inválido. Verifica los datos."
        : error.message.includes("URL válida")
        ? "Error al subir los archivos. Intenta de nuevo."
        : "Error al guardar las imágenes: " + error.message;
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal
      open={isOpen}
      setOpen={(value) => {
        setIsOpen(value);

        if (!value) {
          setIsOpen(false);
          setModalFilterQuery("");
          setSelectedModels([]);
          setFileData({
            uModImgAbierto: null,
            uModImgInsonoro: null,
            uModImgDimensiones: null,
            uModImgDimensionesInsonoro: null,
          });
          setFilePreviewData({
            uModImgAbierto: null,
            uModImgInsonoro: null,
            uModImgDimensiones: null,
            uModImgDimensionesInsonoro: null,
          });
          setFileUrls({
            uModImgAbierto: null,
            uModImgInsonoro: null,
            uModImgDimensiones: null,
            uModImgDimensionesInsonoro: null,
          });
        }
      }}
      width="max-w-4xl"
      title={"Asignar Imágenes a Grupos Electrógenos"}
      footer={
        <>
          <Button
            label="Guardar"
            onClick={handleSaveImages}
            disabled={isUploading || selectedModels.length === 0}
            loading={isUploading}
          />
          <Button
            label="Cancelar"
            onClick={() => setIsOpen(false)}
            variant="destructive"
            disabled={isUploading}
          />
        </>
      }
    >
      <form
        className="bg-gray-50 rounded-lg"
        onSubmit={(e) => {
          e.preventDefault();
          handleSaveImages(e);
        }}
      >
        <div className="mb-4">
          <InputText
            type="text"
            placeholder="Buscar modelos..."
            value={modalFilterQuery}
            onChange={(e) => setModalFilterQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
              }
            }}
            className="p-2 outline-none w-full bg-white border border-gray-300 rounded-xl placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-4 max-h-[300px] overflow-y-auto p-4 bg-white rounded-xl shadow-sm border border-gray-200">
          {uniqueModels.length > 0 ? (
            uniqueModels.map((model) => (
              <div
                key={model.Modelo}
                className="flex items-center p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors w-[calc(33.333%-0.5rem)] lg:w-[calc(14.286%-0.5rem)]"
              >
                <Checkbox
                  inputId={model.Modelo}
                  value={model.Modelo}
                  onChange={() => onModelChange(model.Modelo)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      onModelChange(model.Modelo);
                    }
                  }}
                  checked={selectedModels.includes(model.Modelo)}
                  disabled={isUploading}
                  className="mr-2"
                />
                <label
                  htmlFor={model.Modelo}
                  className="text-gray-700 text-xs font-medium"
                >
                  {model.Modelo}
                </label>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-4">
              No hay modelos disponibles para seleccionar.
            </div>
          )}
        </div>

        {selectedModels.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold mb-4">
              Imágenes para Modelos Seleccionados
            </h3>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <div className="grid grid-cols-2 gap-6">
                {[
                  {
                    title: "Versión Abierta",
                    name: "uModImgAbierto",
                    field: "uModImgAbierto",
                  },
                  {
                    title: "Versión Insonorizada",
                    name: "uModImgInsonoro",
                    field: "uModImgInsonoro",
                  },
                  {
                    title: "Dimensión Abierta",
                    name: "uModImgDimensiones",
                    field: "uModImgDimensiones",
                  },
                  {
                    title: "Dimensión Insonorizada",
                    name: "uModImgDimensionesInsonoro",
                    field: "uModImgDimensionesInsonoro",
                  },
                ].map(({ title, name, field }) => (
                  <div
                    key={name}
                    className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
                  >
                    <h4 className="bg-gray-100 text-gray-800 p-3 font-semibold text-base border-b border-gray-200">
                      {title}
                    </h4>
                    <div className="p-4">
                      <div className="flex items-center mb-3 space-x-4">
                        <Button
                          label="Subir Archivos"
                          type="button"
                          className="bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors px-4 py-2 rounded-md text-sm"
                          onClick={() =>
                            document.getElementById(`fileInput-${name}`).click()
                          }
                          disabled={isUploading}
                        />
                        <input
                          id={`fileInput-${name}`}
                          type="file"
                          accept="image/*,image/svg+xml"
                          onChange={(e) => handleFileChange(field, e)}
                          className="hidden"
                          disabled={isUploading}
                        />
                        {filePreviewData[name] && (
                          <p className="text-sm text-gray-600 truncate">
                            {filePreviewData[name].name}
                          </p>
                        )}
                      </div>
                      {loadingState[name] ? (
                        <div className="flex justify-center items-center h-40">
                          <p className="text-gray-500 text-sm">
                            Cargando imagen...
                          </p>
                        </div>
                      ) : filePreviewData[name] ? (
                        <div>
                          <img
                            src={filePreviewData[name].url}
                            alt={filePreviewData[name].name}
                            className="w-full h-40 object-contain rounded-md border border-gray-200 bg-gray-50"
                          />
                          <Button
                            type="button"
                            label="Eliminar"
                            className="mt-2 text-xs bg-red-500 text-white hover:bg-red-600 px-3 py-1 rounded-md"
                            onClick={() => {
                              setFilePreviewData((prev) => ({
                                ...prev,
                                [name]: null,
                              }));
                              setFileData((prev) => ({
                                ...prev,
                                [name]: null,
                              }));
                              setFileUrls((prev) => ({
                                ...prev,
                                [name]: null,
                              }));
                            }}
                          />
                        </div>
                      ) : (
                        <div className="flex justify-center items-center h-40 bg-gray-50 rounded-md border border-gray-200">
                          <p className="text-gray-500 text-sm">No hay imagen</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
};

export default UpdateImages;
