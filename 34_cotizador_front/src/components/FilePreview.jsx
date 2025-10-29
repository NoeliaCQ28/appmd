import { PiMicrosoftExcelLogoFill } from "react-icons/pi";

export const FilePreview = ({
  files = [],
  onRemoveFile,
  icon: IconComponent = PiMicrosoftExcelLogoFill,
  title = "Archivos cargados:",
  className = "",
  showRemoveButton = true,
}) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleRemoveFile = (fileIndex) => {
    if (onRemoveFile) {
      onRemoveFile(fileIndex);
    }
  };

  if (!files || files.length === 0) {
    return null;
  }

  const fileTypeToHumanReadable = (fileType) => {
    switch (fileType) {
      case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        return "Excel";
      default:
        return fileType || "Archivo";
    }
  };

  return (
    <div className={`mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 ${className}`}>
      <h4 className="text-sm font-medium text-gray-700 mb-3">{title}</h4>
      <div className="space-y-2">
        {files.map((file, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-white rounded-md border border-gray-200 shadow-sm"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-md">
                <IconComponent className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(file.size)} • {fileTypeToHumanReadable(file.type)}
                </p>
              </div>
            </div>
            {showRemoveButton && (
              <button
                onClick={() => handleRemoveFile(index)}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
                title="Eliminar archivo"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
