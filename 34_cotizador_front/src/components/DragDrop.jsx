import { FaFolderPlus } from "react-icons/fa6"
import { useDragDrop } from "../hooks/useDragDrop";

export const DragDrop = ({ onFileSelect, onCancel }) => {

  const { isDragging, selectedFile, handleDragOver, handleDragLeave, handleDrop, handleFileSelect, handleSave, reset } = useDragDrop(onFileSelect)

  return (
    <div className="w-full p-1 bg-white rounded-lg">
      <h2 className="text-xl font-semibold mb-4 uppercase">Importar</h2>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
               border-2 border-dashed rounded-lg p-8
               flex flex-col items-center justify-center gap-4
               transition-colors duration-200
               ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"}
               ${selectedFile ? "border-green-500 bg-green-50" : ""}
               `}
      >
        <FaFolderPlus className="w-12 h-12 text-orange-500" />
          <p className="text-center text-gray-600">
               {selectedFile
               ? `Archivo seleccionado: ${selectedFile.name}`
               : "Arrastre su archivo para comenzar a cargar"}
          </p>
        <label className="cursor-pointer">
          <button
            variant="outline"
            className="text-blue-500 border rounded-md p-2 border-blue-500 hover:bg-blue-50"
            onClick={() => document.getElementById("fileInput")?.click()}
          >
            Cargar archivo
          </button>
          <input
            id="fileInput"
            type="file"
            className="hidden"
            accept=".csv"
            onChange={handleFileSelect}
          />
        </label>
      </div>

      <p className="text-sm text-gray-500 mt-2">Solo se admite .csv</p>

      <div className="flex flex-col justify-center space-y-4 md:space-y-0 md:space-x-10 md:py-7 md:flex-row">
        <input
          type="submit"
          value={"Guardar"}
          className="bg-blue-800 px-8 p-2 uppercase text-white rounded-lg cursor-pointer"
          onClick={handleSave}
          disabled={!selectedFile}
        />
        <input
          type="button"
          className="bg-red-600 px-8 p-2 uppercase text-white rounded-lg cursor-pointer"
          value={"Cancelar"}
          onClick={() => { 
               reset()
               onCancel(false)
          }}
        />
      </div>
    </div>
  );
};
