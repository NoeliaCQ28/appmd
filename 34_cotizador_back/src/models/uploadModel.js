import { handleResponse } from "#helpers/handlerResponse.js";
import { S3 } from "#libs/s3Service.js";
import { sanitizeFilename } from "#libs/utils.js";

const UploadModel = {
  uploadFile: async ({ file, folder = "" }) => {
    try {
      if (!file) {
        return handleResponse(
          null,
          "No se ha subido ningun archivo",
          false,
          400
        );
      }

      const originalFilename = file.originalname;
      const sanitizedFilename = sanitizeFilename(originalFilename);
      const fileName = `${folder}/${Date.now()}_${sanitizedFilename}`;

      const fileUrl = await S3.uploadFile(fileName, file.buffer, file.mimetype);

      return handleResponse(fileUrl, "Archivo subido correctamente");
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  getFileUrl: async ({ fileName }) => {
    try {
      const fileUrl = await S3.getFileUrl(fileName);

      if (!fileUrl || fileUrl === null) {
        return handleResponse(null, "El archivo no existe", false, 404);
      }

      return handleResponse(fileUrl, "Archivo obtenido correctamente");
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  deleteFile: async ({ fileName }) => {
    try {
      const file = await S3.deleteFile(fileName);

      if (!file || file === null) {
        return handleResponse(
          null,
          "El archivo no existe, por lo tanto no se puede eliminar",
          false,
          404
        );
      }

      return handleResponse(null, "Archivo eliminado correctamente");
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  getBuffer: async ({ fileName }) => {
    try {
      const result = await S3.getBuffer(fileName);

      // Handle various response types (stream, buffer, S3 response)
      let buffer;
      if (result && typeof result.pipe === "function") {
        // It's a stream, convert to buffer
        buffer = await new Promise((resolve, reject) => {
          const chunks = [];
          result.on("data", (chunk) => chunks.push(chunk));
          result.on("end", () => resolve(Buffer.concat(chunks)));
          result.on("error", reject);
        });
      } else if (
        result &&
        result.Body &&
        typeof result.Body.pipe === "function"
      ) {
        // AWS S3 response with stream in Body property
        buffer = await new Promise((resolve, reject) => {
          const chunks = [];
          result.Body.on("data", (chunk) => chunks.push(chunk));
          result.Body.on("end", () => resolve(Buffer.concat(chunks)));
          result.Body.on("error", reject);
        });
      } else if (Buffer.isBuffer(result)) {
        // Already a buffer
        buffer = result;
      } else if (result && result.Body && Buffer.isBuffer(result.Body)) {
        // AWS S3 response with buffer in Body property
        buffer = result.Body;
      } else {
        // Not a recognizable format
        return handleResponse(
          { data: "Unsupported data format", isBase64: false },
          "Error processing buffer"
        );
      }

      // Convert buffer to base64 string
      const base64Data = buffer.toString("base64");

      return handleResponse(
        { data: base64Data, isBase64: true },
        "Buffer obtenido correctamente"
      );
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
};

export default UploadModel;
