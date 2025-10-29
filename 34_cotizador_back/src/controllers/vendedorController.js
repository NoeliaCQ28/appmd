import {
  useDelete,
  useEdit,
  useList,
  useRegister,
  useSyncERP,
} from "../models/vendedoresModel.js";

export const listVendedor = async (req, res) => {
  const response = await useList();
  res.status(response.code).send(response);
};

export const registerVendedor = async (req, res) => {
  const user_id = req.user.id;
  const data = req.body;

  const response = await useRegister(user_id, data);
  res.status(response.code).send(response);
};

export const editVendedor = async (req, res) => {
  const { id } = req.params;

  const user_id = req.user.id;
  const data = req.body;

  const response = await useEdit(id, user_id, data);
  res.status(response.code).send(response);
};

export const deleteVendedor = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;

  const response = await useDelete(id, user_id);
  res.status(response.code).send(response);
};

export const syncERPVendedores = async (req, res) => {
  const response = await useSyncERP();
  res.status(response.code).send(response);
};
