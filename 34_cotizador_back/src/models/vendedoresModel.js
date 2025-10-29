import { ERP_PROXY_API } from "#libs/axios.js";
import { executeStoredProcedure } from "#libs/dbUtils.js";
import db_pool from "../config/db.js";
import { handleResponse } from "../helpers/handlerResponse.js";

export const useList = async () => {
  try {
    const [[rows]] = await db_pool.query(`CALL eje_listarC(0)`);
    return handleResponse(rows, "Datos obtenidos correctamente");
  } catch (error) {
    const { message } = error;
    return handleResponse(null, message, false, 500);
  }
};

export const useRegister = async (user_id, data) => {
  try {
    const {
      codigo,
      sap,
      nombre,
      telefono,
      correo,
      pais,
      departamento,
      provincia,
      estado,
      eliminado,
      usuario_asignado_id,
    } = data;

    const [[rows]] = await db_pool.query(
      `CALL eje_crear(?,?,?,?,?,?,?,?,?,?,?,?,@ejecutivoId)`,
      [
        codigo,
        sap,
        nombre,
        telefono,
        correo,
        pais,
        departamento,
        provincia,
        estado,
        eliminado,
        user_id,
        usuario_asignado_id,
      ]
    );

    return handleResponse(rows, "Vendedor creado exitosamente");
  } catch (error) {
    const { message } = error;
    return handleResponse(null, message, false, 500);
  }
};

export const useEdit = async (id, user_id, data) => {
  try {
    const [existeEjecutivo] = await db_pool.query(
      `SELECT * FROM ejecutivo WHERE Ejecutivo_Id = ?`,
      [id]
    );

    if (!existeEjecutivo || existeEjecutivo.length === 0) {
      return handleResponse(null, "Vendedor no encontrado", false, 404);
    }

    const {
      codigo,
      sap,
      nombre,
      telefono,
      correo,
      pais,
      departamento,
      provincia,
      estado,
      eliminado = 0,
      usuario_asignado_id,
    } = data;

    const [rows] = await db_pool.query(
      `CALL eje_editar(?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        id,
        codigo,
        sap,
        nombre,
        telefono,
        correo,
        pais,
        departamento,
        provincia,
        estado,
        eliminado,
        user_id,
        usuario_asignado_id,
      ]
    );

    return handleResponse(rows, "Vendedor actualizado correctamente");
  } catch (error) {
    const { message } = error;
    return handleResponse(null, message, false, 500);
  }
};

export const useDelete = async (id, user_id) => {
  try {
    const [existeEjecutivo] = await db_pool.query(
      `SELECT * FROM ejecutivo WHERE Ejecutivo_Id = ?`,
      [id]
    );

    if (!existeEjecutivo || existeEjecutivo.length === 0) {
      return handleResponse(null, "Vendedor no encontrado", false, 404);
    }

    const [rows] = await db_pool.query(`CALL eje_ocultar(?,?)`, [id, user_id]);

    return handleResponse(rows, "Vendedor eliminado correctamente");
  } catch (error) {
    const { message } = error;
    return handleResponse(null, message, false, 500);
  }
};

export const useSyncERP = async () => {
  try {
    const ERPSellersResponse = await ERP_PROXY_API.get("/sellers")
      .then((response) => response.data)
      .catch((error) => {
        console.error(error);
        return [];
      });

    if (ERPSellersResponse.Output.length === 0) {
      return handleResponse(
        null,
        "No hay vendedores para sincronizar",
        false,
        500
      );
    }

    const sellers = ERPSellersResponse.Output.map((seller) => {
      return {
        sap_code: seller.Pernr,
        name: seller.Ename,
      };
    });

    for (const seller of sellers) {
      // Buscar por código SAP
      const {
        result: [rowsByCodigo],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "eje_buscar_por_codigo_ERP",
        parameters: {
          in: [seller.sap_code],
        },
      });

      // Si no existe por código, buscar por nombre
      if (rowsByCodigo.length === 0) {
        const [rowsByName] = await db_pool.query(
          `SELECT * FROM ejecutivo WHERE sEjeNombre = ? AND nEjeEliminado = 0`,
          [seller.name]
        );

        // Si existe con el mismo nombre pero diferente código SAP, actualizar el código
        if (rowsByName.length > 0) {
          const existingEjecutivo = rowsByName[0];
          await db_pool.query(
            `UPDATE ejecutivo SET sEjeSAP = ? WHERE Ejecutivo_Id = ?`,
            [seller.sap_code, existingEjecutivo.Ejecutivo_Id]
          );
          continue;
        }

        // Si no existe ni por código ni por nombre, crear nuevo
        await executeStoredProcedure({
          pool: db_pool,
          sp_name: "eje_crear_desde_ERP",
          parameters: {
            in: [seller.sap_code, seller.name],
          },
        });
      }
    }

    return handleResponse(null, "Vendedores sincronizados correctamente");
  } catch (error) {
    const { message } = error;
    return handleResponse(null, message, false, 500);
  }
};
