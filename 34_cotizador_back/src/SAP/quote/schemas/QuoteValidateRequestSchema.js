import { z } from "zod";

// Schema para las fechas de entrega
const TFechaEntregaSchema = z.object({
  Kwmeng: z.number().positive(),
  Handoverdate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha debe estar en formato YYYY-MM-DD"),
});

// Schema para los repuestos/reservas
const TReservaSchema = z.object({
  Matnr: z.string().min(1, "Matnr es requerido"),
});

// Schema para los detalles de la cotización
const TDetalleSchema = z.object({
  Matkl: z.string().min(1, "Matkl es requerido"),
  Matnr: z.string().optional(),
  Kwmeng: z
    .string()
    .regex(/^\d+\.\d{2}$/, "Kwmeng debe ser un número decimal con 2 decimales"),
  Werks: z.number().int().positive(),
  Netpr: z
    .string()
    .regex(/^\d+\.\d{2}$/, "Netpr debe ser un número decimal con 2 decimales"),
  Waerk: z
    .string()
    .length(3, "Waerk debe ser un código de moneda de 3 caracteres"),
  TFechaEntrega: z
    .array(TFechaEntregaSchema)
    .min(1, "Al menos una fecha de entrega es requerida"),
  TextoDet: z.array(z.string()).optional(),
  ModeloEspec: z.string().optional(),
  ModeloGener: z.string().optional(),
  MarcaMotor: z.string().optional(),
  Motor: z.string().optional(),
  MarcaAlter: z.string().optional(),
  Alternador: z.string().optional(),
  Regimen: z.string().optional(),
  Tension: z.string().optional(),
  Frecuencia: z.string().optional(),
  Fases: z.number().int().positive().optional(),
  MetrosSnm: z.string().optional(),
  PotenciaPc: z.string().optional(),
  PotenciaSb: z.string().optional(),
  Itm: z.string().optional(),
  Modulo: z.string().optional(),
  SenalesArr: z.string().nullable().optional(),
  CapacidadTc: z.string().optional(),
  PartidaAr: z.string().optional(),
  AccesorioMot: z.string().nullable().optional(),
  AccesorioAlt: z.string().nullable().optional(),
  AccesorioCont: z.string().nullable().optional(),
  AccesorioTab: z.string().nullable().optional(),
  AccesorioFab: z.string().nullable().optional(),
  TipoGe: z.string().optional(),
  Silenciador: z.string().optional(),
  TuboFlex: z.string().nullable().optional(),
  ModeloCab: z.string().optional(),
  ColorCab: z.string().optional(),
  IngresoAir: z.string().optional(),
  SalidaAir: z.string().optional(),
  EscapeMot: z.string().optional(),
  NivelRuido: z.string().optional(),
  TipoGrupo: z.string().nullable().optional(),
  TReserva: z.array(TReservaSchema).optional(),
});

export const QuoteValidateRequestSchema = z.object({
  Auart: z.string().min(1, "Auart es requerido"),
  Vtweg: z.string().min(1, "Vtweg es requerido"),
  Vkbur: z.string().min(1, "Vkbur es requerido"),
  Kunnr: z.string().min(1, "Kunnr es requerido"),
  Pernr: z.string().min(1, "Pernr es requerido"),
  Bstkd: z.string().min(1, "Bstkd es requerido"),
  Inco1: z.string().min(1, "Inco1 es requerido"),
  TextoCab: z
    .array(z.string())
    .min(1, "Al menos un texto de cabecera es requerido"),
  TDetalle: z.array(TDetalleSchema).min(1, "Al menos un detalle es requerido"),
});
