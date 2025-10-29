import { CardResumen } from "@components/CardResumen";
import { FormInputText } from "@components/custom/inputs/FormInputText";
import { FormSelectText } from "@components/custom/selects/FormSelectText";
import { Fullscreen, Plus, Save } from "lucide-react";
import { Calendar } from "primereact/calendar";
import { Editor } from "primereact/editor";
import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Controller, useForm } from "react-hook-form";
import { IoIosAdd } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "../../../../../components/custom/buttons/Button";
import { ButtonIcon } from "../../../../../components/custom/buttons/ButtonIcon";
import { ErrorComponent } from "../../../../../components/error/ErrorComponent";
import { ContactModal } from "../../../../catalagos/clientes/components/forms/modals/ContactModal";
import { CreateOrViewCommercialConditionModal } from "../../../../catalagos/condiciones/components/modals/CreateOrViewCommercialConditionModal";
import { useCablesStore } from "../../hooks/useCablesStore";
import { useCellsStore } from "../../hooks/useCellsStore";
import { useDetails } from "../../hooks/useDetails";
import { useElectrogenosStore } from "../../hooks/useElectrogenosStore";
import { useExchange } from "../../hooks/useExchange";
import useQuote from "../../hooks/useQuote";
import { useResume } from "../../hooks/useResume";
import { useTransformersStore } from "../../hooks/useTransformersStore";
import { useExchangeStore } from "../../store/useExchangeStore";
import { useQuotationStore } from "../../store/useQuotationStore";
import { useGeneratorSetStore } from "../../store/v2/useGeneratorSetStore";
import { generateQuotePayload } from "../../utils/utils";
import useCustomerContacts from "./../../../../catalagos/clientes/hooks/useCustomerContacts";
import { QuoteDetailsTable } from "./../QuoteDetailsTable";
import { AddCablesModal } from "./modals/AddCablesModal";
import { AddCeldasModal } from "./modals/AddCeldasModal";
import { AddClientModal } from "./modals/AddClientModal";
import { AddElectrogenosModal } from "./modals/AddElectrogenosModal";
import { AddTransformadorModal } from "./modals/AddTransformadorModal";
import ViewModes from "../../../../../constants/ViewModes";

