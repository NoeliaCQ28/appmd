import { Dialog, DialogPanel } from "@headlessui/react";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "../../../../../components/custom/buttons/Button";
import site from "../../../../../config/site";

export const AddNewPowerAlternadorModal = ({
  isOpen,
  setIsOpen,
  createMutatePowerAlternator,
  Alternador_Id,
}) => {
  const initialValues = {
    Alternador_Id: Alternador_Id,
    Frecuencia: 0,
    Fases: 0,
    Voltaje: 0,
    Prime_KW: 0,
    Prime_KVA: 0,
    Standby_KW: 0,
    SandtBy_KVA: 0,
    Eficiencia: 0,
  };
  const { register, handleSubmit, reset } = useForm(initialValues);

  const onSave = (data) => {
    createMutatePowerAlternator({
      ...data,
      Alternador_Id,
    });

    setIsOpen(false);
    reset();
  };

  return (
    <>
      <Dialog
        open={isOpen}
        as="div"
        className={"relative z-50"}
        onClose={() => {}}
      >
        <div className="fixed inset-0 bg-black/30 z-50 w-screen overflow-y-auto">
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
                  Crear Nueva Potencia del Alternador
                </h2>
              </div>
              <form onSubmit={handleSubmit(onSave)} className="flex flex-col">
                <section className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-3 my-6">
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
                      Voltaje
                    </label>
                    <input
                      label="Voltaje"
                      className="rounded-lg w-full p-2 border border-gray-400/50"
                      type="number"
                      {...register("Voltaje")}
                    />
                  </section>
                  <section className="relative">
                    <label className="uppercase font-medium text-sm">
                      Potencia Prime {site.powerUnits.kilowatt}
                    </label>
                    <input
                      label={`Potencia Prime ${site.powerUnits.kilowatt}`}
                      className="rounded-lg w-full p-2 border border-gray-400/50"
                      type="number"
                      step="0.01"
                      {...register("Prime_KW")}
                    />
                  </section>
                  <section className="relative">
                    <label className="uppercase font-medium text-sm">
                      Potencia Prime {site.powerUnits.kilovoltAmpere}
                    </label>
                    <input
                      label={`Potencia Prime ${site.powerUnits.kilovoltAmpere}`}
                      className="rounded-lg w-full p-2 border border-gray-400/50"
                      type="number"
                      step="0.01"
                      {...register("Prime_KVA")}
                    />
                  </section>
                  <section className="relative">
                    <label className="uppercase font-medium text-sm">
                      Potencia Stand By {site.powerUnits.kilowatt}
                    </label>
                    <input
                      label={`Potencia Stand By ${site.powerUnits.kilowatt}`}
                      className="rounded-lg w-full p-2 border border-gray-400/50"
                      type="number"
                      step="0.01"
                      {...register("Standby_KW")}
                    />
                  </section>
                  <section className="relative">
                    <label className="uppercase font-medium text-sm">
                      Potencia Stand By {site.powerUnits.kilovoltAmpere}
                    </label>
                    <input
                      label={`Potencia Stand By ${site.powerUnits.kilovoltAmpere}`}
                      className="rounded-lg w-full p-2 border border-gray-400/50"
                      type="number"
                      step="0.01"
                      {...register("SandtBy_KVA")}
                    />
                  </section>
                  <section className="relative">
                    <label className="uppercase font-medium text-sm">
                      Eficiencia
                    </label>
                    <input
                      label="Eficiencia"
                      className="rounded-lg w-full p-2 border border-gray-400/50"
                      type="number"
                      step="0.01"
                      {...register("Eficiencia")}
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
