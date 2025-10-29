import { z } from "zod";

// -----------------------------------------------------------------------------
// 1. Esquema Zod para el objeto JavaScript SIMPLIFICADO (ENTRADA para la transformación)
// -----------------------------------------------------------------------------

const SimplifiedContactSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  department: z.string().optional().default("Z042"), // ABTPA | Z042 = "Ingenieria de Tiendas"
  city: z.string().optional(), // ORT01
  phone: z.string().optional(), // TELF1
  email: z.string().optional(), // PARAU
  positionCode: z.string().optional().default("Z9"), // PAFKT
});

const SimplifiedUnloadingPointSchema = z.object({
  name: z.string().min(1), // ABLAD
  number: z.string().min(1).default("01"), // LFDNR
  factoryCalendar: z.string().min(1).default("01"), // KNFAK
});

// Este es el esquema que define la forma de tus datos de entrada "amigables"
export const SimplifiedClientInputSchema = z.object({
  kunnr: z
    .string()
    .optional()
    .describe("Numero de Deudor, vacío para creación"),
  countryCode: z.string().length(2).default("PE"),
  name1: z.string().min(1),
  searchTerm1: z.string().max(20).optional().nullable(),
  name2: z.string().optional().nullable(),
  treatment: z
    .enum([
      "Copropietario",
      "Empresa",
      "Señor",
      "Señor y señora",
      "Señora",
      "Señorita",
      "Sociedad Conyugal",
    ])
    .default("Empresa")
    .nullable(),
  region: z.string().min(1).nullable(),
  province: z.string().nullable(),
  postalCode: z.string().nullable(),
  regionCode: z.string().min(1),
  streetAndNumber: z.string().min(1),
  customerAccountGroup: z.enum(["ZNAC", "ZEXT"]).default("ZNAC"),
  customerClassification: z.string().min(1).default("01"),
  district: z.string().nullable(),
  languageKey: z.string().length(1).default("S"),
  taxId1: z.string().min(1),
  subjectToVAT: z.boolean().default(true),
  isNaturalPerson: z.boolean().default(false),
  taxType: z.enum(["PJ", "PN"]).default("PJ"),
  taxIdType: z.enum(["0", "1", "4", "6", "7", "8", "9"]).default("6"),
  industrySector: z.string().min(1).default("A014"),
  society: z.string().min(1).default("MO01"),
  assignmentSortKey: z.string().default("001"),
  reconciliationAccount: z.string().min(1).default("1212000010"),
  paymentTermsKey: z.string().default("CONT"),
  salesOrganization: z.enum(["MD01", "MD02"]).default("MD01"),
  distributionChannel: z.string().min(1).default("P6"),
  division: z.string().default("99"),
  salesDistrict: z.string().optional().default("000002"),
  shippingConditions: z.string().default("01"),
  currency: z.enum(["USD", "PEN", "EUR"]).default("USD"),
  customerAccountAssignmentGroup: z.enum(["01", "02"]).default("01"),
  supplyingPlant: z.string().optional().default("1201"), // Modapower
  salesGroup: z.string().optional().nullable(),
  salesOffice: z.string().optional().default("0203"),
  customerGroup: z.string().optional().default("A4"),
  nameCO: z.string().optional().default(""),
  postalCodePOBox: z.string().optional(),
  poBox: z.string().optional().default(""),
  poBoxCity: z.string().optional().default(""),
  deliveryDistrict: z.string().optional().default(""),
  phone: z.string().max(16, {
    message: "El telefono debe tener máximo 16 caracteres",
  }).optional().nullable(),
  email: z.string().optional().nullable(),
  contactPersonFirstName: z.string().optional(),
  contactPersonLastName: z.string().optional(),
  contactPersonNameCountry: z.string().optional(),
  contactPersonLanguage: z.string().optional(),
  contactPersonCity: z.string().optional(),
  contactPersonDistrict: z.string().optional(),
  contactPersonDistrictNo: z.string().optional(),
  contactPersonStreet: z.string().optional(),
  contactPersonRegion: z.string().optional(),
  sellerId: z.string().length(8, {
    message: "El Id del ejecutivo debe tener exactamente 8 caracteres",
  }),
  unloadingPoints: z
    .array(SimplifiedUnloadingPointSchema)
    .optional()
    .default([]),
  contacts: z.array(SimplifiedContactSchema).optional().default([]),
});

// -----------------------------------------------------------------------------
// 2. Esquemas Zod para la estructura XML de SAP (SALIDA de la transformación)
//    (Estos son los mismos que antes, definen la estructura objetivo)
// -----------------------------------------------------------------------------

