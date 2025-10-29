import UploadModel from "#models/uploadModel.js";

const UploadController = {
  uploadFile: async (req, res) => {
    const file = req.file;

    const { folder } = req.body;

    const response = await UploadModel.uploadFile({
      file,
      folder,
    });

    res.status(response.code).send(response);
  },
  getFileUrl: async (req, res) => {
    const { fileName } = req.body;

    const response = await UploadModel.getFileUrl({ fileName });

    res.status(response.code).send(response);
  },
  deleteFile: async (req, res) => {
    const { fileName } = req.body;

    const response = await UploadModel.deleteFile({ fileName });

    res.status(response.code).send(response);
  },
  getBuffer: async (req, res) => {
    const { fileName } = req.body;

    const response = await UploadModel.getBuffer({ fileName });

    res.status(response.code).send(response);
  },
};

export default UploadController;
