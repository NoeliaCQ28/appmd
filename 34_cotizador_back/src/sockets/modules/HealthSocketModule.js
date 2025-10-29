import EventEmitter from "node:events";

const DEFAULT_INTERVAL_MS = Number(process.env.HEALTH_INTERVAL_MS) || 10_000;
const DEFAULT_TIMEOUT_MS = Number(process.env.HEALTH_TIMEOUT_MS) || 5_000;

/**
 * HealthSocketModule: check periodically an endpoint and emit events based on its status.
 */
export class HealthSocketModule extends EventEmitter {
  constructor({
    url,
    intervalMs = DEFAULT_INTERVAL_MS,
    timeoutMs = DEFAULT_TIMEOUT_MS,
  } = {}) {
    super();
    this.url = url;
    this.intervalMs = intervalMs;
    this.timeoutMs = timeoutMs;
    this.status = null;
    this._timer = null;
  }

  static build(ctx, options = {}) {
    const health = new HealthSocketModule(options);
    health.start();
    health.on("health", (payload) => ctx.io.emit("health-status", payload));

    const { serverName = "default" } = options;

    ctx.modules.push({
      eventName: `health-status-${serverName}`,
      initialEvent: () => ({
        status: health.status || "unknown",
        timestamp: Date.now(),
      }),
    });
  }

  start() {
    if (!this._timer) {
      this._timer = setInterval(() => this._check(), this.intervalMs);
    }
  }

  stop() {
    clearInterval(this._timer);
    this._timer = null;
  }

  async _check() {
    let newStatus = "down";
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), this.timeoutMs);
      const response = await fetch(this.url, {
        signal: controller.signal,
        headers: {
          accept: "application/json",
          "X-API-KEY": process.env.ERP_PROXY_API_KEY,
        },
      });

      clearTimeout(timeout);
      newStatus = response.ok ? "up" : "down";
    } catch {
      newStatus = "down";
    }

    if (newStatus !== this.status) {
      this.status = newStatus;
      this.emit("health", { status: newStatus, timestamp: Date.now() });
    }
  }
}
