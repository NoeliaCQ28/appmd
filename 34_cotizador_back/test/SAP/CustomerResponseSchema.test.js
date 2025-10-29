import { describe, expect, it } from "vitest";
import {
  CustomerSoapResponseSchema,
  CustomerTransformSchema,
} from "../../src/SAP/customers/schemas/CustomerResponseSchema.js"; // Asegúrate que la ruta sea correcta

// --- Helper para crear datos de prueba mínimos ---
// Dado el gran número de campos, es útil tener una función para generar
// datos base y luego sobreescribir solo lo necesario para cada test.

const createMinimalIKna1 = (overrides = {}) => ({
  MANDT: "400",
  KUNNR: "1000",
  LAND1: "PE",
  NAME1: "Cliente Ejemplo",
  NAME2: "",
  ORT01: "LIMA",
  PSTLZ: "15001",
  REGIO: "15",
  SORTL: "EJEMPLO",
  STRAS: "AV. PRINCIPAL 123",
  TELF1: "987654321",
  TELFX: "",
  XCPDK: "",
  ADRNR: "ADR001",
  MCOD1: "",
  MCOD2: "",
  MCOD3: "",
  ANRED: "Empresa",
  AUFSD: "",
  BAHNE: "",
  BAHNS: "",
  BBBNR: "",
  BBSNR: "",
  BEGRU: "",
  BRSCH: "A014",
  BUBKZ: "0",
  DATLT: "",
  ERDAT: "2023-01-15",
  ERNAM: "USERAPI",
  EXABL: "",
  FAKSD: "",
  FISKN: "",
  KNAZK: "",
  KNRZA: "",
  KONZS: "",
  KTOKD: "ZNAC",
  KUKLA: "1",
  LIFNR: "",
  LIFSD: "",
  LOCCO: "",
  LOEVM: "",
  NAME3: "",
  NAME4: "",
  NIELS: "",
  ORT02: "MIRAFLORES",
  PFACH: "",
  PSTL2: "",
  COUNC: "",
  CITYC: "",
  RPMKR: "",
  SPERR: "",
  SPRAS: "S",
  STCD1: "20123456789",
  STCD2: "",
  STKZA: "",
  STKZU: "X",
  TELBX: "",
  TELF2: "",
  TELTX: "",
  TELX1: "",
  LZONE: "",
  XZEMP: "",
  VBUND: "",
  STCEG: "",
  DEAR1: "",
  DEAR2: "",
  DEAR3: "",
  DEAR4: "",
  DEAR5: "",
  GFORM: "",
  BRAN1: "",
  BRAN2: "",
  BRAN3: "",
  BRAN4: "",
  BRAN5: "",
  EKONT: "",
  UMSAT: "",
  UMJAH: "",
  UWAER: "",
  JMZAH: "",
  JMJAH: "",
  KATR1: "",
  KATR2: "",
  KATR3: "",
  KATR4: "",
  KATR5: "",
  KATR6: "",
  KATR7: "",
  KATR8: "",
  KATR9: "",
  KATR10: "",
  STKZN: "",
  UMSA1: "",
  TXJCD: "",
  PERIV: "",
  ABRVW: "",
  INSPBYDEBI: "",
  INSPATDEBI: "",
  KTOCD: "",
  PFORT: "",
  WERKS: "",
  DTAMS: "",
  DTAWS: "",
  DUEFL: "",
  HZUOR: "00",
  SPERZ: "",
  ETIKG: "",
  CIVVE: "",
  MILVE: "",
  KDKG1: "",
  KDKG2: "",
  KDKG3: "",
  KDKG4: "",
  KDKG5: "",
  XKNZA: "",
  FITYP: "PJ",
  STCDT: "6",
  STCD3: "",
  STCD4: "",
  STCD5: "",
  XICMS: "",
  XXIPI: "",
  XSUBT: "",
  CFOPC: "",
  TXLW1: "",
  TXLW2: "",
  CCC01: "",
  CCC02: "",
  CCC03: "",
  CCC04: "",
  CASSD: "",
  KNURL: "",
  J_1KFREPRE: "",
  J_1KFTBUS: "",
  J_1KFTIND: "",
  CONFS: "",
  UPDAT: "",
  UPTIM: "",
  NODEL: "",
  DEAR6: "",
  CVP_XBLCK: "",
  SUFRAMA: "",
  RG: "",
  EXP: "",
  UF: "",
  RGDATE: "",
  RIC: "",
  RNE: "",
  RNEDATE: "",
  CNAE: "",
  LEGALNAT: "",
  CRTN: "",
  ICMSTAXPAY: "",
  INDTYP: "",
  TDT: "",
  COMSIZE: "",
  DECREGPC: "",
  "_-VSO_-R_PALHGT": "",
  "_-VSO_-R_PAL_UL": "",
  "_-VSO_-R_PK_MAT": "",
  "_-VSO_-R_MATPAL": "",
  "_-VSO_-R_I_NO_LYR": "",
  "_-VSO_-R_ONE_MAT": "",
  "_-VSO_-R_ONE_SORT": "",
  "_-VSO_-R_ULD_SIDE": "",
  "_-VSO_-R_LOAD_PREF": "",
  "_-VSO_-R_DPOINT": "",
  ALC: "",
  PMT_OFFICE: "",
  FEE_SCHEDULE: "",
  DUNS: "",
  DUNS4: "",
  PSOFG: "",
  PSOIS: "",
  PSON1: "",
  PSON2: "",
  PSON3: "",
  PSOVN: "",
  PSOTL: "",
  PSOHS: "",
  PSOST: "",
  PSOO1: "",
  PSOO2: "",
  PSOO3: "",
  PSOO4: "",
  PSOO5: "",
  ...overrides,
});

