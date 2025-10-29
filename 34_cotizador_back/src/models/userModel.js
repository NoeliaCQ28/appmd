import { executeStoredProcedure } from "#libs/dbUtils.js";
import { logger } from "#libs/logger.js";
import db_pool from "../config/db.js";
import { handlerBitacora } from "../helpers/handlerBitacora.js";
import { handleResponse } from "../helpers/handlerResponse.js";
import { comparePassword, hashPassword } from "../libs/bcrypt.js";
import { generateToken } from "../libs/jwt.js";
import AuditModel, { AuditActions } from "./AuditModel.js";

export const uselogin = async (ctx, email, password) => {
  try {
    const [rows] = await db_pool.query(
      `SELECT 
          U.Usuario_Id as id,
          U.sUsuNombre as name,
          U.sUsuLogin as email,
          U.sUsuContrasena as password,
          R.sNombre as role,
          IF(R.sNombre = 'Administrador', 1, 0) as isAdmin
        FROM usuario U 
        INNER JOIN roles R ON U.nRolId = R.RolId
        WHERE U.sUsuLogin = "${email}" AND U.nUsuEstado = 1
      `,
    );

    if (rows[0]) {
      const compare = await comparePassword(password, rows[0].password);
      const payload = {
        id: rows[0].id,
        name: rows[0].name,
        email: rows[0].email,
        role: rows[0].role,
        isAdmin: rows[0].isAdmin === 1,
      };

      if (compare) {
        const token = generateToken(payload);

        await AuditModel.log({
          ctx: {
            ...ctx,
            user: {
              ...ctx.user,
              id: payload.id,
              name: payload.name,
              email: payload.email,
            },
          },
          action: AuditActions.LOGIN,
          entity: "usuario",
          entityId: payload.id,
          humanDescription: `Usuario ${payload.name} ha iniciado sesión`,
        });

        return handleResponse(token, "Inicio de sesión exitoso");
      } else {
        await AuditModel.log({
          ctx: ctx,
          action: AuditActions.LOGIN,
          entity: "usuario",
          entityId: ctx.user.id,
          humanDescription: `Usuario ${payload.name} ha intentado iniciar sesión, pero la contraseña es incorrecta`,
          success: false,
          error: "Contraseña incorrecta",
        });

        return handleResponse(null, "Contraseña incorrecta", false, 400);
      }
    } else {
      return handleResponse(null, "Usuario no encontrado", false, 404);
    }
  } catch (error) {
    const { message } = error;
    return handleResponse(null, message, false, 500);
  }
};

export const useRegister = async (ctx, data) => {
  try {
    const {
      sUsuNombre,
      sUsuLogin,
      sUsuContrasena,
      nUsuUsuario_Own = 0,
      nRolId,
    } = data;

    if (!sUsuNombre) {
      return handleResponse(null, "El nombre es requerido", false, 400);
    }
    if (!sUsuLogin) {
      return handleResponse(null, "El correo es requerido", false, 400);
    }
    if (!sUsuContrasena) {
      return handleResponse(null, "La contraseña es requerida", false, 400);
    }

    const hashedPassword = await hashPassword(sUsuContrasena);

    const [rows] = await db_pool.query(
      `INSERT INTO usuario (sUsuNombre, sUsuLogin, sUsuContrasena, nUsuUsuario_Own, nRolId) VALUES ('${sUsuNombre}', '${sUsuLogin}', '${hashedPassword}', '${nUsuUsuario_Own}', ${nRolId})`,
    );

    await AuditModel.log({
      ctx: ctx,
      action: AuditActions.CREATE,
      entity: "usuario",
      humanDescription: `Usuario ${sUsuNombre} ha sido registrado exitosamente por el usuario ${ctx.user.name}`,
      newData: { sUsuNombre, sUsuLogin, nRolId },
    });

    return handleResponse(rows, "Usuario registrado");
  } catch (error) {
    const { message } = error;
    return handleResponse(null, message, false, 500);
  }
};

export const useEditUser = async (userId, data) => {
  try {
    const {
      sUsuNombre,
      sUsuLogin,
      user_own = 0,
      sUsuContrasena,
      sUsuContrasenaConfirmacion,
      nRolId,
    } = data;

    if (!userId) {
      return handleResponse(null, "El usuario es requerido", false, 400);
    }

    if (!sUsuNombre) {
      return handleResponse(null, "El nombre es requerido", false, 400);
    }
    if (!sUsuLogin) {
      return handleResponse(null, "El correo es requerido", false, 400);
    }

    let passwordToUse;
    if (sUsuContrasena) {
      // New password provided -> hash and use it
      if (sUsuContrasenaConfirmacion !== sUsuContrasena) {
        return handleResponse(null, "Las contraseñas no coinciden", false, 400);
      }

      passwordToUse = await hashPassword(sUsuContrasena);
    } else {
      // No new password -> retain existing one from DB
      const [passRows] = await db_pool.query(
        "SELECT sUsuContrasena FROM usuario WHERE Usuario_Id = ?",
        [userId],
      );
      if (!passRows[0]) {
        return handleResponse(null, "Usuario no encontrado", false, 404);
      }
      passwordToUse = passRows[0].sUsuContrasena; // keep current (already hashed)
    }

    await executeStoredProcedure({
      pool: db_pool,
      sp_name: "usu_editar",
      parameters: {
        in: [
          Number.parseInt(userId),
          Number.parseInt(nRolId),
          sUsuNombre,
          passwordToUse,
          sUsuLogin,
        ],
      },
    });

    return handleResponse(null, "Usuario editado con exito");
  } catch (error) {
    const { message } = error;
    return handleResponse(null, message, false, 500);
  }
};

export const useLogout = async (ctx, req) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      await handlerBitacora(req, token, 2);

      await AuditModel.log({
        ctx: ctx,
        action: AuditActions.LOGOUT,
        entity: "usuario",
        entityId: ctx.user.id,
        humanDescription: `Usuario ${ctx.user.name} ha cerrado sesión`,
      });

      return handleResponse(null, "Cierre de sesión exitoso");
    } else {
      return handleResponse(null, "Fallo al cerrar sesión", false, 500);
    }
  } catch (error) {
    logger.error("Error al cerrar sesión", {
      error: error.message,
      stack: error.stack,
    });
    return handleResponse(null, "Error interno", false, 500);
  }
};

export const allUsers = async () => {
  try {
    const {
      result: [rows],
    } = await executeStoredProcedure({
      pool: db_pool,
      sp_name: "usu_listarC",
      parameters: {
        in: [0],
      },
    });

    return handleResponse(rows, "Listado de usuarios exitoso");
  } catch (error) {
    const { message } = error;
    return handleResponse(null, message, false, 500);
  }
};
