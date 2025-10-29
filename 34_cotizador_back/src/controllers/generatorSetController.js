import GeneratorSetModel from "#models/generatorSetModel.js";
const GeneratorSetController = {
  create: async (req, res) => {
    const user_id = req.user.id;
    const data = req.body;

    const response = await GeneratorSetModel.create(user_id, data);
    res.status(response.code).send(response);
  },
  getParams: async (req, res) => {
    const response = await GeneratorSetModel.getParams();
    res.status(response.code).send(response);
  },
  getModelsByParams: async (req, res) => {
    const {
      modelo,
      voltaje,
      frecuencia,
      fases,
      factorPotencia,
      altura,
      temperatura,
      insonoro,
      powerThreshold,
      primePower,
      standbyPower,
      marketId,
    } = req.body;

    const response = await GeneratorSetModel.getModelsByParams({
      modelo,
      voltaje,
      frecuencia,
      fases,
      factorPotencia,
      altura,
      temperatura,
      insonoro,
      powerThreshold: Number(powerThreshold),
      primePower,
      standbyPower,
      marketId,
    });

    res.status(response.code).send(response);
  },
  searchModels: async (req, res) => {
    const params = req.query;

    const response = await GeneratorSetModel.searchModels({ params });
    res.status(response.code).send(response);
  },
  getModels: async (req, res) => {
    const response = await GeneratorSetModel.getModels();
    res.status(response.code).send(response);
  },
  getMotorBrands: async (req, res) => {
    const response = await GeneratorSetModel.getMotorBrands();
    res.status(response.code).send(response);
  },
  getMotorModels: async (req, res) => {
    const response = await GeneratorSetModel.getMotorModels();
    res.status(response.code).send(response);
  },
  getAlternatorBrands: async (req, res) => {
    const response = await GeneratorSetModel.getAlternatorBrands();
    res.status(response.code).send(response);
  },
  getAlternatorModels: async (req, res) => {
    const response = await GeneratorSetModel.getAlternatorModels();
    res.status(response.code).send(response);
  },
  getVoltages: async (req, res) => {
    const response = await GeneratorSetModel.getVoltages();
    res.status(response.code).send(response);
  },
  getFrequencies: async (req, res) => {
    const response = await GeneratorSetModel.getFrequencies();
    res.status(response.code).send(response);
  },
  getPhases: async (req, res) => {
    const response = await GeneratorSetModel.getPhases();
    res.status(response.code).send(response);
  },
  getPowerFactors: async (req, res) => {
    const response = await GeneratorSetModel.getPowerFactors();
    res.status(response.code).send(response);
  },
  getAltitudes: async (req, res) => {
    const response = await GeneratorSetModel.getAltitudes();
    res.status(response.code).send(response);
  },
  getITMs: async (req, res) => {
    const response = await GeneratorSetModel.getITMs();
    res.status(response.code).send(response);
  },
  getMarkets: async (req, res) => {
    const response = await GeneratorSetModel.getMarkets();
    res.status(response.code).send(response);
  },
  getMotorInfo: async (req, res) => {
    const { motor_modelo } = req.params;

    const response = await GeneratorSetModel.getMotorInfo({
      motorModelo: motor_modelo,
    });
    res.status(response.code).send(response);
  },
  getAlternatorInfo: async (req, res) => {
    const { alternador_modelo } = req.params;

    const response = await GeneratorSetModel.getAlternatorInfo({
      alternadorModelo: alternador_modelo,
    });
    res.status(response.code).send(response);
  },
  getModeloInfo: async (req, res) => {
    const { modelo } = req.params;

    const response = await GeneratorSetModel.getModeloInfo({ modelo });
    res.status(response.code).send(response);
  },
  getModelPrices: async (req, res) => {
    const {
      modeloge_id,
      motor_id,
      alternador_id,
      voltaje,
      frecuencia,
      fases,
      factor_potencia,
      market_id,
    } = req.query;

    const response = await GeneratorSetModel.getModelPrices({
      modeloge_id,
      motor_id,
      alternador_id,
      voltaje,
      frecuencia,
      fases,
      factor_potencia,
      market_id,
    });
    res.status(response.code).send(response);
  },

  updateMotorInformation: async (req, res) => {
    const user_id = req.user.id;
    const data = req.body;

    const response = await GeneratorSetModel.updateMotorInfo(user_id, data);
    res.status(response.code).send(response);
  },

  updatePowerMotorInformation: async (req, res) => {
    const user_id = req.user.id;
    const data = req.body;

    const response = await GeneratorSetModel.updatePowerMotorInfo(
      user_id,
      data
    );
    res.status(response.code).send(response);
  },

  createPowerMotorInformation: async (req, res) => {
    const user_id = req.user.id;
    const data = req.body;

    const response = await GeneratorSetModel.createPowerMotorInfo(
      user_id,
      data
    );
    res.status(response.code).send(response);
  },

  createPowerAlternatorInformation: async (req, res) => {
    const user_id = req.user.id;
    const data = req.body;

    const response = await GeneratorSetModel.createPowerAlternatorInfo(
      user_id,
      data
    );
    res.status(response.code).send(response);
  },

  updateAlternadorInformation: async (req, res) => {
    const user_id = req.user.id;
    const data = req.body;

    const response = await GeneratorSetModel.updateAlternadorInfo(
      user_id,
      data
    );
    res.status(response.code).send(response);
  },

  updatePowerAlternatorInformation: async (req, res) => {
    const user_id = req.user.id;
    const data = req.body;

    const response = await GeneratorSetModel.updatePowerAlternatorInfo(
      user_id,
      data
    );
    res.status(response.code).send(response);
  },

  updateModeloInformation: async (req, res) => {
    const user_id = req.user.id;
    const data = req.body;

    const response = await GeneratorSetModel.updateModeloInfo(user_id, data);
    res.status(response.code).send(response);
  },

  updateModelImages: async (req, res) => {
    try {
      const user_id = req.body.user_id || req.user?.id;
      const data = req.body;

      if (!user_id) {
        console.error("Error: User ID no proporcionado o no autorizado", {
          body: req.body,
          user: req.user,
        });
        return res.status(401).json({
          success: false,
          message: "User ID no proporcionado o no autorizado",
        });
      }

      const result = await GeneratorSetModel.updateModelImages(user_id, data);

      return res.status(result.status || 200).json(result);
    } catch (error) {
      console.error("Error en GeneratorSetController.updateModelImages:", {
        message: error.message,
        stack: error.stack,
        requestBody: req.body,
        requestHeaders: req.headers,
        user: req.user,
      });
      return res.status(500).json({
        success: false,
        message: "Error del servidor: " + error.message,
      });
    }
  },

  updateModelPricesInformation: async (req, res) => {
    const user_id = req.user.id;
    const data = req.body;

    const response = await GeneratorSetModel.updateModelPricesInfo(data);
    res.status(response.code).send(response);
  },

  createMotorInformation: async (req, res) => {
    const user_id = req.user.id;
    const data = req.body;

    const response = await GeneratorSetModel.createMotorInfo(user_id, data);
    res.status(response.code).send(response);
  },

  createAlternadorInformation: async (req, res) => {
    const user_id = req.user.id;
    const data = req.body;

    const response = await GeneratorSetModel.createAlternadorInfo(
      user_id,
      data
    );
    res.status(response.code).send(response);
  },
  createIntegradora: async (req, res) => {
    const user_id = req.user.id;
    const data = req.body;

    const response = await GeneratorSetModel.createIntegradora(user_id, data);
    res.status(response.code).send(response);
  },
  updateIntegradora: async (req, res) => {
    const user_id = req.user.id;
    const data = req.body;

    const { id } = req.params;

    const response = await GeneratorSetModel.updateIntegradora(
      user_id,
      id,
      data
    );
    res.status(response.code).send(response);
  },
  deleteModelAndIntegradora: async (req, res) => {
    const user_id = req.user.id; // Corregimos req.user_id a req.user.id
    const { modelo: modelo_id } = req.params;

    const response = await GeneratorSetModel.deleteModelAndIntegradora(
      user_id,
      modelo_id
    );
    res.status(response.code).send(response);
  },
};

export default GeneratorSetController;
