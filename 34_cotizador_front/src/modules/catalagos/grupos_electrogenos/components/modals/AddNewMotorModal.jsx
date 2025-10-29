import { Dialog, DialogPanel } from "@headlessui/react";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "../../../../../components/custom/buttons/Button";
import useModelsSearch from "../../hooks/useModelsSearch";
import { InfoSection } from "../MotorInfo";
import { FormInputText } from "../../../../../components/custom/inputs/FormInputText";
import { Modal } from "../../../../../components/modals/Modal";

export const AddNewMotorModal = ({ createMutateMotor, isOpen, setIsOpen }) => {
  const initialValues = {
    sMotCodigoSAP: "",
    MotorMarca_Id: "",
    sMotModelo: "",
    sMotFamilia: "",
    sMotNoCilindros: "",
    sMotSisGobernacion: "",
    sMotCiclo: "",
    sMotAspiracion: "",
    sMotCombustible: "",
    sMotSisCombustion: "",
    sMotSisEnfriamiento: "",
    nMotDiametroPiston: 0,
    nMotDesplazamientoPiston: 0,
    nMotCapacidad: 0,
    sMotRelCompresion: "",
    nMotCapSisLubricacion: 0,
    nMotCapSisRefrigeracion: 0,
    nMotSisElectrico: 0,
    sMotNormasTecnicas: "",
    sMotNivelEmision: "",
    nMotConsStandBy1800: 0,
    nMotConsPrime1800: 0,
    nMotConsPrime1800_75porc: 0,
    nMotConsPrime1800_50porc: 0,
    nMotConsStandBy1500: 0,
    nMotConsPrime1500: 0,
    nMotConsPrime1500_75porc: 0,
    nMotConsPrime1500_50porc: 0,
    nMotEstado: 1,
    nMotEliminado: 0,
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ defaultValues: initialValues });

  const { motorBrands } = useModelsSearch();

  const onSubmit = (data) => {
    createMutateMotor(data);
    reset();
  };

  return (
    <Modal
      open={isOpen}
      setOpen={setIsOpen}
      title={"Nuevo Motor"}
      width="max-w-4xl"
    >
      <div className="p-4 overflow-y-auto flex-1">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-5">
              <InfoSection title="Información General">
                {motorBrands && motorBrands.length > 0 && (
                  <div className="flex flex-col justify-between items-start ">
                    <label className="uppercase font-medium text-sm">
                      Marca
                    </label>
                    <select
                      name="MotorMarca_Id"
                      {...register("MotorMarca_Id", {
                        required: "Selecciona una marca",
                      })}
                      className={`text-xs mt-1 border p-2 rounded-lg focus:outline-none focus:ring-1 w-full cursor-pointer ${
                        errors.MotorMarca_Id ? "border-red-500" : ""
                      }`}
                    >
                      {motorBrands.map((brand) => (
                        <option
                          className="text-black text-sm cursor-pointer"
                          key={brand.MotorMarca_Id}
                          value={brand.MotorMarca_Id}
                        >
                          {brand.sMotMarca}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <AddItem
                  label="Código ERP"
                  name="sMotCodigoSAP"
                  register={register}
                  errors={errors}
                  rules={{
                    maxLength: {
                      value: 20,
                      message: "Máximo 20 caracteres",
                    },
                  }}
                />
                <AddItem
                  label="Modelo"
                  name="sMotModelo"
                  register={register}
                  errors={errors}
                  rules={{
                    required: "Este campo es obligatorio",
                    maxLength: {
                      value: 45,
                      message: "Máximo 45 caracteres",
                    },
                  }}
                />
                <AddItem
                  label="Familia"
                  name="sMotFamilia"
                  register={register}
                  errors={errors}
                  rules={{
                    maxLength: {
                      value: 45,
                      message: "Máximo 45 caracteres",
                    },
                  }}
                />
                <AddItem
                  label="Ciclo"
                  name="sMotCiclo"
                  register={register}
                  errors={errors}
                  rules={{
                    maxLength: {
                      value: 45,
                      message: "Máximo 45 caracteres",
                    },
                  }}
                />
                <AddItem
                  label="Combustible"
                  name="sMotCombustible"
                  register={register}
                  errors={errors}
                  rules={{
                    maxLength: {
                      value: 45,
                      message: "Máximo 45 caracteres",
                    },
                  }}
                />
                <AddItem
                  label="Normas Técnicas"
                  name="sMotNormasTecnicas"
                  register={register}
                  errors={errors}
                  rules={{
                    maxLength: {
                      value: 100,
                      message: "Máximo 100 caracteres",
                    },
                  }}
                />
                <AddItem
                  label="Nivel de Emisión"
                  name="sMotNivelEmision"
                  register={register}
                  errors={errors}
                  rules={{
                    maxLength: {
                      value: 45,
                      message: "Máximo 45 caracteres",
                    },
                  }}
                />
              </InfoSection>

              {/* Engine Specs */}
              <InfoSection title="Especificaciones">
                <AddItem
                  label="Cilindros"
                  name="sMotNoCilindros"
                  register={register}
                  errors={errors}
                  rules={{
                    maxLength: {
                      value: 45,
                      message: "Máximo 45 caracteres",
                    },
                  }}
                />
                <AddItem
                  label="Aspiración"
                  name="sMotAspiracion"
                  register={register}
                  errors={errors}
                  rules={{
                    maxLength: {
                      value: 45,
                      message: "Máximo 45 caracteres",
                    },
                  }}
                />
                <AddItem
                  label="Sistema de Combustión"
                  name="sMotSisCombustion"
                  register={register}
                  errors={errors}
                  rules={{
                    maxLength: {
                      value: 45,
                      message: "Máximo 45 caracteres",
                    },
                  }}
                />
                <AddItem
                  label="Sistema de Enfriamiento"
                  name="sMotSisEnfriamiento"
                  register={register}
                  errors={errors}
                  rules={{
                    maxLength: {
                      value: 45,
                      message: "Máximo 45 caracteres",
                    },
                  }}
                />
                <AddItem
                  label="Gobernación"
                  name="sMotSisGobernacion"
                  register={register}
                  errors={errors}
                  rules={{
                    maxLength: {
                      value: 45,
                      message: "Máximo 45 caracteres",
                    },
                  }}
                />
              </InfoSection>
            </div>

            <div className="space-y-5">
              <InfoSection title="Dimensiones y Características">
                <AddItem
                  label="Diámetro de pistón (mm)"
                  name="nMotDiametroPiston"
                  register={register}
                  errors={errors}
                  rules={{
                    pattern: {
                      value: /^\d+$/,
                      message: "Solo se permiten números enteros",
                    },
                  }}
                />
                <AddItem
                  label="Desplazamiento (mm)"
                  name="nMotDesplazamientoPiston"
                  register={register}
                  errors={errors}
                  rules={{
                    pattern: {
                      value: /^\d+$/,
                      message: "Solo se permiten números enteros",
                    },
                  }}
                />
                <AddItem
                  label="Capacidad (cc)"
                  name="nMotCapacidad"
                  register={register}
                  errors={errors}
                  rules={{
                    pattern: {
                      value: /^\d+$/,
                      message: "Solo se permiten números enteros",
                    },
                  }}
                />
                <AddItem
                  label="Relación de compresión"
                  name="sMotRelCompresion"
                  register={register}
                  errors={errors}
                  rules={{
                    maxLength: {
                      value: 45,
                      message: "Máximo 45 caracteres",
                    },
                  }}
                />
                <AddItem
                  label="Sistema eléctrico (V)"
                  name="nMotSisElectrico"
                  register={register}
                  errors={errors}
                  rules={{
                    pattern: {
                      value: /^\d+$/,
                      message: "Solo se permiten números enteros",
                    },
                    maxLength: {
                      value: 4,
                      message: "Máximo 4 caracteres",
                    },
                  }}
                />
              </InfoSection>

              <InfoSection title="Capacidades">
                <AddItem
                  label="Sistema de lubricación (litros)"
                  name="nMotCapSisLubricacion"
                  register={register}
                  errors={errors}
                  rules={{
                    pattern: {
                      value: /^\d+(\.\d{1,2})?$/,
                      message: "Solo se permiten números enteros o decimales",
                    },
                  }}
                />
                <AddItem
                  label="Sistema de refrigeración (litros)"
                  name="nMotCapSisRefrigeracion"
                  register={register}
                  errors={errors}
                  rules={{
                    pattern: {
                      value: /^\d+(\.\d{1,2})?$/,
                      message: "Solo se permiten números enteros o decimales",
                    },
                  }}
                />
              </InfoSection>
            </div>
          </div>

          <div className="mt-6 space-y-5 border p-2 rounded-md">
            <h3 className="text-lg font-semibold">Consumo de Combustible</h3>

            <div className=" rounded-lg p-5">
              <div className="flex flex-col md:flex-row mb-3">
                <h4 className="text-orange-600 font-medium mb-2 md:mb-0 md:w-1/4">
                  1800 RPM
                </h4>
                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3">
                  <AddConsumptionItem
                    label="Stand By"
                    name="nMotConsStandBy1800"
                    register={register}
                    errors={errors}
                    rules={{
                      pattern: {
                        value: /^\d+(\.\d{1,2})?$/,
                        message: "Solo se permiten números enteros o decimales",
                      },
                    }}
                  />
                  <AddConsumptionItem
                    label="Prime"
                    name="nMotConsPrime1800"
                    register={register}
                    errors={errors}
                    rules={{
                      pattern: {
                        value: /^\d+(\.\d{1,2})?$/,
                        message: "Solo se permiten números enteros o decimales",
                      },
                    }}
                  />
                  <AddConsumptionItem
                    label="Prime 75%"
                    name="nMotConsPrime1800_75porc"
                    register={register}
                    errors={errors}
                    rules={{
                      pattern: {
                        value: /^\d+(\.\d{1,2})?$/,
                        message: "Solo se permiten números enteros o decimales",
                      },
                    }}
                  />
                  <AddConsumptionItem
                    label="Prime 50%"
                    name="nMotConsPrime1800_50porc"
                    register={register}
                    errors={errors}
                    rules={{
                      pattern: {
                        value: /^\d+(\.\d{1,2})?$/,
                        message: "Solo se permiten números enteros o decimales",
                      },
                    }}
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row">
                <h4 className="text-orange-600 font-medium mb-2 md:mb-0 md:w-1/4">
                  1500 RPM
                </h4>
                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3">
                  <AddConsumptionItem
                    label="Stand By"
                    name="nMotConsStandBy1500"
                    register={register}
                    errors={errors}
                    rules={{
                      pattern: {
                        value: /^\d+(\.\d{1,2})?$/,
                        message: "Solo se permiten números enteros o decimales",
                      },
                    }}
                  />
                  <AddConsumptionItem
                    label="Prime"
                    name="nMotConsPrime1500"
                    register={register}
                    errors={errors}
                    rules={{
                      pattern: {
                        value: /^\d+(\.\d{1,2})?$/,
                        message: "Solo se permiten números enteros o decimales",
                      },
                    }}
                  />
                  <AddConsumptionItem
                    label="Prime 75%"
                    name="nMotConsPrime1500_75porc"
                    register={register}
                    errors={errors}
                    rules={{
                      pattern: {
                        value: /^\d+(\.\d{1,2})?$/,
                        message: "Solo se permiten números enteros o decimales",
                      },
                    }}
                  />
                  <AddConsumptionItem
                    label="Prime 50%"
                    name="nMotConsPrime1500_50porc"
                    register={register}
                    errors={errors}
                    rules={{
                      pattern: {
                        value: /^\d+(\.\d{1,2})?$/,
                        message: "Solo se permiten números enteros o decimales",
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <section className="flex items-center justify-center gap-6 mt-10">
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
      </div>
    </Modal>
  );
};

const AddItem = ({ label, name, register, type = "text", rules, errors }) => (
  <div className="w-full">
    <div className="w-full">
      <FormInputText
        type="text"
        label={label}
        className="p-input text-xs w-full"
        {...register(name, rules)}
      />
      {/* <label className="text-blue-900 font-medium">{label}</label>
      <input
        type={type}
        {...register(name, rules)}
        className={`mt-1 p-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-200 
        ${errors[name] ? "border-red-500" : "border-blue-300"}`}
      /> */}
    </div>
    {/* {errors[name] && <span className='text-red-500 text-sm mt-1'>{errors[name].message}</span>} */}
  </div>
);

const AddConsumptionItem = ({
  label,
  name,
  register,
  type = "text",
  rules,
  errors,
}) => (
  <div>
    <div className="bg-white rounded-lg p-3 text-center shadow-sm transition-all duration-200 hover:shadow-md hover:translate-y-[-2px]">
      <div className="text-sm mb-1">{label}</div>
      <div className="text-sm font-semibold">
        <input
          type={type}
          {...register(name, rules)}
          className={`mt-1 p-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-200 w-20
					${errors[name] ? "border-red-500" : ""}`}
        />
      </div>
    </div>
    {/* {errors[name] && <span className='text-red-500 text-xs'>{errors[name].message}</span>} */}
  </div>
);
