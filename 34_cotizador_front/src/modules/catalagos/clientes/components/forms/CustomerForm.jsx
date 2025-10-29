import { FormInputText } from "@components/custom/inputs/FormInputText";
import { FormSelectText } from "@components/custom/selects/FormSelectText";
import useLocation from "@hooks/useLocation";
import { Check, Loader2, MoveLeft, Save, SearchIcon } from "lucide-react";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Dropdown } from "primereact/dropdown";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Button } from "../../../../../components/custom/buttons/Button";
import useSAP from "../../../../../hooks/useSAP";
import { logger } from "../../../../../utils/logger";
import { cn } from "../../../../../utils/utils";
import useCurrency from "../../../../operaciones/cotizaciones/hooks/useCurrency";
import { useDistributionChannel } from "../../../../operaciones/cotizaciones/hooks/useDistributionChannel";
import useCustomer from "../../hooks/useCustomer";
import { useCustomerBranch } from "../../hooks/useCustomerBranch";
import useCustomersContacts from "../../hooks/useCustomerContacts";
import { usePaymentConditions } from "../../hooks/usePaymentConditions";
import { useSociety } from "../../hooks/useSociety";
import { useTaxClass } from "../../hooks/useTaxClass";
import { useTaxIdType } from "../../hooks/useTaxIdType";
import { useCustomerStore } from "../../stores/useCustomerStore";
import { CustomerOrigin } from "./customerOrigin";
import { CustomerTypes } from "./customerTypes";

