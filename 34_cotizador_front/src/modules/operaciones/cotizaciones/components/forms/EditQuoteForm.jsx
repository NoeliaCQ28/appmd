import { FormInputText } from "@components/custom/inputs/FormInputText";
import { FormSelectText } from "@components/custom/selects/FormSelectText";
import { Check, Edit2, Fullscreen, Maximize, Send } from "lucide-react";
import { Calendar } from "primereact/calendar";
import { Editor } from "primereact/editor";
import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Controller, useForm } from "react-hook-form";
import { IoIosAdd } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CardResumen } from "../../../../../components/CardResumen";
import { ButtonIcon } from "../../../../../components/custom/buttons/ButtonIcon";
import { ErrorComponent } from "../../../../../components/error/ErrorComponent";
import { useModal } from "../../../../../hooks/useModal";
import { ContactModal } from "../../../../catalagos/clientes/components/forms/modals/ContactModal";
import useCustomersContacts from "../../../../catalagos/clientes/hooks/useCustomerContacts";
import { CreateOrViewCommercialConditionModal } from "../../../../catalagos/condiciones/components/modals/CreateOrViewCommercialConditionModal";
import { useCablesAddItemsStore } from "../../hooks/useCablesAddItemsStore";
import { useCablesStore } from "../../hooks/useCablesStore";
import { useCellsStore } from "../../hooks/useCellsStore";
import { useEditResume } from "../../hooks/useEditResume";
import { useElectrogenosStore } from "../../hooks/useElectrogenosStore";
import { useExchange } from "../../hooks/useExchange";
import useQuote from "../../hooks/useQuote";
import { useTransformersStore } from "../../hooks/useTransformersStore";
import { useQuotationStore } from "../../store/useQuotationStore";
import { useQuoteDetailStore } from "../../store/useQuoteDetailStore";
import { QuoteDetailsTable } from "../QuoteDetailsTable";
import { Button } from "./../../../../../components/custom/buttons/Button";
import { AddClientModal } from "./modals/AddClientModal";
import { AddMoreCablesModal } from "./modals/AddMoreCablesModal";
import { AddMoreElectrogenosModal } from "./modals/AddMoreElectrogenosModal";
import { AddMoreTransformersModal } from "./modals/AddMoreTransformerModal";
import { EmitQuoteModal } from "./modals/EmitQuoteModal";
import { AddMoreCellsModal } from "./modals/AddMoreCellsModal";
import { Tooltip } from "primereact/tooltip";
import ViewModes from "../../../../../constants/ViewModes";

