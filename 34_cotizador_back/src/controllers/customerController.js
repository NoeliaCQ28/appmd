import CustomerModel from "../models/customerModel.js";

const CustomerController = {
  getAll: async (req, res) => {
    const response = await CustomerModel.getAll();
    res.status(response.code).send(response);
  },
  getContactsByCustomerId: async (req, res) => {
    const { id } = req.params;
    const response = await CustomerModel.getContactsByCustomerId(id);
    res.status(response.code).send(response);
  },
  getFromERPByRuc: async (req, res) => {
    const { ruc } = req.params;
    const response = await CustomerModel.getFromERPByRuc(ruc);
    res.status(response.code).send(response);
  },
  createContact: async (req, res) => {
    const user_id = req.user.id;
    const { id } = req.params;
    const data = req.body;

    const response = await CustomerModel.createContact(user_id, id, data);
    res.status(response.code).send(response);
  },
  deleteContact: async (req, res) => {
    const user_id = req.user.id;
    const { id, contact_id } = req.params;

    const response = await CustomerModel.deleteContact(user_id, id, contact_id);
    res.status(response.code).send(response);
  },
  updateContact: async (req, res) => {
    const user_id = req.user.id;
    const { id, contact_id } = req.params;

    const data = req.body;

    const response = await CustomerModel.updateContact(
      user_id,
      id,
      contact_id,
      data
    );
    res.status(response.code).send(response);
  },
  create: async (req, res) => {
    const data = req.body;

    const response = await CustomerModel.create(req.ctx, data);
    res.status(response.code).send(response);
  },
  update: async (req, res) => {
    const user_id = req.user.id;
    const { id } = req.params;
    const data = req.body;

    const response = await CustomerModel.update(user_id, id, data);
    res.status(response.code).send(response);
  },
  delete: async (req, res) => {
    const user_id = req.user.id;
    const { id } = req.params;

    const response = await CustomerModel.delete(user_id, id);
    res.status(response.code).send(response);
  },

  getContactsDenomination: async (req, res) => {
    const response = await CustomerModel.getContactsDenomination();
    res.status(response.code).send(response);
  },
  
  getContactsDeparments: async (req, res) => {
    const response = await CustomerModel.getContactsDeparments();
    res.status(response.code).send(response);
  },
};

export default CustomerController;
