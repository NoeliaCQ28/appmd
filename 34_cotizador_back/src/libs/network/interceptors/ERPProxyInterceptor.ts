import { AxiosInterceptor } from "./AxiosInterceptor";

export class ERPProxyInterceptor extends AxiosInterceptor {
  setUp(): void {
    // Interceptor de solicitud (request)
    this.axiosInstance.interceptors.request.use(
      (config) => {
        this.logger.network(
          `${this.requestTag()} ${config.method?.toUpperCase()} ${config.url}`,
          {
            headers: { ...config.headers, "X-API-KEY": "***" }, // Ocultamos API Key
            params: config.params,
            data: config.data,
          },
        );

        return config;
      },
      (error) => {
        this.logger.network(this.requestTag(error), error);
        return Promise.reject(error);
      },
    );

    // Interceptor de respuesta (response)
    this.axiosInstance.interceptors.response.use(
      (response) => {
        this.logger.network(
          `${this.responseTag()} ${response.status} ${response.config.url}`,
          {
            data: response.data,
          },
        );
        return response;
      },
      (error) => {
        if (error.response) {
          // El servidor respondió con un código diferente de 2xx
          this.logger.network(
            `${this.responseTag(error)} ${error.response.status} ${error.config?.url}`,
            {
              data: error.response.data,
            },
          );
        } else if (error.request) {
          // No hubo respuesta del servidor
          this.logger.network(`${this.responseTag()} [NO RESPONSE]`, {
            request: error.request,
          });
        } else {
          // Otro tipo de error
          this.logger.network(`${this.responseTag(error)}`, error.message);
        }

        return Promise.reject(error);
      },
    );
  }

  getTag(): string {
    return "ERP PROXY API";
  }
}
