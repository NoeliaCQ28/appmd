import db_pool from "../config/db.js";
import { handleResponse } from "../helpers/handlerResponse.js";

export const registerBitacora = async (data) => {
  try {
    const { user_id, access_type, ip, device } = data;

    const [rows] = await db_pool.query(
      `INSERT INTO bitacora (Usuario_Id, nBitTipoAcceso, sBitIpAcceso, sBitDispositivo) 
                VALUES ('${user_id}', '${access_type}', '${ip}', '${device}')`,
    );

    return handleResponse(rows, "Registro exitoso - bitacora");
  } catch (error) {
    const { message } = error;
    return handleResponse(null, message, false, 500);
  }
};
