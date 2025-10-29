import { logger } from "#libs/logger.js";
import SettingsModel from "#models/v2/config/SettingsModel.js";

const SettingsController = {
  getPreferences: async (req, res) => {
    const user_id = req.user.id;

    logger.info(`User ${user_id} requested all preferences`);

    const response = await SettingsModel.getPreferences();

    return res.status(response.code).json(response);
  },
  createPreference: async (req, res) => {
    const data = req.body;

    logger.info(`User ${req.user.id} is creating a preference`);

    const response = await SettingsModel.createPreference(data);

    return res.status(response.code).json(response);
  },
  updatePreference: async (req, res) => {
    const data = req.body;

    const key = req.params.key;

    logger.info(`User ${req.user.id} is updating a preference`);

    const response = await SettingsModel.updatePreference({ ...data, key });

    return res.status(response.code).json(response);
  },
  deletePreference: async (req, res) => {
    const key = req.params.key;

    logger.info(`User ${req.user.id} is deleting a preference`);

    const response = await SettingsModel.deletePreference({ key });

    return res.status(response.code).json(response);
  },
};

export default SettingsController;
