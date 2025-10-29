import { Save } from "lucide-react";
import { useState } from "react";
import { Button } from "../../../../components/custom/buttons/Button";
import { Modal } from "../../../../components/modals/Modal";

export const CreatePreferenceModal = ({
  open,
  setOpen,
  onConfirm,
  isLoading = false,
}) => {
  const [preference, setPreference] = useState({
    key: "",
    value: "",
    group: "",
    description: "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!preference.key.trim()) {
      newErrors.key = "La clave es requerida";
    }
    if (!preference.value.trim()) {
      newErrors.value = "El valor es requerido";
    }
    if (!preference.group.trim()) {
      newErrors.group = "El grupo es requerido";
    }
    if (!preference.description.trim()) {
      newErrors.description = "La descripción es requerida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onConfirm(preference);
    }
  };

  const handleClose = () => {
    setPreference({
      key: "",
      value: "",
      group: "",
      description: "",
    });
    setErrors({});
    setOpen(false);
  };

  const handleInputChange = (field, value) => {
    setPreference((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title="Nueva Configuración"
      withBackground
      footer={
        <>
          <Button type="button" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>Creando...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Save className="h-4 w-4" />
                <span>Guardar</span>
              </div>
            )}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleClose}
            disabled={isLoading}
            className="px-4 py-2"
          >
            Cancelar
          </Button>
        </>
      }
    >
      {/* Form */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Clave *
            </label>
            <input
              type="text"
              value={preference.key}
              onChange={(e) => handleInputChange("key", e.target.value)}
              className={`w-full px-3 py-2 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.key ? "border-red-300 bg-red-50" : "border-gray-200"
              }`}
              placeholder="factor-ejemplo"
            />
            {errors.key && (
              <p className="text-xs text-red-600 mt-1">{errors.key}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valor *
            </label>
            <input
              type="text"
              value={preference.value}
              onChange={(e) => handleInputChange("value", e.target.value)}
              className={`w-full px-3 py-2 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.value ? "border-red-300 bg-red-50" : "border-gray-200"
              }`}
              placeholder="0.5"
            />
            {errors.value && (
              <p className="text-xs text-red-600 mt-1">{errors.value}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Grupo *
            </label>
            <input
              type="text"
              value={preference.group}
              onChange={(e) => handleInputChange("group", e.target.value)}
              className={`w-full px-3 py-2 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.group ? "border-red-300 bg-red-50" : "border-gray-200"
              }`}
              placeholder="ing-ventas"
            />
            {errors.group && (
              <p className="text-xs text-red-600 mt-1">{errors.group}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción *
            </label>
            <input
              type="text"
              value={preference.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className={`w-full px-3 py-2 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.description
                  ? "border-red-300 bg-red-50"
                  : "border-gray-200"
              }`}
              placeholder="Descripción clara y concisa"
            />
            {errors.description && (
              <p className="text-xs text-red-600 mt-1">{errors.description}</p>
            )}
          </div>
        </div>

        {/* Preview */}
        {(preference.key || preference.value) && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Vista previa:
            </h4>
            <div className="flex items-center space-x-2 text-sm">
              <span className="font-medium text-gray-900">
                {preference.key || "clave-ejemplo"}
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-mono bg-gray-100 text-gray-700 border">
                {preference.value || "0.0"}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {preference.description || "Descripción de la preferencia"}
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};
