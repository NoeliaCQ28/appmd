import { notify } from "@utils/notifications";
import {
  ChevronDown,
  ChevronRight,
  Edit3,
  Folder,
  FolderOpen,
  Key,
  Plus,
  Save,
  Settings,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { Button } from "../../../components/custom/buttons/Button";
import { DeleteModal } from "../../../components/modals/DeleteModal";
import { CreatePreferenceModal } from "../components/modals/CreatePreferenceModal";
import useSettings from "../hooks/v2/useSettings";

const PreferenceSettingsView = () => {
  const {
    preferences,
    isLoadingPreferences,
    isErrorPreferences,
    createPreferenceMutation,
    updatePreferenceMutation,
    deletePreferenceMutation,
  } = useSettings();

  const [expandedGroups, setExpandedGroups] = useState(new Set());
  const [editingItem, setEditingItem] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Toggle group expansion
  const toggleGroup = (groupName) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupName)) {
      newExpanded.delete(groupName);
    } else {
      newExpanded.add(groupName);
    }
    setExpandedGroups(newExpanded);
  };

  // Start editing an item
  const startEdit = (preference) => {
    setEditingItem(preference.sConfClave);
    setEditValues({
      value: preference.sConfValor,
      description: preference.sConfDescripcion,
    });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingItem(null);
    setEditValues({});
  };

  // Save edited preference
  const saveEdit = async (key) => {
    try {
      await updatePreferenceMutation.mutateAsync({
        key,
        updateData: editValues,
      });
      notify.success("Preferencia actualizada exitosamente");
      setEditingItem(null);
      setEditValues({});
    } catch (error) {
      notify.error(`Error al actualizar: ${error.message}`);
    }
  };

  // Delete preference
  const handleDeleteClick = (key) => {
    setItemToDelete(key);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      await deletePreferenceMutation.mutateAsync(itemToDelete);
      notify.success("Preferencia eliminada exitosamente");
      setItemToDelete(null);
    } catch (error) {
      notify.error(`Error al eliminar: ${error.message}`);
    }
  };

  // Create new preference
  const handleCreateConfirm = async (preferenceData) => {
    try {
      await createPreferenceMutation.mutateAsync(preferenceData);
      notify.success("Preferencia creada exitosamente");
      setShowCreateModal(false);
    } catch (error) {
      notify.error(`Error al crear: ${error.message}`);
    }
  };

  if (isLoadingPreferences) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-12">
        <div className="w-full">
          <div className="animate-pulse space-y-8">
            <div className="space-y-3">
              <div className="h-8 bg-gray-200 rounded-lg w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-100 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isErrorPreferences) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-xl border border-gray-200 p-12">
            <Settings className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No se pudieron cargar las preferencias
            </h3>
            <p className="text-gray-500">
              Verifica tu conexión e intenta nuevamente
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Configuraciones
              </h1>
              <p className="text-gray-600">
                Gestiona las preferencias del sistema
              </p>
            </div>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nueva
            </Button>
          </div>

          {/* Modals */}
          <CreatePreferenceModal
            open={showCreateModal}
            setOpen={setShowCreateModal}
            onConfirm={handleCreateConfirm}
            isLoading={createPreferenceMutation.isPending}
          />

          <DeleteModal
            open={showDeleteModal}
            setOpen={setShowDeleteModal}
            onConfirm={handleDeleteConfirm}
            message={`Esta acción eliminará permanentemente la configuración "${itemToDelete}".`}
          />
        </div>

        {/* Preferences Tree */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center space-x-2">
              <Folder className="h-5 w-5 text-gray-600" />
              <h2 className="font-semibold text-gray-900">
                Configuraciones del Sistema
              </h2>
            </div>
          </div>

          <div className="p-4">
            {preferences && Object.keys(preferences).length > 0 ? (
              <div className="space-y-1">
                {Object.entries(preferences).map(([groupName, groupItems]) => (
                  <div key={groupName}>
                    {/* Folder Header */}
                    <div
                      onClick={() => toggleGroup(groupName)}
                      className="flex items-center space-x-2 px-2 py-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors group"
                    >
                      <div className="w-4 h-4 flex items-center justify-center">
                        {expandedGroups.has(groupName) ? (
                          <ChevronDown className="h-3 w-3 text-gray-500" />
                        ) : (
                          <ChevronRight className="h-3 w-3 text-gray-500" />
                        )}
                      </div>
                      <div className="w-4 h-4 flex items-center justify-center">
                        {expandedGroups.has(groupName) ? (
                          <FolderOpen className="h-4 w-4 text-stone-500" />
                        ) : (
                          <Folder className="h-4 w-4 text-stone-500" />
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 select-none">
                        {groupName}
                      </span>
                      <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded text-center min-w-[1.5rem]">
                        {groupItems.length}
                      </span>
                    </div>

                    {/* Folder Contents */}
                    {expandedGroups.has(groupName) && (
                      <div className="ml-6 space-y-1 mt-1">
                        {groupItems.map((preference, index) => (
                          <div
                            key={preference.sConfClave}
                            className="flex items-center space-x-2 px-2 py-1.5 hover:bg-gray-50 rounded-lg group transition-colors"
                          >
                            {/* Tree Line */}
                            <div className="w-4 h-4 flex items-center justify-center">
                              <div className="w-2 h-2 border-l border-b border-gray-300 rounded-bl-sm"></div>
                            </div>

                            {/* File Icon */}
                            <div className="w-4 h-4 flex items-center justify-center">
                              <Key className="h-3.5 w-3.5 text-orange-500" />
                            </div>

                            {/* File Content */}
                            <div className="flex-1 min-w-0">
                              {editingItem === preference.sConfClave ? (
                                <div className="space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <input
                                      type="text"
                                      value={editValues.value}
                                      onChange={(e) =>
                                        setEditValues({
                                          ...editValues,
                                          value: e.target.value,
                                        })
                                      }
                                      className="flex-1 px-2 py-1 text-xs bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                                      placeholder="Valor"
                                    />
                                    <div className="flex items-center space-x-1">
                                      <button
                                        onClick={() =>
                                          saveEdit(preference.sConfClave)
                                        }
                                        disabled={
                                          updatePreferenceMutation.isPending
                                        }
                                        className="w-6 h-6 flex items-center justify-center text-green-600 hover:bg-green-50 rounded transition-colors"
                                        title="Guardar"
                                      >
                                        <Save className="h-3 w-3" />
                                      </button>
                                      <button
                                        onClick={cancelEdit}
                                        className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-gray-50 rounded transition-colors"
                                        title="Cancelar"
                                      >
                                        <X className="h-3 w-3" />
                                      </button>
                                    </div>
                                  </div>
                                  <input
                                    type="text"
                                    value={editValues.description}
                                    onChange={(e) =>
                                      setEditValues({
                                        ...editValues,
                                        description: e.target.value,
                                      })
                                    }
                                    className="w-full px-2 py-1 text-xs bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Descripción"
                                  />
                                </div>
                              ) : (
                                <div className="flex items-center justify-between">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2">
                                      <span className="text-sm font-medium text-gray-900 truncate">
                                        {preference.sConfClave}
                                      </span>
                                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-mono bg-gray-100 text-gray-700 border">
                                        {preference.sConfValor}
                                      </span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed pr-8">
                                      {preference.sConfDescripcion}
                                    </p>
                                  </div>

                                  {/* Actions */}
                                  <div className="flex items-center space-x-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                      onClick={() => startEdit(preference)}
                                      className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                      title="Editar"
                                    >
                                      <Edit3 className="h-3 w-3" />
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleDeleteClick(preference.sConfClave)
                                      }
                                      disabled={
                                        deletePreferenceMutation.isPending
                                      }
                                      className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                      title="Eliminar"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Folder className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      Sin configuraciones
                    </h3>
                    <p className="text-xs text-gray-500">
                      Este directorio está vacío
                    </p>
                  </div>
                  <Button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Plus className="h-3 w-3 mr-1.5" />
                    Crear primera configuración
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreferenceSettingsView;
