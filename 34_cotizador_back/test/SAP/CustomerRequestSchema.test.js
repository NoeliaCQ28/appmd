import { describe, expect, it } from "vitest";
import {
  SapClientTransformationSchema,
  SimplifiedClientInputSchema,
} from "./../../src/SAP/customers/schemas/CustomerRequestSchema.js"; // Asegúrate de que la ruta sea correcta

// Asume que tus esquemas Zod están en un archivo llamado 'your-zod-schemas-file.ts' (o .js)

describe("SAP Client Schemas and Transformation", () => {
  // 1. Tests para SimplifiedClientInputSchema (Esquema de Entendimiento/Entrada)
  describe("SimplifiedClientInputSchema", () => {
    const baseValidInput = {
      name1: "Test Corp",
      countryCode: "PE",
      city: "LIMA",
      postalCode: "15001",
      regionCode: "15",
      streetAndNumber: "AV. TEST 123",
      district: "MIRAFLORES",
      taxId1: "20123456789",
      taxType: "PJ",
      taxIdType: "6",
      // ... (otros campos requeridos con valores por defecto o explícitos)
    };

    it("should validate a correct simplified client object", () => {
      const result = SimplifiedClientInputSchema.safeParse(baseValidInput);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name1).toBe("Test Corp");
        expect(result.data.countryCode).toBe("PE"); // Verifica valores por defecto si no se proveen
        expect(result.data.treatment).toBe("Empresa"); // Ejemplo de valor por defecto
      }
    });

    it("should apply default values", () => {
      const minimalInput = {
        name1: "Minimal Corp",
        city: "AREQUIPA",
        postalCode: "04001",
        regionCode: "04",
        streetAndNumber: "CALLE MINIMA 456",
        district: "YANAHUARA",
        taxId1: "20987654321",
      };
      const result = SimplifiedClientInputSchema.safeParse(minimalInput);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.countryCode).toBe("PE");
        expect(result.data.treatment).toBe("Empresa");
        expect(result.data.customerAccountGroup).toBe("ZNAC");
        expect(result.data.languageKey).toBe("S");
        // ... verifica otros defaults
      }
    });

    it("should fail validation for missing required fields", () => {
      const invalidInput = { ...baseValidInput, name1: undefined }; // Forzar un error
      const result = SimplifiedClientInputSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].path).toContain("name1");
        expect(result.error.errors[0].message).toBe("Required"); // o el mensaje específico de Zod
      }
    });

    it("should fail validation for incorrect data types", () => {
      const invalidInput = { ...baseValidInput, postalCode: 12345 }; // postalCode debe ser string
      const result = SimplifiedClientInputSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].path).toContain("postalCode");
      }
    });

    it("should validate contacts and unloading points arrays", () => {
      const inputWithArrays = {
        ...baseValidInput,
        contacts: [
          { firstName: "John", lastName: "Doe", email: "john@test.com" },
          {
            firstName: "Jane",
            lastName: "Doe",
            email: "jane@test.com",
            positionCode: "CEO",
          },
        ],
        unloadingPoints: [
          { name: "Main Warehouse", number: "01", factoryCalendar: "US" },
        ],
      };
      const result = SimplifiedClientInputSchema.safeParse(inputWithArrays);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.contacts).toHaveLength(2);
        expect(result.data.contacts?.[0].positionCode).toBe("Z9"); // Default
        expect(result.data.contacts?.[1].positionCode).toBe("CEO");
        expect(result.data.unloadingPoints).toHaveLength(1);
      }
    });
  });

  // 2. Tests para SapClientTransformationSchema (Transformación)
  describe("SapClientTransformationSchema", () => {
    const validInput = {
      customerAccountGroup: "ZNAC",
      name1: "ANALYTICA MINERAL SERVICES S.A.C.",
      name2: "",
      countryCode: "PE",
      city: "SANTIAGO DE SURCO",
      treatment: "Empresa",
      postalCode: "LIMA 33",
      regionCode: "15",
      streetAndNumber: "AV. JAVIER PRADO ESTE NRO. 4019",
      district: "SANTIAGO DE SURCO",
      taxId1: "20508853721",
      taxType: "PJ",
      taxIdType: "6",
      industrySector: "A019",
      companyCode: "MO01",
      society: "MO01",
      salesDistrict: "000002",
      paymentTermsKey: "CENT",
      salesOrganization: "MD01",
      salesOffice: "0200",
      distributionChannel: "MP",
      customerAccountAssignmentGroup: "01",
      currency: "USD",
      email: "facturacion@ams.com.pe",
      phone: "6280138",
      subjectToVAT: true,
      isNaturalPerson: false,
      contacts: [
        {
          firstName: "ELLIOT AMANZO ARMIJO",
          lastName: "ELLIOT AMANZO ARMIJO",
          city: "",
          phone: "6580138-0",
          email: "eamanzo@scm.net.pe",
        },
        {
          firstName: "GABRIEL CONCEPCION GABRIEL CONCEPCION",
          lastName: "GABRIEL CONCEPCION GABRIEL CONCEPCION",
          city: "",
          phone: "6280138-112",
          email: "gconcepcion@ams.com.pe",
        },
      ],
      unloadingPoints: [],
    };

    it("should correctly transform valid simplified data to SAP request format", () => {
      const result = SapClientTransformationSchema.safeParse(validInput);
      expect(result.success).toBe(true);

      if (result.success) {
        const sapData = result.data;

        const inputSap = sapData;

        // Verificar algunos campos clave en I_KNA1
        expect(inputSap.I_KNA1.MANDT).toBe("400");
        expect(inputSap.I_KNA1.KUNNR).toBe(undefined);
        expect(inputSap.I_KNA1.NAME1).toBe("ANALYTICA MINERAL SERVICES S.A.C.");
        expect(inputSap.I_KNA1.LAND1).toBe("PE");
        expect(inputSap.I_KNA1.ORT01).toBe("SANTIAGO DE SURCO");
        expect(inputSap.I_KNA1.STKZU).toBe("X"); // subjectToVAT default es true

        // Verificar algunos campos clave en I_KNB1
        expect(inputSap.I_KNB1.BUKRS).toBe("MO01");
        expect(inputSap.I_KNB1.ZTERM).toBe("CENT");
        expect(inputSap.I_KNB1.ERNAM).toBe("API_USER"); // Valor fijo de la transformación

        // Verificar algunos campos clave en I_KNVV
        expect(inputSap.I_KNVV.VKORG).toBe("MD01");
        expect(inputSap.I_KNVV.VTWEG).toBe("MP");
        expect(inputSap.I_KNVV.WAERS).toBe("USD");

        // Verificar I_BAPIADDR1
        expect(inputSap.I_BAPIADDR1.NAME).toBe(
          "ANALYTICA MINERAL SERVICES S.A.C."
        );
        expect(inputSap.I_BAPIADDR1.CITY).toBe("SANTIAGO DE SURCO");
        expect(inputSap.I_BAPIADDR1.TEL1_NUMBR).toBe("6280138");
        expect(inputSap.I_BAPIADDR1.E_MAIL).toBe("facturacion@ams.com.pe");

        // Verificar T_XKNVK (Contactos)
        expect(inputSap.T_XKNVK).toHaveLength(2);
        expect(inputSap.T_XKNVK[0].NAMEV).toBe("ELLIOT AMANZO ARMIJO");
        expect(inputSap.T_XKNVK[0].NAME1).toBe("ELLIOT AMANZO ARMIJO");
        expect(inputSap.T_XKNVK[0].PARAU).toBe("eamanzo@scm.net.pe");

        // Verificar T_XKNVA (Puntos de descarga)
        expect(inputSap.T_XKNVA).toHaveLength(0);

        if (inputSap.T_XKNVA.length > 0) {
          expect(inputSap.T_XKNVA[0].NAME1).toBe("Main Warehouse");
          expect(inputSap.T_XKNVA[0].NAME2).toBe("01");
          expect(inputSap.T_XKNVA[0].PARAU).toBe("US");
        }

        // Verificar flags
        expect(inputSap.PI_POSTFLAG).toBe("X");
        expect(inputSap.PI_CAM_CHANGED).toBe("X");
      }
    });

    it("should handle empty KUNNR for new client creation", () => {
      const newClientInput = { ...validInput, kunnr: undefined };
      const result = SapClientTransformationSchema.safeParse(newClientInput);
      expect(result.success).toBe(true);
      if (result.success) {
        const inputSap = result.data;
        expect(inputSap.I_KNA1.KUNNR).toBe(undefined);
        expect(inputSap.I_KNB1.KUNNR).toBe(undefined);
        // ... y así para todos los KUNNR
      }
    });

    it("should correctly transform STKZU and STKZN based on booleans", () => {
      const inputNaturalPerson = {
        ...validInput,
        subjectToVAT: false,
        isNaturalPerson: true,
      };
      const result =
        SapClientTransformationSchema.safeParse(inputNaturalPerson);
      expect(result.success).toBe(true);
      if (result.success) {
        const kna1 = result.data.I_KNA1;
        expect(kna1.STKZU).toBe(""); // subjectToVAT: false
        expect(kna1.STKZN).toBe("X"); // isNaturalPerson: true
      }
    });

    it("should fail transformation if input data is invalid for SimplifiedClientInputSchema", () => {
      const invalidForSimplified = { name1: 123 }; // Invalid type for name1
      const result =
        SapClientTransformationSchema.safeParse(invalidForSimplified);
      expect(result.success).toBe(false);
      if (!result.success) {
        // El error vendrá de la validación del esquema de entrada (SimplifiedClientInputSchema)
        expect(result.error.errors[0].path).toContain("name1");
      }
    });
  });
});
