import { Plus } from "lucide-react";

import React from "react";
import { Button } from "../../../../components/custom/buttons/Button";
import { PowerMotorSingleInfo } from "./PowerMotorSingleInfo";
import { AddNewPowerMotorModal } from "./modals/AddNewPowerMotorModal";

export const PowerMotorInfo = ({
  data,
  editMutatePowerMotor,
  createMutatePowerMotor,
}) => {
  const [openAddNewPowerMotorModal, setOpenAddNewPowerMotorModal] =
    React.useState(false);

  return (
    <div className="mt-6 space-y-5">
      <h3 className="text-lg font-semibold">Potencias del Motor</h3>
      <section>
        <section className="flex flex-col gap-3 max-h-[300px] overflow-y-auto scroll-mask-white">
          {data.powerMotorInfo?.map((motorInfo, index) => (
            <PowerMotorSingleInfo
              key={index}
              motorInfo={motorInfo}
              editMutatePowerMotor={editMutatePowerMotor}
            />
          ))}
        </section>

        <section className="p-5 flex items-center justify-center gap-6">
          <Button
            variant="secondary"
            onClick={() => setOpenAddNewPowerMotorModal(true)}
          >
            Agregar <Plus className="ml-2" width={14} height={14} />
          </Button>
        </section>
      </section>
      <AddNewPowerMotorModal
        createMutatePowerMotor={createMutatePowerMotor}
        isOpen={openAddNewPowerMotorModal}
        setIsOpen={setOpenAddNewPowerMotorModal}
        Motor_Id={data.Motor_Id}
      />
    </div>
  );
};
