import React from "react";
import { Button } from "../../../../../../components/custom/buttons/Button";
import { InputSearch } from "../../../../../../components/custom/inputs/InputSearch";
import { Modal } from "../../../../../../components/modals/Modal";
import { SkeletonAccordion } from "../../../../../../components/skeletons/SkeletonAccordion";
import { useAlternators } from "../../../hooks/v2/useAlternators";
import { AlternatorCard } from "../AlternatorCard";

export const AlternatorsModal = ({
  open,
  setOpen,
  setAlternator,
  integradoraId,
}) => {
  const {
    alternatorsByCombination = [],
    isLoadingAlternatorsByCombination,
    isErrorAlternatorsByCombination,
  } = useAlternators(null, integradoraId);

  const [filteredAlternators, setFilteredAlternators] = React.useState(
    alternatorsByCombination
  );

  const [selectedAlternator, setSelectedAlternator] = React.useState(null);

  React.useEffect(() => {
    setFilteredAlternators(alternatorsByCombination);
  }, [alternatorsByCombination]);

  const handleSearch = (term) => {
    const filteredAlternators = alternatorsByCombination.filter((alternator) =>
      Object.values(alternator).some((value) =>
        String(value).toLowerCase().includes(term.toLowerCase())
      )
    );
    setFilteredAlternators(filteredAlternators);
  };

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title="Alternadores"
      footer={
        <>
          <Button
            type="button"
            onClick={() => {
              setAlternator(selectedAlternator);
              setOpen(false);
            }}
          >
            Seleccionar A.
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => setOpen(false)}
          >
            Cancelar
          </Button>
        </>
      }
    >
      {isLoadingAlternatorsByCombination ? (
        <SkeletonAccordion />
      ) : isErrorAlternatorsByCombination ? (
        <span>Error al cargar los alternadores</span>
      ) : (
        <section>
          <div className="w-full">
            <InputSearch
              type={"text"}
              placeholder={"Buscar alternador..."}
              onSearch={handleSearch}
              centered
            />
          </div>
          <ul className="list-none max-h-[35rem] overflow-y-auto space-y-3 scroll-mask-white pt-8 pb-14">
            {filteredAlternators?.map((alternator) => (
              <li key={alternator.Alternador_Id} className="">
                <AlternatorCard
                  alternator={alternator}
                  setSelectedAlternator={setSelectedAlternator}
                  selected={
                    selectedAlternator?.Alternador_Id ===
                    alternator.Alternador_Id
                  }
                />
              </li>
            ))}
          </ul>
        </section>
      )}
    </Modal>
  );
};
