import { ERP_PROXY_API } from "#libs/axios.js";
import { executeFunction, executeStoredProcedure } from "#libs/dbUtils.js";
import db_pool from "../config/db.js";
import { handleResponse } from "../helpers/handlerResponse.js";
import AuditModel from "./AuditModel.js";

const identificationRegex = {
  // DNI
  1: /^[0-9]{8}$/, // 8 dígitos numéricos
  // RUC
  6: /^(10|15|17|20)[0-9]{9}$/, // 11 dígitos, empieza con 10,15,17,20
  // CARNETE DE EXTRANJERIA
  4: /^[A-Za-z0-9]{9,12}$/, // Alfanumérico de 9 a 12 caracteres
  // PASAPORTE
  7: /^[A-Za-z0-9]{6,12}$/, // Alfanumérico de 6 a 12 caracteres
  // OTROS TIPOS DE DOCUMENTO
  0: /^[A-Za-z0-9 \-]{6,20}$/, // Alfanumérico, guion o espacio, 6 a 20 caracteres
  // RUT
  8: /^[0-9]{7,8}-[0-9Kk]$/, // Chileno: 7-8 dígitos + guion + dígito o K
  // RIF
  9: /^[VEJGP]-[0-9]{8}-[0-9]$/, // Venezolano: letra + guion + 8 dígitos + guion + dígito verificador
};

const identificationRegexErrorMessage = {
  1: "El DNI debe tener 8 dígitos numéricos",
  6: "El RUC debe tener 11 dígitos y empezar con 10, 15, 17 o 20",
  4: "El Carnet de extranjería debe ser alfanumérico de 9 a 12 caracteres",
  7: "El Pasaporte debe ser alfanumérico de 6 a 12 caracteres",
  0: "El identificador fiscal debe ser alfanumérico, guion o espacio, de 6 a 20 caracteres",
  8: "El RUT chileno debe tener el formato correcto (7-8 dígitos + guion + dígito o K)",
  9: "El RIF venezolano debe tener el formato correcto (letra + guion + 8 dígitos + guion + dígito verificador)",
};

