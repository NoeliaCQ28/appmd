import { logger } from "#libs/logger.js";
import GeneratorSetModel from "#models/v2/GeneratorSetModel.js";

const GeneratorSetController = {
  getAllITMs: async (req, res) => {
    const user_id = req.user.id;

    logger.info(`User ${user_id} requested all interruptors`);

    const response = await GeneratorSetModel.getAllITMs();

    return res.status(response.code).json(response);
  },

  getAllITMsByCombination: async (req, res) => {
    const user_id = req.user.id;

    const { integradoraId } = req.params;

    logger.info(`User ${user_id} requested all interruptors by combination`);

    const response = await GeneratorSetModel.getAllITMsByCombination({
      integradoraId,
    });

    return res.status(response.code).json(response);
  },

  getITMById: async (req, res) => {
    const user_id = req.user.id;
    const { id } = req.params;

    logger.info(`User ${user_id} requested interruptor with ID: ${id}`);

    const response = await GeneratorSetModel.getITMById(id);

    return res.status(response.code).json(response);
  },
  getAllAlternators: async (req, res) => {
    const user_id = req.user.id;

    logger.info(`User ${user_id} requested all alternators`);

    const response = await GeneratorSetModel.getAllAlternators();

    return res.status(response.code).json(response);
  },

  getAllAlternatorsByCombination: async (req, res) => {
    const user_id = req.user.id;

    const { integradoraId } = req.params;

    logger.info(`User ${user_id} requested all alternators by combination`);

    const response = await GeneratorSetModel.getAllAlternatorsByCombination({
      integradoraId,
    });

    return res.status(response.code).json(response);
  },

  getAlternatorById: async (req, res) => {
    const user_id = req.user.id;
    const { id } = req.params;

    logger.info(`User ${user_id} requested alternator with ID: ${id}`);

    const response = await GeneratorSetModel.getAlternatorById(id);

    return res.status(response.code).json(response);
  },

  getAllCombinations: async (req, res) => {
    const user_id = req.user.id;
    const params = req.body;

    logger.info(`User ${user_id} initiated search with params`, { params });

    const response = await GeneratorSetModel.getAllCombinations(params);

    return res.status(response.code).json(response);
  },
  getCombinationByIntegradora: async (req, res) => {
    const user_id = req.user.id;
    const body = req.body;
    const { params, integradoraId } = body;

    logger.info(`User ${user_id} requested combinations for integradora`, {
      params,
      integradoraId,
    });

    const response = await GeneratorSetModel.getCombinationByIntegradora(
      params,
      integradoraId,
    );

    return res.status(response.code).json(response);
  },
  changeConfiguration: async (req, res) => {
    const user_id = req.user.id;
    const body = req.body;
    const { params, integradoraId, configuration } = body;

    logger.info(`User ${user_id} requested combinations for integradora`, {
      params,
      integradoraId,
      configuration,
    });

    const response = await GeneratorSetModel.changeConfiguration(
      params,
      integradoraId,
      configuration,
    );

    return res.status(response.code).json(response);
  },
};

export default GeneratorSetController;
