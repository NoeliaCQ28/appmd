import { TechnicalReportModel } from "../models/fichasTecnicasModel.js";

const TechnicalReportController = {
  search: async (req, res) => {
    const response = await TechnicalReportModel.search(req.body);
    res.status(response.code).send(response);
  },
  getByCombinationId: async (req, res) => {
    const { id } = req.params;
    const { altura, temperatura, alternatorSwapped, alternatorSwappedId } =
      req.query;

    const response = await TechnicalReportModel.getByCombinationId(
      id,
      altura,
      temperatura,
      alternatorSwapped === "true",
      Number.parseInt(alternatorSwappedId),
    );
    res.status(response.code).send(response);
  },
};

export default TechnicalReportController;