const createMinimalIKnb1 = (overrides = {}) => ({
  MANDT: "400",
  KUNNR: "1000",
  BUKRS: "MO01",
  PERNR: "0",
  ERDAT: "2023-01-15",
  ERNAM: "USERAPI",
  SPERR: "",
  LOEVM: "",
  ZUAWA: "001",
  BUSAB: "",
  AKONT: "121200",
  BEGRU: "",
  KNRZE: "",
  KNRZB: "",
  ZAMIM: "",
  ZAMIV: "",
  ZAMIR: "",
  ZAMIB: "",
  ZAMIO: "",
  ZWELS: "",
  XVERR: "",
  ZAHLS: "",
  ZTERM: "CONT",
  WAKON: "",
  VZSKZ: "",
  ZINDT: "",
  ZINRT: "",
  EIKTO: "",
  ZSABE: "",
  KVERM: "",
  FDGRV: "",
  VRBKZ: "",
  VLIBB: "",
  VRSZL: "",
  VRSPR: "",
  VRSNR: "",
  VERDT: "",
  PERKZ: "",
  XDEZV: "",
  XAUSZ: "",
  WEBTR: "",
  REMIT: "",
  DATLZ: "",
  XZVER: "",
  TOGRU: "",
  KULTG: "",
  HBKID: "",
  XPORE: "",
  BLNKZ: "",
  ALTKN: "",
  ZGRUP: "",
  URLID: "",
  MGRUP: "",
  LOCKB: "",
  UZAWE: "",
  EKVBD: "",
  SREGL: "",
  XEDIP: "",
  FRGRP: "",
  VRSDG: "",
  TLFXS: "",
  INTAD: "",
  XKNZB: "",
  GUZTE: "",
  GRICD: "",
  GRIDT: "",
  WBRSL: "",
  CONFS: "",
  UPDAT: "",
  UPTIM: "",
  NODEL: "",
  TLFNS: "",
  CESSION_KZ: "",
  AVSND: "",
  AD_HASH: "",
  QLAND: "",
  CVP_XBLCK_B: "",
  CIIUCODE: "",
  GMVKZD: "",
  ...overrides,
});

