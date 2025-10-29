import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { FormInputText } from "../../../../components/custom/inputs/FormInputText";
import { InputTextarea } from "primereact/inputtextarea";
import { Controller, useForm } from "react-hook-form";
import modasa from "/login.png";
import useLocation from "../../../../hooks/useLocation";
import { useEmail } from "../hooks/useEmail";
import { useParams, useSearchParams } from "react-router";

export const CreateCotizar = () => {
  let [searchParams] = useSearchParams();

  const combination = Object.fromEntries(searchParams.entries());

  const { countriesWhereMODASAOperates, citiesOfCountry } = useLocation({
    initialValues: { country: "Peru" },
  });

  const initialValues = {
    nombres: "",
    empresa: "",
    telefono: "",
    email: "",
    country: "",
    province: "",
    message: "",
  };

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({ defaultValues: initialValues });

  const selectedCountry = watch("country");

  const { sendEmailForGetAQuoteMutate, isSendingEmailForGetAQuote } =
    useEmail();

  const onSubmit = (data) => {
    sendEmailForGetAQuoteMutate({
      customerName: data.nombres,
      businessName: data.empresa,
      phone: data.telefono.toString(),
      email: data.email,
      country: data.country,
      province: data.province,
      message: data.message,
      combination: combination,
    });
  };

  return (
    <>
      <div className="px-4 py-2 w-auto bg-[#F3F4F8] min-h-screen">
        <div className="flex justify-center mt-10 gap-10 mb-10 flex-col-reverse md:flex-row">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-5 flex flex-col gap-7 bg-[#FFFFFF] w-full md:w-[45rem] rounded-md"
          >
            <span className="text-blue-500 font-semibold text-2xl">
              Déjanos un mensaje
            </span>
            <div className="grid grid-cols-1">
              <FormInputText
                label={"Nombre y apellido"}
                placeholder={"Ingrese su nombre y apellido"}
                error={errors.nombres}
                {...register("nombres", {
                  required: "El campo nombre y apellido es requerido",
                })}
              />
            </div>
            <div className="grid grid-cols-1">
              <FormInputText
                label={"Empresa"}
                placeholder={"Ingrese nombre de su empresa"}
                error={errors.empresa}
                {...register("empresa", {
                  required: "El campo empresa es requerido",
                })}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="w-full flex flex-col">
                <label className="uppercase font-medium text-sm">
                  TELÉFONO
                </label>
                <Controller
                  name="telefono"
                  control={control}
                  rules={{
                    required: "El campo Teléfono es requerido",
                  }}
                  render={({ field }) => (
                    <InputNumber
                      className="mt-2"
                      placeholder="Ingrese su Teléfono"
                      value={field.value || ""}
                      onValueChange={(e) => field.onChange(e.value)}
                      useGrouping={false}
                      maxLength={15}
                    />
                  )}
                />
                {errors.telefono && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.telefono.message}
                  </p>
                )}
              </div>
              <FormInputText
                placeholder={"Ingrese su email"}
                label={"Email"}
                error={errors.email}
                type="email"
                {...register("email", {
                  required: "El campo email es requerido",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Ingrese un email válido",
                  },
                })}
              />
            </div>
            <div className="grid grid-cols-1">
              <div className="w-full flex flex-col gap-1">
                <label className="uppercase font-medium text-sm">PAÍS</label>
                <Controller
                  name="country"
                  control={control}
                  rules={{
                    required: "El campo País es requerido",
                  }}
                  render={({ field }) => (
                    <Dropdown
                      className="mt-2"
                      placeholder="Seleccione un país"
                      value={field.value}
                      onChange={(e) => field.onChange(e.value)}
                      options={countriesWhereMODASAOperates}
                      filter
                      filterPlaceholder="Buscar país"
                    />
                  )}
                />
                {errors.country && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.country.message}
                  </p>
                )}
              </div>
              {(selectedCountry === "Perú" || selectedCountry === "Peru") && (
                <div className="w-full flex flex-col gap-1 mt-6">
                  <label className="uppercase font-medium text-sm">
                    PROVINCIA
                  </label>
                  <Controller
                    name="province"
                    control={control}
                    rules={{
                      required: "El campo Provincia es requerido",
                    }}
                    render={({ field }) => (
                      <Dropdown
                        className="mt-2"
                        placeholder="Seleccione una provincia"
                        value={field.value}
                        onChange={(e) => field.onChange(e.value)}
                        options={citiesOfCountry}
                        filter
                        filterPlaceholder="Buscar provincia"
                      />
                    )}
                  />
                  {errors.province && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.province.message}
                    </p>
                  )}
                </div>
              )}
            </div>
            <div className="grid grid-cols-1">
              <label className="uppercase font-medium text-sm">Mensaje</label>
              <Controller
                name="message"
                control={control}
                rules={{
                  required: "El campo mensaje es requerido",
                }}
                render={({ field }) => (
                  <InputTextarea
                    className="mt-2"
                    placeholder="Ingrese su Mensaje"
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    rows={5}
                    autoResize
                  />
                )}
              />
              {errors.message && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.message.message}
                </p>
              )}
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className={`p-3 border rounded-md ${
                  isSendingEmailForGetAQuote
                    ? "bg-[#ffd591] cursor-not-allowed"
                    : "bg-[#FF9F00]"
                } text-white font-semibold w-64 flex justify-center items-center`}
                disabled={isSendingEmailForGetAQuote}
              >
                {isSendingEmailForGetAQuote ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-red-600"></div>
                  </>
                ) : (
                  "Enviar"
                )}
              </button>
            </div>
          </form>
          <div className="flex flex-col h-full items-center md:h-[30rem]">
            <div className="max-w-[46rem] h-full">
              <img
                src={modasa} //GE-subestacion-2.png
                alt=""
              />
            </div>
            {/* <div className="flex flex-col space-y-4">
                            <span className="text-blue-500 font-semibold text-2xl" >Para otras consultas escríbenos:</span>
                            <span className="flex items-center justify-center gap-2 text-xl"> <MdOutlineEmail size={28} /> webinfo@modasa.com.pe</span>
                        </div> */}
          </div>
        </div>
      </div>
    </>
  );
};
