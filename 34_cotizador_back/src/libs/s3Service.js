import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { logger } from "#libs/logger.js";

const isProduction = process.env.NODE_ENV === "production";

const internalEndpoint = `${process.env.AWS_S3_ENDPOINT}:${process.env.AWS_S3_PORT}`;

const publicEndpoint = process.env.AWS_S3_PUBLIC_ENDPOINT || internalEndpoint;

const s3Client = new S3Client({
  endpoint: internalEndpoint,
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true, // Force path-style URLs (true for MinIO)
});

const bucketName = process.env.AWS_S3_BUCKET_NAME;

export const S3 = {
  /**
   * Upload a file to S3.
   * @param {string} key Pathname of the file.
   * @param {Buffer} fileBuffer File buffer.
   * @param {string} contentType File MIME type.
   * @returns {Promise<string>} URL of the uploaded object.
   */
  uploadFile: async (fileName, fileBuffer, mimetype) => {
    try {
      logger.info(`[S3] Iniciando uploadFile - fileName: ${fileName}, mimetype: ${mimetype}, bufferSize: ${fileBuffer?.length || 0} bytes`);

      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        Body: fileBuffer,
        ContentType: mimetype,
      });

      logger.info(`[S3] Enviando comando PutObject al bucket: ${bucketName}`);
      await s3Client.send(command);

      logger.info(`[S3] Archivo subido exitosamente: ${fileName}`);
      return fileName;
    } catch (error) {
      logger.error(`[S3] Error al subir archivo - fileName: ${fileName}, error: ${error.message}`, {
        code: error.Code,
        statusCode: error.$metadata?.httpStatusCode,
        requestId: error.$metadata?.requestId,
      });
      throw new Error(`Error al subir archivo a S3: ${error.message}`);
    }
  },
  /**
   * Delete a file from S3.
   * @param {string} fileName Filename to delete.
   * @returns {Promise<void>}
   */
  deleteFile: async (fileName) => {
    try {
      logger.info(`[S3] Iniciando deleteFile - fileName: ${fileName}`);

      const commandForCheckIfExistsFile = new HeadObjectCommand({
        Bucket: bucketName,
        Key: fileName,
      });

      logger.info(`[S3] Verificando existencia del archivo: ${fileName}`);
      await s3Client.send(commandForCheckIfExistsFile);

      const command = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: fileName,
      });

      logger.info(`[S3] Eliminando archivo: ${fileName}`);
      await s3Client.send(command);

      logger.info(`[S3] Archivo eliminado exitosamente: ${fileName}`);
    } catch (error) {
      if (error.$metadata && error.$metadata.httpStatusCode === 404) {
        logger.info(`[S3] Archivo no encontrado para eliminar: ${fileName}`);
        return null; // File does not exist
      }

      logger.error(`[S3] Error al eliminar archivo - fileName: ${fileName}, error: ${error.message}`, {
        code: error.Code,
        statusCode: error.$metadata?.httpStatusCode,
        requestId: error.$metadata?.requestId,
      });
      throw new Error(`Error al eliminar archivo de S3: ${error.message}`);
    }
  },
  /**
   * Obtains the URL of a file in S3.
   * @param {string} fileName Filename to check.
   * @returns {Promise<string|null>} File URL or null if it doesn't exist.
   */
  getFileUrl: async (fileName) => {
    try {
      logger.info(`[S3] Iniciando getFileUrl - fileName: ${fileName}, isProduction: ${isProduction}`);

      const command = new HeadObjectCommand({
        Bucket: bucketName,
        Key: fileName,
      });

      logger.info(`[S3] Verificando existencia del archivo en bucket: ${bucketName}`);
      await s3Client.send(command);

      // Usar el endpoint público para las URLs
      const fileUrl = `${publicEndpoint}/${bucketName}/${fileName}`;
      logger.info(`[S3] URL generada exitosamente: ${fileUrl}`);

      return fileUrl;
    } catch (error) {
      if (error.$metadata && error.$metadata.httpStatusCode === 404) {
        logger.info(`[S3] Archivo no encontrado: ${fileName}`);
        return null; // File does not exist
      }

      logger.error(`[S3] Error al verificar existencia del archivo - fileName: ${fileName}, error: ${error.message}`, {
        code: error.Code,
        statusCode: error.$metadata?.httpStatusCode,
        requestId: error.$metadata?.requestId,
      });
      throw new Error(
        `Error al verificar la existencia del archivo: ${error.message}`
      );
    }
  },

  /**
   * Obtiene el buffer de un archivo de S3.
   * @param {string} fileName Nombre del archivo.
   * @returns {Promise<Buffer|null>} Buffer del archivo o null si no existe.
   * @throws {Error} Si hay un error al obtener el buffer del archivo.
   */
  getBuffer: async (fileName) => {
    try {
      logger.info(`[S3] Iniciando getBuffer - fileName: ${fileName}`);

      const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: fileName,
      });

      logger.info(`[S3] Obteniendo buffer del archivo desde bucket: ${bucketName}`);
      const { Body } = await s3Client.send(command);

      logger.info(`[S3] Buffer obtenido exitosamente para: ${fileName}`);
      return Body;
    } catch (error) {
      logger.error(`[S3] Error al obtener buffer del archivo - fileName: ${fileName}, error: ${error.message}`, {
        code: error.Code,
        statusCode: error.$metadata?.httpStatusCode,
        requestId: error.$metadata?.requestId,
      });
      throw new Error(
        `Error al obtener el buffer del archivo: ${error.message}`
      );
    }
  },
};