const createMinimalIKnvv = (overrides = {}) => ({
  MANDT: "400",
  KUNNR: "1000",
  VKORG: "MD01",
  VTWEG: "P6",
  SPART: "99",
  ERNAM: "USERAPI",
  ERDAT: "2023-01-15",
  BEGRU: "",
  LOEVM: "",
  VERSG: "A",
  AUFSD: "",
  KALKS: "1",
  KDGRP: "",
  BZIRK: "000002",
  KONDA: "",
  PLTYP: "",
  AWAHR: "100",
  INCO1: "",
  INCO2: "",
  LIFSD: "",
  AUTLF: "",
  ANTLF: "9",
  KZTLF: "",
  KZAZU: "X",
  CHSPL: "",
  LPRIO: "00",
  EIKTO: "",
  VSBED: "01",
  FAKSD: "",
  MRNKZ: "",
  PERFK: "",
  PERRL: "",
  KVAKZ: "",
  KVAWT: "",
  WAERS: "PEN",
  KLABC: "",
  KTGRD: "01",
  ZTERM: "CONT",
  VWERK: "1601",
  VKGRP: "LS2",
  VKBUR: "0203",
  VSORT: "",
  KVGR1: "",
  KVGR2: "",
  KVGR3: "",
  KVGR4: "",
  KVGR5: "",
  BOKRE: "",
  BOIDT: "",
  KURST: "",
  PRFRE: "",
  PRAT1: "",
  PRAT2: "",
  PRAT3: "",
  PRAT4: "",
  PRAT5: "",
  PRAT6: "",
  PRAT7: "",
  PRAT8: "",
  PRAT9: "",
  PRATA: "",
  KABSS: "",
  KKBER: "",
  CASSD: "",
  RDOFF: "",
  AGREL: "",
  MEGRU: "",
  UEBTO: "",
  UNTTO: "",
  UEBTK: "",
  PVKSM: "",
  PODKZ: "",
  PODTG: "",
  BLIND: "",
  CARRIER_NOTIF: "",
  CVP_XBLCK_V: "",
  "_-BEV1_-EMLGPFAND": "",
  "_-BEV1_-EMLGFORTS": "",
  ...overrides,
});

const createMinimalIBapiaddr1 = (overrides = {}) => ({
  ADDR_NO: "ADR001",
  FORMOFADDR: "",
  NAME: "Cliente Ejemplo",
  NAME_2: "",
  NAME_3: "",
  NAME_4: "",
  C_O_NAME: "",
  CITY: "LIMA",
  DISTRICT: "MIRAFLORES",
  CITY_NO: "LIM01",
  POSTL_COD1: "15001",
  POSTL_COD2: "",
  POSTL_COD3: "",
  PO_BOX: "",
  PO_BOX_CIT: "",
  DELIV_DIS: "",
  STREET: "AV. PRINCIPAL 123",
  STREET_NO: "",
  STR_ABBR: "",
  HOUSE_NO: "123",
  STR_SUPPL1: "",
  STR_SUPPL2: "",
  LOCATION: "",
  BUILDING: "",
  FLOOR: "",
  ROOM_NO: "",
  COUNTRY: "PE",
  LANGU: "S",
  REGION: "15",
  SORT1: "",
  SORT2: "",
  TIME_ZONE: "PET",
  TAXJURCODE: "",
  ADR_NOTES: "",
  COMM_TYPE: "",
  TEL1_NUMBR: "987654321",
  TEL1_EXT: "",
  FAX_NUMBER: "",
  FAX_EXTENS: "",
  STREET_LNG: "",
  DISTRCT_NO: "",
  CHCKSTATUS: "",
  PBOXCIT_NO: "",
  TRANSPZONE: "",
  HOUSE_NO2: "",
  E_MAIL: "cliente@ejemplo.com",
  STR_SUPPL3: "",
  TITLE: "",
  COUNTRYISO: "PE",
  LANGU_ISO: "ES",
  BUILD_LONG: "",
  REGIOGROUP: "",
  HOME_CITY: "",
  HOMECITYNO: "",
  PCODE1_EXT: "",
  PCODE2_EXT: "",
  PCODE3_EXT: "",
  PO_W_O_NO: "",
  PO_BOX_REG: "",
  POBOX_CTRY: "",
  PO_CTRYISO: "",
  HOMEPAGE: "",
  DONT_USE_S: "",
  DONT_USE_P: "",
  HOUSE_NO3: "",
  LANGU_CR: "",
  LANGUCRISO: "",
  PO_BOX_LOBBY: "",
  DELI_SERV_TYPE: "",
  DELI_SERV_NUMBER: "",
  URI_TYPE: "",
  COUNTY_CODE: "",
  COUNTY: "",
  TOWNSHIP_CODE: "",
  TOWNSHIP: "",
  ...overrides,
});

