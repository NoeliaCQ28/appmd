import React from "react";
import { Button } from "../../../../../components/custom/buttons/Button";
import site from "../../../../../config/site";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { FileDropzone } from "../../../../../components/FileDropzone";
import useBulkDataUpload, { ACTIONS } from "../../hooks/v2/useBulkDataUpload";
import { Download, Upload } from "lucide-react";
import { FilePreview } from "../../../../../components/FilePreview";
import { SheetsToImport } from "../SheetsToImport";

export const BulkDataUploadForm = () => {
  const {
    downloadTemplate,
    isPendingUpload,
    state: { file, sheets },
    dispatch,
  } = useBulkDataUpload();

  React.useEffect(() => {
    return () => {
      dispatch({ type: ACTIONS.RESET_STATE });
    };
  }, [dispatch]);

  return (
    <section className="flex flex-col items-center justify-center gap-3">
      <Button
        variant="tertiary"
        className="flex items-center gap-2 md:w-fit"
        onClick={downloadTemplate}
      >
        <p>{site.templateFileName}</p> <Download size={16} />
      </Button>

      {!file && (
        <section className="mt-6 w-full">
          <FileDropzone
            onDrop={(acceptedFiles) => {
              if (acceptedFiles && acceptedFiles.length > 0) {
                const file = acceptedFiles[0];
                dispatch({ type: ACTIONS.SET_FILE, file });
              }
            }}
            icon={PiMicrosoftExcelLogoFill}
            title="Arrastra tu archivo Excel aquí"
            subtitle="haz clic para seleccionar"
            description="Solo archivos .xlsx • Máximo 1 archivo"
            dragActiveTitle="Suelta el archivo aquí"
            dragRejectTitle="Tipo de archivo no válido"
          />
        </section>
      )}
      {file && (
        <FilePreview
          className="w-full"
          title="Archivo cargado"
          files={[file]}
          onRemoveFile={() => {
            dispatch({ type: ACTIONS.RESET_STATE });
          }}
          icon={PiMicrosoftExcelLogoFill}
        />
      )}
      {file && (
        <section className="mt-6 w-full">
          <SheetsToImport file={file} sheets={sheets} dispatch={dispatch} />
        </section>
      )}
      {file && (
        <section className="flex justify-between items-center">
          <Button
            variant="primary"
            disabled={
              !file ||
              sheets?.filter((s) => s.isSelected).length === 0 ||
              isPendingUpload
            }
            onClick={async () => {
              const promises = sheets
                ?.filter((s) => s.isSelected)
                ?.map((sheet) => sheet.upload());
              await Promise.all(promises);
            }}
            className="flex gap-2 md:w-fit"
          >
            {isPendingUpload ? <span>Cargando...</span> : "Importar"}
            <Upload width={16} height={16} />
          </Button>
        </section>
      )}
    </section>
  );
};
