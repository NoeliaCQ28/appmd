import { useForm } from "react-hook-form";
import { Button } from "../../../../../components/custom/buttons/Button";
import { FormInputText } from "../../../../../components/custom/inputs/FormInputText";
import { Modal } from "../../../../../components/modals/Modal";
import useModelsSearch from "../../hooks/useModelsSearch";
import { InfoSection } from "../MotorInfo";

export const AddNewAlternadorModal = ({
  createMutateAlternador,
  isOpen,
  setIsOpen,
}) => {
  const initialValues = {
    sAltCodigoSAP: "",
    AlternadorMarca_Id: "",
    sAltModelo: "",
    sAltFamilia: "",
    sAltAislamiento: "",
    sAltSistemaExitacion: "",
    sAltTarjetaAVR: "",
    sAltGradoIP: "",
    sAltNormaTecnica: "",
    nAltNroHilos: 0,
    sAltNroPaso: "",
    nAltPesoKg: 0,
    nAltEstado: 1,
    nAltEliminado: 0,
    nAltBrida: 0,
    nAltDisco: 0,
    nAltCostoUSD: 0,
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const { alternatorBrands } = useModelsSearch();

  const onSubmit = (data) => {
    createMutateAlternador(data);

    setIsOpen(false);
  };

  return (
    <Modal
      open={isOpen}
      setOpen={setIsOpen}
      title="Agregar Nuevo Alternador"
      withBackground
      width="max-w-3xl"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-2 transition-all duration-300"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-5">
            <InfoSection title="Información General">
              {alternatorBrands && alternatorBrands.length > 0 && (
                <div className="flex flex-col justify-between items-start">
                  <label className="uppercase font-medium text-sm">Marca</label>
                  <select
                    name="AlternadorMarca_Id"
                    {...register("AlternadorMarca_Id", {
                      required: "Selecciona una marca",
                    })}
                    className={`text-xs mt-1 border p-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-200 w-full cursor-pointer ${
                      errors.AlternadorMarca_Id ? "border-red-500" : ""
                    }`}
                  >
                    {alternatorBrands.map((brand) => (
                      <option
                        className="text-black text-sm cursor-pointer"
                        key={brand.AlternadorMarca_Id}
                        value={`${brand.AlternadorMarca_Id}`}
                      >
                        {brand.sAltMarca}{" "}
                        {brand?.sAltMarcaObservacion &&
                          ` - ${brand.sAltMarcaObservacion}`}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <AddItem
                label="Código ERP"
                name="sAltCodigoSAP"
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
                name="sAltModelo"
                register={register}
                errors={errors}
                rules={{
                  required: "El modelo de alternador es obligatorio",
                  maxLength: {
                    value: 45,
                    message: "Máximo 45 caracteres",
                  },
                }}
              />
              <AddItem
                label="Sistema de Exitación"
                name="sAltSistemaExitacion"
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
                label="Aislamiento"
                name="sAltAislamiento"
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
                label="Grado de Protección"
                name="sAltGradoIP"
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
                label="Brida"
                name="nAltBrida"
                register={register}
                errors={errors}
                rules={{
                  required: "Este campo es obligatorio",
                  min: {
                    value: 0,
                    message: "La brida debe ser mayor o igual a 0",
                  },
                }}
              />
              <AddItem
                label="Disco"
                name="nAltDisco"
                register={register}
                errors={errors}
                rules={{
                  required: "Este campo es obligatorio",
                  min: {
                    value: 0,
                    message: "El disco debe ser mayor o igual a 0",
                  },
                }}
              />
              <AddItem
                label="Costo (USD)"
                name="nAltCostoUSD"
                register={register}
                errors={errors}
                rules={{
                  required: "Este campo es obligatorio",
                  min: {
                    value: 0,
                    message: "El costo debe ser mayor o igual a 0",
                  },
                }}
              />
            </InfoSection>

            {/* Engine Specs */}
            <InfoSection title="Especificaciones Técnicas">
              <AddItem
                label="Tarjeta AVR"
                name="sAltTarjetaAVR"
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
                label="Número de Hilos"
                name="nAltNroHilos"
                register={register}
                errors={errors}
                rules={{
                  pattern: {
                    value: /^\d+$/,
                    message: "Solo se permiten números enteros",
                  },
                  //   min: {
                  //     value: 1,
                  //     message: "El número debe ser mayor o igual a 1",
                  //   },
                  maxLength: {
                    value: 4,
                    message: "Máximo 4 caracteres",
                  },
                }}
              />
              <AddItem
                label="Número de Paso"
                name="sAltNroPaso"
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
            <InfoSection title="Características Físicas">
              <AddItem
                label="Peso (Kg)"
                name="nAltPesoKg"
                register={register}
                errors={errors}
                rules={{
                  pattern: {
                    value: /^\d+(\.\d{1,2})?$/,
                    message: "Solo se permiten números enteros o decimales",
                  },
                  //   min: {
                  //     value: 1,
                  //     message: "El número debe ser mayor o igual a 1",
                  //   },
                }}
              />
            </InfoSection>

            <InfoSection title="Normas y Certificaciones">
              <AddItem
                label="Normas Técnicas"
                name="sAltNormaTecnica"
                register={register}
                errors={errors}
                rules={{
                  maxLength: {
                    value: 100,
                    message: "Máximo 100 caracteres",
                  },
                }}
              />
            </InfoSection>
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
    </Modal>
  );
};

const AddItem = ({ label, name, register, rules, errors }) => (
  <div className="w-full">
    <FormInputText
      type="text"
      label={label}
      className="w-full text-xs"
      {...register(name, rules)}
    />

    {errors[name] && (
      <span className="text-red-500 text-sm mt-1">{errors[name].message}</span>
    )}
  </div>
);
