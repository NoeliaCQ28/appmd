import React from "react";
import { Button } from "../../../../../../components/custom/buttons/Button";
import { InputSearch } from "../../../../../../components/custom/inputs/InputSearch";
import { Modal } from "../../../../../../components/modals/Modal";
import { SkeletonAccordion } from "../../../../../../components/skeletons/SkeletonAccordion";
import { useITMs } from "../../../hooks/v2/useITMs";
import { ITMCard } from "../ITMCard";

export const ITMModal = ({ open, setOpen, setITM, integradoraId }) => {
  const {
    itmsByCombination = [],
    isLoadingITMsByCombination,
    isErrorITMsByCombination,
  } = useITMs(null, integradoraId);

  const [filteredITMs, setFilteredITMs] = React.useState(itmsByCombination);

  const [selectedITM, setSelectedITM] = React.useState(null);

  React.useEffect(() => {
    setFilteredITMs(itmsByCombination);
  }, [itmsByCombination]);

  const handleSearch = (term) => {
    const filteredITMs = itmsByCombination.filter((itm) =>
      Object.values(itm).some((value) =>
        String(value).toLowerCase().includes(term.toLowerCase())
      )
    );
    setFilteredITMs(filteredITMs);
  };

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title="Interruptores"
      footer={
        <>
          <Button
            type="button"
            onClick={() => {
              setITM(selectedITM);
              setOpen(false);
            }}
          >
            Seleccionar ITM.
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
      {isLoadingITMsByCombination ? (
        <SkeletonAccordion />
      ) : isErrorITMsByCombination ? (
        <span>Error al cargar los interruptores</span>
      ) : (
        <section>
          <div className="w-full">
            <InputSearch
              type={"text"}
              placeholder={"Buscar interruptor..."}
              onSearch={handleSearch}
              centered
            />
          </div>
          <ul className="list-none max-h-[35rem] overflow-y-auto space-y-3 scroll-mask-white pt-8 pb-14">
            {filteredITMs?.map((itm) => (
              <li key={itm.nITMId} className="">
                <ITMCard
                  itm={itm}
                  setSelectedITM={setSelectedITM}
                  selected={selectedITM?.nITMId === itm.nITMId}
                />
              </li>
            ))}
          </ul>
        </section>
      )}
    </Modal>
  );
};
