import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Button } from "../../../../../components/custom/buttons/Button";
import { FormInputText } from "../../../../../components/custom/inputs/FormInputText";
import FileService from "../../../../../services/fileService";
import { useGeneratorSet } from "../../../../operaciones/cotizaciones/hooks/useGeneratorSet";

export const GeneratorSetModelForm = ({ setIsOpen }) => {
  const { createGeneratorSetMutate } = useGeneratorSet();

  // NOTE: Renamed image fields to match backend (uModImg*)
  const initialValues = {
    sModNombre: "",
    sModNormaTecnica: "",
    sModNiveldeRuido: "",
    sModRuidoAmbiental: "",
    nModDimensionesA: "",
    nModDimensionesB: "",
    nModDimensionesC: "",
    nModDimensionesPeso1: "",
    nModDimensionesEsc1: "",
    nModTcombAbierto: "",
    nModTcombInsonoro: "",
    sIntModControl: "",
    nModDimensionesX: "",
    nModDimensionesY: "",
    nModDimensionesZ: "",
    nModDimensionesPeso2: "",
    nModDimensionesEsc2: "",
    uModImgAbierto: null,
    uModImgInsonoro: null,
    uModImgDimensiones: null,
    uModImgDimensionesInsonoro: null,
  };

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: initialValues,
    mode: "onChange",
    rules: {
      sModNombre: { required: "El nombre del modelo es obligatorio" },
    },
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
    uModImgAbierto: null,
    uModImgInsonoro: null,
    uModImgDimensiones: null,
    uModImgDimensionesInsonoro: null,
  });

  // Removed custom event listener; direct upload now handled per input

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const inputName = event.target.name; // e.g., uModImgAbierto

    if (!file) {
      setFilePreviewData((prev) => ({ ...prev, [inputName]: null }));
      setFileData((prev) => ({ ...prev, [inputName]: null }));
      setValue(inputName, null);
      return;
    }

    // Basic validations
    if (!file.type.startsWith("image/")) {
      toast.error("Solo se permiten imágenes");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("El tamaño máximo permitido es 5MB");
      return;
    }

    setFileData((prev) => ({ ...prev, [inputName]: file }));

    // Local preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setFilePreviewData((prev) => ({
        ...prev,
        [inputName]: { type: "image", url: e.target.result, name: file.name },
      }));
    };
    reader.readAsDataURL(file);

    try {
      const folderMap = {
        uModImgAbierto: "grupos_electrogenos/cabina-abierta",
        uModImgInsonoro: "grupos_electrogenos/cabina-insonorizada",
        uModImgDimensiones: "grupos_electrogenos/dimensiones",
        uModImgDimensionesInsonoro: "grupos_electrogenos/dimensiones",
      };
      const folder = folderMap[inputName] || "grupos_electrogenos";

      const response = await FileService.uploadFile({ file, folder });

      let fileUrl = typeof response === "string" ? response : response?.url;
      if (!fileUrl) throw new Error("Respuesta de carga inválida");

      // Convert absolute to relative if needed
      const BASE_PREFIX = "https://cotizador.modasa.com.pe/storage/cotizadormodasa/"; // TODO externalize
      const relativePath = fileUrl.startsWith(BASE_PREFIX)
        ? fileUrl.replace(BASE_PREFIX, "")
        : fileUrl;

      setFileUrls((prev) => ({ ...prev, [inputName]: relativePath }));
      setValue(inputName, relativePath, { shouldValidate: true });
      toast.success("Imagen subida correctamente");
    } catch (error) {
      console.error(error);
      toast.error("Error al subir la imagen");
    }
  };

  const removeFilePreview = (name) => {
    const fileInput = document.getElementById(name);
    if (fileInput) fileInput.value = "";
    setFilePreviewData((prev) => ({ ...prev, [name]: null }));
    setFileData((prev) => ({ ...prev, [name]: null }));
    setFileUrls((prev) => ({ ...prev, [name]: null }));
    setValue(name, null, { shouldValidate: true });
  };

  const onSave = (data) => {
    createGeneratorSetMutate(data);
    setIsOpen(false);
  };

  return (
    <form onSubmit={handleSubmit(onSave)} className="flex flex-col">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        {/* Left column */}
        <div className="space-y-5">
          <InfoSection title="Información General">
            <InfoItem label="Modelo" name="sModNombre" control={control} />
            <InfoItem
              label="Normas Técnicas"
              name="sModNormaTecnica"
              control={control}
            />
            <InfoItem
              label="Nivel de ruido"
              name="sModNiveldeRuido"
              control={control}
            />
            <InfoItem
              label="Ruido Ambiental"
              name="sModRuidoAmbiental"
              control={control}
            />
          </InfoSection>
          <InfoSection title="Dimensiones Versión Abierta">
            <InfoItem
              label="Largo (mm)"
              name="nModDimensionesA"
              control={control}
            />
            <InfoItem
              label="Ancho (mm)"
              name="nModDimensionesB"
              control={control}
            />
            <InfoItem
              label="Altura (mm)"
              name="nModDimensionesC"
              control={control}
            />
            <InfoItem
              label="Peso (kg)"
              name="nModDimensionesPeso1"
              control={control}
            />
            <InfoItem
              label="ø Esc"
              name="nModDimensionesEsc1"
              control={control}
              type="number"
              step="0.01"
            />
          </InfoSection>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          <InfoSection title="Consumo de Combustible">
            <InfoItem
              label="Versión Abierta (Gal)"
              name="nModTcombAbierto"
              control={control}
              keyfilter="int"
              type="number"
              step="1"
            />
            <InfoItem
              label="Versión Insonorizada (Gal)"
              name="nModTcombInsonoro"
              control={control}
              keyfilter="int"
              type="number"
              step="1"
            />
          </InfoSection>
          <InfoSection title={"Módulo de Control"}>
            <InfoItem
              label="Módulo de control"
              name="sIntModControl"
              control={control}
            />
          </InfoSection>
          <InfoSection title="Dimensiones Versión Insonorizada">
            <InfoItem
              label="Largo (mm)"
              name="nModDimensionesX"
              control={control}
            />
            <InfoItem
              label="Ancho (mm)"
              name="nModDimensionesY"
              control={control}
            />
            <InfoItem
              label="Altura (mm)"
              name="nModDimensionesZ"
              control={control}
            />
            <InfoItem
              label="Peso (kg)"
              name="nModDimensionesPeso2"
              control={control}
            />
            <InfoItem
              label="ø Esc"
              name="nModDimensionesEsc2"
              control={control}
              type="number"
              step="0.01"
            />
          </InfoSection>
        </div>
      </div>

      <InfoSection title="Imagenes">
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
                      id="uModImgAbierto"
                      name="uModImgAbierto"
                      accept="image/*"
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
                      id="uModImgInsonoro"
                      name="uModImgInsonoro"
                      accept="image/*"
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
                      id="uModImgDimensiones"
                      name="uModImgDimensiones"
                      accept="image/*"
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
                      id="uModImgDimensionesInsonoro"
                      name="uModImgDimensionesInsonoro"
                      accept="image/*"
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
      </InfoSection>

      <section className="flex items-center justify-center gap-6 mt-6">
        <Button type="submit">Guardar</Button>
        <Button
          type="button"
          onClick={() => {
            setIsOpen(false);
          }}
          variant="destructive"
        >
          Cancelar
        </Button>
      </section>
    </form>
  );
};

const InfoSection = ({ title, children }) => (
  <section className="bg-white rounded-lg p-2 shadow-sm border">
    <h3 className="text-lg font-semibold mb-3">{title}</h3>
    <div className="space-y-2">{children}</div>
  </section>
);

const InfoItem = ({ label, name, control, ...rest }) => {
  const isRequired = name === "sModNombre";

  return (
    <div className="flex flex-col py-1">
      <div className="flex justify-between items-center">
        <Controller
          name={name}
          control={control}
          rules={isRequired ? { required: "Este campo es obligatorio" } : {}}
          render={({ field, fieldState }) => (
            <div className="flex flex-col w-full">
              <FormInputText
                type="text"
                label={label}
                className="p-input w-full text-xs"
                {...rest}
                value={field.value || ""}
                onChange={field.onChange}
                required={isRequired}
              />

              {/* <InputText
                id={field.name}
                {...field}
                type="text"
                className={`p-inputtext-sm ${
                  fieldState.invalid ? "p-invalid" : ""
                }`}
                {...rest}
              /> */}
              {fieldState.error && (
                <small className="text-red-500 text-right">
                  {fieldState.error.message}
                </small>
              )}
            </div>
          )}
        />
      </div>
    </div>
  );
};
