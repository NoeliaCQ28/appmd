import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { useState } from "react";
import Dropzone from "react-dropzone";
import { FilePreview } from "./FilePreview";

export const FileDropzone = ({
  onDrop,
  accept = {
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
      ".xlsx",
    ],
  },
  maxFiles = 1,
  multiple = false,
  className = "",
  icon: IconComponent = PiMicrosoftExcelLogoFill,
  title = "Arrastra tu archivo Excel aquí",
  subtitle = "haz clic para seleccionar",
  description = "Solo archivos .xlsx • Máximo 1 archivo",
  dragActiveTitle = "Suelta el archivo aquí",
  dragRejectTitle = "Tipo de archivo no válido",
  disabled = false,
  showPreview = true,
  onRemoveFile,
  ...props
}) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleDrop = (acceptedFiles) => {
    setUploadedFiles(acceptedFiles);
    if (onDrop) {
      onDrop(acceptedFiles);
    }
  };

  const handleRemoveFile = (fileIndex) => {
    const newFiles = uploadedFiles.filter((_, index) => index !== fileIndex);
    setUploadedFiles(newFiles);
    if (onRemoveFile) {
      onRemoveFile(newFiles);
    }
  };
  return (
    <div className={`w-full ${className}`}>
      <Dropzone
        onDrop={handleDrop}
        maxFiles={maxFiles}
        multiple={multiple}
        accept={accept}
        disabled={disabled}
        {...props}
      >
        {({
          getRootProps,
          getInputProps,
          isDragActive,
          isDragAccept,
          isDragReject,
        }) => (
          <div
            {...getRootProps()}
            className={`
              relative cursor-pointer border-2 border-dashed rounded-xl p-8 
              transition-all duration-300 ease-in-out hover:animate-pulse
              ${
                disabled
                  ? "cursor-not-allowed opacity-50 bg-gray-100"
                  : isDragActive
                  ? isDragAccept
                    ? "border-[#289900] bg-green-50 shadow-lg transform scale-[1.02]"
                    : "border-red-400 bg-red-50"
                  : "border-gray-300 hover:border-[#289900] hover:bg-gray-50"
              }
              focus:outline-none focus:ring-2 focus:ring-[#289900] focus:ring-opacity-50
              group
            `}
          >
            <input {...getInputProps()} disabled={disabled} />
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div
                className={`
                  p-4 rounded-full transition-all duration-300
                  ${
                    disabled
                      ? "text-gray-400"
                      : isDragActive && isDragAccept
                      ? "text-[#289900]"
                      : "text-gray-400 group-hover:text-[#289900]"
                  }
                `}
              >
                <IconComponent className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <p
                  className={`
                    text-lg font-medium transition-colors duration-300
                    ${
                      disabled
                        ? "text-gray-400"
                        : isDragActive && isDragAccept
                        ? "text-[#289900]"
                        : "text-gray-700 group-hover:text-[#289900]"
                    }
                  `}
                >
                  {disabled
                    ? "Subida de archivos deshabilitada"
                    : isDragActive
                    ? isDragAccept
                      ? dragActiveTitle
                      : dragRejectTitle
                    : title}
                </p>

                {!disabled && (
                  <>
                    <p className="text-sm text-gray-500">
                      o{" "}
                      <span className="text-[#289900] font-medium">
                        {subtitle}
                      </span>
                    </p>

                    <p className="text-xs text-gray-400 mt-2">{description}</p>
                  </>
                )}
              </div>
            </div>

            {/* Subtle animation overlay */}
            <div
              className={`
                absolute inset-0 rounded-xl transition-opacity duration-300 pointer-events-none
                ${
                  isDragActive && isDragAccept && !disabled
                    ? "bg-gradient-to-r from-orange-400/10 to-green-500/10 opacity-100"
                    : "opacity-0"
                }
              `}
            />
          </div>
        )}
      </Dropzone>

      {/* File Preview Section */}
      {showPreview && (
        <FilePreview
          files={uploadedFiles}
          onRemoveFile={handleRemoveFile}
          icon={IconComponent}
        />
      )}
    </div>
  );
};
