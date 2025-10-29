# ------------------------------
# PRODUCTION DOCKERFILE
# ------------------------------
FROM oven/bun:1.3.1-alpine

ENV NODE_ENV=production

WORKDIR /app

RUN addgroup -S appgroup && \
    adduser -S appuser -G appgroup

COPY --chown=appuser:appgroup bun.lock package.json ./

RUN bun install --production --frozen-lockfile

COPY --chown=appuser:appgroup . .

USER appuser

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget -q -O- http://localhost:3000/api/health | grep "OK" || exit 1

CMD ["bun", "run", "start"]