export const CustomerForm = ({
  isEditMode = false,
  selectedEditItem,
  setVisibility,
  setNewCustomerId,
  sellers,
  marketType,
  setMarketType,
}) => {
  // --------------------- STATES ---------------------

  const [newInnerCustomerId, setNewInnerCustomerId] = React.useState(undefined);
  const [postalCodeSelected, setPostalCodeSelected] = React.useState("");
  const [onExport, setOnExport] = React.useState(false);

  // --------------------- HOOKS ---------------------

  const { distributionChannels = [], isLoadingDistributionChannels } =
    useDistributionChannel();
  const { currencies = [], isLoading: isLoadingCurrencies } = useCurrency();
  const {
    taxIdTypes,
    isLoading: isLoadingTaxIdTypes,
    error: errorTaxIdTypes,
  } = useTaxIdType();
  const {
    customerBranches,
    isLoading: isLoadingCustomerBranches,
    error: errorCustomerBranches,
  } = useCustomerBranch();
  const { societies, isLoadingSocieties, errorSocieties } = useSociety();
  const {
    paymentConditions,
    isLoadingPaymentConditions,
    errorPaymentConditions,
  } = usePaymentConditions();
  const { taxClasses, isLoadingTaxClasses, errorTaxClasses } = useTaxClass();
  const { createMutate: createContactMutate } =
    useCustomersContacts(newInnerCustomerId);

  // --------------------- STORES ---------------------

  const { setCustomerFromSAP, removeCustomerFromSAP, postalCodesOfLimaPeru } =
    useCustomerStore();

  // --------------------- MEMO ---------------------

  const currenciesOptions = React.useMemo(
    () =>
      currencies.map((currency) => ({
        value: currency.Moneda_Id,
        label: `${currency.sMonAlias} - ${currency.sMonDescripcion}`.trim(),
      })),
    [currencies]
  );

  const distributionChannelsOptions = React.useMemo(
    () =>
      distributionChannels.map((channel) => ({
        value: channel.CanalId,
        label: channel.sNombre,
      })),
    [distributionChannels]
  );

  const taxIdTypesOptions = React.useMemo(
    () =>
      taxIdTypes?.map((taxIdType) => ({
        value: taxIdType.TipoIdentificacionId,
        label: taxIdType.TipoIdentificacion,
      })),
    [taxIdTypes]
  );

  const customerBranchesOptions = React.useMemo(
    () =>
      customerBranches?.map((branch) => ({
        value: branch.RamoId,
        label: branch.RamoDescripcion,
      })),
    [customerBranches]
  );

  // const societiesOptions = React.useMemo(
  //   () =>
  //     societies?.map((society) => ({
  //       value: society.SocId,
  //       label: society.SocDescripcion,
  //     })),
  //   [societies]
  // );

  // const paymentConditionsOptions = React.useMemo(
  //   () =>
  //     paymentConditions?.map((condition) => ({
  //       value: condition.CondPagoId,
  //       label: condition.ConPagoDescripcion,
  //     })),
  //   [paymentConditions]
  // );

  // const taxClassesOptions = React.useMemo(
  //   () =>
  //     taxClasses?.map((taxClass) => ({
  //       value: taxClass.ClaseImpuestoId,
  //       label: taxClass.ClaseImpuestoDescripcion,
  //     })),
  //   [taxClasses]
  // );

  // const sujectToIVAOptions = React.useMemo(() => {
  //   return [
  //     {
  //       value: 1,
  //       label: "Sí",
  //     },
  //     {
  //       value: 0,
  //       label: "No",
  //     },
  //   ];
  // }, []);

  const initialValues = React.useMemo(
    () => ({
      procedencia: "",
      tipo: "",
      estado: 1,
      eliminado: 0,
      condicion_pago: 10,
      ramo: "A099",
      sociedad: "MO01",
    }),
    []
  );

  const {
    register,
    watch,
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  // Effect to reset form values when in edit mode
  React.useEffect(() => {
    if (isEditMode && selectedEditItem) {
      logger.info("RESET FROM EDIT MODE");
      reset({
        codigo: selectedEditItem?.sCliCodigo,
        codigo_sap: selectedEditItem?.sCliSAP,
        ruc_dni: selectedEditItem?.sCliRucDni,
        nombre: selectedEditItem?.sCliNombre,
        nombre2: selectedEditItem?.sCliNombre2,
        direccion: selectedEditItem?.sCliDirección,
        ejecutivo_id: sellers?.find(
          (seller) => seller.Ejecutivo_Id === selectedEditItem?.Ejecutivo_Id
        )?.sEjeNombre,
        procedencia:
          Object.keys(CustomerOrigin)[
            Number(selectedEditItem?.nCliProcedencia - 1)
          ],
        cliengo_id: selectedEditItem?.sCliIdCliengo,
        tipo: Object.keys(CustomerTypes)[
          Number(selectedEditItem?.nCliTcliente - 1)
        ],
        telefono: selectedEditItem?.sCliTelefono,
        email: selectedEditItem?.sCliCelectronico,
        pais:
          marketType == "NACIONAL"
            ? selectedEditItem?.sCliPais || "Peru"
            : selectedEditItem?.sCliPais || "",
        departamento: selectedEditItem?.sCliDepartamento,
        provincia: selectedEditItem?.sCliProvincia,
        distrito: selectedEditItem?.sCliDistrito,
        estado: selectedEditItem ? selectedEditItem?.nCliEstado : 1,
        eliminado: 0,
        canal_distribucion: selectedEditItem?.nCliCanalDistribucionId,
        moneda_id: selectedEditItem?.nCliMonedaId,
        tipo_identificador_fiscal: selectedEditItem?.TipoIdentificacionFiscalId,
        ramo: selectedEditItem?.RamoId,
        sociedad: selectedEditItem?.SocId,
        condicion_pago: selectedEditItem?.CondPagoId,
        clase_impuesto: selectedEditItem?.ClaseImpuestoId,
        codigo_postal: selectedEditItem?.sCliCodigoPostal,
        concepto_busqueda: selectedEditItem?.sCliConceptoBusqueda,
        tratamiento: selectedEditItem?.sCliTratamiento,
        sujeto_iva: Number(selectedEditItem?.nCliSujetoIVA),
      });
      setPostalCodeSelected(selectedEditItem?.sCliCodigoPostal);
    }
  }, [isEditMode, selectedEditItem, reset, sellers, marketType]);

  const isCliengo = watch("procedencia") === "CLIENGO";

  const {
    countries,
    states,
    cities,
    districts,
    selectedCountry,
    selectedState,
    selectedCity,
    selectedDistrict,
    handleCountryChange,
    handleStateChange,
    handleCityChange,
    handleDistrictChange,
    countryNameFromISO2,
    getCountryNameFromISO2MutateAsync,
    stateNameFromFipsCode,
    getStateNameFromFipsCodeMutateAsync,
    cityNameFromSAPCityName,
    getCityNameFromSAPCityNameMutateAsync,
  } = useLocation({
    initialValues: {
      country:
        marketType == "NACIONAL"
          ? selectedEditItem?.sCliPais || "Peru"
          : selectedEditItem?.sCliPais,
      state: selectedEditItem?.sCliDepartamento,
      city: selectedEditItem?.sCliProvincia,
      district: selectedEditItem?.sCliDistrito,
    },
  });

  const {
    createMutate,
    editMutate,
    isPendingCreateCustomer,
    isPendingEditCustomer,
    refetch,
  } = useCustomer({
    setNewCustomerId: setNewCustomerId,
  });

  const sellersMapping = sellers.map((seller) => seller.sEjeNombre);

  const [customerHasBeenAdded, setCustomerHasBeenAdded] = React.useState(false);

  const onSave = (formData) => {
    const formDataMapped = {
      ...formData,
      tipo: Object.keys(CustomerTypes).indexOf(formData.tipo) + 1,
      procedencia:
        Object.keys(CustomerOrigin).indexOf(formData.procedencia) + 1,
      ejecutivo_id: sellers.find(
        (seller) => seller.sEjeNombre === formData.ejecutivo_id
      ).Ejecutivo_Id,
      sujeto_iva: formData.pais?.toUpperCase() === "PERU" ? 1 : 0,
    };

    createMutate(formDataMapped, {
      onSuccess: (data) => {
        const customerId = data.data[0].Cliente_Id;

        if (!customerId) return;

        setNewInnerCustomerId(customerId);
        setCustomerHasBeenAdded(true);
      },
      onError: (error) => {
        setCustomerHasBeenAdded(false);
        setNewInnerCustomerId(undefined);
      },
    });
    refetch();
  };

  const onEdit = (formData) => {
    const { Cliente_Id: id } = selectedEditItem;

    const formDataMapped = {
      ...formData,
      tipo: Object.keys(CustomerTypes).indexOf(formData.tipo) + 1,
      procedencia:
        Object.keys(CustomerOrigin).indexOf(formData.procedencia) + 1,
      ejecutivo_id: sellers.find(
        (seller) => seller.sEjeNombre === formData.ejecutivo_id
      ).Ejecutivo_Id,
    };

    editMutate({ id, data: formDataMapped });
  };

  const { findCustomerMutate, customerFromSAP, isPendingCustomerFromSAP } =
    useSAP();

  const countryLoadedRef = React.useRef(false);
  const stateLoadedRef = React.useRef(false);
  const cityLoadedRef = React.useRef(false);
  const currentCustomerRef = React.useRef(null);

  // Reset the refs whenever customerFromSAP changes
  React.useEffect(() => {
    if (customerFromSAP) {
      countryLoadedRef.current = false;
      stateLoadedRef.current = false;
      cityLoadedRef.current = false;
      currentCustomerRef.current = customerFromSAP;
    }
  }, [customerFromSAP]); // Reset whenever the customer data changes

  // Handle country selection when data is available
  React.useEffect(() => {
    if (
      customerFromSAP &&
      countryNameFromISO2?.name &&
      !countryLoadedRef.current
    ) {
      countryLoadedRef.current = true;
      handleCountryChange(countryNameFromISO2.name);
      setValue("pais", countryNameFromISO2.name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerFromSAP, countryNameFromISO2, handleCountryChange]);

  // Handle state fetching and selection
  React.useEffect(() => {
    if (
      customerFromSAP &&
      countryNameFromISO2?.name &&
      customerFromSAP.address?.regionCode &&
      !stateLoadedRef.current
    ) {
      stateLoadedRef.current = true;
      getStateNameFromFipsCodeMutateAsync({
        fipsCode: customerFromSAP.address.regionCode,
        country: countryNameFromISO2.name,
      });
    }
  }, [
    customerFromSAP,
    countryNameFromISO2,
    getStateNameFromFipsCodeMutateAsync,
  ]);

  // Handle state selection when data is available
  React.useEffect(() => {
    if (stateNameFromFipsCode?.name && currentCustomerRef.current) {
      handleStateChange(stateNameFromFipsCode.name);
      setValue("departamento", stateNameFromFipsCode.name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateNameFromFipsCode, handleStateChange]);

  // Handle city fetching
  React.useEffect(() => {
    if (
      currentCustomerRef.current &&
      stateNameFromFipsCode?.name &&
      currentCustomerRef.current.address?.province &&
      !cityLoadedRef.current
    ) {
      cityLoadedRef.current = true;

      getCityNameFromSAPCityNameMutateAsync({
        SAPCityName: currentCustomerRef.current.address.province,
        state: stateNameFromFipsCode.name,
        country: selectedCountry,
      });
    }
  }, [
    stateNameFromFipsCode,
    selectedCountry,
    getCityNameFromSAPCityNameMutateAsync,
  ]);

  // Handle city selection when data is available
  React.useEffect(() => {
    if (cityNameFromSAPCityName?.name && currentCustomerRef.current) {
      handleCityChange(cityNameFromSAPCityName.name);
      setValue("provincia", cityNameFromSAPCityName.name);

      handleDistrictChange(currentCustomerRef.current.address?.district || "");
      setValue("distrito", currentCustomerRef.current.address?.district || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityNameFromSAPCityName, handleCityChange]);

  // Effect to fill form data when customerFromSAP changes
  React.useEffect(() => {
    async function fillData() {
      const distributionChannelSelected = distributionChannels.find(
        (channel) =>
          channel.sCodigo === customerFromSAP.sales.distributionChannel
      );

      const interlocutorFunction = "VE";

      const interlocutor = customerFromSAP.interlocutors?.find(
        (interlocutor) =>
          interlocutor.distributionChannel ===
            distributionChannelSelected.sCodigo &&
          interlocutor.interlocutorFunction === interlocutorFunction
      );

      const sellerSelected = sellers.find(
        (seller) => seller?.sEjeSAP === interlocutor?.personId
      );

      await getCountryNameFromISO2MutateAsync({
        iso2: customerFromSAP.address.country,
      });

      logger.info("RESET AND FILL DATA FROM SAP");

      reset({
        ...getValues(),
        // ruc_dni: customerFromSAP.ruc_dni,
        nombre: customerFromSAP.name,
        nombre2: customerFromSAP.name2,
        direccion: customerFromSAP.address.street,
        codigo_postal: customerFromSAP.address.postalCode,
        telefono: customerFromSAP.phone,
        email: customerFromSAP.email,
        canal_distribucion: distributionChannelSelected.CanalId,
        moneda_id: currencies.find(
          (currency) => currency.sMonCodigo === customerFromSAP.sales.currency
        ).Moneda_Id,
        codigo_sap: customerFromSAP.id,
        ejecutivo_id: sellerSelected?.sEjeNombre,
        tipo_identificador_fiscal: Number.parseInt(customerFromSAP.taxIdType),
        ramo: customerBranches.find(
          (branch) => branch.RamoId === customerFromSAP.branch
        )?.RamoId,
        sociedad: societies.find(
          (society) => society.SocId === customerFromSAP.sales?.society
        )?.SocId,
        condicion_pago: paymentConditions.find(
          (condition) =>
            condition.ConPagoClave === customerFromSAP.sales?.paymentTerms
        )?.CondPagoId,
        clase_impuesto: taxClasses.find(
          (taxClass) => taxClass.ClaseImpuestoId === customerFromSAP.taxClass
        )?.ClaseImpuestoId,
      });

      setPostalCodeSelected(customerFromSAP.address.postalCode);
    }

    if (isEditMode && selectedEditItem) return;

    if (customerFromSAP?.id && customerFromSAP?.id !== "") {
      setCustomerFromSAP(customerFromSAP);
      fillData();
      setNewInnerCustomerId(undefined);
    } else {
      // If customerFromSAP is not set, reset the form and remove customerFromSAP
      const ruc_dni = getValues("ruc_dni");
      logger.info("RESET IF CUSTOMER NOT FOUND IN SAP");
      reset({ ...initialValues });
      setValue("ruc_dni", ruc_dni);
      setPostalCodeSelected("");
      removeCustomerFromSAP();
      setNewInnerCustomerId(undefined);

      if (marketType && marketType === "EXPORTACIÓN") {
        handleCountryChange("");
        setValue("pais", "");
      }

      if (marketType && marketType === "NACIONAL") {
        handleCountryChange("Peru");
        setValue("pais", "Peru");
      }

      handleStateChange("");
      handleCityChange("");
      currentCustomerRef.current = undefined;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerFromSAP, reset, getValues]);

  // Create all contacts from SAP when a new customer is created
  React.useEffect(() => {
    if (customerFromSAP && customerFromSAP?.id && newInnerCustomerId) {
      const contacts = customerFromSAP?.contacts || [];

      for (const contact of contacts) {
        createContactMutate({
          customer_id: newInnerCustomerId,
          data: {
            nombrePila: contact?.name || "-",
            nombre: contact?.lastName || "-",
            cargo: contact?.role || "Z9",
            departamento: contact?.department || "Z024",
            email: contact?.email || "-",
            telefono: contact?.phone || "-",
            estado: 1,
          },
        });
      }
    }
  }, [newInnerCustomerId, customerFromSAP, createContactMutate]);

  React.useEffect(() => {
    if (marketType && marketType === "NACIONAL") {
      setValue("pais", "Peru");
      setValue("sujeto_iva", 1);
      handleCountryChange("Peru");
    } else {
      setValue("sujeto_iva", 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const country = watch("pais");

    if (marketType) {
      if (marketType === "NACIONAL" && country !== "Peru") {
        toast.warn(
          "Ah Seleccionado un pais diferente a Perú, su cotización pasara a ser de Exportación"
        );
        setMarketType("EXPORTACIÓN");
      }

      if (marketType !== "NACIONAL" && country === "Peru") {
        toast.warn("Ah Seleccionado Perú, su cotización pasara a ser Nacional");
        setMarketType("NACIONAL");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch("pais")]);

  React.useEffect(() => {
    const country = watch("pais");

    if (country !== "Peru" || selectedCountry !== "Peru") {
      setOnExport(true);
    } else {
      setOnExport(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch("pais"), selectedCountry, currentCustomerRef.current]);

  return (
    <form
      className="flex flex-col py-4 space-y-3 [&_section]:flex [&_section]:flex-col [&_section]:md:flex-row [&_section]:items-center [&_section]:gap-3"
      onSubmit={handleSubmit(isEditMode ? onEdit : onSave)}
    >
      <section>
        {isEditMode && (
          <FormInputText
            label={"Código del Cliente"}
            placeholder={"Ingrese el Código"}
            {...register("codigo", {
              required: "Código es obligatorio",
            })}
            error={errors.codigo}
            control={control}
            parentClassName="w-full md:w-1/2"
            disabled={true}
            value={selectedEditItem?.sCliCodigo}
          />
        )}
        <Controller
          name="ejecutivo_id"
          control={control}
          rules={{ required: "Debe seleccionar un Ejecutivo" }}
          render={({ field: { onChange, value, ...rest } }) => (
            <FormSelectText
              label={"Ejecutivo"}
              required
              {...rest}
              placeholder="Seleccione un Ejecutivo"
              parentClassName="w-full"
              options={sellersMapping}
              {...register("ejecutivo_id", {
                required: "El ejecutivo es obligatorio",
              })}
              value={value}
              onChange={(e) => {
                onChange(e.target.value ? e.target.value : null);
              }}
              labelName={"ejecutivo_id"}
              filter={true}
            />
          )}
        />

        {!isEditMode && (
          <Controller
            name="procedencia"
            control={control}
            rules={{ required: "Debe seleccionar una Procedencia" }}
            render={({ field: { onChange, value, ...rest } }) => (
              <FormSelectText
                label={"Proc. de cliente"}
                required
                {...rest}
                parentClassName="w-full md:w-1/2"
                placeholder="Seleccione la procedencia"
                options={Object.keys(CustomerOrigin)}
                {...register("tipo", {
                  required: "La procedencia es obligatorio",
                })}
                value={value}
                onChange={(e) => {
                  onChange(e.target.value ? e.target.value : null);
                }}
                labelName={"tipo"}
                filter={true}
              />
            )}
          />
        )}
      </section>
      <section>
        {isEditMode && (
          <Controller
            name="procedencia"
            control={control}
            rules={{ required: "Debe seleccionar una Procedencia" }}
            render={({ field: { onChange, value, ...rest } }) => (
              <FormSelectText
                label={"Procedencia de cliente"}
                required
                {...rest}
                parentClassName="w-full md:w-1/2"
                placeholder="Seleccione la procedencia"
                options={Object.keys(CustomerOrigin)}
                {...register("tipo", {
                  required: "La procedencia es obligatorio",
                })}
                value={value}
                onChange={(e) => {
                  onChange(e.target.value ? e.target.value : null);
                }}
                labelName={"tipo"}
                filter={true}
              />
            )}
          />
        )}
        {isCliengo && (
          <FormInputText
            label={"ID Cliengo"}
            disabled={false}
            placeholder="Ingrese un ID"
            {...register("cliengo_id")}
            error={errors.cliengo_id}
            control={control}
            parentClassName="w-full md:w-1/2"
          />
        )}
      </section>
      <section>
        <Controller
          name="tipo_identificador_fiscal"
          control={control}
          rules={{
            required: "Debe seleccionar un Tipo de Identificador Fiscal",
          }}
          render={({ field: { onChange, value, ...rest } }) => (
            <FormSelectText
              label={"T. de Ident. Fiscal"}
              required
              {...rest}
              placeholder={"Seleccione un tipo"}
              parentClassName="w-full"
              options={taxIdTypesOptions}
              value={value}
              onChange={onChange}
              filter={true}
            />
          )}
        />
      </section>
      <section className="flex flex-col md:flex-row justify-start items-center">
        {/* <Controller
          name="clase_impuesto"
          control={control}
          rules={{
            required: "Debe seleccionar una Clase de Impuesto",
          }}
          render={({ field: { onChange, value, ...rest } }) => (
            <FormSelectText
              label={"Clase de Impuesto"}
              required
              {...rest}
              placeholder={"Seleccione una c. de impuesto"}
              parentClassName="w-full"
              options={taxClassesOptions}
              value={value}
              onChange={(e) => {
                onChange(e.target.value ? e.target.value : null);
              }}
              filter={true}
            />
          )}
        /> */}

        <div className="flex flex-col w-full md:w-1/2 ">
          <FormInputText
            label={"N° de identificación fiscal"}
            required
            disabled={false}
            maxLength={20}
            placeholder={"Ingrese Identificador Fiscal"}
            {...register("ruc_dni", {
              required: "Identificador Fiscal es obligatorio",
            })}
            error={errors.ruc_dni}
            control={control}
            parentClassName="w-full "
          />
          <Button
            className="mt-2 md:w-38 h-10 md:h-8 mb-3"
            variant="tertiary"
            style={{ width: "100%" }}
            disabled={isPendingCustomerFromSAP}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              findCustomerMutate({ ruc: watch("ruc_dni") });
            }}
          >
            {isPendingCustomerFromSAP ? (
              <span>Buscando...</span>
            ) : (
              <span>Buscar en ERP</span>
            )}
            {isPendingCustomerFromSAP ? (
              <Loader2
                data-testid="loader-icon"
                className="ml-2 animate-spin"
                width={22}
                height={22}
              />
            ) : (
              <SearchIcon className="ml-2 md:w-5" />
            )}
          </Button>
        </div>
        <Controller
          name="tipo"
          control={control}
          rules={{ required: "Debe seleccionar un Tipo" }}
          render={({ field: { onChange, value, ...rest } }) => (
            <FormSelectText
              label={"Tipo de cliente"}
              required
              {...rest}
              placeholder={"Seleccione un tipo"}
              parentClassName="w-full -mt-10 md:w-1/2"
              options={Object.keys(CustomerTypes).sort()}
              {...register("tipo", {
                required: "El Tipo es obligatorio",
              })}
              value={value}
              onChange={(e) => {
                onChange(e.target.value ? e.target.value : null);
              }}
              labelName={"tipo"}
              filter={true}
            />
          )}
        />
      </section>
      <section>
        <FormInputText
          label={"Razón Social"}
          required
          disabled={false}
          placeholder={"Ingrese la razón social"}
          {...register("nombre", {
            required: "Razón Social es obligatorio",
          })}
          error={errors.nombre}
          control={control}
          maxLength={35}
          parentClassName="w-full md:w-1/2 "
        />
        <FormInputText
          label={"Razón Social 2"}
          disabled={false}
          placeholder={"Ingrese la razón social 2"}
          {...register("nombre2")}
          error={errors.nombre2}
          control={control}
          maxLength={35}
          parentClassName="w-full md:w-1/2 "
        />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Controller
          name="pais"
          control={control}
          rules={{ required: "Debe seleccionar un País" }}
          defaultValue={selectedEditItem?.sCliPais}
          render={({ field: { onChange, value, ...rest } }) => (
            <FormSelectText
              label={"País"}
              required
              {...rest}
              parentClassName="w-full"
              placeholder={"Seleccione un pais"}
              options={countries}
              {...register("pais", {
                required: "El país es obligatorio",
              })}
              value={selectedCountry}
              onChange={(e) => {
                handleCountryChange(e.target.value);
                onChange(e.target.value ? e.target.value : null);
              }}
              filter={true}
            />
          )}
        />

        <Controller
          name="departamento"
          control={control}
          rules={{ required: "Debe seleccionar un Departamento" }}
          defaultValue={selectedEditItem?.sCliDepartamento}
          render={({ field: { onChange, value, ...rest } }) => (
            <FormSelectText
              label={"Departamento"}
              required
              {...rest}
              placeholder="Seleccione un departamento"
              parentClassName="w-full"
              options={states}
              {...register("departamento", {
                required: "El departamento es obligatorio",
              })}
              value={selectedState}
              onChange={(e) => {
                handleStateChange(e.target.value);
                onChange(e.target.value ? e.target.value : null);
              }}
              filter={true}
            />
          )}
        />
      </section>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Controller
          name="provincia"
          control={control}
          defaultValue={selectedEditItem?.sCliProvincia}
          render={({ field: { onChange, value, ...rest } }) => (
            <FormSelectText
              label={"Provincia/Municipio/Ciudad"}
              required
              {...rest}
              placeholder="Seleccione una provincia"
              parentClassName="w-full"
              options={cities}
              value={selectedCity}
              onChange={(e) => {
                handleCityChange(e.target.value);
                onChange(e.target.value ? e.target.value : null);
              }}
              filter={true}
              editable
            />
          )}
        />
        <Controller
          name="distrito"
          control={control}
          defaultValue={selectedEditItem?.sCliDistrito}
          render={({ field: { onChange, value, ...rest } }) => (
            <FormSelectText
              label={"Distrito"}
              {...rest}
              placeholder="Seleccione un distrito"
              parentClassName="w-full"
              options={districts}
              value={selectedDistrict}
              onChange={(e) => {
                handleDistrictChange(e.target.value);
                onChange(e.target.value ? e.target.value : null);
              }}
              filter={true}
              editable
            />
          )}
        />
      </div>
      <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <FormInputText
          label={"Dirección"}
          required
          disabled={false}
          placeholder={"Ingrese la dirección"}
          {...register("direccion", {
            required: "Dirección es obligatorio",
          })}
          maxLength={35}
          error={errors.direccion}
          control={control}
          parentClassName="w-full md:w-1/2"
        />
        {/* <FormInputText
          label={"Codigo Postal"}
          disabled={false}
          maxLength={6}
          placeholder={"Ingrese un código postal"}
          {...register("codigo_postal")}
          error={errors.codigo_postal}
          control={control}
          parentClassName="w-full"
        /> */}
        <div className="flex flex-col w-full md:w-1/2">
          <label className="uppercase font-medium text-sm w-full">
            Código Postal
          </label>
          <Dropdown
            value={postalCodeSelected}
            onChange={(e) => {
              setPostalCodeSelected(e.value);
              setValue("codigo_postal", e.value);
            }}
            options={
              watch("departamento") === "LIMA" ? postalCodesOfLimaPeru : []
            }
            maxLength={7}
            optionLabel="name"
            editable
            placeholder="Seleccione o escriba el código postal"
            className="w-full md:w-14rem rounded-lg"
            emptyMessage="No hay códigos postales disponibles"
          />
        </div>
      </section>
      <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <FormInputText
          label={"Telefono"}
          disabled={false}
          placeholder="Ingrese un numero telefonico"
          {...register("telefono", {
            // pattern: {
            //   value: /^[0-9]*$/,
            //   message: "El teléfono solo puede contener números",
            // },
            // required: "El teléfono es obligatorio",
          })}
          error={errors.telefono}
          control={control}
          parentClassName="w-full"
          maxLength={15}
        />
        <FormInputText
          label={"Correo"}
          disabled={false}
          placeholder={"Ingrese un correo electronico"}
          {...register("email")}
          type="email"
          error={errors.email}
          control={control}
          parentClassName="w-full"
        />
      </section>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Controller
          name="canal_distribucion"
          control={control}
          rules={{ required: "Debe seleccionar un Canal de Distribución" }}
          render={({ field: { onChange, value, ...rest } }) => (
            <FormSelectText
              label={"Canal de Distribución"}
              required
              placeholder="Seleccione un canal de distribución"
              parentClassName="w-full"
              options={distributionChannelsOptions
                .filter(
                  (dc) =>
                    customerFromSAP && customerFromSAP?.id // Si el cliente existe en el ERP
                      ? true // Devuelve todos los canales
                      : isEditMode // Verifica si esta en modo edición
                      ? true // Si esta verdad que esta editando entonces se muestra todos los canales
                      : dc.value < 10 // Si va a crear uno nuevo entonces solo muestra los canales MP*
                )
                .filter((dc) => (onExport ? dc.value === 1 : true))} // Si esta en exportación, solo muestra el canal de distribución ModaPower
              value={value}
              disabled={isLoadingDistributionChannels}
              onChange={onChange}
              filter={true}
              {...rest}
            />
          )}
        />
        <Controller
          name="moneda_id"
          control={control}
          rules={{ required: "Debe seleccionar una Moneda" }}
          render={({ field: { onChange, value, ...rest } }) => (
            <FormSelectText
              label={"Moneda"}
              required
              parentClassName="w-full"
              placeholder="Seleccione una moneda"
              options={currenciesOptions}
              onChange={onChange}
              value={value}
              disabled={isLoadingCurrencies}
              {...rest}
            />
          )}
        />
      </div>

      <Accordion>
        <AccordionTab header="Campos Adicionales">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3  w-full p-2">
            {/* <div className="flex flex-col">
              <FormInputText
                id="concepto_busqueda"
                label={"Concepto de busqueda"}
                disabled={false}
                placeholder={"Ingrese un concepto de busqueda"}
                {...register("concepto_busqueda")}
                type="text"
                maxLength={20}
                error={errors.concepto_busqueda}
                control={control}
                parentClassName="w-full"
              />
              <small id="concepto_busqueda">
                Frase corta para identificar al cliente en el ERP.
              </small>
            </div> */}
            <Controller
              name="ramo"
              control={control}
              rules={{
                required: "Debe seleccionar un sector industrial",
              }}
              defaultValue={"A099"}
              render={({ field: { onChange, value, ...rest } }) => (
                <FormSelectText
                  label={"Sector Industrial"}
                  {...rest}
                  placeholder={"Seleccione un sector industrial"}
                  parentClassName="w-full"
                  options={customerBranchesOptions}
                  value={value}
                  onChange={onChange}
                  filter={true}
                />
              )}
            />
            {/* <Controller
              name="sociedad"
              control={control}
              rules={{
                required: "Debe seleccionar una Sociedad",
              }}
              defaultValue={"MO01"}
              render={({ field: { onChange, value, ...rest } }) => (
                <FormSelectText
                  label={"Sociedad"}
                  {...rest}
                  placeholder={"Seleccione una sociedad"}
                  parentClassName="w-full"
                  options={societiesOptions}
                  value={value}
                  onChange={onChange}
                  filter={true}
                />
              )}
            />
             */}
            {/* <Controller
              name="condicion_pago"
              control={control}
              rules={{
                required: "Debe seleccionar una Condición de Pago",
              }}
              defaultValue={10}
              render={({ field: { onChange, value, ...rest } }) => (
                <FormSelectText
                  label={"Condición de Pago"}
                  {...rest}
                  placeholder={"Seleccione una c. de pago"}
                  parentClassName="w-full"
                  options={paymentConditionsOptions}
                  value={value}
                  onChange={onChange}
                  filter={true}
                />
              )}
            /> */}
            {/* <Controller
              name="tratamiento"
              control={control}
              rules={{
                required: "Debe seleccionar un Tratamiento",
              }}
              defaultValue={"Empresa"}
              render={({ field: { onChange, value, ...rest } }) => (
                <FormSelectText
                  label={"Tratamiento"}
                  {...rest}
                  placeholder={"Seleccione un tratamiento"}
                  parentClassName="w-full"
                  options={[
                    "Copropietario",
                    "Empresa",
                    "Señor",
                    "Señor y señora",
                    "Señora",
                    "Señorita",
                    "Sociedad conyugal",
                  ]}
                  value={value}
                  onChange={onChange}
                  filter={true}
                />
              )}
            /> */}
            {/* <Controller
              name="sujeto_iva"
              control={control}
              rules={{
                required: "Debe seleccionar un Sujeto a IVA/IGV",
              }}
              defaultValue={0}
              render={({ field: { onChange, value, ...rest } }) => (
                <FormSelectText
                  label={"Sujeto a IVA/IGV"}
                  {...rest}
                  placeholder={"Seleccione un sujeto a IVA/IGV"}
                  parentClassName="w-full"
                  options={sujectToIVAOptions}
                  value={value}
                  onChange={onChange}
                  filter={true}
                />
              )}
            /> */}
          </div>
          {customerFromSAP && customerFromSAP?.interlocutors?.length > 0 && (
            <div className="bg-gray-50 p-2 rounded-md border border-gray-200 mt-2 w-full">
              <p className="text-xs font-medium text-gray-700 mb-1">
                Interlocutores
              </p>
              <div className="flex flex-wrap gap-1 max-h-[200px] overflow-y-auto">
                {customerFromSAP?.interlocutors?.map((interlocutor, index) => (
                  <div
                    key={index}
                    className="bg-white p-1.5 rounded text-xs border-l-2 border-blue-400 flex-1 min-w-[110px] max-w-[150px] shadow-sm hover:shadow transition-shadow"
                  >
                    <p className="font-medium truncate text-xs">
                      {sellers.find(
                        (seller) => seller?.sEjeSAP === interlocutor?.personId
                      )?.sEjeNombre || interlocutor.personId}
                    </p>
                    <div className="text-[10px] text-gray-600">
                      <p
                        className="truncate"
                        title={`Función: ${interlocutor?.interlocutorFunction}`}
                      >
                        Función: {interlocutor?.interlocutorFunction}
                      </p>
                      <p
                        className="truncate"
                        title={`Canal: ${interlocutor?.distributionChannel}`}
                      >
                        Canal D.: {interlocutor?.distributionChannel}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </AccordionTab>
      </Accordion>
      <section className="flex-col md:flex-row justify-center items-center">
        <Button
          type="submit"
          className={cn(
            `px-8 p-2 uppercase rounded-lg w-full mb-2 md:mb-0 md:mr-2 md:w-auto`,
            customerHasBeenAdded
              ? "bg-gray-400 text-gray-100 cursor-not-allowed"
              : "bg-[#0055be] text-white cursor-pointer"
          )}
          disabled={
            customerHasBeenAdded ||
            isPendingCreateCustomer ||
            isPendingEditCustomer
          }
        >
          {(isPendingCreateCustomer || isPendingEditCustomer) && (
            <Loader2
              data-testid="loader-icon"
              className="ml-2 animate-spin"
              width={22}
              height={22}
            />
          )}

          {isEditMode && !isPendingEditCustomer && (
            <Check className="w-4 h-4 mr-2" />
          )}

          {!isEditMode && customerHasBeenAdded && (
            <Check className="w-4 h-4 mr-2" />
          )}

          {!isEditMode && !isPendingCreateCustomer && !customerHasBeenAdded && (
            <Save className="w-5 h-5 mr-2" />
          )}

          {isEditMode
            ? isPendingEditCustomer
              ? "Actualizando..."
              : "Actualizar"
            : customerHasBeenAdded
            ? "Registrado"
            : isPendingCreateCustomer
            ? "Registrando..."
            : "Registrar"}
        </Button>
        <Button
          type="button"
          variant={customerHasBeenAdded ? "secondary" : "destructive"}
          className={cn(
            "w-full md:w-auto",
            customerHasBeenAdded
              ? "bg-[#0055be] cursor-not-allowed"
              : "bg-[#ff1f31]"
          )}
          onClick={() => {
            setVisibility(false);
            removeCustomerFromSAP();
          }}
        >
          {customerHasBeenAdded && <MoveLeft className="w-4 h-4 mr-2" />}
          {customerHasBeenAdded ? "Regresar" : "Cancelar"}
        </Button>
      </section>
    </form>
  );
};
