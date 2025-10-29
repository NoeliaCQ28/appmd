import { logger } from "./logger";
import { DataTransformerInterceptor } from "./network/interceptors/DataTransformerInterceptor";
import axios from "axios";
import { ERPProxyInterceptor } from "./network/interceptors/ERPProxyInterceptor";

const API_KEY = process.env.ERP_PROXY_API_KEY;
const API_ENDPOINT = process.env.ERP_PROXY_API_ENDPOINT;
const DATA_TRANSFORMER_API_ENDPOINT = process.env.DATA_TRANSFORMER_API_ENDPOINT;
const DATA_TRANSFORMER_API_KEY = process.env.DATA_TRANSFORMER_API_KEY;

export const ERP_PROXY_API = axios.create({
  baseURL: API_ENDPOINT,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-API-KEY": API_KEY,
  },
  timeout: 600_000, // 600 seconds or 10 min
});

export const DATA_TRANSFORMER_API = axios.create({
  baseURL: DATA_TRANSFORMER_API_ENDPOINT,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-API-KEY": DATA_TRANSFORMER_API_KEY,
  },
  timeout: 600_000, // 600 seconds or 10 min
});

/**
 * Interceptadores para logging de requests y responses
 */
new ERPProxyInterceptor(ERP_PROXY_API, logger);
new DataTransformerInterceptor(DATA_TRANSFORMER_API, logger);
