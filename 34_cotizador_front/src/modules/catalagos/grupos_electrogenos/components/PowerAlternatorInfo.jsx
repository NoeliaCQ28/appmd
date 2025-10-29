import { Plus } from "lucide-react";

import React from "react";
import { Button } from "../../../../components/custom/buttons/Button";
import { PowerAlternatorSingleInfo } from "./PowerAlternatorSingleInfo";
import { AddNewPowerAlternadorModal } from "./modals/AddNewPowerAlternadorModal";

export const PowerAlternatorInfo = ({
  data,
  editMutatePowerAlternator,
  createMutatePowerAlternator,
}) => {
  const [openAddNewPowerAlternadorModal, setOpenAddNewPowerAlternadorModal] =
    React.useState(false);

  return (
    <div className="mt-6 space-y-5">
      <h3 className="text-lg font-semibold">Potencias del Alternador</h3>
      <section>
        <section className="flex flex-col gap-3 max-h-[400px] overflow-y-auto scroll-mask-white">
          {data.powerAlternatorInfo?.map((alternatorInfo, index) => (
            <PowerAlternatorSingleInfo
              key={index}
              alternatorInfo={alternatorInfo}
              editMutatePowerAlternator={editMutatePowerAlternator}
            />
          ))}
        </section>

        <section className="p-5 flex items-center justify-center gap-6">
          <Button
            variant="secondary"
            onClick={() => setOpenAddNewPowerAlternadorModal(true)}
          >
            Agregar <Plus className="ml-2" width={14} height={14} />
          </Button>
        </section>

        <AddNewPowerAlternadorModal
          createMutatePowerAlternator={createMutatePowerAlternator}
          isOpen={openAddNewPowerAlternadorModal}
          setIsOpen={setOpenAddNewPowerAlternadorModal}
          Alternador_Id={data.Alternador_Id}
        />
      </section>
    </div>
  );
};
