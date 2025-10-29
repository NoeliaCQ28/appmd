import { handlerBitacora } from "../helpers/handlerBitacora.js";
import {
  useEditUser,
  uselogin,
  useLogout,
  useRegister,
} from "../models/userModel.js";

export const login = async (req, res) => {
  // #swagger.tags = ['Auth', 'Completado', 'v1']
  // #swagger.summary = 'Iniciar sesión'
  // #swagger.description = 'Autentica un usuario con email y contraseña, retorna un token JWT'
  /*  #swagger.requestBody = {
            required: true,
            schema: { $ref: "#/components/schemas/AuthLoginRequest" }
        } 
    */
  /* #swagger.responses[200] = {
            description: 'Usuario autenticado exitosamente',
            schema: { $ref: '#/components/schemas/SuccessResponse' }
    } */
  const { email, password } = req.body;

  const response = await uselogin(req.ctx, email, password);

  if (response.success) {
    await handlerBitacora(req, response.data, 1);
  }

  res.status(response.code).send(response);
};

export const user = async (req, res) => {
  // #swagger.tags = ['Auth', 'Completado', 'v1']
  // #swagger.summary = 'Obtener datos del usuario autenticado'
  // #swagger.description = 'Retorna los datos del usuario autenticado mediante el token JWT'
  /* #swagger.responses[200] = {
            description: 'Datos del usuario autenticado',
            schema: { $ref: '#/components/schemas/CurrentUserResponse' }
    } */
  /* #swagger.responses[400] = {
            description: 'Error en la solicitud',
            schema: { $ref: '#/components/schemas/Error' }
  } */
  return res.json(req.user);
};

export const register = async (req, res) => {
  // #swagger.tags = ['Auth', 'Completado', 'v1']
  // #swagger.summary = 'Registrar nuevo usuario'
  // #swagger.description = 'Registra un nuevo usuario con los datos proporcionados'
  /*  #swagger.requestBody = {
            required: true,
            schema: { $ref: "#/components/schemas/RegisterUserRequest" }
        } 
    */
  /* #swagger.responses[200] = {
            description: 'Usuario registrado exitosamente',
            schema: { $ref: '#/components/schemas/SuccessResponse' }
    } */
  /* #swagger.responses[400] = {
            description: 'Error en la solicitud',
            schema: { $ref: '#/components/schemas/Error' }
  } */
  const response = await useRegister(req.ctx, req.body);

  res.status(response.code).send(response);
};

export const editUser = async (req, res) => {
  // #swagger.tags = ['Auth', 'En curso', 'v1']
  // #swagger.summary = 'Editar usuario'
  // #swagger.description = 'Edita los datos de un usuario existente por su ID'
  // #swagger.parameters['id'] = { description: 'ID del usuario a editar' }
  const { id } = req.params;

  const response = await useEditUser(id, req.body);

  res.status(response.code).send(response);
};

export const logout = async (req, res) => {
  // #swagger.tags = ['Auth', 'En curso', 'v1']
  // #swagger.summary = 'Cerrar sesión'
  // #swagger.description = 'Cierra la sesión del usuario actual'
  const response = await useLogout(req.ctx, req);

  res.status(response.code).send(response);
};
