import db_pool from "#config/db.js";
import { transporter } from "#config/email.js";
import { executeStoredProcedure } from "#libs/dbUtils.js";

const handleValidationEmail = (res, message) => {
  return res.status(400).send({ message });
};

const EmailController = {
  sendEmailForGetAQuote: async (req, res) => {
    const {
      customerName,
      businessName,
      phone,
      email,
      country,
      province = "",
      message,
      combination,
    } = req.body;

    if (!customerName || customerName.trim() === "") {
      return handleValidationEmail(res, "El campo nombres es requerido");
    }

    if (!businessName || businessName.trim() === "") {
      return handleValidationEmail(res, "El campo empresa es requerido");
    }

    if (!phone || phone.trim() === "") {
      return handleValidationEmail(res, "El campo teléfono es requerido");
    }

    if (
      !combination.Mercado ||
      combination.Mercado.trim() === "" ||
      ["NACIONAL", "EXPORTACIÓN"].includes(
        combination.Mercado.toUpperCase(),
      ) === false
    ) {
      return handleValidationEmail(
        res,
        "El tipo de cotización es requerido y debe ser 'NACIONAL' o 'EXPORTACIÓN'",
      );
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return handleValidationEmail(
        res,
        "El campo email es requerido y debe ser un email válido",
      );
    }

    if (!message || message.trim() === "") {
      return handleValidationEmail(res, "El campo mensaje es requerido");
    }

    const {
      result: [emailsNationalTeam],
    } = await executeStoredProcedure({
      pool: db_pool,
      sp_name: "configuracion_obtener_valor",
      parameters: {
        in: ["correo-cotizaciones-nacionales"],
      },
    });

    const {
      result: [emailsInternationalTeam],
    } = await executeStoredProcedure({
      pool: db_pool,
      sp_name: "configuracion_obtener_valor",
      parameters: {
        in: ["correo-cotizaciones-exportacion"],
      },
    });

    const {
      result: [emailsNationalTeamCC],
    } = await executeStoredProcedure({
      pool: db_pool,
      sp_name: "configuracion_obtener_valor",
      parameters: {
        in: ["correo-cotizaciones-nacionales-cc"],
      },
    });

    const {
      result: [emailsInternationalTeamCC],
    } = await executeStoredProcedure({
      pool: db_pool,
      sp_name: "configuracion_obtener_valor",
      parameters: {
        in: ["correo-cotizaciones-exportacion-cc"],
      },
    });

    const emailsOfExecutivesPerTypeOfQuote = {
      NACIONAL: emailsNationalTeam,
      EXPORTACIÓN: emailsInternationalTeam,
    };

    const emailsWithCCPerTypeOfQuote = {
      NACIONAL: emailsNationalTeamCC,
      EXPORTACIÓN: emailsInternationalTeamCC,
    };

    const emailData = {
      from: '"Alertas MODASA" <alertas.modasa@fmsac.com>',
      to: emailsOfExecutivesPerTypeOfQuote[combination.Mercado.toUpperCase()],
      cc: `${emailsWithCCPerTypeOfQuote[combination.Mercado.toUpperCase()]}, ${email}`,
      subject: `🔔 Nueva Solicitud de Cotización ${combination.Mercado === 'NACIONAL' ? '🇵🇪' : '🌎'} | ${businessName}${combination.ModeloGE ? ` - ${combination.ModeloGE}` : ''} | ${customerName}`,
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              margin: 0;
              padding: 0;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
              background-color: #f8fafc;
              color: #0f172a;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
            }
            .header {
              background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
              padding: 32px 24px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
              font-weight: 600;
              color: #ffffff;
              letter-spacing: -0.5px;
            }
            .header p {
              margin: 8px 0 0 0;
              font-size: 14px;
              color: #94a3b8;
            }
            .content {
              padding: 32px 24px;
            }
            .card {
              background-color: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              padding: 20px;
              margin-bottom: 24px;
            }
            .card-title {
              font-size: 16px;
              font-weight: 600;
              color: #0f172a;
              margin: 0 0 16px 0;
              padding-bottom: 12px;
              border-bottom: 2px solid #e2e8f0;
            }
            .info-row {
              display: flex;
              padding: 10px 0;
              border-bottom: 1px solid #e2e8f0;
            }
            .info-row:last-child {
              border-bottom: none;
            }
            .info-label {
              font-size: 13px;
              font-weight: 500;
              color: #64748b;
              min-width: 120px;
            }
            .info-value {
              font-size: 14px;
              color: #0f172a;
              font-weight: 500;
            }
            .message-box {
              background-color: #ffffff;
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              padding: 16px;
              margin-top: 12px;
              font-size: 14px;
              line-height: 1.6;
              color: #334155;
            }
            .badge {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 6px;
              font-size: 12px;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .badge-nacional {
              background-color: #dbeafe;
              color: #1e40af;
            }
            .badge-exportacion {
              background-color: #d1fae5;
              color: #065f46;
            }
            .specs-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 12px;
              margin-top: 12px;
            }
            .spec-item {
              background-color: #ffffff;
              border: 1px solid #e2e8f0;
              border-radius: 6px;
              padding: 12px;
            }
            .spec-label {
              font-size: 11px;
              text-transform: uppercase;
              color: #64748b;
              font-weight: 600;
              letter-spacing: 0.5px;
              margin-bottom: 4px;
            }
            .spec-value {
              font-size: 14px;
              color: #0f172a;
              font-weight: 600;
            }
            .footer {
              background-color: #f8fafc;
              padding: 24px;
              text-align: center;
              border-top: 1px solid #e2e8f0;
            }
            .footer p {
              margin: 0;
              font-size: 12px;
              color: #64748b;
            }
            @media only screen and (max-width: 600px) {
              .specs-grid {
                grid-template-columns: 1fr;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Nueva Solicitud de Cotización</h1>
              <p>Detalles de la solicitud recibida</p>
            </div>
            
            <div class="content">
              <div class="card">
                <h2 class="card-title">Información del Cliente</h2>
                <div class="info-row">
                  <span class="info-label">Nombre:</span>
                  <span class="info-value">${customerName}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Empresa:</span>
                  <span class="info-value">${businessName}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Email:</span>
                  <span class="info-value">${email}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Teléfono:</span>
                  <span class="info-value">${phone}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">País:</span>
                  <span class="info-value">${country}</span>
                </div>
                ${
                  province
                    ? `
                <div class="info-row">
                  <span class="info-label">Provincia:</span>
                  <span class="info-value">${province}</span>
                </div>
                `
                    : ""
                }
              </div>

              <div class="card">
                <h2 class="card-title">Tipo de Cotización</h2>
                <span class="badge ${combination.Mercado.toUpperCase() === "NACIONAL" ? "badge-nacional" : "badge-exportacion"}">
                  ${combination.Mercado}
                </span>
              </div>

              ${
                combination.ModeloGE
                  ? `
              <div class="card">
                <h2 class="card-title">Especificaciones Técnicas</h2>
                <div class="info-row">
                  <span class="info-label">Modelo:</span>
                  <span class="info-value">${combination.ModeloGE}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Motor:</span>
                  <span class="info-value">${combination.Motor || "N/A"}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Alternador:</span>
                  <span class="info-value">${combination.Alternador || "N/A"}</span>
                </div>
                
                <div class="specs-grid">
                  <div class="spec-item">
                    <div class="spec-label">Potencia Prime</div>
                    <div class="spec-value">${combination.PrimeKW} kW / ${combination.PrimeKVA} kVA</div>
                  </div>
                  <div class="spec-item">
                    <div class="spec-label">Potencia Stand By</div>
                    <div class="spec-value">${combination.StandByKW} kW / ${combination.StandByKVA} kVA</div>
                  </div>
                  <div class="spec-item">
                    <div class="spec-label">Voltaje</div>
                    <div class="spec-value">${combination.Voltaje}V</div>
                  </div>
                  <div class="spec-item">
                    <div class="spec-label">Frecuencia</div>
                    <div class="spec-value">${combination.Frecuencia} Hz</div>
                  </div>
                  <div class="spec-item">
                    <div class="spec-label">Fases</div>
                    <div class="spec-value">${combination.Fases}</div>
                  </div>
                  <div class="spec-item">
                    <div class="spec-label">Factor de Potencia</div>
                    <div class="spec-value">${combination.FactorPotencia}</div>
                  </div>
                  <div class="spec-item">
                    <div class="spec-label">Corriente Prime</div>
                    <div class="spec-value">${combination.CorrientePrimeA} A</div>
                  </div>
                  <div class="spec-item">
                    <div class="spec-label">Corriente Stand By</div>
                    <div class="spec-value">${combination.CorrienteStandByA} A</div>
                  </div>
                </div>
              </div>
              `
                  : ""
              }

              <div class="card">
                <h2 class="card-title">Mensaje del Cliente</h2>
                <div class="message-box">${message}</div>
              </div>
            </div>

            <div class="footer">
              <p>Este correo fue generado automáticamente por el sistema de cotizaciones de MODASA S.A.</p>
              <p style="margin-top: 8px; color: #94a3b8;">© ${new Date().getFullYear()} MODASA S.A.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    try {
      await transporter.sendMail(emailData);
      res.status(200).json({ message: "Correo enviado exitosamente" });
    } catch (error) {
      res
        .status(500)
        .json({ message: `Error al enviar el correo: ${error.message}` });
    }
  },
};

export default EmailController;
