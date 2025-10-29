import { useNavigate } from "react-router-dom";
import { CardResumen } from "../../../../components/CardResumen";

import { Button } from "../../../../components/custom/buttons/Button";
import { CablesForm } from "../components/forms/CablesForm";
import { CeldasForm } from "../components/forms/CeldasForm";
import { ElectrogenosForm } from "../components/forms/ElectrogenosForm";
import { TransformadorForm } from "../components/forms/TransformadorForm";
import { useCablesStore } from "../hooks/useCablesStore";
import { useCellsStore } from "../hooks/useCellsStore";
import { useResume } from "../hooks/useResume";
import { useTransformersStore } from "../hooks/useTransformersStore";
import { useQuotationStore } from "../store/useQuotationStore";
import { useGeneratorSetStore } from "../store/v2/useGeneratorSetStore";

function CotizationTypeForm({ quotationType }) {
  switch (quotationType) {
    case 1:
      return <ElectrogenosForm isAppendMode={false} marketId={1} />;
    case 2:
      return <CablesForm />;
    case 3:
      return <CeldasForm />;
    case 4:
      return <TransformadorForm />;
    default:
      return <span>Debe seleccionar un tipo de cotizador</span>;
  }
}

export const CotizacionsAdjuntarDetalleView = () => {
  const navigate = useNavigate();

  const { quotationType } = useQuotationStore();
  const {
    generatorSetsAdded,
    commitGeneratorSetsAdded,
    removeUnconfirmedGeneratorSets,
  } = useGeneratorSetStore();
  const { cablesAdded, clearCablesAdded } = useCablesStore();
  const { cellsAdded, clearCellsAdded } = useCellsStore();
  const { transformersAdded, clearTransformersAdded } = useTransformersStore();

  const onSaveDetail = (e) => {
    switch (quotationType) {
      // Grupos Electrogenos
      case 1:
        commitGeneratorSetsAdded();
        break;
      case 2:
        break;
      case 3:
        break;
      case 4:
        break;
    }

    e.preventDefault();
    navigate(-1);
  };

  const { resume, isResumeAvailable } = useResume(
    quotationType === 1
      ? generatorSetsAdded
      : quotationType === 2
      ? cablesAdded
      : quotationType === 3
      ? cellsAdded
      : quotationType === 4
      ? transformersAdded
      : []
  );

  const handleClearDetailsAdded = () => {
    switch (quotationType) {
      case 1:
        removeUnconfirmedGeneratorSets();
        break;
      case 2:
        clearCablesAdded();
        break;
      case 3:
        clearCellsAdded();
        break;
      case 4:
        clearTransformersAdded();
        break;
    }
  };

  return (
    <section className="flex flex-col space-y-3 w-full px-1 md:px-4 md:py-3">
      <CotizationTypeForm quotationType={quotationType} />

      {isResumeAvailable && (
        <CardResumen
          items={resume.items}
          discount={resume.discount}
          exportationCosts={resume.exportationCosts}
          total={resume.total}
          isThroughput={resume.isThroughput || false}
          marginPercentage={resume.marginPercentage || 0}
        />
      )}

      <div className="flex flex-col justify-center space-y-4 md:space-y-0 md:space-x-10 md:py-7 md:flex-row">
        <Button
          onClick={onSaveDetail}
          disabled={!isResumeAvailable}
          variant={isResumeAvailable ? "primary" : "primary-alt-2"}
        >
          Agregar
        </Button>
        <Button
          variant="destructive"
          onClick={() => {
            handleClearDetailsAdded();
            navigate(-1);
          }}
        >
          Cancelar
        </Button>
      </div>
    </section>
  );
};
