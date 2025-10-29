// Utilidad para renderizar el mensaje de estado de la hoja
function renderSheetMessage(value) {
  const text = value?.uploadResponse?.result
    ? value?.uploadResponse?.result?.success === true
      ? value?.uploadResponse?.result?.message_spanish
      : value?.uploadResponse?.result?.error
    : value?.uploadResponse?.progress?.message;
  if (!text) return null;
  const isLong = text.length > 60 || /\n/.test(text);
  if (!isLong) return text;
  return <HorizontalTextCarousel text={text} />;
}
import { FileSpreadsheet, Check } from "lucide-react";
import { useCallback, useMemo } from "react";
import useBulkDataUpload, { ACTIONS } from "../hooks/v2/useBulkDataUpload";
import { logger } from "../../../../utils/logger";
import { AnimatePresence, motion } from "framer-motion";
import { HorizontalTextCarousel } from "./HorizontalTextCarousel";

const operativeSheets = ["MOTORES", "ALTERNADORES"];

export const SheetsToImport = ({ file, sheets = [], dispatch }) => {
  const { uploadMutateAsync } = useBulkDataUpload();

  const sheetsOptions = useMemo(
    () =>
      sheets.map((sheet) => ({
        label: sheet.sheetName,
        value: sheet,
      })),
    [sheets]
  );

  const handleSheetToggle = useCallback(
    (sheet) => {
      if (sheet.isSelected) {
        dispatch({
          type: ACTIONS.TOGGLE_SELECT_SHEET,
          sheet,
          toggleState: false,
        });
        return;
      }

      const bindWebSocketClient = (sheet) => {
        const websocketURL = sheet?.uploadResponse?.websocketURL;
        const sheetName = sheet?.sheetName;

        if (!websocketURL) return null;

        const client = new WebSocket(websocketURL);

        client.onopen = () => {
          logger.info("WebSocket connected for sheet:", sheetName);
        };

        client.onmessage = (event) => {
          const messageData = JSON.parse(event.data);

          const progress = messageData?.progress?.percent || 0;

          const sheetUpdated = {
            uploadResponse: {
              ...sheet.uploadResponse,
              ...messageData,
            },
          };

          dispatch({
            type: ACTIONS.UPDATE_SHEET,
            sheetName: sheet.sheetName,
            sheet: (sheet) => ({ ...sheet, ...sheetUpdated }),
          });

          if (progress === 100) {
            client.close();
          }
        };
        client.onerror = (error) => {
          logger.error("WebSocket error for sheet:", sheetName, error);
        };
        client.onclose = () => {
          logger.info("WebSocket closed for sheet:", sheetName);
        };
      };

      const upload = async () => {
        const uploadResponse = await uploadMutateAsync({
          file,
          transformName: sheet.transformer,
          sheetName: sheet.sheetName,
          upsertMode: "insert",
        });

        const sheetWithUploadResponse = {
          uploadResponse: uploadResponse?.data,
        };

        dispatch({
          type: ACTIONS.UPDATE_SHEET,
          sheetName: sheet.sheetName,
          sheet: (sheet) => ({ ...sheet, ...sheetWithUploadResponse }),
        });

        bindWebSocketClient({ ...sheet, ...sheetWithUploadResponse });
      };

      dispatch({
        type: ACTIONS.TOGGLE_SELECT_SHEET,
        sheet: sheet,
        toggleState: true,
      });

      dispatch({
        type: ACTIONS.UPDATE_SHEET,
        sheetName: sheet.sheetName,
        sheet: (sheet) => ({ ...sheet, upload: upload }),
      });
    },
    [dispatch, uploadMutateAsync, file]
  );

  if (!sheets.length) {
    return (
      <div className="text-center py-4 text-gray-500">
        No hay hojas disponibles para importar
      </div>
    );
  }

  function isSheetOperative(sheet) {
    return operativeSheets.includes(sheet.sheetName.toUpperCase());
  }

  return (
    <div className="w-full">
      <h3 className="text-sm font-medium text-gray-900 mb-3">
        Seleccionar hojas a importar:
      </h3>

      {/* Estilo Finder de macOS */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        {/* Header de la tabla */}
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-medium text-gray-600 uppercase tracking-wide">
              <FileSpreadsheet className="w-3 h-3" />
              Hojas de Excel
            </div>
            <div className="text-xs text-gray-500">
              {sheets.filter((s) => s.isSelected).length} de {sheets.length}{" "}
              seleccionadas
            </div>
          </div>
        </div>

        {/* Lista de hojas */}
        <div className="divide-y divide-gray-100 scroll-mask-white max-h-60 overflow-y-auto">
          {sheetsOptions.map(({ label, value }, index) => {
            const isSelected = value.isSelected;
            const isEven = index % 2 === 0;

            return (
              <div
                key={index}
                className={`flex items-center justify-between px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors duration-150 ${
                  isSheetOperative(value)
                    ? "opacity-100"
                    : "opacity-50 cursor-not-allowed"
                } ${isEven ? "bg-white" : "bg-gray-100"} ${
                  isSelected && "bg-blue-50/50"
                }`}
                onClick={() => {
                  if (isSheetOperative(value)) {
                    handleSheetToggle(value);
                  }
                }}
              >
                {/* Lado izquierdo: Icono y nombre */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {/* Checkbox visual */}
                  <div
                    className={`min-w-5 min-h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                      isSelected
                        ? "bg-[#289900] border-[#289900]"
                        : "border-gray-300 hover:border-[#289900]"
                    }`}
                  >
                    {isSelected && (
                      <Check className="w-3 h-3 text-white stroke-[3]" />
                    )}
                  </div>

                  {/* Icono de hoja */}
                  <div className="flex-shrink-0">
                    <FileSpreadsheet
                      className={`w-4 h-4 ${
                        isSelected ? "text-[#289900]" : "text-gray-400"
                      }`}
                    />
                  </div>

                  {/* Nombre de la hoja */}
                  <section className="flex flex-col">
                    <span
                      className={`text-sm font-medium truncate select-none ${
                        isSelected
                          ? value?.uploadResponse?.result
                            ? value?.uploadResponse?.result?.success
                              ? "text-[#144b01]"
                              : "text-red-700"
                            : "text-[#144b01]"
                          : "text-gray-900"
                      }`}
                      title={label}
                    >
                      {label}
                    </span>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={value?.uploadResponse?.progress?.message}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                        className={`text-xs line-clamp-1 ${
                          value?.uploadResponse?.result
                            ? value?.uploadResponse?.result?.success
                              ? "text-gray-500"
                              : "text-red-700"
                            : "text-gray-500"
                        }`}
                      >
                        {renderSheetMessage(value)}
                      </motion.div>
                    </AnimatePresence>
                  </section>
                  <section className="flex justify-end items-center ml-auto space-y-1 gap-2">
                    {/* Badge ultra compacto con progreso */}
                    {value?.uploadResponse?.status_spanish && (
                      <span
                        className={
                          "px-2 py-0 rounded-full text-[10px] font-medium select-none whitespace-nowrap flex items-center relative overflow-hidden bg-gray-100 min-w-0 " +
                          (value?.uploadResponse?.result
                            ? value?.uploadResponse?.result?.success
                              ? "text-[#144b01]"
                              : "text-red-700"
                            : "text-gray-800")
                        }
                        title={value?.uploadResponse?.status_spanish}
                        style={{
                          minWidth: 44,
                          minHeight: 18,
                          lineHeight: "18px",
                        }}
                      >
                        {typeof value?.uploadResponse?.progress?.percent ===
                          "number" &&
                          value.uploadResponse.progress.percent < 100 && (
                            <motion.span
                              key={value.uploadResponse.progress.percent}
                              className={`absolute left-0 top-0 h-full z-0 ${
                                value.uploadResponse.result &&
                                value.uploadResponse.result.success === false
                                  ? "bg-red-200"
                                  : "bg-gray-300"
                              }`}
                              initial={{ width: 0 }}
                              animate={{
                                width: `${value.uploadResponse.progress.percent}%`,
                              }}
                              transition={{ duration: 0.3 }}
                              style={{ borderRadius: 9999 }}
                            />
                          )}
                        <span className="relative z-10 flex items-center">
                          {typeof value?.uploadResponse?.progress?.percent ===
                            "number" && (
                            <span className="font-semibold mr-0.5">
                              {Math.round(
                                value.uploadResponse.progress.percent
                              )}
                              %
                            </span>
                          )}
                          {value?.uploadResponse?.status_spanish}
                        </span>
                      </span>
                    )}
                  </section>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer con información adicional */}
        {sheets.filter((s) => s.isSelected).length > 0 && (
          <div className="bg-gray-50 border-t border-gray-200 px-4 py-2">
            <div className="text-xs text-gray-600">
              Se importarán las hojas seleccionadas
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
