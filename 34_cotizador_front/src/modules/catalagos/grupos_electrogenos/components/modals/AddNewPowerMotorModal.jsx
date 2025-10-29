import { Dialog, DialogPanel } from "@headlessui/react";
import { X } from "lucide-react";
import { InputText } from "primereact";
import { useForm } from "react-hook-form";
import { Button } from "../../../../../components/custom/buttons/Button";

export const AddNewPowerMotorModal = ({
  isOpen,
  setIsOpen,
  createMutatePowerMotor,
  Motor_Id,
}) => {
  const initialValues = {
    Motor_Id: Motor_Id,
    RPM: 0,
    Frecuencia: 0,
    Fases: 0,
    StandBy: 0,
    Prime: 0,
  };
  const { register, handleSubmit } = useForm(initialValues);

  const onSave = (data) => {
    createMutatePowerMotor({
      ...data,
      Motor_Id,
    });

    setIsOpen(false);
  };

  return (
    <>
      <Dialog
        open={isOpen}
        as="div"
        className={"relative z-50"}
        onClose={() => {}}
      >
        <div className="fixed inset-0 bg-black/30 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center">
            <DialogPanel
              transition
              className="w-full md:max-w-xl m-10 transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-6"
            >
              {/* Botón de cierre (X) */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <X />
              </button>
              <div>
                <h2 className="font-bold text-xl">
                  Crear Nueva Potencia de Motor
                </h2>
              </div>
              <form onSubmit={handleSubmit(onSave)} className="flex flex-col">
                <section className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-3 my-6">
                  <section className="relative">
                    <label className="uppercase font-medium text-sm">RPM</label>
                    <input
                      label="RPM"
                      className="rounded-lg w-full p-2 border border-gray-400/50"
                      type="number"
                      {...register("RPM")}
                    />
                  </section>
                  <section className="relative">
                    <label className="uppercase font-medium text-sm">
                      Frecuencia
                    </label>
                    <input
                      label="Frecuencia"
                      className="rounded-lg w-full p-2 border border-gray-400/50"
                      type="number"
                      {...register("Frecuencia")}
                    />
                  </section>
                  <section className="relative">
                    <label className="uppercase font-medium text-sm">
                      Fases
                    </label>
                    <input
                      label="Fases"
                      className="rounded-lg w-full p-2 border border-gray-400/50"
                      type="number"
                      {...register("Fases")}
                    />
                  </section>
                  <section className="relative">
                    <label className="uppercase font-medium text-sm">
                      Potencia Stand By
                    </label>
                    <input
                      label="Potencia Stand By"
                      className="rounded-lg w-full p-2 border border-gray-400/50"
                      type="number"
                      step="0.01"
                      {...register("StandBy")}
                    />
                  </section>
                  <section className="relative">
                    <label className="uppercase font-medium text-sm">
                      Potencia Prime
                    </label>
                    <input
                      label="Potencia Prime"
                      className="rounded-lg w-full p-2 border border-gray-400/50"
                      type="number"
                      step="0.01"
                      {...register("Prime")}
                    />
                  </section>
                </section>

                <section className="flex items-center justify-center gap-6">
                  <Button type="submit">Guardar</Button>

                  <Button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                    }}
                    variant="destructive"
                  >
                    Cancelar
                  </Button>
                </section>
              </form>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
};

const ConsumptionItem = ({ label, value, onChange }) => (
  <div className="bg-white rounded-lg p-3 text-center shadow-sm transition-all duration-200 hover:shadow-md hover:translate-y-[-2px]">
    <div className="text-sm text-blue-600 mb-1">{label}</div>
    <div className="text-xl font-semibold text-orange-600">
      <InputText
        type="text"
        className="p-inputtext-sm w-20"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  </div>
);
