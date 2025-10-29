import type { AxiosInstance } from "axios";
import type { Logger } from "winston";

export abstract class AxiosInterceptor {
  protected axiosInstance: AxiosInstance;
  // biome-ignore lint/suspicious/noExplicitAny: logger can be any
  protected logger: Logger | any;

  // biome-ignore lint/suspicious/noExplicitAny: logger can be any
  protected constructor(axiosInstance: AxiosInstance, logger: Logger | any) {
    this.axiosInstance = axiosInstance;
    this.logger = logger;
    this.setUp();
  }

  abstract setUp(): void;

  abstract getTag(): string;

  protected requestTag(error?: Error): string {
    return error ? `>> ${this.getTag()} [ERROR] ` : `>> ${this.getTag()}`;
  }

  protected responseTag(error?: Error): string {
    return error ? `<< ${this.getTag()} [ERROR]` : `<< ${this.getTag()}`;
  }
}