export const EditQuoteForm = ({
  selectedItem,
  currencies,
  markets,
  sellers,
  customers,
  comercialConditions,
  distributionChannels,
  incoterms,
}) => {
  const navigate = useNavigate();

  // Agregar estado para controlar la visibilidad del modal
  const { isOpen, openModal, closeModal } = useModal();

  const { currency, evalTypeChange } = useExchange();

  const [customerSelected, setCustomerSelected] = React.useState(null);

  const { data: contactsUnsorted = [], isLoading: isLoadingContacts } =
    useCustomersContacts(customerSelected?.Cliente_Id);

  const contacts = React.useMemo(
    () =>
      [...(contactsUnsorted || [])].sort((a, b) =>
        a.sCliConNombre.localeCompare(b.sCliConNombre)
      ),
    [contactsUnsorted]
  );

  const MODAL_IDS = {
    CABLES: "add-more-cables-modal",
    TRANSFORMERS: "add-more-transformers-modal",
    ELECTROGENOS: "add-more-electrogenos-modal",
    CELLS: "add-more-cells-modal",
  };

  const quoteType = selectedItem?.nCotTipo;

  const openAddMoreItemsModal = () => {
    const modalMap = {
      1: MODAL_IDS.ELECTROGENOS,
      2: MODAL_IDS.CABLES,
      3: MODAL_IDS.CELLS,
      4: MODAL_IDS.TRANSFORMERS,
    };

    const modalId = modalMap[quoteType];
    if (modalId) {
      openModal(modalId);
    } else {
      toast.warning("Tipo de cotización no soportado para agregar ítems");
    }
  };

  const { details, initializeDetails: clearElectrogenos } =
    useElectrogenosStore();
  const { cablesAdded, initializeDetails: clearCables } = useCablesStore();
  const { cellsAdded, initializeDetails: clearCells } = useCellsStore();
  const { transformersAdded, initializeDetails: clearTransformers } =
    useTransformersStore();
  const { clearCablesAdded } = useCablesAddItemsStore();
  const { clearNewItems: clearElectrogenosAdded } = useElectrogenosStore();
  const handleClear = () => {
    clearElectrogenos([]);
    clearCables([]);
    clearCells([]);
    clearTransformers([]);
    clearCablesAdded([]);
    clearElectrogenosAdded([]);

    // Resetear estados locales
    // setSelectedItemProps(null);
    // setCustomerSelected(null);
    // setDate(null);
  };

  React.useEffect(() => {
    // Función de limpieza que se ejecutará al desmontar el componente
    return () => {
      handleClear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [ClienteModalVisible, setClienteModalVisible] = React.useState(false);
  const [customerContactEditMode, setCustomerContactEditMode] =
    React.useState(false);
  const [onlyAttachContact, setOnlyAttachContact] = React.useState(false);

  const [
    openCreateOrEditCommercialConditionModal,
    setopenCreateOrEditCommercialConditionModal,
  ] = React.useState(false);
  const [isEditModeOnCommercialCondition, setIsEditModeOnCommercialCondition] =
    React.useState(false);
  const [commercialConditionSelected, setCommercialConditionSelected] =
    React.useState(null);

  const {
    quotationType,
    types: quotationTypes,
    setQuote,
    setQuotationType,
  } = useQuotationStore();

  React.useEffect(() => {
    if (selectedItem?.nCotTipo && selectedItem?.nCotTipo !== quotationType) {
      setQuotationType(selectedItem?.nCotTipo);
      setQuote((prevQuote) => ({
        ...prevQuote,
        quotationType: selectedItem?.nCotTipo,
      }));
    }
  }, [quotationType, selectedItem?.nCotTipo, setQuotationType, setQuote]);

  const { detailsForDelete, removeAllDetailsForDelete } = useQuoteDetailStore();

  const [date, setDate] = React.useState(
    selectedItem?.dCotFecha
      ? new Date(
          new Date(selectedItem.dCotFecha).getTime() +
            new Date().getTimezoneOffset() * 60000
        )
      : null
  );
  React.useEffect(() => {
    setCustomerSelected(
      selectedItem
        ? customers.find(
            (customer) => customer.Cliente_Id === selectedItem?.Cliente_Id
          )
        : null
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItem?.Cliente_Id, customers, setCustomerSelected]);
  const defaultCurrency = React.useMemo(() => {
    const currency = currencies.find(
      (currency) =>
        parseInt(currency.Moneda_Id) === parseInt(selectedItem?.Moneda_Id)
    );
    return `${currency?.sMonAlias} - ${currency?.sMonDescripcion}`.trim();
  }, [selectedItem, currencies]);

  const customerDefault = React.useMemo(() => {
    return (
      customers.find(
        (customer) => customer.Cliente_Id === selectedItem?.Cliente_Id
      )?.sCliNombre || ""
    );
  }, [selectedItem, customers]);

  const sellerDefault = React.useMemo(() => {
    return (
      sellers.find(
        (seller) => seller.Ejecutivo_Id === selectedItem?.Ejecutivo_Id
      )?.sEjeNombre || ""
    );
  }, [selectedItem, sellers]);
  const {
    updateMutate,
    mutateState,
    deleteDetailOfQuoteMutate,
    refetch,
    updateMutateQuantity,
  } = useQuote();

  const handleDeleleDetailsOfQuote = () => {
    if (!detailsForDelete || detailsForDelete.length === 0) return;

    for (const detailForDelete of detailsForDelete) {
      const detailId = detailForDelete.id;

      deleteDetailOfQuoteMutate({
        quoteId: selectedItem.Cotizacon_Id,
        quoteDetailId: detailId,
      });

      removeAllDetailsForDelete();
    }
  };

  const getDetailsForQuoteType = (type) => {
    switch (type) {
      case 1:
        return details;
      case 2:
        return cablesAdded;
      case 3:
        return cellsAdded;
      case 4:
        return transformersAdded;
      default:
        return [];
    }
  };

  const handleUpdateQuantity = () => {
    let detailsToUpdate = [];
    switch (quoteType) {
      case 1: // Electrógenos
        detailsToUpdate = details;
        break;
      case 2: // Cables
        detailsToUpdate = cablesAdded;
        break;
      case 3: // Celdas
        detailsToUpdate = cellsAdded;
        break;
      case 4: // Transformadores
        detailsToUpdate = transformersAdded;
        break;
      default:
        return;
    }

    if (!detailsToUpdate || detailsToUpdate.length === 0) return;
    // Iterar por cada detalle
    detailsToUpdate.forEach((detail) => {
      const payload = {
        quoteDetailId: detail.nCotDetItem, // ID del detalle que va enviar
        data: {
          quantity: detail.nCotDetCantidad,
          type: quoteType,
        },
      };

      // Llamar a la mutación para cada detalle
      updateMutateQuantity(payload);
    });
  };

  const initialIsDollarSelected =
    selectedItem?.Moneda_Id && selectedItem?.Moneda_Id == "2";

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
    handleSubmit,
    register,
    getValues,
    reset,
    formState: { errors },
  } = useForm();

  const marketType = watch("mercado");

  const marketNameFromItem = React.useMemo(() => {
    return markets.find(
      (market) => market.MercadoId === selectedItem?.nCotTMercado
    )?.sNombre;
  }, [markets, selectedItem?.nCotTMercado]);

  const commercialConditionsFilterByQuoteType = React.useMemo(() => {
    const currentMarketType = marketType || marketNameFromItem;
    return comercialConditions.filter(
      (condition) =>
        condition.nConCotTipoId === quoteType &&
        condition.sMercadoNombre ===
          (currentMarketType === "NACIONAL" ? "NACIONAL" : "EXPORTACIÓN")
    );
  }, [comercialConditions, quoteType, marketType, marketNameFromItem]);

  React.useEffect(
    () => {
      const isCurrencyDollar =
        currencies.find(
          (currency) =>
            parseInt(currency.Moneda_Id) === parseInt(selectedItem?.Moneda_Id)
        )?.sMonAlias === "$";

      reset({
        codigo: selectedItem?.nCotCodigo,
        cliente_id: customerDefault,
        ejecutivo_id: sellerDefault,
        ruc_dni: customerSelected?.sCliRucDni,
        fecha:
          new Date(
            new Date(selectedItem?.dCotFecha).getTime() +
              new Date(selectedItem?.dCotFecha).getTimezoneOffset() * 60000
          ).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }) || null,
        validez_oferta: selectedItem?.sCotValidezOfeta,
        proyecto: selectedItem?.sCotProyecto,
        direccion: selectedItem?.sCotDireccionProy,
        contacto: selectedItem?.sCotContacto || "",
        telefono: selectedItem?.nCotTelefono || "",
        email: selectedItem?.sCotCorreo || "",
        envio: parseInt(selectedItem?.nCotEnvio),
        costo_envio: parseFloat(selectedItem?.nCotCostoEnvio) || 0,
        instalacion: parseInt(selectedItem?.nCotInstalacion),
        costo_instalacion: parseFloat(selectedItem?.nCotCostoInstalacion) || 0,
        puesta_en_marcha: parseInt(selectedItem?.nCotPuestaEnMarcha),
        costo_puesta_en_marcha:
          parseFloat(selectedItem?.nCotCostoPuestaEnMarcha) || 0,
        mercado: markets.find(
          (market) => market.MercadoId === selectedItem?.nCotTMercado
        )?.sNombre,
        moneda_id: defaultCurrency,
        tipo_cambio: selectedItem?.nCotTipoCambio || (isCurrencyDollar ? 1 : 0),
        total: selectedItem?.nCotTotal || 0,
        condicion_comercial_id: commercialConditionsFilterByQuoteType.find(
          (condition) =>
            condition.CondicionesComerciales_Id ===
            selectedItem?.CondComercial_Id
        )?.sConTitulo,
        canal_distribucion: distributionChannels.find(
          (channel) => channel.CanalId === selectedItem?.nCotCanalDistribucionId
        )?.sNombre,
        incoterm: incoterms.find(
          (incoterm) => incoterm.IncotermId === selectedItem?.nCotIncotermId
        )?.sDescripcion,
        incoterm_valor: selectedItem?.nCotIncotermValor || 0,
        incoterm_valor_seguro: selectedItem?.nCotIncotermValorSeguro || 0,
        estado: parseInt(selectedItem?.nCotEstado) || 1,
        usuario_aprobador_id: 1,
        aprobacion_fecha: "2024-01-10 14:13",
        observaciones: selectedItem?.sCotObservaciones || "",
        observaciones_HTML: selectedItem?.sCotObservacionesHTML || "",
        eliminado: 0,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      // commercialConditionsFilterByQuoteType,
      // customerDefault,
      // customerSelected?.sCliRucDni,
      // defaultCurrency,
      // distributionChannels,
      // incoterms,
      // markets,
      // reset,
      selectedItem,
      // sellerDefault,
    ]
  );

  const currenciesName = React.useMemo(
    () =>
      currencies.map((currency) =>
        `${currency.sMonAlias} - ${currency.sMonDescripcion}`.trim()
      ),
    [currencies]
  );

  const marketsName = React.useMemo(
    () => markets.map((market) => market.sNombre),
    [markets]
  );
  const sellersName = React.useMemo(
    () => sellers.map((seller) => seller.sEjeNombre),
    [sellers]
  );

  const contactsName = React.useMemo(
    () => contacts.map((contact) => contact.sCliConNombre),
    [contacts]
  );

  const onEdit = (data) => {
    let observationsData = {};

    if (
      data.observaciones_HTML.htmlValue &&
      data.observaciones_HTML.textValue
    ) {
      const { observaciones_HTML: rawDescription } = data;
      const observaciones_HTML = rawDescription.htmlValue;
      const observaciones = rawDescription.textValue;

      observationsData = {
        observaciones_HTML,
        observaciones,
      };
    }

    const dataMapped = {
      ...data,
      codigo: data.codigo,
      moneda_id: currencies.find(
        (currency) =>
          currency.sMonAlias === data.moneda_id.split(" - ")[0].trim()
      )?.Moneda_Id,
      tipo_cambio: parseFloat(data.tipo_cambio) || 0,
      mercado: markets.find((market) => market.sNombre === data.mercado)
        ?.MercadoId,
      cliente_id: customers.find(
        (customer) => customer.sCliNombre === data.cliente_id
      )?.Cliente_Id,
      ejecutivo_id: sellers.find(
        (seller) => seller.sEjeNombre === data.ejecutivo_id
      )?.Ejecutivo_Id,
      validez_oferta: parseInt(data.validez_oferta),
      condicion_comercial_id: commercialConditionsFilterByQuoteType.find(
        (conmercialCondition) =>
          conmercialCondition.sConTitulo === data.condicion_comercial_id
      )?.CondicionesComerciales_Id,
      canal_distribucion_id: distributionChannels.find(
        (channel) => channel.sNombre === data.canal_distribucion
      )?.CanalId,
      incoterm_id: incoterms.find(
        (incoterm) => incoterm.sDescripcion === data.incoterm
      )?.IncotermId,
      fecha: new Date(date).toISOString().split("T")[0],
      ...observationsData,
    };

    updateMutate(
      {
        id: selectedItem?.Cotizacon_Id,
        data: dataMapped,
      },
      {
        onSuccess: () => {
          refetch();
        },
      }
    );

    handleDeleleDetailsOfQuote();
    handleUpdateQuantity(); //llamar a actualizar la cantidad

    //Cuando se termina de editar tambien se deben limpiar los stores
    handleClear();

    delete dataMapped.ruc_dni;

    navigate("/cotizaciones");
  };

  // const someModelsRequireDiscountApproval = React.useMemo(
  //   () =>
  //     selectedItem?.details.some(
  //       (detail) => detail.quote_extra_details?.nIncrementoDescuento === 1
  //     ) || false,
  //   [selectedItem]
  // );

  const someModelsRequireDiscountApproval = false;

  const [isOpenEmitQuoteModal, setIsOpenEmitQuoteModal] = React.useState(false);

  const { resume, isResumeAvailable } = useEditResume({
    details: getDetailsForQuoteType(selectedItem?.nCotTipo),
    quotationType: selectedItem?.nCotTipo,
    // globalDiscount: selectedItem?.nCotDescuentoGlobal,
    globalMargen: selectedItem?.nCotMargenGlobal,
    exportationCosts: {
      incoterm: {
        code: selectedItem?.sIncotermCodigo,
        category: selectedItem?.sIncotermCategoriaNombre,
        shippingCosts: {
          freight: Number(selectedItem?.nCotIncotermValor) || 0,
          insurance: Number(selectedItem?.nCotIncotermValorSeguro) || 0,
        },
        description: selectedItem?.sIncotermDescripcion,
      },
      marketName: selectedItem?.sMercadoNombre,
    },
  });

  const handleRegisterQuote = () => {
    if (!selectedItem) return;

    mutateState({
      id: selectedItem.Cotizacon_Id,
      data: {
        state: someModelsRequireDiscountApproval ? 2 : 3,
      },
    });

    navigate("/cotizaciones");
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

  const [selectedItemProps, setSelectedItemProps] =
    React.useState(selectedItem);

  React.useEffect(() => {
    setSelectedItemProps(selectedItem);
  }, [selectedItem]);

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

  return (
    <section>
      <form
        className="py-6 space-y-7"
        onSubmit={handleSubmit(onEdit)}
        key={selectedItem ? selectedItem?.Cotizacon_Id : "new"}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 space-y-4 md:space-y-0">
          <FormInputText
            label={"Codigo de cotización"}
            placeholder={"Codigo de cotización"}
            {...register("codigo", {
              required: "El codigo es obligatorio",
            })}
            disabled={true}
          />

          <FormInputText
            label={"Tipo de Cotizador"}
            placeholder={"Codigo de cotización"}
            value={
              quotationTypes.find((type) => type.id === selectedItem?.nCotTipo)
                ?.description
            }
            disabled={true}
          />

          <Controller
            name="ejecutivo_id"
            control={control}
            rules={{ required: "El Ejecutivo comercial es obligatorio" }}
            render={({ field: { onChange, value, ...rest } }) => (
              <FormSelectText
                label={"Ejecutivo comercial"}
                {...rest}
                parentClassName="w-full"
                options={sellersName}
                value={value}
                onChange={(e) => {
                  onChange(e.target.value ? e.target.value : null);
                }}
                labelName={"ejecutivo_id"}
                filter={true}
                required
                error={errors.ejecutivo_id}
              />
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 space-y-4 md:space-y-0">
          <section className="w-full">
            <Controller
              name="mercado"
              control={control}
              rules={{ required: "Debe seleccionar un mercado" }}
              render={({ field: { onChange, value, ...rest } }) => (
                <FormSelectText
                  label={"Tipo de Mercado"}
                  {...rest}
                  parentClassName="w-full tooltip_mercado"
                  options={marketsName}
                  value={value}
                  onChange={(e) => {
                    onChange(e.target.value ? e.target.value : null);
                  }}
                  labelName={"mercado"}
                  disabled={true}
                  required
                  error={errors.mercado}
                />
              )}
            />
            <Tooltip target=".tooltip_mercado">
              <p className="w-64 text-justify">
                El tipo de mercado no puede modificarse con los equipos
                seleccionados.
              </p>
            </Tooltip>
          </section>

          <div className="flex gap-2 items-end">
            <div className="w-5/6">
              <Controller
                name="cliente_id"
                control={control}
                rules={{ required: "Debe seleccionar un Cliente/Prospecto" }}
                render={({ field: { onChange, value, ...rest } }) => (
                  <FormSelectText
                    label={"Cliente/Prospecto"}
                    {...rest}
                    parentClassName="w-full"
                    options={customersFilterByMarketType.map(
                      (customer) => customer.sCliNombre
                    )}
                    value={value}
                    onChange={(e) => {
                      onChange(e.target.value ? e.target.value : null);
                      setCustomerSelected(
                        e.target.value
                          ? customers.find(
                              (customer) =>
                                customer.sCliNombre === e.target.value
                            )
                          : null
                      );
                    }}
                    labelName={"cliente_id"}
                    filter={true}
                    required
                    error={errors.cliente_id}
                  />
                )}
              />
            </div>
            <div className="w-1/6 flex-shrink-0 pb-1">
              <button
                className="bg-[#0055be] w-11 h-11 rounded-lg flex items-center justify-center hover:scale-95 duration-500 ease-in-out transition-transform"
                onClick={() => {
                  if (customerSelected) {
                    setCustomerContactEditMode(true);
                  }
                  setClienteModalVisible(true);
                }}
                type="button"
              >
                <IoIosAdd color="white" size={30} />
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 space-y-4 md:space-y-0">
          <div className="flex gap-2">
            <div className="w-full">
              <Controller
                name="contacto"
                control={control}
                rules={{ required: "Debe seleccionar un Contacto" }}
                render={({ field: { onChange, value, ...rest } }) => (
                  <FormSelectText
                    label={"Contacto"}
                    {...rest}
                    parentClassName="w-full"
                    options={contactsName}
                    value={value}
                    onChange={(e) => {
                      const contactoName = e.target.value
                        ? e.target.value
                        : null;
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
                    required
                    error={errors.contacto}
                  />
                )}
              />
            </div>
            <div className="flex items-end">
              <button
                className={`w-11 h-11 rounded-lg flex items-center justify-center hover:scale-95 duration-500 ease-in-out transition-transform ${
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
                <IoIosAdd color="white" size={30} />
              </button>
            </div>
          </div>

          <FormInputText
            label={"Telefono"}
            placeholder={"Numero de teléfono"}
            {...register("telefono", {
              required: "El telefono es obligatorio",
            })}
            maxLength={15}
            // disabled={true}
            control={control}
            required
            error={errors.telefono}
          />

          <FormInputText
            label={"Correo Electronico"}
            placeholder={"logistica.ate@provejec.com"}
            type="email"
            // disabled={true}
            {...register("email", {
              required: "El correo electronico es obligatorio",
            })}
            required
            error={errors.email}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 space-y-4 md:space-y-0">
          <FormInputText
            label={"Proyecto"}
            placeholder={"Nombre del proyecto"}
            {...register("proyecto", {
              required: "El proyecto es obligatorio",
            })}
            required
            error={errors.proyecto}
          />
          <FormInputText
            label={"UBICACIÓN"}
            placeholder={"Ingresar la ubicación del proyecto"}
            {...register("direccion", {
              required: "La ubicación del proyecto es obligatorio",
            })}
            required
            error={errors.direccion}
          />
        </div>
        <div
          className={`grid grid-cols-1 md:grid-cols-${
            isDollarSelected ? "3" : "4"
          } gap-6 md:space-y-0`}
        >
          <div>
            <Controller
              name="moneda_id"
              control={control}
              rules={{ required: "Debe seleccionar una Moneda" }}
              render={({ field: { onChange, value, ...rest } }) => (
                <FormSelectText
                  label={"Moneda"}
                  {...rest}
                  parentClassName="w-full"
                  options={currenciesName}
                  value={value}
                  onChange={(e) => {
                    const newValue = e.target.value ? e.target.value : null;
                    onChange(newValue);
                    const isDollar = newValue?.split(" - ")[0] === "$";
                    setIsDollarSelected(isDollar);

                    // Actualizar el tipo de cambio según la moneda seleccionada
                    if (isDollar) {
                      setValue("tipo_cambio", 1); // Dólares = 1
                    } else {
                      // Si cambia a soles y no tiene un valor personalizado previo
                      // usar el valor original de la BD cuando existe
                      const originalTipoCambio = selectedItem?.nCotTipoCambio;
                      if (
                        originalTipoCambio &&
                        originalTipoCambio > 1 &&
                        !isDollar
                      ) {
                        setValue("tipo_cambio", originalTipoCambio);
                      } else {
                        setValue("tipo_cambio", 0); // Valor por defecto si no hay valor original
                      }
                    }
                  }}
                  disabled={true}
                  labelName={"moneda_id"}
                  required
                  error={errors.moneda_id}
                />
              )}
            />
            <span className="text-blue-900 flex text-xs p-2 rounded-lg mt-2 bg-blue-50/50">
              La moneda no puede modificarse.
            </span>
          </div>

          {!isDollarSelected && (
            <FormInputText
              label={"TIPO CAMBIO"}
              placeholder={"Ingresar el tipo de cambio"}
              {...register("tipo_cambio", {
                valueAsNumber: true,
                validate: (value) =>
                  !value || value > 0 || "El tipo de cambio debe ser mayor a 0",
              })}
              control={control}
              type="number"
              min={0}
              step="0.001"
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
                {...register("validez_oferta", {
                  required: "La validez de la oferta es obligatorio",
                })}
                control={control}
                required
                error={errors.validez_oferta}
              />
              <span className="absolute right-8 top-1/2 translate-y-1 text-gray-500">
                Días
              </span>
            </section>
          </div>
        </div>
        <section className="flex items-center gap-6">
          <Controller
            name="canal_distribucion"
            control={control}
            render={({ field: { onChange, value, ...rest } }) => (
              <FormSelectText
                label={"Canal de Distribución (ERP)"}
                placeholder="Seleccione un canal de distribución"
                parentClassName="flex-1"
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
                required
                error={errors.canal_distribucion}
              />
            )}
          />

          <Controller
            name="incoterm"
            control={control}
            render={({ field: { onChange, value, ...rest } }) => (
              <FormSelectText
                label={"Incoterms (ERP)"}
                placeholder="Seleccione un Incoterm"
                parentClassName="flex-1"
                options={incotermsOptions}
                value={value}
                onChange={(e) => {
                  onChange(e.target.value ? e.target.value : null);
                }}
                filter={true}
                required
                error={errors.incoterm}
              />
            )}
          />

          {(selectedItem?.sIncotermCategoriaNombre === "Flete y Seguros" ||
            selectedItem?.sIncotermCategoriaNombre === "Flete") &&
            selectedItem?.sMercadoNombre !== "NACIONAL" && (
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

          {selectedItem?.sIncotermCategoriaNombre === "Flete y Seguros" &&
            selectedItem?.sMercadoNombre !== "NACIONAL" && (
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

          {/* Costo de puesto en marcha */}
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
          {/* <Button
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
                date: date,
                validityOffer: payload.validez_oferta,
                sending: payload.envio,
                installation: payload.instalacion,
                comercialConditionId: payload.condicion_comercial_id,
                distributionChannelId: payload.canal_distribucion_id,
                incotermId: payload.incoterm_id,
                state: payload.estado,
                observations: payload.observaciones,
                observationsHTML: payload.observaciones_HTML,
                editMode: true,
              };

              setQuote(quote);

              navigate("/cotizaciones/crear/combinaciones");
            }}
          >
            Agregar
          </Button> */}
        </section>
        <section>
          {selectedItem?.details && selectedItem?.details.length > 0 && (
            <ErrorBoundary fallbackRender={ErrorComponent}>
              <div className="flex flex-row items-end justify-end p-5">
                <button
                  className={`w-11 h-11 rounded-lg flex items-center justify-center hover:scale-95 duration-500 ease-in-out transition-transform bg-[#0055be]`}
                  onClick={openAddMoreItemsModal}
                  type="button"
                >
                  <IoIosAdd color="white" size={30} />
                </button>
              </div>

              {selectedItemProps?.details &&
                selectedItemProps?.details.length > 0 && (
                  <QuoteDetailsTable
                    quotationType={quoteType}
                    isEditMode={true}
                    details={selectedItemProps?.details}
                    isDetailsAvailable={true}
                    marketId={selectedItem?.nCotTMercado}
                    onUpdateDetails={(updatedDetails) => {
                      setSelectedItemProps((prev) => ({
                        ...prev,
                        details: updatedDetails,
                      }));
                    }}
                  />
                )}
            </ErrorBoundary>
          )}
        </section>
        <section className="flex flex-col gap-3 w-full">
          <label className="font-semibold text-sm">OBSERVACIONES</label>
          <Controller
            name="observaciones_HTML"
            control={control}
            render={({ field: { onChange, value, ...rest } }) => (
              <Editor
                value={value}
                className="w-full textarea"
                onTextChange={onChange}
                style={{ height: "120px" }}
                placeholder="Ingresar las observaciones de la cotización"
                {...rest}
              />
            )}
          />
        </section>
        <section className="flex flex-row items-center gap-6 justify-between">
          <Controller
            name="condicion_comercial_id"
            control={control}
            rules={{ required: "Debe seleccionar una Condicion Comercial" }}
            render={({ field: { onChange, value, ...rest } }) => (
              <FormSelectText
                label={"Condiciones"}
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
              />
            )}
          />
          <section className="flex items-center gap-3">
            <ButtonIcon
              className="mt-6"
              onClick={() => {
                const commercialConditionTitle = watch(
                  "condicion_comercial_id"
                );
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
            <ErrorBoundary fallbackRender={ErrorComponent}>
              <CardResumen
                items={resume.items}
                total={resume.total}
                discount={resume.discount}
                exportationCosts={resume.exportationCosts}
                isThroughput={resume.isThroughput || false}
                marginPercentage={resume.marginPercentage || 0}
                operativeCosts={operativeCosts}
              />
            </ErrorBoundary>
          </section>
        )}
        <div className="flex flex-col justify-center space-y-4 md:space-y-0 md:space-x-10 md:py-7 md:flex-row">
          <Button type="submit">
            <Check className="w-4 h-4 mr-2" /> Actualizar
          </Button>
          {selectedItem?.sCotEstado === "BORRADOR" && (
            <Button
              type="button"
              variant="tertiary"
              onClick={() => {
                setIsOpenEmitQuoteModal(true);
              }}
            >
              <Send className="w-4 h-4 mr-2" /> Emitir
            </Button>
          )}

          <Link
            type="button"
            onClick={() => {
              handleClear();
              removeAllDetailsForDelete();
            }}
            to={"/cotizaciones"}
          >
            <Button type="button" variant="destructive">
              Cancelar
            </Button>
          </Link>
        </div>
      </form>
      <AddClientModal
        ClienteVisible={ClienteModalVisible}
        setClienteVisible={setClienteModalVisible}
        setCustomerContactEditMode={setClienteModalVisible}
      />
      <ContactModal
        isOpen={onlyAttachContact}
        setIsOpen={setOnlyAttachContact}
        customerId={customerSelected?.Cliente_Id}
      />
      <EmitQuoteModal
        open={isOpenEmitQuoteModal}
        someModelsRequireDiscountApproval={someModelsRequireDiscountApproval}
        setOpen={setIsOpenEmitQuoteModal}
        onConfirm={handleRegisterQuote}
      />
      <CreateOrViewCommercialConditionModal
        isOpen={openCreateOrEditCommercialConditionModal}
        setOpen={setopenCreateOrEditCommercialConditionModal}
        viewMode={
          isEditModeOnCommercialCondition ? ViewModes.VIEW : ViewModes.CREATE
        }
        selectedItem={commercialConditionSelected}
      />{" "}
      {/* Modal para abrir en las ediciones */}
      <AddMoreElectrogenosModal
        isOpen={isOpen(MODAL_IDS.ELECTROGENOS)}
        onClose={() => closeModal(MODAL_IDS.ELECTROGENOS)}
        existingDetails={selectedItemProps?.details || []}
        marketId={selectedItem?.nCotTMercado}
      />
      <AddMoreCablesModal
        isOpen={isOpen(MODAL_IDS.CABLES)}
        onClose={() => closeModal(MODAL_IDS.CABLES)}
        existingDetails={selectedItemProps?.details || []}
        type={selectedItem?.nCotTipo}
        margin={Number.parseInt(selectedItem?.nCotMargenGlobal) || 0}
      />
      <AddMoreCellsModal
        isOpen={isOpen(MODAL_IDS.CELLS)}
        onClose={() => closeModal(MODAL_IDS.CELLS)}
        existingDetails={selectedItemProps?.details || []}
        type={selectedItem?.nCotTipo}
        margin={Number.parseInt(selectedItem?.nCotMargenGlobal) || 0}
      />
      <AddMoreTransformersModal
        isOpen={isOpen(MODAL_IDS.TRANSFORMERS)}
        onClose={() => closeModal(MODAL_IDS.TRANSFORMERS)}
        existingDetails={selectedItemProps?.details || []}
        type={selectedItem?.nCotTipo}
      />
    </section>
  );
};