const createMinimalTXknvkItem = (overrides = {}) => ({
  MANDT: "400",
  PARNR: "CP001",
  KUNNR: "1000",
  NAMEV: "Juan",
  NAME1: "Perez",
  ORT01: "LIMA",
  ADRND: "",
  ADRNP: "",
  ABTPA: "VENTAS",
  ABTNR: "",
  UEPAR: "",
  TELF1: "999888777",
  ANRED: "Sr.",
  PAFKT: "Z9",
  PARVO: "",
  PAVIP: "",
  PARGE: "",
  PARLA: "",
  GBDAT: "1980-05-10",
  VRTNR: "",
  BRYTH: "",
  AKVER: "",
  NMAIL: "",
  PARAU: "juan.perez@ejemplo.com",
  PARH1: "",
  PARH2: "",
  PARH3: "",
  PARH4: "",
  PARH5: "",
  MOAB1: "",
  MOBI1: "",
  MOAB2: "",
  MOBI2: "",
  DIAB1: "",
  DIBI1: "",
  DIAB2: "",
  DIBI2: "",
  MIAB1: "",
  MIBI1: "",
  MIAB2: "",
  MIBI2: "",
  DOAB1: "",
  DOBI1: "",
  DOAB2: "",
  DOBI2: "",
  FRAB1: "",
  FRBI1: "",
  FRAB2: "",
  FRBI2: "",
  SAAB1: "",
  SABI1: "",
  SAAB2: "",
  SABI2: "",
  SOAB1: "",
  SOBI1: "",
  SOAB2: "",
  SOBI2: "",
  PAKN1: "",
  PAKN2: "",
  PAKN3: "",
  PAKN4: "",
  PAKN5: "",
  SORTL: "",
  FAMST: "",
  SPNAM: "",
  TITEL_AP: "",
  ERDAT: "2023-01-15",
  ERNAM: "USERAPI",
  DUEFL: "",
  LIFNR: "",
  LOEVM: "",
  KZHERK: "",
  ADRNP_2: "",
  PRSNR: "",
  CVP_XBLCK_K: "",
  KZ: "",
  ...overrides,
});

const createMinimalTXknvpItem = (overrides = {}) => ({
  MANDT: "400",
  KUNNR: "1000",
  VKORG: "MD01",
  VTWEG: "P6",
  SPART: "99",
  PARVW: "AG",
  PARZA: "001",
  KUNN2: "1000",
  LIFNR: "",
  PERNR: "",
  PARNR: "CP001",
  KNREF: "Ref Interlocutor",
  DEFPA: "X",
  KZ: "",
  ...overrides,
});

const createMinimalTXknviItem = (overrides = {}) => ({
  MANDT: "400",
  KUNNR: "1000",
  ALAND: "PE",
  TATYP: "MWST",
  TAXKD: "1",
  KZ: "",
  ...overrides,
});

const createMinimalTXknvaItem = (overrides = {}) => ({
  // passthrough, so can be anything
  MANDT: "400",
  KUNNR: "1000",
  ABLAD: "ALMACEN01",
  LFDNR: "01",
  KNFAK: "PE",
  ...overrides,
});

