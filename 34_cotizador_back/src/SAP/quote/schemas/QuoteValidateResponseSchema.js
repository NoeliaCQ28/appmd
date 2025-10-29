const { z } = require("zod");

// Esquema para un mensaje individual
const MessageItemSchema = z.object({
  MESSAGE: z.string(),
  TIPO: z.string(),
});

// Esquema para EX_TABLE_ERROR - T_MENSAJES puede ser array directamente o un objeto con item
const ExTableErrorSchema = z.object({
  VBELN: z.string(),
  T_MENSAJES: z.union([
    z.array(MessageItemSchema), // Si viene como array directo
    z.object({ item: z.array(MessageItemSchema) }), // Si viene como objeto con array de items
    z.object({ item: MessageItemSchema }), // Si viene como objeto con un solo item
  ]),
});

// Esquema para OUTPUT
const OutputSchema = z.object({
  VBELN: z.string(),
  T_MENSAJES: z.union([
    z.array(MessageItemSchema), // Si viene como array directo
    z.object({ item: z.array(MessageItemSchema) }), // Si viene como objeto con array de items
    z.object({ item: MessageItemSchema }), // Si viene como objeto con un solo item
  ]),
});

// Esquema principal para la respuesta completa de validación de cotización
export const QuoteValidateResponseSchema = z.object({
  EX_TABLE_ERROR: ExTableErrorSchema,
  OUTPUT: OutputSchema,
});

export const convertQuoteValidateResponse = (sapResponse) => {
  try {
    const validatedResponse = QuoteValidateResponseSchema.parse(sapResponse);

    const { EX_TABLE_ERROR, OUTPUT } = validatedResponse;

    const errorMessages = [];

    // Normalizar T_MENSAJES a array
    let exTableMessages = [];
    if (Array.isArray(EX_TABLE_ERROR.T_MENSAJES)) {
      exTableMessages = EX_TABLE_ERROR.T_MENSAJES;
    } else if (EX_TABLE_ERROR.T_MENSAJES.item) {
      // Si item es un array, úsalo; si es un objeto único, conviértelo en array
      exTableMessages = Array.isArray(EX_TABLE_ERROR.T_MENSAJES.item)
        ? EX_TABLE_ERROR.T_MENSAJES.item
        : [EX_TABLE_ERROR.T_MENSAJES.item];
    }

    if (exTableMessages.length > 0) {
      exTableMessages.forEach((message) => {
        if (message.MESSAGE && message.MESSAGE.trim() !== "") {
          errorMessages.push({
            message: message.MESSAGE,
            type: message.TIPO || "ERROR",
            source: "VALIDATION",
          });
        }
      });
    }

    // Normalizar T_MENSAJES de OUTPUT a array
    let outputMessages = [];
    if (Array.isArray(OUTPUT.T_MENSAJES)) {
      outputMessages = OUTPUT.T_MENSAJES;
    } else if (OUTPUT.T_MENSAJES.item) {
      // Si item es un array, úsalo; si es un objeto único, conviértelo en array
      outputMessages = Array.isArray(OUTPUT.T_MENSAJES.item)
        ? OUTPUT.T_MENSAJES.item
        : [OUTPUT.T_MENSAJES.item];
    }

    if (outputMessages.length > 0) {
      outputMessages.forEach((message) => {
        if (message.MESSAGE && message.MESSAGE.trim() !== "") {
          errorMessages.push({
            message: message.MESSAGE,
            type: message.TIPO || "INFO",
            source: "OUTPUT",
          });
        }
      });
    }

    // Determinar el estado de la validación
    const isValid = errorMessages.length === 0;
    const vbeln = OUTPUT.VBELN || EX_TABLE_ERROR.VBELN || "";

    return {
      success: isValid,
      valid: isValid,
      vbeln: vbeln,
      message: isValid
        ? "La cotización ha sido validada correctamente"
        : "Se encontraron errores en la validación de la cotización",
      errors: errorMessages,
      hasErrors: errorMessages.length > 0,
      errorCount: errorMessages.length,
      rawResponse: sapResponse, // Mantener la respuesta original para debug
    };
  } catch (error) {
    // Si hay error en la validación del schema
    return {
      success: false,
      valid: false,
      vbeln: "",
      message: "Error al procesar la respuesta de validación",
      errors: [
        {
          message: `Error de formato en la respuesta: ${error.message}`,
          type: "SYSTEM_ERROR",
          source: "PARSER",
        },
      ],
      hasErrors: true,
      errorCount: 1,
      rawResponse: sapResponse,
    };
  }
};
