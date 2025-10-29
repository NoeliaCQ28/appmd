import { X } from "lucide-react";
import { FaFile, FaFilePdf, FaFileWord } from "react-icons/fa";
import { toast } from "react-toastify";
import { useFile } from "../hooks/useFile";

export const FileUpload = ({
  label,
  name,
  accept,
  folder,
  previewData,
  onRemove,
  onChange,
  setValue, // Add setValue prop to directly set the form value
  // Remove register prop if it was passed
  ...rest
}) => {
  const { uploadFileMutate, isPendingUploadFile } = useFile();

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Call the parent component's onChange handler with the file
    if (onChange) {
      onChange(event);
    }

    // Update the file name display
    const fileNameSpan = document.getElementById(`${name}-filename`);
    if (fileNameSpan) fileNameSpan.textContent = file.name;

    // Upload the file to the backend
    uploadFileMutate({ file, folder }, {
      onSuccess: (fileUrl) => {

        // Directly set the form value if setValue is provided
        if (setValue) {
          setValue(name, fileUrl);
          toast.success(`Archivo subido correctamente`);
        }
        // Otherwise use the custom event as fallback
        else {
          // Find the form the input belongs to
          const form = event.target.closest("form");
          if (form) {
            // Create a custom event to communicate with parent component
            const uploadCompleteEvent = new CustomEvent("fileUploadComplete", {
              detail: { fieldName: name, fileUrl: fileUrl },
            });
            form.dispatchEvent(uploadCompleteEvent);
          }
        }
      },
      onError: (error) => {
        toast.error(`Error al subir archivo ${name}: ${error.message}`);
      },
    });
  };

  return (
    <div className="flex flex-col py-2">
      <div className="flex justify-between items-center mb-2">
        <span className="text-blue-900 font-medium">{label}:</span>
        <div className="flex items-center">
          <input
            id={name}
            type="file"
            name={name}
            accept={accept}
            className="hidden"
            onChange={handleFileChange}
            disabled={isPendingUploadFile}
            {...rest} // Spread other input props if needed
          />
          <label
            htmlFor={name}
            className={`bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1.5 rounded cursor-pointer text-sm flex items-center transition-colors ${
              isPendingUploadFile ? "opacity-50 cursor-wait" : ""
            }`}
          >
            {isPendingUploadFile ? "Subiendo..." : "Seleccionar archivo"}
          </label>
          <span
            id={`${name}-filename`}
            className="ml-2 text-sm text-gray-500 truncate max-w-[150px]"
          ></span>
        </div>
      </div>

      {previewData && (
        <div className="relative mt-2 flex justify-end">
          <div className="border border-gray-200 rounded-lg p-2 bg-gray-50 max-w-[250px] relative">
            <button
              type="button"
              onClick={() => onRemove(name)} // Ensure onRemove uses the correct name argument
              className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm hover:bg-gray-100 z-10"
              title="Eliminar archivo"
            >
              <X size={14} className="text-gray-600" />
            </button>

            {previewData.type === "image" ? (
              <img
                src={previewData.url}
                alt={previewData.name}
                className="max-h-44 mx-auto object-contain"
              />
            ) : (
              <div className="flex flex-col items-center p-4 gap-2">
                {previewData.type === "pdf" ? (
                  <FaFilePdf size={40} className="text-red-500" />
                ) : previewData.type === "word" ? (
                  <FaFileWord size={40} className="text-blue-600" />
                ) : (
                  <FaFile size={40} className="text-gray-500" />
                )}
                <span className="text-xs text-center text-gray-700 break-all">
                  {previewData.name}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