// --- Tests ---
describe("CustomerSoapResponse and Transformation Schemas", () => {
  describe("CustomerSoapResponseSchema (Input Validation)", () => {
    let validRawInput; // Tipo 'any' para flexibilidad en la creación de datos de prueba

    beforeEach(() => {
      // Construir un objeto de entrada válido base
      validRawInput = {
        OUTPUT: {
          I_KNA1: createMinimalIKna1(),
          I_KNB1: createMinimalIKnb1(),
          I_KNVV: createMinimalIKnvv(),
          I_BAPIADDR1: createMinimalIBapiaddr1(),
          T_XKNVA: { item: [createMinimalTXknvaItem()] }, // Ejemplo con objeto y array
          T_XKNVI: { item: [createMinimalTXknviItem()] },
          T_XKNVK: { item: [createMinimalTXknvkItem()] },
          T_XKNVP: { item: [createMinimalTXknvpItem()] },
        },
        O_KUNNR: "1000",
        O_MESSAGE: "Cliente procesado",
        O_TIPO: "S", // Success
      };
    });

    it("should validate a correct raw SOAP response object", () => {
      const result = CustomerSoapResponseSchema.safeParse(validRawInput);
      expect(
        result.success,
        JSON.stringify(result.success ? {} : result.error.errors, null, 2)
      ).toBe(true);
    });

    it("should fail if O_KUNNR is missing", () => {
      delete validRawInput.O_KUNNR;
      const result = CustomerSoapResponseSchema.safeParse(validRawInput);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].path).toContain("O_KUNNR");
      }
    });

    it("should fail if a required field in I_KNA1 is missing (e.g., NAME1)", () => {
      delete validRawInput.OUTPUT.I_KNA1.NAME1;
      const result = CustomerSoapResponseSchema.safeParse(validRawInput);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].path).toEqual([
          "OUTPUT",
          "I_KNA1",
          "NAME1",
        ]);
      }
    });

    // Pruebas para la normalización de T_XKNVK
    describe("T_XKNVK normalization", () => {
      it("should normalize T_XKNVK when item is a single object", () => {
        validRawInput.OUTPUT.T_XKNVK = {
          item: createMinimalTXknvkItem({ PARNR: "SINGLE_CP" }),
        };
        const result = CustomerSoapResponseSchema.safeParse(validRawInput);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(Array.isArray(result.data.OUTPUT.T_XKNVK.item)).toBe(true);
          expect(result.data.OUTPUT.T_XKNVK.item).toHaveLength(1);
          expect(result.data.OUTPUT.T_XKNVK.item[0].PARNR).toBe("SINGLE_CP");
        }
      });

      it("should normalize T_XKNVK when item is an array", () => {
        validRawInput.OUTPUT.T_XKNVK = {
          item: [
            createMinimalTXknvkItem({ PARNR: "CP001" }),
            createMinimalTXknvkItem({ PARNR: "CP002" }),
          ],
        };
        const result = CustomerSoapResponseSchema.safeParse(validRawInput);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(Array.isArray(result.data.OUTPUT.T_XKNVK.item)).toBe(true);
          expect(result.data.OUTPUT.T_XKNVK.item).toHaveLength(2);
        }
      });

      it("should handle T_XKNVK when input is already an array (direct array input)", () => {
        // Esta prueba es para la parte de z.array(tXknvkItemSchema) en la unión de tXknvkSchema
        // Sin embargo, la transformación final de tXknvkSchema siempre lo envuelve en { item: [...] }
        // Así que probamos la entrada que la transformación de tXknvkSchema espera.
        const rawContactsArray = [
          createMinimalTXknvkItem({ PARNR: "ARR_CP001" }),
          createMinimalTXknvkItem({ PARNR: "ARR_CP002" }),
        ];
        // Para probar la transformación de tXknvkSchema directamente:
        // const tXknvkSchema = z.object({ item: z.array(tXknvkItemSchema) }); // Suponiendo que esta es la forma final
        // const parsedContacts = tXknvkSchema.parse({ item: rawContactsArray });
        // expect(parsedContacts.item).toHaveLength(2);

        // Para el esquema completo:
        validRawInput.OUTPUT.T_XKNVK = rawContactsArray; // Esto es lo que tXknvkSchema (el union) podría recibir
        const result = CustomerSoapResponseSchema.safeParse(validRawInput);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(Array.isArray(result.data.OUTPUT.T_XKNVK.item)).toBe(true);
          expect(result.data.OUTPUT.T_XKNVK.item).toHaveLength(2);
          expect(result.data.OUTPUT.T_XKNVK.item[0].PARNR).toBe("ARR_CP001");
        }
      });

      it("should handle T_XKNVK when it is an empty array (no contacts)", () => {
        validRawInput.OUTPUT.T_XKNVK = []; // Simula la respuesta del servicio sin contactos
        const result = CustomerSoapResponseSchema.safeParse(validRawInput);
        expect(
          result.success,
          JSON.stringify(result.success ? {} : result.error.errors, null, 2)
        ).toBe(true);
        if (result.success) {
          // Después de la transformación de tXknvkSchema, esperamos { item: [] }
          expect(result.data.OUTPUT.T_XKNVK).toEqual({ item: [] });
        }
      });
    });

    // Pruebas similares para T_XKNVI y T_XKNVA (en outputSchema)
    describe("T_XKNVI normalization", () => {
      it("should normalize T_XKNVI when item is a single object", () => {
        validRawInput.OUTPUT.T_XKNVI = {
          item: createMinimalTXknviItem({ TAXKD: "S1" }),
        };
        const result = CustomerSoapResponseSchema.safeParse(validRawInput);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(Array.isArray(result.data.OUTPUT.T_XKNVI)).toBe(true);
          expect(result.data.OUTPUT.T_XKNVI).toHaveLength(1);
          expect(result.data.OUTPUT.T_XKNVI[0].TAXKD).toBe("S1");
        }
      });
      // ... más tests para T_XKNVI (array, undefined)
    });

    describe("T_XKNVA normalization (in outputSchema)", () => {
      it("should normalize T_XKNVA when item is a single object", () => {
        validRawInput.OUTPUT.T_XKNVA = {
          item: createMinimalTXknvaItem({ ABLAD: "SINGLE_UNLOAD" }),
        };
        const result = CustomerSoapResponseSchema.safeParse(validRawInput);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(Array.isArray(result.data.OUTPUT.T_XKNVA)).toBe(true);
          expect(result.data.OUTPUT.T_XKNVA).toHaveLength(1);
          expect(result.data.OUTPUT.T_XKNVA[0].ABLAD).toBe("SINGLE_UNLOAD");
        }
      });
      // ... más tests para T_XKNVA (array, undefined)
    });
  });

  describe("CustomerTransformSchema (Output Transformation)", () => {
    let validRawInputForTransform;

    beforeEach(() => {
      validRawInputForTransform = {
        OUTPUT: {
          I_KNA1: createMinimalIKna1({
            KUNNR: "CUST007",
            NAME1: "Transform Corp",
            SORTL: "TRANSFORM",
            KTOKD: "ZEXT",
            STCD1: "RUC123",
            STCDT: "6",
            FITYP: "PJ",
            BRSCH: "A001",
            STRAS: "Calle Falsa 123",
            ORT02: "Distrito Test",
            ORT01: "Provincia Test",
            REGIO: "99",
            LAND1: "AR",
            PSTLZ: "C1000",
            TELF1: "555-0100",
            ERDAT: "2024-07-26",
          }),
          I_KNB1: createMinimalIKnb1({
            BUKRS: "AR01",
            ZTERM: "PAGO30",
          }),
          I_KNVV: createMinimalIKnvv({
            VKORG: "ARSA",
            VKGRP: "GVENTAS",
            VTWEG: "01",
            SPART: "02",
            VKBUR: "OFIVTA",
            BZIRK: "ZONA01",
            WAERS: "ARS",
            VWERK: "PLANTA01",
          }),
          I_BAPIADDR1: createMinimalIBapiaddr1({
            E_MAIL: "info@transformcorp.com",
          }),
          T_XKNVK: {
            item: [
              createMinimalTXknvkItem({
                PARNR: "CONT01",
                PAFKT: "CEO",
                NAMEV: "Ana",
                NAME1: "Smith",
                ABTPA: "Gerencia",
                ORT01: "BsAs",
                TELF1: "555-0101",
                PARAU: "ana@transformcorp.com",
              }),
              createMinimalTXknvkItem({
                PARNR: "CONT02",
                PAFKT: "CTO",
                NAMEV: "Luis",
                NAME1: "Gomez",
                ABTPA: "IT",
                ORT01: "CBA",
                TELF1: "555-0102",
                PARAU: "luis@transformcorp.com",
              }),
            ],
          },
          T_XKNVP: {
            item: [
              createMinimalTXknvpItem({
                PARVW: "RE",
                KUNN2: "CUST007",
                KNREF: "Receptor Factura",
              }),
            ],
          },
          T_XKNVI: { item: [] }, // Vacío para este test
          T_XKNVA: { item: [] }, // Vacío para este test
        },
        O_KUNNR: "CUST007",
        O_MESSAGE: "Cliente transformado OK",
        O_TIPO: "S",
      };
    });

    it("should correctly transform the raw SOAP response to the simplified customer object", () => {
      const result = CustomerTransformSchema.safeParse(
        validRawInputForTransform
      );
      expect(
        result.success,
        JSON.stringify(result.success ? {} : result.error.errors, null, 2)
      ).toBe(true);

      if (result.success) {
        const transformed = result.data;
        const customer = transformed.customer;

        // Customer root level
        expect(customer.id).toBe("CUST007");
        expect(customer.name).toBe("Transform Corp");
        expect(customer.searchConcept).toBe("TRANSFORM");
        expect(customer.accountGroup).toBe("ZEXT");
        expect(customer.taxNumber).toBe("RUC123");
        expect(customer.taxIdType).toBe("6");
        expect(customer.taxClass).toBe("PJ");
        expect(customer.branch).toBe("A001");
        expect(customer.email).toBe("info@transformcorp.com");
        expect(customer.phone).toBe("555-0100");
        expect(customer.createdAt).toBe("2024-07-26");

        // Address
        expect(customer.address.street).toBe("Calle Falsa 123");
        expect(customer.address.district).toBe("Distrito Test");
        expect(customer.address.province).toBe("Provincia Test");
        expect(customer.address.regionCode).toBe("99");
        expect(customer.address.country).toBe("AR");
        expect(customer.address.postalCode).toBe("C1000");

        // Sales
        expect(customer.sales.society).toBe("AR01");
        expect(customer.sales.salesOrganization).toBe("ARSA");
        expect(customer.sales.paymentTerms).toBe("PAGO30");
        expect(customer.sales.salesGroup).toBe("GVENTAS");
        expect(customer.sales.org).toBe("ARSA");
        expect(customer.sales.distributionChannel).toBe("01");
        expect(customer.sales.division).toBe("02");
        expect(customer.sales.salesOffice).toBe("OFIVTA");
        expect(customer.sales.salesZone).toBe("ZONA01");
        expect(customer.sales.currency).toBe("ARS");
        expect(customer.sales.distributionChannelAreaCode).toBe("PLANTA01");

        // Contacts
        expect(customer.contacts).toHaveLength(2);
        const contact1 = customer.contacts[0];
        expect(contact1.id).toBe("CONT01");
        expect(contact1.role).toBe("CEO");
        expect(contact1.name).toBe("Ana");
        expect(contact1.lastName).toBe("Smith");
        expect(contact1.region).toBe("Gerencia");
        expect(contact1.regionCode).toBe("BsAs");
        expect(contact1.phone).toBe("555-0101");
        expect(contact1.email).toBe("ana@transformcorp.com");

        // Interlocutors
        expect(customer.interlocutors).toHaveLength(1);
        const interlocutor1 = customer.interlocutors[0];
        expect(interlocutor1.customerId).toBe("1000"); // KUNNR de createMinimalTXknvpItem
        expect(interlocutor1.interlocutorFunction).toBe("RE");
        expect(interlocutor1.customerInterlocutorNumber).toBe("CUST007");
        expect(interlocutor1.interlocutorDenomination).toBe("Receptor Factura");
      }
    });

    it("should handle empty T_XKNVK.item array for contacts", () => {
      validRawInputForTransform.OUTPUT.T_XKNVK = { item: [] };
      const result = CustomerTransformSchema.safeParse(
        validRawInputForTransform
      );
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.customer.contacts).toEqual([]);
      }
    });

    it("should handle missing T_XKNVK for contacts (transformed to empty array)", () => {
      validRawInputForTransform.OUTPUT.T_XKNVK = [];
      const result = CustomerTransformSchema.safeParse(
        validRawInputForTransform
      );
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.customer.contacts).toEqual([]);
      }
    });

    // Pruebas similares para T_XKNVP (interlocutors)
    it("should handle empty T_XKNVP.item array for interlocutors", () => {
      validRawInputForTransform.OUTPUT.T_XKNVP = { item: [] };
      const result = CustomerTransformSchema.safeParse(
        validRawInputForTransform
      );
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.customer.interlocutors).toEqual([]);
      }
    });

    it("should fail transformation if input does not match CustomerSoapResponseSchema", () => {
      const invalidInput = { ...validRawInputForTransform, O_KUNNR: 12345 }; // Tipo incorrecto
      const result = CustomerTransformSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].path).toContain("O_KUNNR");
      }
    });
  });
});
