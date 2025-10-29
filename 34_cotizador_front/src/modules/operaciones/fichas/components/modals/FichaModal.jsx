import { PDFDownloadLink } from "@react-pdf/renderer";
import { Button } from "../../../../../components/custom/buttons/Button";
import { Modal } from "../../../../../components/modals/Modal";
import { FichaPdf } from "../FichaPdf";
import { FichaTecnica } from "../FichaTecnica";
import { useTranslation } from "react-i18next";

export const FichaModal = ({ visible, onClose, ficha, isLoading, error }) => {
  const { t } = useTranslation();

  return (
    <Modal
      open={visible}
      setOpen={onClose}
      title="Ficha Técnica"
      width="max-w-5xl"
    >
      <div>
        {isLoading ? <p>{t("common.loading")}...</p> : <FichaTecnica ficha={ficha} />}

        <div className="flex flex-col justify-center space-y-4 md:space-y-0 md:space-x-10 md:py-7 md:flex-row xs:mt-10">
          <PDFDownloadLink
            document={<FichaPdf ficha={ficha} />}
            fileName={`modasa-${ficha.sModNombre}`}
          >
            <Button className="sm:w-full md:w-full" type="button">
              {t("technical_report.download")}
            </Button>
          </PDFDownloadLink>

          <Button type="button" variant="destructive" onClick={onClose}>
            {t("common.cancel")}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
