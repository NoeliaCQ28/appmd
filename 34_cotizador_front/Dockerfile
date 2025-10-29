## ------------------------------
## Etapa 1: Build de la aplicación (Bun)
## ------------------------------
FROM oven/bun:1.2.22-alpine AS builder
WORKDIR /app

# Señales de CI y flags opcionales para controlar el build
ENV CI=true
ARG VITE_ANALYZE=false
ARG VITE_COMPRESS=true
ENV VITE_ANALYZE=${VITE_ANALYZE} \
    VITE_COMPRESS=${VITE_COMPRESS}

# Copiamos manifiestos para cache (package.json + bun.lockb si existe)
COPY package.json bun.lock* ./

# Instalación de dependencias usando Bun (aprovecha cache de módulos)
RUN --mount=type=cache,target=/root/.bun bun install --frozen-lockfile

# Copiamos el resto del código fuente
COPY . .

# Build de producción (Vite genera dist). Variables VITE_* ya en entorno.
RUN --mount=type=cache,target=/root/.bun bun run build

# ------------------------------
# Etapa 2: Imagen de producción con Nginx
# ------------------------------
FROM nginx:stable-alpine

# Elimina la configuración por defecto de Nginx (opcional)
RUN rm /etc/nginx/conf.d/default.conf

# Copia tu configuración personalizada de Nginx para optimizar cacheo, compresión, etc.
# Asegúrate de tener un archivo "nginx.conf" en el directorio "nginx"
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copia los archivos estáticos generados en la etapa de build
COPY --from=builder /app/dist /usr/share/nginx/html

# Crear un usuario sin privilegios
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Ajustar permisos en directorios que Nginx necesita escribir
RUN mkdir -p /var/cache/nginx/client_temp && \
    chown -R appuser:appgroup /var/cache/nginx && \
    chown -R appuser:appgroup /etc/nginx/conf.d

# Eliminar la directiva "pid" del archivo principal de Nginx para evitar que intente crear el PID en /var/run
RUN sed -i '/^\s*pid\s\+/d' /etc/nginx/nginx.conf

# Cambiar a usuario no-root
USER appuser

# Definición de un HEALTHCHECK robusto para detectar fallos en la aplicación
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/health || exit 1

# Ejecuta Nginx en primer plano, especificando que el archivo PID se genere en /tmp
CMD ["nginx", "-g", "pid /tmp/nginx.pid; daemon off;"]
