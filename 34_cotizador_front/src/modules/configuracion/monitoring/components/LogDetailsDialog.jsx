import React from "react";
import { Dialog } from "primereact/dialog";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  User,
  Calendar,
  Globe,
  Monitor,
  Clock,
  Database,
  AlertCircle,
  FileText,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const LogDetailsDialog = ({ visible, onHide, logData }) => {
  if (!logData) return null;

  const formatDate = (date) => {
    if (!date) return "-";
    try {
      return format(new Date(date), "dd/MM/yyyy HH:mm:ss", { locale: es });
    } catch {
      return date;
    }
  };

  const InfoRow = ({ icon: Icon, label, value, className = "", delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay }}
      className={`flex items-start gap-3 py-3 ${className}`}
    >
      <div className="flex-shrink-0 mt-0.5">
        <Icon size={16} className="text-gray-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
          {label}
        </p>
        <p className="text-sm text-gray-900 break-words">{value || "-"}</p>
      </div>
    </motion.div>
  );

  const JsonViewer = ({ title, data }) => {
    if (!data || (typeof data === "object" && Object.keys(data).length === 0)) {
      return null;
    }

    return (
      <div className="mt-4">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
          {title}
        </p>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-auto max-h-64">
          <pre className="text-xs font-mono text-gray-700">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      </div>
    );
  };

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={
        <div className="flex items-center gap-3">
          <FileText size={20} className="text-gray-600" />
          <span className="text-lg font-semibold">Detalles del Log</span>
        </div>
      }
      style={{ width: "50vw" }}
      breakpoints={{ "960px": "75vw", "641px": "95vw" }}
      draggable={false}
      resizable={false}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={logData.Auditoria_Id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Header Info */}
          <div className="flex items-start justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div
                className={`p-2 rounded-lg flex-shrink-0 ${
                  logData.bExitoso ? "bg-green-100" : "bg-red-100"
                }`}
              >
                {logData.bExitoso ? (
                  <CheckCircle2 size={20} className="text-green-700" />
                ) : (
                  <XCircle size={20} className="text-red-700" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                      logData.sAccion === "LOGIN"
                        ? "bg-green-100 text-green-700"
                        : logData.sAccion === "LOGOUT"
                        ? "bg-blue-100 text-blue-700"
                        : logData.sAccion === "CREATE"
                        ? "bg-green-100 text-green-700"
                        : logData.sAccion === "UPDATE"
                        ? "bg-amber-100 text-amber-700"
                        : logData.sAccion === "DELETE"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {logData.sAccion}
                  </span>
                  <span className="text-xs text-gray-500">
                    ID: {logData.Auditoria_Id}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-900 break-words">
                  {logData.sAccionDescripcionHumana}
                </p>
              </div>
            </div>
            <span
              className={`text-xs font-medium px-2 py-1 rounded flex-shrink-0 ml-3 ${
                logData.bExitoso
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {logData.bExitoso ? "Exitoso" : "Fallido"}
            </span>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200"></div>

          {/* User Information */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Información del Usuario
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              <InfoRow
                icon={User}
                label="Nombre"
                value={logData.sUsuNombre}
                delay={0}
              />
              <InfoRow
                icon={User}
                label="Email"
                value={logData.sUsuLogin}
                delay={0.05}
              />
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200"></div>

          {/* Request Information */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Información de la Solicitud
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              <InfoRow
                icon={Globe}
                label="Método HTTP"
                value={logData.sMetodo}
                delay={0}
              />
              <InfoRow
                icon={Globe}
                label="Endpoint"
                value={logData.sEndpoint}
                delay={0.05}
              />
              <InfoRow
                icon={Monitor}
                label="IP Origen"
                value={logData.sIPOrigen}
                delay={0.1}
              />
              <InfoRow
                icon={Calendar}
                label="Fecha y Hora"
                value={formatDate(logData.dtFechaHora)}
                delay={0.15}
              />
              <InfoRow
                icon={Clock}
                label="Duración"
                value={`${logData.nDuracionMs} ms`}
                delay={0.2}
              />
              <InfoRow
                icon={Database}
                label="Entidad"
                value={logData.sEntidad}
                delay={0.25}
              />
            </div>
          </div>

          {/* Error Information */}
          {logData.sError && (
            <>
              <div className="border-t border-gray-200"></div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Información del Error
                </h3>
                <InfoRow
                  icon={AlertCircle}
                  label="Mensaje de Error"
                  value={logData.sError}
                  className="text-red-600"
                />
              </div>
            </>
          )}

          {/* Modified Fields */}
          {logData.sCamposModificados && (
            <>
              <div className="border-t border-gray-200"></div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Cambios Realizados
                </h3>
                <InfoRow
                  icon={FileText}
                  label="Campos Modificados"
                  value={logData.sCamposModificados}
                />
              </div>
            </>
          )}

          {/* User Agent */}
          {logData.sUserAgent && (
            <>
              <div className="border-t border-gray-200"></div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Información del Navegador
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                  {/* Browser Info */}
                  {logData.sUserAgent?.browser?.name && (
                    <InfoRow
                      icon={Monitor}
                      label="Navegador"
                      value={`${logData.sUserAgent.browser.name} ${
                        logData.sUserAgent.browser.version || ""
                      }${
                        logData.sUserAgent.browser.type
                          ? ` (${logData.sUserAgent.browser.type})`
                          : ""
                      }`}
                      delay={0}
                    />
                  )}

                  {/* OS Info */}
                  {logData.sUserAgent?.os?.name && (
                    <InfoRow
                      icon={Monitor}
                      label="Sistema Operativo"
                      value={`${logData.sUserAgent.os.name}${
                        logData.sUserAgent.os.version
                          ? " " + logData.sUserAgent.os.version
                          : ""
                      }`}
                      delay={0.05}
                    />
                  )}

                  {/* Engine Info */}
                  {logData.sUserAgent?.engine?.name && (
                    <InfoRow
                      icon={Monitor}
                      label="Motor de Renderizado"
                      value={`${logData.sUserAgent.engine.name}${
                        logData.sUserAgent.engine.version
                          ? " " + logData.sUserAgent.engine.version
                          : ""
                      }`}
                      delay={0.1}
                    />
                  )}

                  {/* CPU Architecture */}
                  {logData.sUserAgent?.cpu?.architecture && (
                    <InfoRow
                      icon={Monitor}
                      label="Arquitectura CPU"
                      value={logData.sUserAgent.cpu.architecture.toUpperCase()}
                      delay={0.15}
                    />
                  )}

                  {/* Device Info */}
                  {(logData.sUserAgent?.device?.vendor ||
                    logData.sUserAgent?.device?.model ||
                    logData.sUserAgent?.device?.type) && (
                    <InfoRow
                      icon={Monitor}
                      label="Dispositivo"
                      value={
                        [
                          logData.sUserAgent.device.vendor,
                          logData.sUserAgent.device.model,
                          logData.sUserAgent.device.type &&
                            `(${logData.sUserAgent.device.type})`,
                        ]
                          .filter(Boolean)
                          .join(" ") || "Escritorio"
                      }
                      delay={0.2}
                    />
                  )}
                </div>

                {/* Full UA String */}
                {logData.sUserAgent?.ua && (
                  <div className="mt-4">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                      User Agent Completo
                    </p>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                      <p className="text-xs font-mono text-gray-600 break-all">
                        {logData.sUserAgent.ua}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* JSON Data */}
          {(logData.jsonDatosAnteriores || logData.jsonDatosNuevos) && (
            <>
              <div className="border-t border-gray-200"></div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Datos Adicionales
                </h3>
                {logData.jsonDatosAnteriores && (
                  <JsonViewer
                    title="Datos Anteriores"
                    data={logData.jsonDatosAnteriores}
                  />
                )}
                {logData.jsonDatosNuevos && (
                  <JsonViewer
                    title="Datos Nuevos"
                    data={logData.jsonDatosNuevos}
                  />
                )}
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </Dialog>
  );
};