const CustomerModel = {
  getAll: async () => {
    try {
      const {
        result: [rows],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "cli_listarC",
        parameters: {
          in: [0],
        },
      });

      return handleResponse(rows, "Clientes consultados con exito");
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  getContactsByCustomerId: async (customer_id) => {
    try {
      const {
        result: [rows],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "cli_con_listarC",
        parameters: {
          in: [customer_id],
        },
      });

      return handleResponse(
        rows,
        "Los Contactos del cliente fueron consultados con exito",
      );
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  getFromERPByRuc: async (ruc) => {
    try {
      const ERPCustomerResponse = await ERP_PROXY_API.get("/customers", {
        params: {
          RUC: ruc,
        },
      })
        .then((response) => response.data)
        .catch((error) => {
          console.error(error);
          return [];
        });

      if (ERPCustomerResponse.OTipo !== "S") {
        return handleResponse(
          null,
          "No existe el cliente en el ERP",
          false,
          500,
        );
      }

      return handleResponse(
        ERPCustomerResponse.Output,
        "Cliente consultado con exito",
      );
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  createContact: async (user_id, customer_id, data) => {
    const {
      nombre,
      nombrePila,
      cargo,
      departamento,
      email,
      telefono,
      estado,
      eliminado = 0,
    } = data;

    if (!customer_id) {
      return handleResponse(
        null,
        `El contacto ${nombre} no se puede adjuntar. dado que el cliente no existe o el id esta nulo`,
        false,
        404,
      );
    }

    const {
      result: [rows],
      outputParamsResult,
    } = await executeStoredProcedure({
      pool: db_pool,
      sp_name: "clicon_crear",
      parameters: {
        in: [
          customer_id,
          nombre,
          nombrePila,
          cargo,
          email,
          telefono,
          estado,
          eliminado,
          departamento,
          user_id,
        ],
        out: ["@pContacto_Id"],
      },
    });

    return handleResponse(rows, "Contacto adjuntado exitosamente");
  },

  deleteContact: async (user_id, customer_id, contact_id) => {
    try {
      const {
        result: [rowsExistsCustomer],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "cli_listarC",
        parameters: {
          in: [customer_id],
        },
      });

      if (!rowsExistsCustomer || rowsExistsCustomer.length === 0) {
        return handleResponse(null, "Cliente no encontrado", false, 404);
      }

      await executeStoredProcedure({
        pool: db_pool,
        sp_name: "clicon_ocultar",
        parameters: {
          in: [contact_id, user_id],
        },
      });

      return handleResponse(
        null,
        "El Contacto del cliente fue eliminado exitosamente",
      );
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  updateContact: async (user_id, customer_id, contact_id, data) => {
    try {
      const {
        result: [rowsExistsCustomer],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "cli_listarC",
        parameters: {
          in: [customer_id],
        },
      });

      if (!rowsExistsCustomer || rowsExistsCustomer.length === 0) {
        return handleResponse(null, "Cliente no encontrado", false, 404);
      }

      const {
        nombre,
        nombrePila,
        cargo,
        departamento,
        email,
        telefono,
        estado,
        eliminado = 0,
      } = data;

      await executeStoredProcedure({
        pool: db_pool,
        sp_name: "clicon_editar",
        parameters: {
          in: [
            Number(contact_id),
            nombre,
            nombrePila,
            cargo,
            email,
            telefono,
            estado,
            eliminado,
            departamento,
            user_id,
          ],
        },
      });

      return handleResponse(
        null,
        "El Contacto del cliente fue editado exitosamente",
      );
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  create: async (ctx, data) => {
    try {
      const {
        codigo,
        codigo_sap = "",
        ruc_dni,
        nombre,
        nombre2,
        direccion,
        procedencia,
        tipo,
        telefono,
        email,
        pais,
        departamento,
        provincia,
        distrito,
        estado,
        eliminado,
        fecha_actualizacion,
        cliengo_id,
        canal_distribucion,
        moneda_id,
        ejecutivo_id,
        tipo_identificador_fiscal,
        ramo,
        sociedad,
        condicion_pago,
        clase_impuesto,
        codigo_postal,
        concepto_busqueda,
        tratamiento,
        sujeto_iva,
      } = data;

      const taxId = ruc_dni.trim();

      const isUniqueCustomer = await executeFunction({
        pool: db_pool,
        functionName: "fn_cliente_existente",
        params: [nombre, taxId],
      });

      if (
        !taxId ||
        !identificationRegex[tipo_identificador_fiscal].test(taxId)
      ) {
        return handleResponse(
          null,
          `El Identificador fiscal ${taxId} no es válido. ${identificationRegexErrorMessage[tipo_identificador_fiscal]}`,
          false,
          400,
        );
      }

      switch (Number.parseInt(isUniqueCustomer)) {
        case 1:
          return handleResponse(
            null,
            `El nombre/razon social del cliente ${nombre} ya existe en la base de datos`,
            false,
            409,
          );
        case 2:
          return handleResponse(
            null,
            `El Identificador fiscal del cliente ${nombre} ya existe en la base de datos`,
            false,
            409,
          );
        case 3:
          return handleResponse(
            null,
            `El cliente ${nombre} y el Identificador fiscal ${taxId} ya existen en la base de datos`,
            false,
            409,
          );
      }

      const {
        result: [rows],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "cli_crear",
        parameters: {
          in: [
            codigo,
            codigo_sap,
            taxId,
            nombre,
            nombre2,
            direccion,
            ejecutivo_id,
            procedencia,
            cliengo_id,
            tipo,
            telefono,
            email,
            pais,
            departamento,
            provincia,
            distrito,
            estado,
            eliminado,
            canal_distribucion,
            moneda_id,
            tipo_identificador_fiscal,
            ramo,
            sociedad,
            condicion_pago,
            clase_impuesto,
            codigo_postal,
            concepto_busqueda,
            tratamiento,
            Number(sujeto_iva),
            ctx.user.id,
          ],
          out: ["@pCliente_Id"],
        },
      });

      await AuditModel.log({
        ctx: ctx,
        action: AuditActions.CREATE,
        humanDescription: `El usuario ${ctx.user.name} creó el cliente ${nombre} e identificador fiscal ${taxId}`,
        entity: "cliente",
        newData: data,
      });

      return handleResponse(rows, "Cliente creado exitosamente");
    } catch (error) {
      const { message } = error;
      await AuditModel.log({
        ctx: ctx,
        action: AuditActions.CREATE,
        humanDescription: `El usuario ${ctx.user.name} intento crear el cliente ${data?.nombre} e identificador fiscal ${data?.ruc_dni.trim()} pero ocurrió un error: ${message}`,
        entity: "cliente",
        oldData: data,
      });

      return handleResponse(null, message, false, 500);
    }
  },
  update: async (user_id, cliente_id, data) => {
    try {
      const {
        result: [rowsExistsCustomer],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "cli_listarC",
        parameters: {
          in: [cliente_id],
        },
      });

      if (!rowsExistsCustomer || rowsExistsCustomer.length === 0) {
        return handleResponse(null, "Cliente no encontrado", false, 404);
      }

      const {
        codigo,
        codigo_sap,
        ruc_dni,
        nombre,
        nombre2,
        direccion,
        procedencia,
        tipo,
        telefono,
        email,
        pais,
        departamento,
        provincia,
        distrito,
        estado,
        eliminado,
        fecha_actualizacion,
        cliengo_id,
        ejecutivo_id,
        canal_distribucion,
        moneda_id,
        tipo_identificador_fiscal,
        ramo,
        sociedad,
        condicion_pago,
        clase_impuesto,
        codigo_postal,
        concepto_busqueda,
        tratamiento,
        sujeto_iva,
      } = data;

      if (
        !ruc_dni ||
        !identificationRegex[tipo_identificador_fiscal].test(ruc_dni)
      ) {
        return handleResponse(
          null,
          `El Identificador fiscal ${ruc_dni} no es válido. ${identificationRegexErrorMessage[tipo_identificador_fiscal]}`,
          false,
          400,
        );
      }

      await executeStoredProcedure({
        pool: db_pool,
        sp_name: "cli_editar",
        parameters: {
          in: [
            cliente_id,
            codigo,
            ruc_dni,
            nombre,
            nombre2,
            direccion,
            ejecutivo_id,
            procedencia,
            cliengo_id,
            tipo,
            telefono,
            email,
            pais,
            departamento,
            provincia,
            distrito,
            estado,
            eliminado,
            canal_distribucion,
            moneda_id,
            tipo_identificador_fiscal,
            ramo,
            sociedad,
            condicion_pago,
            clase_impuesto,
            codigo_postal,
            concepto_busqueda,
            tratamiento,
            Number(sujeto_iva),
            user_id,
          ],
        },
      });

      return handleResponse(null, "Cliente editado exitosamente");
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  delete: async (user_id, cliente_id) => {
    try {
      const {
        result: [rowsExistsCustomer],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "cli_listarC",
        parameters: {
          in: [cliente_id],
        },
      });

      if (!rowsExistsCustomer || rowsExistsCustomer.length === 0) {
        return handleResponse(null, "Cliente no encontrado", false, 404);
      }

      await executeStoredProcedure({
        pool: db_pool,
        sp_name: "cli_ocultar",
        parameters: {
          in: [cliente_id, user_id],
        },
      });

      return handleResponse(null, "Cliente eliminado exitosamente");
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  getContactsDenomination: async () => {
    try {
      const {
        result: [rows],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "contacto_denominacion_listarC",
        parameters: {
          in: [0],
        },
      });

      return handleResponse(
        rows,
        "Denominaciones de contactos consultadas con exito",
      );
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  getContactsDeparments: async () => {
    try {
      const {
        result: [rows],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "contacto_departamento_listarC",
        parameters: {
          in: [0],
        },
      });

      return handleResponse(
        rows,
        "Departamentos de contactos consultados con exito",
      );
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
};

export default CustomerModel;