const IKna1Schema = z.object({
  MANDT: z.string(),
  // KUNNR: z.string(),
  LAND1: z.string(),
  NAME1: z.string(),
  MCOD1: z.string().max(25),
  NAME2: z.string(),
  ANRED: z.string(),
  ORT01: z.string(),
  PSTLZ: z.string(),
  REGIO: z.string(),
  SORTL: z.string().max(10),
  STRAS: z.string(),
  BUBKZ: z.string(),
  KTOKD: z.string(),
  KUKLA: z.string(),
  ORT02: z.string(),
  SPRAS: z.string(),
  STCD1: z.string(),
  STKZU: z.string(),
  STKZN: z.string(),
  HZUOR: z.string(),
  FITYP: z.string(),
  STCDT: z.string(),
  BRSCH: z.string(),
});

const IKnb1Schema = z.object({
  MANDT: z.string(),
  // KUNNR: z.string(),
  BUKRS: z.string(),
  PERNR: z.string(),
  ERDAT: z.string(),
  ERNAM: z.string(),
  ZUAWA: z.string(),
  AKONT: z.string(),
  ZTERM: z.string(),
  ZINRT: z.string(),
  FDGRV: z.string(),
  XZVER: z.string(),
  TOGRU: z.string(),
});

const IKnvvSchema = z.object({
  MANDT: z.string(),
  // KUNNR: z.string(),
  VKORG: z.string(),
  VTWEG: z.string(),
  SPART: z.string(),
  VERSG: z.string(),
  KALKS: z.string(),
  BZIRK: z.string(),
  AWAHR: z.string(),
  ANTLF: z.string(),
  KZAZU: z.string(),
  LPRIO: z.string(),
  VSBED: z.string(),
  WAERS: z.string(),
  KTGRD: z.string(),
  ZTERM: z.string(),
  VWERK: z.string(),
  VKGRP: z.string(),
  VKBUR: z.string(),
});

const IBapiaddr1Schema = z.object({
  ADDR_NO: z.string(),
  FORMOFADDR: z.string(),
  NAME: z.string(),
  NAME_2: z.string(),
  NAME_3: z.string(),
  NAME_4: z.string(),
  C_O_NAME: z.string(),
  CITY: z.string(),
  CITY_NO: z.string(),
  POSTL_COD1: z.string(),
  POSTL_COD2: z.string(),
  POSTL_COD3: z.string(),
  PO_BOX: z.string(),
  PO_BOX_CIT: z.string(),
  DELIV_DIS: z.string(),
  STREET: z.string(),
  COUNTRY: z.string(),
  LANGU: z.string(),
  REGION: z.string(),
  TEL1_NUMBR: z.string(),
  E_MAIL: z.string(),
});

const IBapiaddr2Schema = z.object({
  FIRSTNAME: z.string(),
  LASTNAME: z.string(),
  NAMCOUNTRY: z.string(),
  LANGU_P: z.string(),
  CITY: z.string(),
  DISTRICT: z.string(),
  DISTRCT_NO: z.string(),
  DELIV_DIS: z.string(),
  STREET: z.string(),
  REGION: z.string(),
});

const TXknvaItemSchema = z.object({
  MANDT: z.string(),
  // KUNNR: z.string(),
  ABLAD: z.string(),
  LFDNR: z.string(),
  KNFAK: z.string(),
});

const TXknvaSchema = z.array(TXknvaItemSchema);

const TXknvkItemSchema = z.object({
  MANDT: z.string(),
  // KUNNR: z.string(),
  NAMEV: z.string(),
  NAME1: z.string(),
  ABTPA: z.string(),
  ORT01: z.string(),
  TELF1: z.string(),
  PARAU: z.string(),
  PAFKT: z.string(),
});

const TXknvkSchema = z.array(TXknvkItemSchema);

const InputSchema = z.object({
  I_KNA1: IKna1Schema,
  I_KNB1: IKnb1Schema,
  I_KNVV: IKnvvSchema,
  I_BAPIADDR1: IBapiaddr1Schema,
  I_BAPIADDR2: IBapiaddr2Schema,
  T_XKNVA: TXknvaSchema,
  T_XKNVK: TXknvkSchema,
  PI_POSTFLAG: z.string(),
  PI_CAM_CHANGED: z.string(),
});

const ZmfCrearModificarClienteSchema = z.object({ InputSchema });

// Este es el esquema que define la forma de tus datos de SALIDA (formato SAP)
export const SapClientRequestOutputSchema = ZmfCrearModificarClienteSchema;

// -----------------------------------------------------------------------------
// 3. Esquema de Transformación Zod: de SimplifiedClientInputSchema a SapClientRequestOutputSchema
// -----------------------------------------------------------------------------

