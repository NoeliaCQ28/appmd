const ENDPOINT = "/customers";

import db_pool from "#config/db.js";
import { handleResponse } from "#helpers/handlerResponse.js";
import { ERP_PROXY_API } from "#libs/axios.js";
import { executeStoredProcedure } from "#libs/dbUtils.js";
import { logger } from "#libs/logger.js";
import CurrencyModel from "#models/currencyModel.js";
import DistributionChannelModel from "#models/distributionChannelModel.js";
import LocationModel from "#models/locationModel.js";
import SalesOfficeModel from "#models/salesOfficeModel.js";
import { isAxiosError } from "axios";
import { SapClientTransformationSchema } from "../schemas/CustomerRequestSchema.js";
import { CustomerTransformSchema } from "../schemas/CustomerResponseSchema.js";

export const CustomerSAPModel = {
  getByRuc: async ({ ruc }) => {
    try {
      const response = await ERP_PROXY_API.get(`${ENDPOINT}?RUC=${ruc}`);
      const { data, status } = response;

      const customer = CustomerTransformSchema.safeParse(data);

      if (!customer.success) {
        return handleResponse(null, "Cliente no encontrado en SAP", false, 404);
      }

      return handleResponse(
        customer.data.customer,
        "Cliente obtenido correctamente desde SAP",
        true,
        status
      );
    } catch (error) {
      return handleResponse(
        null,
        `Error al optener el cliente por su RUC: ${error.message}`,
        false,
        500
      );
    }
  },
  getByCode: async ({ code }) => {
    try {
      const response = await ERP_PROXY_API.get(`${ENDPOINT}?code=${code}`);

      const { data, status } = response;

      const customer = CustomerTransformSchema.safeParse(data);

      if (!customer.success) {
        return handleResponse(null, "Cliente no encontrado en SAP", false, 500);
      }

      return handleResponse(
        customer.data.customer,
        "Cliente obtenido correctamente desde SAP",
        true,
        status
      );
    } catch (error) {
      return handleResponse(
        null,
        `Error al optener el cliente por su código: ${error.message}`,
        false,
        500
      );
    }
  },
  createFromModel: async ({ customerId }) => {
    try {
      const {
        result: [rows],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "cli_listarC",
        parameters: {
          in: [customerId],
          out: [],
        },
      });

      const customerFromDatabase = rows[0];
      const pais = customerFromDatabase.sCliPais;
      const departamento = customerFromDatabase.sCliDepartamento;
      const provincia = customerFromDatabase.sCliProvincia;
      const distrito = customerFromDatabase?.sCliDistrito || "";
      const canal_distribucion = customerFromDatabase.nCliCanalDistribucionId;
      const moneda_id = customerFromDatabase.nCliMonedaId;
      const nombre = customerFromDatabase.sCliNombre;
      const nombre2 = customerFromDatabase.sCliNombre2;
      const direccion = customerFromDatabase.sCliDirección;
      const ruc_dni = customerFromDatabase.sCliRucDni;
      const telefono = customerFromDatabase.sCliTelefono;
      const email = customerFromDatabase.sCliCelectronico;
      const type = customerFromDatabase.ClaseImpuestoId;
      const society = customerFromDatabase.SocId;
      const indentityTaxType = customerFromDatabase.TipoIdentificacionFiscalId;
      const branch = customerFromDatabase.RamoId;
      const paymentCondition = customerFromDatabase.ConPagoClave;
      const zipCode = customerFromDatabase.sCliCodigoPostal;
      const treatment = customerFromDatabase.sCliTratamiento;
      const searchTerm = customerFromDatabase.sCliConceptoBusqueda;
      const subjectToVAT = Number(customerFromDatabase.nCliSujetoIVA) === 1;
      const sellerId = customerFromDatabase.sEjeSAP?.toString();

      const marketType = pais.toUpperCase() === "PERU" ? "MD01" : "MD02";

      const countryISO2CodeResponse =
        await LocationModel.getISO2FromCountryName(pais);

      const stateFipsCodeResponse =
        await LocationModel.getFipsCodeFromStateName(pais, departamento);

      const distributionChannelResponse =
        await DistributionChannelModel.getCodeAndCodeArea({
          pCanalDistribucionId: canal_distribucion,
        });

      const currencyResponse = await CurrencyModel.getCode({
        currencyId: moneda_id,
      });

      if (!countryISO2CodeResponse.success) {
        return handleResponse(
          null,
          "Error al obtener el código de país o canal de distribución",
          false,
          500
        );
      }

      if (!distributionChannelResponse.success) {
        return handleResponse(
          null,
          "Error al obtener el código de canal de distribución",
          false,
          500
        );
      }

      if (!stateFipsCodeResponse.success) {
        return handleResponse(
          null,
          "Error al obtener el código de estado",
          false,
          500
        );
      }

      if (!currencyResponse.success) {
        return handleResponse(
          null,
          "Error al obtener el código de moneda",
          false,
          500
        );
      }

      const distributionChannel = distributionChannelResponse.data;
      const countryISO2Code = countryISO2CodeResponse.data;
      const stateFipsCode = stateFipsCodeResponse.data;
      const currency = currencyResponse.data;

      const salesOfficeResponse = await SalesOfficeModel.getByLocation({
        psTipoMercado: marketType,
        pnCodigoAreaVentas: distributionChannel.sCodigo.toString(),
      });

      if (!salesOfficeResponse.success) {
        return handleResponse(
          null,
          "Error al obtener la oficina de ventas",
          false,
          500
        );
      }

      const salesOffice = salesOfficeResponse.data;

      const customerType = pais.toUpperCase() === "PERU" ? "ZNAC" : "ZEXT";
      const reconciliationAccount =
        pais.toUpperCase() === "PERU" ? "1212000010" : "1212000020";
      const isNaturalPerson = type === "PN"; // Natural person
      // const customerType = "ZNAC";

      const inputationGroup = pais.toUpperCase() === "PERU" ? "01" : "02";

      const {
        result: [contactRaw],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "cli_listar_contactos",
        parameters: {
          in: [customerId],
          out: [],
        },
      });

      const contacts = contactRaw?.map((contact) => ({
        firstName: contact.sCliConNombrePila,
        lastName: contact.sCliConNombre,
        city: "",
        phone: contact.sCliConTelefono,
        email: contact.sCliConCorreo,
        department: contact.sCliConDepartamento,
        positionCode: contact?.sCliConCargo,
      }));

      const VARIANT = {
        nacional: {
          customerAccountGroup: "ZNAC",
          reconciliationAccount: "1212000010",
          customerAccountAssignmentGroup: "01", // Grupo de imputación
          taxType: "PN", // Persona natural
          isNaturalPerson: true,
          salesOrganization: "MD01",
          salesDistrict: "MOD002", // Distrito de ventas | MOD002 = Lima Sur,
          society: "MO01", // MODASA Lima Peru PEN
          companyCode: "MO01", // MODASA Lima Peru PEN
          subjectToVAT: true,

        },
        extranjero: {
          customerAccountGroup: "ZEXT",
          reconciliationAccount: "1212000020",
          customerAccountAssignmentGroup: "02", // Grupo de imputación
          taxType: "PJ", // Persona juridica
          isNaturalPerson: false,
          salesOrganization: "MD02",
          salesDistrict: "MOD002",
          society: "MO01", // MODASA Lima Peru PEN
          companyCode: "MO01", // MODASA Lima Peru PEN
          subjectToVAT: false,
        },
      }

      const VARIANT_SELECTED = pais.toUpperCase() === "PERU" ? VARIANT.nacional : VARIANT.extranjero;

      const payload = {
        name1: nombre, // Nombre principal
        name2: nombre2, // Nombre secundario (opcional)
        searchTerm1: searchTerm || "", // Término de búsqueda maximo 10 caracteres
        countryCode: countryISO2Code?.iso2, // Código de país Perú
        province: provincia?.toUpperCase() || null, // Provincia
        region: departamento.toUpperCase(), // Nombre del departamento
        regionCode: stateFipsCode?.fips_code, // Código de región (departamento)
        district: distrito?.toUpperCase() || null, // DISTRITO
        postalCode: zipCode, // Código postal de Lima
        treatment: treatment || "Empresa", // Tratamiento
        streetAndNumber: direccion, // Calle y número
        taxId1: ruc_dni, // RUC (Registro Único de Contribuyentes)
        industrySector: branch, // Sector industria alimentaria (ejemplo)
        paymentTermsKey: paymentCondition || "CONT", // Condición de pago 0002 = 30 días
        salesOffice: salesOffice?.VKBUR ? "0" + salesOffice.VKBUR.toString() : "0200", // Oficina de ventas
        customerGroup: "01", // Grupo de clientes | 01 = Industria
        distributionChannel: distributionChannel?.sCodigo || "MP", // Canal directo
        supplyingPlant: distributionChannel?.sCodigoArea?.toString() || "1201", // Centro suministrador
        salesGroup: distributionChannel?.nGrupoVendedoresId || "", // Grupo de vendedores
        currency: currency?.sMonCodigo, // Soles peruanos
        email: email, // Email de contacto
        phone: telefono, // Teléfono
        sellerId: sellerId, // ID del ejecutivo de ventas
        assignmentSortKey: "009",
        shippingConditions: "01", // Condiciones de envío
        taxIdType: indentityTaxType?.toString(),
        ...VARIANT_SELECTED, // Variantes según el país
        contacts: [...contacts],
        unloadingPoints: [
          // {
          //   name: "Puerto del Callao", // Punto de descarga
          //   number: "01", // Código interno
          //   factoryCalendar: "PE", // Calendario laboral
          // },
        ],
      };

      logger.info("createFromModel -> customer payload : ", payload);

      const customer = SapClientTransformationSchema.safeParse(payload);

      if (!customer.success) {
        return handleResponse(
          null,
          "Error al transformar el cliente: " + customer.error,
          false,
          500
        );
      }

      logger.debug(
        "Transformando cliente desde el modelo de cliente: ",
        JSON.stringify(customer.data)
      );

      const customerResponse = await ERP_PROXY_API.post(
        ENDPOINT,
        customer.data
      );

      if (customerResponse.data.O_TIPO === "E") {
        return handleResponse(
          null,
          `Error al crear el cliente en el ERP: ${customerResponse.data.O_MENSAJE}`,
          false,
          500
        );
      }

      const SAPCodeFromERP = customerResponse.data.O_KUNNR;

      if (!SAPCodeFromERP) {
        return handleResponse(
          null,
          "Error al crear el cliente en el ERP",
          false,
          500
        );
      }

      await executeStoredProcedure({
        pool: db_pool,
        sp_name: "cliente_actualizar_codigo_sap",
        parameters: {
          in: [customerId, SAPCodeFromERP],
          out: [],
        },
      });

      return handleResponse(
        {
          SAPCode: SAPCodeFromERP,
        },
        `Cliente creado correctamente en el ERP: ${SAPCodeFromERP}`,
        true,
        201
      );
    } catch (error) {
      logger.error(
        "Error al crear el cliente en el ERP: ",
        error.response?.data || error.message
      );

      if (isAxiosError(error)) {
        return handleResponse(
          null,
          `Error al crear el cliente: ${error.response?.data?.O_MESSAGE}`,
          false,
          500
        );
      }

      return handleResponse(
        null,
        `Error al crear el cliente: ${error.message}`,
        false,
        500
      );
    }
  },
};