export const QuoteForm = ({
  currencies,
  markets,
  sellers,
  customers,
  comercialConditions,
  distributionChannels,
  incoterms,
  user,
}) => {
  const navigate = useNavigate();

  const sellerByDefault = React.useMemo(
    () => sellers.find((seller) => seller.nUsuarioAsignadoId === user?.id),
    [sellers, user]
  );
  const {
    activeModal,
    openModal,
    closeModal,
    quotationType,
    types,
    setQuotationType,
    setQuote,
    quote,
    clearQuote,
  } = useQuotationStore();
  const { setTypeChange, setCurrency } = useExchangeStore();
  const { currency, evalTypeChange } = useExchange();

  const [customerSelected, setCustomerSelected] = React.useState(null);
  const [
    openCreateOrEditCommercialConditionModal,
    setopenCreateOrEditCommercialConditionModal,
  ] = React.useState(false);
  const [isEditModeOnCommercialCondition, setIsEditModeOnCommercialCondition] =
    React.useState(false);
  const [commercialConditionSelected, setCommercialConditionSelected] =
    React.useState(null);

  const { data: contacts = [], isLoading: isLoadingContacts } =
    useCustomerContacts(customerSelected?.Cliente_Id);

  const { createMutate } = useQuote();

  const [date, setDate] = React.useState(quote?.date);

  const { details, standardDetails, isDetailsAvailable } = useDetails();
  const { resume, isResumeAvailable } = useResume(details);
  const { discount: cablesGlobalDiscount, clearCablesAdded } = useCablesStore();
  const { discount: cellsGlobalDiscount, clearCellsAdded } = useCellsStore();
  const { discount: transformersGlobalDiscount, clearTransformersAdded } =
    useTransformersStore();
  const { clearNewItems } = useElectrogenosStore();
  const { clearGeneratorSetsAdded } = useGeneratorSetStore();
  React.useEffect(() => {
    const customerSelected = customers.find(
      (c) => c.Cliente_Id === quote.customerId
    );
    setCustomerSelected(customerSelected);
  }, [customers, quote.customerId]);

  const currenciesName = React.useMemo(
    () =>
      currencies.map((currency) =>
        `${currency.sMonAlias} - ${currency.sMonDescripcion}`.trim()
      ),
    [currencies]
  );

  const defaultValues = {
    codigo: quote.code,
    cliente_id: customers.find(
      (customer) => customer.Cliente_Id === quote.customerId
    )?.sCliNombre,
    ejecutivo_id: sellers.find(
      (seller) => seller.Ejecutivo_Id === quote.comercialExecutiveId
    )?.sEjeNombre,
    ruc_dni: "",
    fecha: date,
    validez_oferta: quote?.validityOffer || 7,
    proyecto: quote.project,
    direccion: quote.address,
    contacto: quote.customerContact,
    telefono: quote.telephone,
    email: quote.email,
    envio: quote.sending,
    costo_envio: quote.shippingCost,
    instalacion: quote.installation,
    costo_instalacion: quote.installationCost,
    puesta_en_marcha: quote.startup,
    costo_puesta_en_marcha: quote.startupCost,
    mercado: markets.find((market) => market.MercadoId === quote.marketId)
      ?.sNombre,
    moneda_id: currenciesName.find(
      (currencyName) =>
        currencyName.split(" - ")[1] ===
        currencies.find((currency) => currency.Moneda_Id === quote.currencyId)
          ?.sMonDescripcion
    ),
    tipo_cambio: quote.typeChange,
    total: 0,
    condicion_comercial_id: comercialConditions?.find(
      (condition) =>
        condition.CondicionesComerciales_Id === quote.comercialConditionId
    )?.sConTitulo,
    estado: quote.state,
    usuario_aprobador_id: null,
    aprobacion_fecha: null,
    eliminado: 0,
    cotizador_tipo: types.find((tipo) => tipo.id === quotationType).description,
    canal_distribucion: quote?.distributionChannelId
      ? distributionChannels.find(
          (channel) => channel.CanalId === quote.distributionChannelId
        )?.sNombre
      : distributionChannels.find((channel) => channel.sNombre === "ModaPower")
          ?.sNombre,
    incoterm: quote?.incotermId
      ? incoterms.find((incoterm) => incoterm.IncotermId === quote.incotermId)
          ?.sDescripcion
      : incoterms.find(
          (incoterm) => incoterm.sDescripcion === "Puesto en fábrica MODASA"
        )?.sDescripcion,
    incoterm_valor: quote?.incotermValue || 0,
    incoterm_valor_seguro: quote?.incotermValueInsurance || 0,
    observaciones_HTML: quote.observationsHTML,
  };

  const initialIsDollarSelected =
    defaultValues.moneda_id &&
    defaultValues.moneda_id.split(" - ")[1] === "Dolar Estadounidense (USD)";

  // // Estado para rastrear si la moneda seleccionada es dólares
  const [isDollarSelected, setIsDollarSelected] = React.useState(
    initialIsDollarSelected
  );

  // const formattedQuoteDate = React.useMemo(() => {
  // 	if (date) {
  // 		const quoteDate = new Date(date);
  // 		const year = quoteDate.getFullYear();
  // 		const month = String(quoteDate.getMonth() + 1).padStart(2, '0');
  // 		const day = String(quoteDate.getDate()).padStart(2, '0');
  // 		return `${year}-${month}-${day}`;
  // 	}
  // }, [date]);

  // //Obtener el tipo de cambio
  // const { data: typeChangeData, isLoading: isLoadingTypeChange } = useTypeChange(formattedQuoteDate);

  const {
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm({ defaultValues });

  const marketType = watch("mercado");

  const commercialConditionsFilterByQuoteType = React.useMemo(
    () =>
      comercialConditions?.filter(
        (condition) =>
          condition.nConCotTipoId === quotationType &&
          condition.sMercadoNombre === (marketType === 'NACIONAL' ? 'NACIONAL' : 'EXPORTACIÓN')
      ),
    [comercialConditions, quotationType, marketType]
  );

  // React.useEffect(() => {
  // 	if (isDollarSelected) {
  // 		if (!isLoadingTypeChange && typeChangeData?.venta) {
  // 			setValue('tipo_cambio', typeChangeData.venta);
  // 		}
  // 	} else {
  // 		setValue('tipo_cambio', 1);
  // 	}
  // }, [isDollarSelected, isLoadingTypeChange, typeChangeData, setValue]);

  React.useEffect(() => {
    if (customerSelected) {
      if (contacts.length > 0) {
        const lastContact = contacts[contacts.length - 1];
        setValue("contacto", lastContact?.sCliConNombre);
        setValue("telefono", lastContact.sCliConTelefono || "");
        setValue("email", lastContact.sCliConCorreo || "");
      } else {
        // Limpiar campos si no hay contactos
        setValue("telefono", "");
        setValue("email", "");
      }
    }
  }, [contacts, customerSelected, setValue]);

  const marketsName = React.useMemo(
    () => markets.map((market) => market.sNombre),
    [markets]
  );
  const sellersName = React.useMemo(
    () => sellers.map((seller) => seller.sEjeNombre),
    [sellers]
  );

  const contactsName = React.useMemo(
    () => contacts.map((contact) => contact.sCliConNombre).sort(),
    [contacts]
  );

  const [ClienteModalVisible, setClienteModalVisible] = React.useState(false);

  const [onlyAttachContact, setOnlyAttachContact] = React.useState(false);

  const cleanAll = () => {
    // Limpiar el formulario
    reset();

    // Limpiar el estado global de la cotización
    clearQuote();

    // Limpiar todos los stores según el tipo de cotización
    clearGeneratorSetsAdded();
    clearNewItems();
    clearCablesAdded();
    clearCellsAdded();
    clearTransformersAdded();

    // Limpiar estados locales
    setCustomerSelected(null);
    setDate(new Date());
    setIsDollarSelected(false);
  };

  const onSave = (data) => {
    if (details.length === 0) {
      switch (quotationType) {
        case 1:
          toast.warning("Debe agregar al menos un modelo de grupo electrogeno");
          break;
        case 2:
          toast.warning("Debe agregar al menos un detalle de cables");
          break;
        case 3:
          toast.warning("Debe agregar al menos un detalle de celdas");
          break;
        case 4:
          toast.warning("Debe agregar al menos un detalle de transformadores");
          break;
        default:
          toast.warning("Debe agregar al menos un detalle");
          return;
      }

      return;
    }

    let throughput = null;

    switch (quotationType) {
      case 2:
        throughput = cablesGlobalDiscount;
        break;
      case 3:
        throughput = cellsGlobalDiscount;
        break;
      case 4:
        throughput = transformersGlobalDiscount;
        break;
      default:
        throughput = null;
        break;
    }

    const payload = generateQuotePayload(data, {
      currencies,
      markets,
      customers,
      sellers,
      comercialConditions: commercialConditionsFilterByQuoteType,
      distributionChannels,
      incoterms,
      date,
      total: resume?.total || 0,
      details: standardDetails,
      quoteType: quotationType,
      descuento_global: null,
      margen_global: throughput,
    });

    isDollarSelected && (payload.tipo_cambio = 1);

    delete payload.ruc_dni;

    const rawObservations = payload.observaciones_HTML;

    payload.observaciones_HTML = rawObservations?.htmlValue;
    payload.observaciones = rawObservations?.textValue;

    createMutate(payload, {
      onSuccess: () => {
        cleanAll();

        // Navegar a la vista de cotizaciones
        navigate("/cotizaciones", { replace: true });
      },
    });
  };

  const customersFilterByMarketType = React.useMemo(
    () =>
      customers.filter((c) =>
        marketType === "NACIONAL"
          ? c.sCliPais === "Peru"
          : c.sCliPais !== "Peru"
      ),
    [customers, marketType]
  );

  const customerHasBeenCreated = React.useRef(false);
  const latestCustomerIdCreated = React.useRef(false);

  React.useEffect(() => {
    if (customerHasBeenCreated.current) {
      const customerFind = customers.find(
        (customer) => customer.Cliente_Id === latestCustomerIdCreated.current
      );
      if (customerFind) {
        setCustomerSelected(customerFind);
        setValue(
          "cliente_id",
          `${customerFind.sCliNombre} - ${
            customerFind.sCliRucDni || "Sin N° de identificación fiscal"
          }`
        );
        setValue("ruc_dni", customerFind.sCliRucDni || "");
      }
      customerHasBeenCreated.current = false;
    }
  }, [customers, setValue]);

  const handleCustomerCreated = (newCustomer) => {
    if (!newCustomer) {
      console.warn("No se recibió un cliente válido");
      return;
    }

    customerHasBeenCreated.current = true;
    latestCustomerIdCreated.current = newCustomer.Cliente_Id;

    setCustomerSelected(newCustomer);
  };

  React.useEffect(() => {
    setTypeChange(watch("tipo_cambio"));
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setTypeChange, watch("tipo_cambio")]);

  const setMarketType = (value) => {
    setValue("mercado", value);
  };

  const previousMarketRef = React.useRef(watch("mercado"));

  React.useEffect(() => {
    const currentMarket = watch("mercado");
    if (currentMarket !== previousMarketRef.current) {
      setCustomerSelected(null);
      setValue("telefono", "");
      setValue("email", "");
      setValue("ruc_dni", "");
      previousMarketRef.current = currentMarket;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch("mercado")]);

  const operativeCosts = [
    {
      label: "Costo de envío",
      value: parseFloat(watch("costo_envio")) || 0,
    },
    {
      label: "Costo de instalación",
      value: parseFloat(watch("costo_instalacion")) || 0,
    },
    {
      label: "Costo de puesta en marcha",
      value: parseFloat(watch("costo_puesta_en_marcha")) || 0,
    },
  ];

  const incotermsOptions = incoterms.map((incoterm) => ({
    label: `${incoterm?.sCodigo || "--"} - ${incoterm?.sDescripcion || "--"}`,
    value: incoterm?.sDescripcion,
  }));

  const selectedIncoterm = React.useMemo(
    () =>
      incoterms.find((incoterm) => incoterm.sDescripcion === watch("incoterm")),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [incoterms, watch("incoterm")]
  );

  return (
    <form className="py-6 space-y-7" onSubmit={handleSubmit(onSave)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 space-y-4 md:space-y-0">
        {/* <FormInputText
          label={"Codigo de cotización"}
          placeholder={"Ingrese codigo de cotización"}
          {...register("codigo", {
            required: "El codigo es obligatorio",
          })}
          type="number"
        /> */}

        <Controller
          name="cotizador_tipo"
          control={control}
          rules={{ required: "Debe seleccionar un Tipo de cotizador" }}
          render={({ field: { onChange, value, ...rest } }) => (
            <FormSelectText
              label={"Tipos de cotizador"}
              required
              {...rest}
              parentClassName="w-full"
              options={types
                .filter((t) =>
                  marketType === "EXPORTACIÓN" ? t.id === 1 : true
                )
                .map((tipo) => tipo.description)}
              value={value}
              onChange={(e) => {
                onChange(e.target.value ? e.target.value : null);
                setQuotationType(
                  types.find((tipo) => tipo.description === e.target.value).id
                );
              }}
              labelName={"cotizador_tipo"}
            />
          )}
        />

        <Controller
          name="ejecutivo_id"
          control={control}
          rules={{ required: "El Ejecutivo comercial es obligatorio" }}
          defaultValue={sellerByDefault?.sEjeNombre || ""}
          render={({ field: { onChange, value, ...rest } }) => (
            <FormSelectText
              label={"Ejecutivo comercial"}
              required
              {...rest}
              placeholder="Seleccione un ejecutivo comercial"
              parentClassName="w-full"
              options={sellersName}
              value={value}
              onChange={(e) => {
                onChange(e.target.value ? e.target.value : null);
                const sellerFind = sellers.find(
                  (seller) => seller.sEjeNombre === e.target.value
                );

                if (
                  sellerFind &&
                  (sellerFind?.sEjeSAP === "" || sellerFind?.sEjeSAP === null)
                ) {
                  toast.warning(
                    "El ejecutivo seleccionado no tiene un codigo ERP asignado"
                  );
                }
              }}
              labelName={"ejecutivo_id"}
              filter={true}
              error={errors.ejecutivo_id}
            />
          )}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 space-y-4 md:space-y-0">
        <Controller
          name="mercado"
          control={control}
          rules={{ required: "Debe seleccionar un mercado" }}
          render={({ field: { onChange, value, ...rest } }) => (
            <FormSelectText
              label={"Tipo de Mercado"}
              required
              {...rest}
              parentClassName="w-full"
              options={marketsName}
              value={value}
              onChange={(e) => {
                onChange(e.target.value ? e.target.value : null);
              }}
              labelName={"mercado"}
            />
          )}
        />
        <div className="flex gap-2 items-end">
          <div className="w-5/6">
            <Controller
              name="cliente_id"
              control={control}
              rules={{ required: "Debe seleccionar un Cliente/Prospecto" }}
              render={({ field: { onChange, value, ...rest } }) => {
                // Create options that include both name and DNI/RUC

                const customerOptions = customersFilterByMarketType.map(
                  (customer) =>
                    `${customer.sCliNombre} - ${
                      customer.sCliRucDni || "Sin N° de identificación fiscal"
                    }`
                );

                return (
                  <FormSelectText
                    label={"Cliente/Prospecto"}
                    required
                    {...rest}
                    placeholder="Seleccione un cliente"
                    parentClassName="w-full"
                    options={customerOptions}
                    value={
                      customerSelected
                        ? `${customerSelected.sCliNombre} - ${
                            customerSelected.sCliRucDni ||
                            "Sin N° de identificación fiscal"
                          }`
                        : ""
                    }
                    onChange={(e) => {
                      const selectedOption = e.target.value;
                      if (!selectedOption) {
                        onChange(null);
                        setCustomerSelected(null);
                        setValue("telefono", "");
                        setValue("email", "");
                        return;
                      }

                      // Extract the customer name from the selected option
                      const customerName = selectedOption.split(" - ")[0];
                      onChange(customerName);

                      const customerFind = customersFilterByMarketType.find(
                        (customer) => customer.sCliNombre === customerName
                      );

                      if (
                        customerFind &&
                        (customerFind?.sCliSAP === "" ||
                          customerFind?.sCliSAP === null)
                      ) {
                        toast.warning(
                          "El cliente seleccionado no tiene un codigo ERP asignado"
                        );
                      }

                      setCustomerSelected(customerFind || null);
                    }}
                    labelName={"cliente_id"}
                    filter={true}
                    error={errors.cliente_id}
                  />
                );
              }}
            />
          </div>
          <div className="w-1/6 flex-shrink-0 pb-1">
            <button
              className="bg-[#0056b8] hover:bg-[#004494] transform transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 w-10 h-10 rounded-lg flex items-center justify-center"
              onClick={() => {
                setClienteModalVisible(true);
              }}
              type="button"
            >
              <IoIosAdd color="white" size={24} />
            </button>
          </div>
        </div>
        <FormInputText
          label={"N° de identificación fiscal"}
          placeholder={"-"}
          {...register("ruc_dni")}
          value={customerSelected?.sCliRucDni}
          control={control}
          disabled={true}
        />
        <FormInputText
          label={"País"}
          {...register("pais")}
          value={customerSelected?.sCliPais}
          control={control}
          disabled={true}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:space-y-0">
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <Controller
              name="contacto"
              control={control}
              rules={{ required: "Debe seleccionar un Contacto" }}
              render={({ field: { onChange, value, ...rest } }) => (
                <FormSelectText
                  label={"Contacto"}
                  required
                  {...rest}
                  parentClassName="w-full"
                  placeholder="Seleccione un contacto"
                  options={contactsName}
                  value={value}
                  onChange={(e) => {
                    const contactoName = e.target.value ? e.target.value : null;

                    onChange(contactoName);

                    const telefono = contacts.find(
                      (c) => c.sCliConNombre === contactoName
                    )?.sCliConTelefono;

                    const email = contacts.find(
                      (c) => c.sCliConNombre === contactoName
                    )?.sCliConCorreo;

                    setValue("telefono", telefono);
                    setValue("email", email);
                  }}
                  labelName={"contacto"}
                  filter={true}
                />
              )}
            />
          </div>

          <div className="flex-shrink-0 pb-1">
            <button
              className={`w-10 h-10 rounded-lg flex items-center justify-center bg-[#0056b8] hover:bg-[#004494] transform transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 ${
                customerSelected
                  ? "bg-[#0055be]"
                  : "bg-[#0055be] opacity-50 cursor-not-allowed"
              }`}
              disabled={!customerSelected}
              onClick={() => {
                setOnlyAttachContact(true);
              }}
              type="button"
            >
              <IoIosAdd color="white" size={24} />
            </button>
          </div>
        </div>
        <FormInputText
          label={"Telefono"}
          required
          placeholder={"Ingrese un numero de teléfono"}
          {...register("telefono", {
            required: "El telefono es obligatorio",
          })}
          maxLength={15}
          control={control}
          error={errors.telefono}
          // disabled={true}
        />

        <FormInputText
          label={"Correo Electronico"}
          required
          placeholder={"Ingrese un correo electronico"}
          type="email"
          // disabled={true}
          maxLength={45}
          {...register("email", {
            required: "El correo electronico es obligatorio",
          })}
          error={errors.email}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:space-y-0">
        <FormInputText
          label={"Proyecto"}
          required
          placeholder={"Ingrese el nombre del proyecto"}
          {...register("proyecto", {
            required: "El proyecto es obligatorio",
          })}
          error={errors.proyecto}
        />
        <FormInputText
          label={"UBICACIÓN"}
          required
          placeholder={"Ingresar la ubicación del proyecto"}
          {...register("direccion", {
            required: "La ubicación del proyecto es obligatorio",
          })}
          error={errors.direccion}
        />
      </div>
      <div
        className={`grid grid-cols-1 md:grid-cols-${
          isDollarSelected ? "3" : "4"
        } gap-6 md:space-y-0`}
      >
        <Controller
          name="moneda_id"
          control={control}
          rules={{ required: "Debe seleccionar una Moneda" }}
          render={({ field: { onChange, value, ...rest } }) => (
            <FormSelectText
              label={"Moneda"}
              required
              {...rest}
              parentClassName="w-full"
              options={currenciesName}
              value={value}
              onChange={(e) => {
                const newValue = e.target.value ? e.target.value : null;
                onChange(newValue);
                const isDollar =
                  newValue?.split(" - ")[1] === "Dolar Estadounidense (USD)";

                setIsDollarSelected(isDollar);

                // Actualizar el tipo de cambio según la moneda seleccionada
                if (isDollar) {
                  setValue("tipo_cambio", 1); // Dólares = 1
                } else {
                  setValue("tipo_cambio", 0); // Soles = 0 (para que el usuario lo digite)
                }

                const currencyId = currencies.find(
                  (currency) =>
                    currency.sMonDescripcion === newValue?.split(" - ")[1]
                );

                setCurrency({
                  code: currencyId?.sMonCodigo,
                  description: currencyId?.sMonDescripcion,
                  symbol: currencyId?.sMonAlias,
                });
              }}
              labelName={"moneda_id"}
            />
          )}
        />

        {/* Nuevo input para el tipo de cambio */}

        {!isDollarSelected && (
          <FormInputText
            label={"TIPO CAMBIO"}
            required
            placeholder={"Ingresar el tipo de cambio"}
            {...register("tipo_cambio", {
              valueAsNumber: true,
              validate: (value) =>
                value > 0 || "El tipo de cambio debe ser mayor a 0",
            })}
            control={control}
            type="number"
            step="0.001"
            min={0}

            // disabled={true}

            // value={
            // 	isDollarSelected
            // 		? isLoadingTypeChange
            // 			? 'Cargando...'
            // 			: typeChangeData?.venta || ''
            // 		: '1'
            // }
          />
        )}

        <div className="flex flex-col w-full">
          <label className="uppercase font-medium text-sm">
            Fecha de cotización <span className="text-red-500">*</span>{" "}
          </label>
          <Calendar
            className="mt-2"
            inputClassName="rounded-lg w-full"
            dateFormat="dd/mm/yy"
            value={date}
            onChange={(e) => {
              setDate(e.value);
            }}
            placeholder="Fecha de cotización"
          />
        </div>
        <div className="flex flex-col w-full">
          <section className="relative">
            <FormInputText
              label={"Validez de la oferta"}
              required
              parentClassName="w-full"
              {...register("validez_oferta", {
                required: "La validez de la oferta es obligatorio",
              })}
              control={control}
              type="number"
            />
            <span className="absolute right-8 top-1/2 translate-y-1 text-gray-500">
              Días
            </span>
          </section>
        </div>
      </div>
      <section className="flex flex-col lg:flex-row items-center gap-6">
        <Controller
          name="canal_distribucion"
          control={control}
          render={({ field: { onChange, value, ...rest } }) => (
            <FormSelectText
              label={"Canal de Distribución (ERP)"}
              required
              placeholder="Seleccione un canal de distribución"
              parentClassName="flex-1 w-full"
              options={distributionChannels
                .filter((dc) =>
                  marketType === "EXPORTACIÓN"
                    ? dc.CanalId === 1
                    : dc.CanalId < 10
                )
                .map((channel) => channel.sNombre)}
              value={value}
              onChange={(e) => {
                onChange(e.target.value ? e.target.value : null);
              }}
              labelName={"canal_distribucion"}
              filter={true}
            />
          )}
        />

        <Controller
          name="incoterm"
          control={control}
          render={({ field: { onChange, value, ...rest } }) => (
            <FormSelectText
              label={"Incoterms (ERP)"}
              required
              placeholder="Seleccione un Incoterm"
              parentClassName="flex-1 w-full"
              options={incotermsOptions}
              value={value}
              onChange={(e) => {
                onChange(e.target.value ? e.target.value : null);
              }}
              filter={true}
            />
          )}
        />

        {(selectedIncoterm?.sIncotermCategoriaNombre === "Flete y Seguros" ||
          selectedIncoterm?.sIncotermCategoriaNombre === "Flete") && (
          <FormInputText
            label={"Flete del INCOTERM (USD)"}
            required={true}
            parentClassName="flex-1 w-full"
            {...register("incoterm_valor", {
              required: "El flete del INCOTERM es obligatorio",
            })}
            control={control}
            type="number"
            min={0}
            step="0.01"
            error={errors.incoterm_valor}
          />
        )}

        {selectedIncoterm?.sIncotermCategoriaNombre === "Flete y Seguros" && (
          <FormInputText
            label={"Seguro del INCOTERM (USD)"}
            required={true}
            parentClassName="flex-1 w-full"
            {...register("incoterm_valor_seguro", {
              required: "El seguro del INCOTERM es obligatorio",
            })}
            control={control}
            type="number"
            min={0}
            step="0.01"
            error={errors.incoterm_valor_seguro}
          />
        )}
      </section>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Costo de envio */}
        {/* <section className="flex flex-row items-start md:items-center gap-4 h-[100px]">
          <section className="flex items-center h-full w-[200px]">
            <Controller
              name="envio"
              control={control}
              defaultValue={0}
              className
              render={({ field: { onChange, value, ...rest } }) => (
                <SwitchInput
                  label="Envio"
                  checked={value === 1}
                  onChangeInput={(e) => {
                    onChange(e.target.value ? 1 : 0);
                    if (!e.target.value) {
                      setValue("costo_envio", 0.0);
                    }
                  }}
                  {...rest}
                />
              )}
            />
          </section>
          {watch("envio") === 1 && (
            <div className="flex items-center gap-2">
              <section className="flex flex-col gap-2">
                <FormInputText
                  label={"COSTO DE ENVIO"}
                  required
                  placeholder={"Ingresar el costo de envio"}
                  {...register("costo_envio", {
                    valueAsNumber: true,
                  })}
                  control={control}
                  type="number"
                  step="0.001"
                  min={0}
                />
                <span className="text-sm">{currency.description}</span>
              </section>

              <span className="font-semibold">{currency.code}</span>
            </div>
          )}
        </section> */}

        {/* Costo de instalación */}
        {/* <section className="flex flex-row items-start md:items-center gap-4 h-[100px]">
          <section className="flex items-center h-full w-[200px]">
            <Controller
              name="instalacion"
              control={control}
              defaultValue={0}
              render={({ field: { onChange, value, ...rest } }) => (
                <SwitchInput
                  label="Instalación"
                  checked={value === 1}
                  onChangeInput={(e) => {
                    onChange(e.target.value ? 1 : 0);

                    if (!e.target.value) {
                      setValue("costo_instalacion", 0.0);
                    }
                  }}
                  {...rest}
                />
              )}
            />
          </section>
          {watch("instalacion") === 1 && (
            <div className="flex items-center gap-2">
              <section className="flex flex-col gap-2">
                <FormInputText
                  label={"COSTO DE INSTALACIÓN"}
                  required
                  placeholder={"Ingresar el costo de instalación"}
                  {...register("costo_instalacion", {
                    valueAsNumber: true,
                  })}
                  control={control}
                  type="number"
                  step="0.001"
                  min={0}
                />
                <span className="text-sm">{currency.description}</span>
              </section>

              <span className="font-semibold">{currency.code}</span>
            </div>
          )}
        </section> */}

        {/* Costo de puesto en Marcha */}
        {/* <section className="flex flex-row items-start md:items-center gap-4 h-[100px]">
          <section className="flex items-center h-full w-[200px]">
            <Controller
              name="puesta_en_marcha"
              control={control}
              defaultValue={0}
              render={({ field: { onChange, value, ...rest } }) => (
                <SwitchInput
                  label="Puesto en Marcha"
                  checked={value === 1}
                  onChangeInput={(e) => {
                    onChange(e.target.value ? 1 : 0);

                    if (!e.target.value) {
                      setValue("costo_puesta_en_marcha", 0.0);
                    }
                  }}
                  {...rest}
                />
              )}
            />
          </section>
          {watch("puesta_en_marcha") === 1 && (
            <div className="flex items-center gap-2">
              <section className="flex flex-col gap-2">
                <FormInputText
                  label={"COSTO DE PUESTO EN MARCHA"}
                  required
                  placeholder={"Ingresar el costo de puesta en marcha"}
                  {...register("costo_puesta_en_marcha", {
                    valueAsNumber: true,
                  })}
                  control={control}
                  type="number"
                  step="0.001"
                  min={0}
                />
                <span className="text-sm">{currency.description}</span>
              </section>

              <span className="font-semibold">{currency.code}</span>
            </div>
          )}
        </section> */}
      </div>
      <section className="flex justify-end">
        <Button
          variant="primary"
          onClick={() => {
            const payload = generateQuotePayload(getValues(), {
              currencies,
              markets,
              customers,
              sellers,
              comercialConditions: commercialConditionsFilterByQuoteType,
              distributionChannels,
              incoterms,
              date,
            });

            const quote = {
              code: payload.codigo,
              quotationType,
              comercialExecutiveId: payload.ejecutivo_id,
              customerId: payload.cliente_id,
              customerContact: payload.contacto,
              telephone: payload.telefono,
              email: payload.email,
              project: payload.proyecto,
              address: payload.direccion,
              marketId: payload.mercado,
              currencyId: payload.moneda_id,
              typeChange: payload.tipo_cambio,
              date: date,
              validityOffer: payload.validez_oferta,
              sending: payload.envio || false,
              shippingCost: payload.costo_envio || 0,
              installation: payload.instalacion || false,
              installationCost: payload.costo_instalacion || 0,
              startup: payload.puesta_en_marcha || false,
              startupCost: payload.costo_puesta_en_marcha || 0,
              comercialConditionId: payload.condicion_comercial_id,
              distributionChannelId: payload.canal_distribucion_id,
              incotermId: payload.incoterm_id,
              incotermValue: payload.incoterm_valor || 0,
              incotermValueInsurance: payload.incoterm_valor_seguro || 0,
              state: payload.estado,
              observationsHTML: {
                htmlValue: payload?.observaciones_HTML?.htmlValue,
                textValue: payload?.observaciones_HTML?.textValue,
              },
            };

            setQuote(quote);

            navigate("/cotizaciones/crear/combinaciones");
          }}
        >
          <Plus className="w-5 h-5 mr-2" /> Agregar
        </Button>
      </section>
      <section>
        <ErrorBoundary fallbackRender={ErrorComponent}>
          {details && details.length > 0 && (
            <QuoteDetailsTable
              quotationType={quotationType}
              details={details}
              isDetailsAvailable={isDetailsAvailable}
              isEditMode={false}
              marketId={null}
            />
          )}
        </ErrorBoundary>
      </section>
      <section className="flex flex-col gap-3 w-full">
        <label className="font-semibold text-sm">OBSERVACIONES</label>
        <Controller
          name="observaciones_HTML"
          control={control}
          render={({ field: { onChange, value, ...rest } }) => (
            <Editor
              value={value?.htmlValue}
              className="w-full textarea"
              onTextChange={onChange}
              style={{ height: "120px" }}
              placeholder="Ingresar las observaciones de la cotización"
              {...rest}
            />
          )}
        />
      </section>
      <section className="flex flex-col lg:flex-row items-center gap-3 justify-between">
        <Controller
          name="condicion_comercial_id"
          control={control}
          rules={{ required: "Debe seleccionar una Condicion Comercial" }}
          render={({ field: { onChange, value, ...rest } }) => (
            <FormSelectText
              label={"Condiciones"}
              required
              {...rest}
              placeholder="Seleccione una condición comercial"
              parentClassName="w-full"
              options={commercialConditionsFilterByQuoteType.map(
                (condition) => condition.sConTitulo
              )}
              value={value}
              onChange={(e) => {
                onChange(e.target.value ? e.target.value : null);
              }}
              labelName={"condicion_comercial_id"}
              error={errors.condicion_comercial_id}
              filter={true}
            />
          )}
        />
        <section className="flex items-center gap-3">
          <ButtonIcon
            className="mt-6"
            onClick={() => {
              const commercialConditionTitle = watch("condicion_comercial_id");
              const commercialConditionFinded =
                commercialConditionsFilterByQuoteType.find(
                  (cc) => cc.sConTitulo === commercialConditionTitle
                );
              setCommercialConditionSelected(commercialConditionFinded);
              setIsEditModeOnCommercialCondition(true);
              setopenCreateOrEditCommercialConditionModal(true);
            }}
            icon={<Fullscreen />}
            variant="tertiary"
            color="white"
            size={20}
          />
          <ButtonIcon
            className="mt-6"
            onClick={() => {
              setCommercialConditionSelected(null);
              setIsEditModeOnCommercialCondition(false);
              setopenCreateOrEditCommercialConditionModal(true);
            }}
            icon={<IoIosAdd />}
            color="white"
            size={30}
          />
        </section>
      </section>
      {isResumeAvailable && (
        <section>
          <CardResumen
            items={resume.items}
            total={resume.total}
            discount={resume.discount}
            exportationCosts={resume.exportationCosts}
            isThroughput={resume.isThroughput || false}
            marginPercentage={resume.marginPercentage || 0}
            operativeCosts={operativeCosts}
          />
        </section>
      )}
      <div className="flex flex-col justify-center space-y-4 md:space-y-0 md:space-x-10 md:py-7 md:flex-row">
        <Button type="submit" variant="primary">
          <Save className="w-5 h-5 mr-2" /> Guardar
        </Button>
        <Link
          type="button"
          to={"/cotizaciones"}
          onClick={() => {
            cleanAll();
          }}
        >
          <Button variant="destructive">Cancelar</Button>
        </Link>
      </div>
      <AddClientModal
        ClienteVisible={ClienteModalVisible}
        setClienteVisible={setClienteModalVisible}
        setCustomerContactEditMode={setClienteModalVisible}
        setCustomerSelected={handleCustomerCreated}
        customers={customers}
        marketType={marketType}
        setMarketType={setMarketType}
      />
      <ContactModal
        isOpen={onlyAttachContact}
        setIsOpen={setOnlyAttachContact}
        customerId={customerSelected?.Cliente_Id}
      />
      {/* abre el modal de grupos electrogenos */}
      <AddElectrogenosModal
        visible={activeModal === "electrogenos"}
        onClose={closeModal}
      />
      {/* abre el modal de cables */}
      <AddCablesModal visible={activeModal === "Cables"} onClose={closeModal} />
      {/* abre el modal de celdas */}
      <AddCeldasModal visible={activeModal === "Celdas"} onClose={closeModal} />
      {/* abre el modal de transformadores */}
      <AddTransformadorModal
        visible={activeModal === "Transformadores"}
        onClose={closeModal}
      />
      <CreateOrViewCommercialConditionModal
        isOpen={openCreateOrEditCommercialConditionModal}
        setOpen={setopenCreateOrEditCommercialConditionModal}
        viewMode={
          isEditModeOnCommercialCondition ? ViewModes.VIEW : ViewModes.CREATE
        }
        selectedItem={commercialConditionSelected}
      />
    </form>
  );
};
