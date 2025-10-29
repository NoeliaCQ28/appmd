import { DataImportModel } from "./DataImportModel";

const DataImportController = {
  async import(req, res) {
    const { transformName } = req.query;
    const file = req.file;
    const { sheetName, upsertMode } = req.body;

    const response = await DataImportModel.import({
      transformName,
      file,
      sheetName,
      upsertMode,
    });

    res.status(response.code).send(response);
  },
};

export default DataImportController;