export const SapClientTransformationSchema =
  SimplifiedClientInputSchema.transform(
    (clientData) => {
      // El tipo de retorno debe ser SapClientRequestOutputData
      const mandt = "400";
      // const kunnr = clientData.kunnr || "";
      const currentDate = new Date().toISOString().split("T")[0];

      return {
        // Maestro de clientes (parte general)
        I_KNA1: {
          MANDT: mandt,
          // KUNNR: kunnr,
          LAND1: clientData.countryCode,
          NAME1: clientData.name1,
          NAME2: clientData.name2 || "",
          MCOD1:
            clientData?.searchTerm1.substring(0, 10) ||
            clientData?.name1.substring(0, 10),
          ANRED: clientData.treatment,
          ORT01: clientData?.province?.substring(0, 35),
          PSTLZ: clientData.postalCode || "",
          REGIO: clientData.regionCode,
          SORTL: clientData.searchTerm1.substring(0, 10) || "",
          STRAS: clientData.streetAndNumber,
          // ADRNR: "",
          BUBKZ: "0",
          KTOKD: clientData.customerAccountGroup,
          KUKLA: clientData.customerClassification,
          ORT02: clientData?.district?.substring(0, 35),
          SPRAS: clientData.languageKey,
          STCD1: clientData.taxId1,
          STKZU: clientData.subjectToVAT ? "X" : "",
          STKZN: clientData.isNaturalPerson ? "X" : "",
          HZUOR: "00", // Asignación jerarquia
          FITYP: clientData.taxType,
          STCDT: clientData.taxIdType,
          BRSCH: clientData.industrySector,
          TELF1: clientData.phone || "",
          TELF2: clientData.customerAccountGroup === "ZEXT" ? clientData.phone : "", // Tel. movil
          BBBNR: "0000000",
          BBSNR: "00000",
          UMSAT: "0.00", // Vol.neg.anual
          UMJAH: "0000", // Año para el cual se indica el volumen de ventas
          JMZAH: "000000", // Numero de empleados año
          JMJAH: "0000", // Año para el cual se indica el numero de empleados
          KATR1: "18", // Autorizado a publicidad
          UMSA1: "0.00", // Vol.neg.anual
          WERKS: clientData.supplyingPlant || "1201", // Modapower
          DUEFL: "X", // Estatus de transferencia datos a release siguiente
          UPTIM: "00:00:00", // Hora de la ultima confirmación de la modificación
          RIC: "00000000000", // RIC Number
          LEGALNAT: "0000", // Legal Nature
          "_-VSO_-R_PALHGT": "0.000", // Altura embalaje maximo material embalaje (utilizar area de cargo)
          "_-VSO_-R_I_NO_LYR": "00", // Cantidad de capas antes de paleta intermedia (utilización area de carga)
          "_-VSO_-R_ULD_SIDE": "0", // Preferencia lateral de carga / descarga (optimizacion area de carga)
          "_-VSO_-R_LOAD_PREF": "0", // Preferencia de carga / descarga anterior / posterior (OAC)
        },
        // Maestro de clientes (sociedad)
        I_KNB1: {
          MANDT: mandt,
          // KUNNR: kunnr,
          BUKRS: clientData.society,
          PERNR: "00000000",
          ERDAT: currentDate,
          ERNAM: "API_USER",
          ZUAWA: clientData.assignmentSortKey,
          AKONT: clientData.reconciliationAccount,
          ZTERM: clientData.paymentTermsKey,
          ZINRT: "00",
          FDGRV: "M4", // Grupo de tesorería | M4 = Clientes nuevos
          XZVER: "X",
          VLIBB: "0.00",
          VRSZL: "0",
          VRSPR: "0",
          WEBTR: "0.00",
          TOGRU: clientData.paymentTermsKey,
          KULTG: "0",
          UPTIM: "00:00:00",
          CIIUCODE: "0000",
        },
        // Maestro de clientes datos comerciales
        I_KNVV: {
          MANDT: mandt,
          // KUNNR: kunnr,
          VKORG: clientData.salesOrganization,
          VTWEG: clientData.distributionChannel,
          SPART: clientData.division,
          VERSG: "A",
          KALKS: "1",
          BZIRK: clientData.salesDistrict || "MOD002",
          AWAHR: "100",
          ANTLF: "9",
          KZAZU: "X",
          LPRIO: "00",
          VSBED: clientData.shippingConditions,
          WAERS: clientData.currency,
          KTGRD: clientData.customerAccountAssignmentGroup,
          ZTERM: clientData.paymentTermsKey,
          VWERK: clientData.supplyingPlant || "1201", // Modapower
          VKGRP: clientData.salesGroup,
          VKBUR: clientData.salesOffice || "0203",
          KDGRP: clientData.customerGroup || "01",
          KVAWT: "0.00",
          UEBTO: "0.0",
          UNTTO: "0.0",
        },
        // Estructura de referencia BAPI p.direcciones (org./empresa)
        I_BAPIADDR1: {
          NAME: clientData.name1,
          NAME_2: clientData.name2 || "",
          NAME_3: "",
          CITY: clientData?.province?.substring(0, 35),
          DISTRICT: clientData?.district?.substring(0, 35),
          CITY_NO: clientData.postalCode || "",
          POSTL_COD1: clientData.postalCode,
          POSTL_COD2: "",
          POSTL_COD3: "",
          STREET: clientData.streetAndNumber,
          COUNTRY: clientData.countryCode,
          LANGU: clientData.languageKey,
          REGION: clientData.regionCode,
          SORT1: clientData.searchTerm1 || "",
          TEL1_NUMBR: clientData.phone || "",
          E_MAIL: clientData.email || "",
          TITLE: clientData.treatment,
          COUNTRYISO: clientData.countryCode,
          LANGU_ISO: clientData.languageKey,
          LANGU_CR: clientData.languageKey,
          ADDR_NO: "",
          FORMOFADDR: clientData.treatment,
          NAME_4: "",
          C_O_NAME: clientData.nameCO,
          PO_BOX: clientData.poBox,
          PO_BOX_CIT: clientData.poBoxCity,
          DELIV_DIS: clientData.deliveryDistrict
        },
        // Estructura referencia BAPI p.direcciones (personas físicas)
        I_BAPIADDR2: {
          FIRSTNAME: clientData.contactPersonFirstName || "",
          LASTNAME: clientData.contactPersonLastName || "",
          NAMCOUNTRY: clientData.contactPersonNameCountry || "",
          LANGU_P: clientData.contactPersonLanguage || "",
          CITY: clientData.contactPersonCity || "",
          DISTRICT: clientData.contactPersonDistrict || "",
          DISTRCT_NO: clientData.contactPersonDistrictNo || "",
          DELIV_DIS: "",
          STREET: clientData.contactPersonStreet || "",
          REGION: clientData.contactPersonRegion || "",
        },
        // Maestro de clientes puestos de descarga
        T_XKNVA: (clientData.unloadingPoints || []).map((up) => ({
          MANDT: mandt,
          // KUNNR: kunnr,
          ABLAD: up.name,
          LFDNR: up.number,
          KNFAK: up.factoryCalendar,
        })),
        // Maestro de clientes persona de contacto
        T_XKNVK: (clientData.contacts || []).map((contact) => ({
          MANDT: mandt,
          // KUNNR: kunnr,
          NAMEV: contact.firstName,
          NAME1: contact.lastName,
          ABTPA: contact.department || "",
          ABTNR: contact.department || "",
          ORT01: contact.city || clientData.region, // Usar ciudad del contacto o la principal
          TELF1: contact.phone || "",
          PARAU: contact.email || "",
          PAFKT: contact.positionCode || "Z9",
        })),
        T_XKNVI: [
          {
            ALAND: "PE", //clientData.countryCode,
            TATYP: "MWST", // Suject to VAT
            TAXKD: clientData.subjectToVAT ? "1" : "0",
          },
        ],
        T_XKNVP: [
          {
            MANDT: mandt,
            VKORG: clientData.salesOrganization,
            VTWEG: clientData.distributionChannel,
            SPART: clientData.division,
            PARVW: "VE",
            PERNR: clientData.sellerId,
            DEFPA: "X",
            KZ: "I",
          },
          {
            MANDT: mandt,
            VKORG: clientData.salesOrganization,
            VTWEG: clientData.distributionChannel,
            SPART: clientData.division,
            PARVW: "AG",
            DEFPA: "X",
            KZ: "I",
          },
          {
            VKORG: clientData.salesOrganization,
            VTWEG: clientData.distributionChannel,
            SPART: clientData.division,
            PARVW: "WE",
            DEFPA: "X",
            KZ: "I",
          },
          {
            VKORG: clientData.salesOrganization,
            VTWEG: clientData.distributionChannel,
            SPART: clientData.division,
            PARVW: "RE",
            DEFPA: "X",
            KZ: "I",
          },
          {
            VKORG: clientData.salesOrganization,
            VTWEG: clientData.distributionChannel,
            SPART: clientData.division,
            PARVW: "RG",
            DEFPA: "X",
            KZ: "I",
          },
        ],
        PI_POSTFLAG: "X",
        PI_CAM_CHANGED: "X",
      };
    }
    // Opcionalmente, para una validación explícita de la salida:
    // .pipe(SapClientRequestOutputSchema)
  );
