import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import site from "../../../../config/site";
import { safeString } from "../../../../utils/utils";
import { getFormattedDate } from "../utils/utils";
import { MotorIndicator } from "./MotorIndicator";
import { NoiseIndicator } from "./NoiseIndicator";
import { SpecificationRow } from "./SpecificationRow";
import dimensionesPrueba from "/dimensionesPrueba.png";
import footerLogo from "/footerLogo.jpg";
import geabierto from "/default-ge-abierto.jpg";
import geinsonoro from "/default-ge-insonoro.jpg";
import modasa from "/modasa.png";
import imageTableroControlPrueba from "/tableroControlPrueba.png";
import { useTranslation } from "react-i18next";
import { currentLanguage } from "../../../../libs/i18n";
import {
  convertTemperature,
  convertUnit,
} from "../../../../utils/unitConversion";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
  },

  cabecera: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  logo: {
    width: 200,
    height: 30,
    paddingRight: 10,
  },

  header: {
    backgroundColor: "#003366",
    padding: 10,
    marginBottom: 10,
    borderBottom: 10,
    borderBottomColor: "#fa8936",
  },

  headerText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },

  table: {
    borderLeft: 4,
    borderLeftColor: "#fa8936",
    display: "table",
    width: "auto",
    marginBottom: 8,
    marginLeft: 20,
    marginRight: 20,
    paddingLeft: 2,
    borderRadius: 3,
    overflow: "hidden",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
    backgroundColor: "#ffffff",
    borderCollapse: "collapse",
  },

  textHead: {
    color: "white",
    fontWeight: "bold",
    fontSize: 6.5,
    letterSpacing: 0.1,
    wrap: true,
    textAlign: "center",
    textTransform: "uppercase",
  },

  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
    borderBottomStyle: "solid",
    textAlign: "center",
    alignItems: "center",
    minHeight: 22,
  },

  tableHeader: {
    backgroundColor: "#616161",
    fontSize: 7,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    paddingVertical: 4,
  },

  tableCell: {
    padding: 2,
    fontSize: 6.5,
    borderRightWidth: 1,
    borderRightColor: "#f1f1f1",
    borderRightStyle: "solid",
    transition: "background-color 0.3s",
    position: "relative",
  },

  modelCell: {
    width: "25%",
  },

  potenciaCell: {
    width: "25%",
  },

  otherCell: {
    width: "15%",
  },

  lastRowCell: {
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },

  cellDivider: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 1,
    height: "100%",
    backgroundColor: "#e0e0e0",
  },
  imagesContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
    marginTop: 6,
    marginBottom: 2,
    padding: 4,
  },

  imageWrapper: {
    backgroundColor: "#ffffff",
    borderRadius: 4,
    padding: 4,
    width: 200,
    alignItems: "center",
  },

  image: {
    width: "100%",
    height: 150,
    objectFit: "contain",
  },

  imageCaption: {
    fontSize: 8,
    textAlign: "center",
    marginTop: 3,
    color: "#333333",
    fontWeight: "500",
  },

  tecnicos: {
    marginTop: 20,
    backgroundColor: "#fa8936",
    color: "white",
    padding: 5,
    paddingLeft: 20,
    paddingRight: 20,
  },

  tecnicosText: {
    fontSize: 10,
    fontWeight: "bold",
  },

  grupoHeader: {
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: "#030963",
    padding: 5,
    width: "45%",
    borderLeft: 20,
    borderLeftColor: "#fa8936",
    marginTop: 10,
  },

  grupoHeaderWide: {
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: "#030963",
    padding: 5,
    width: "55%",
    borderLeft: 20,
    borderLeftColor: "#fa8936",
    marginTop: 10,
  },

  grupoHeaderText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },

  container: {
    backgroundColor: "white",
    padding: 1,
    paddingLeft: 6,
    paddingRight: 6,
    marginLeft: 20,
    marginRight: 20,
    flexShrink: 1,
  },

  specificationsContainer: {
    marginBottom: 1,
  },
});

const getImageSource = async (imageUrl, fallbackImage) => {
  if (!imageUrl) {
    return fallbackImage;
  }

  const extension = imageUrl.split(".").pop().toLowerCase();
  const supportedExtensions = ["png", "jpg", "jpeg"];

  // Si la extensión ya es compatible, devolver la URL directamente
  if (supportedExtensions.includes(extension)) {
    return imageUrl;
  }

  // Si es svg o webp, intentaremos convertir a png
  if (["svg", "webp"].includes(extension)) {
    try {
      const convertedImage = await convertToPng(imageUrl);
      return convertedImage; // Retorna la imagen convertida a PNG (data URL)
    } catch (error) {
      console.warn(
        `[${new Date().toLocaleString("es-PE", {
          timeZone: "America/Lima",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })}] Error al convertir imagen (${extension}): ${imageUrl}. Usando imagen de respaldo. Error: ${
          error.message
        }`
      );
      return fallbackImage;
    }
  }

  // Si la extensión no es compatible ni convertible, usar el fallback
  console.warn(
    `[${new Date().toLocaleString("es-PE", {
      timeZone: "America/Lima",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })}] Imagen no compatible (extensión: ${extension}): ${imageUrl}. Usando imagen de respaldo.`
  );
  return fallbackImage;
};

// Función para convertir SVG o WebP a PNG usando un canvas
const convertToPng = async (imageUrl) => {
  if (typeof window === "undefined" || !window.Image) {
    throw new Error("Entorno DOM no disponible para convertir imágenes.");
  }

  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "Anonymous";

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngDataUrl = canvas.toDataURL("image/png");
      resolve(pngDataUrl);
    };

    img.onerror = () => {
      reject(new Error("No se pudo cargar la imagen para conversión."));
    };

    if (imageUrl.toLowerCase().endsWith(".svg")) {
      fetch(imageUrl, { mode: "cors" })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Fallo al cargar el SVG: " + response.statusText);
          }
          return response.text();
        })
        .then((svgText) => {
          const svgBlob = new Blob([svgText], { type: "image/svg+xml" });
          const svgUrl = URL.createObjectURL(svgBlob);
          img.src = svgUrl;
        })
        .catch((err) => {
          reject(new Error("Error al procesar SVG: " + err.message));
        });
    } else {
      img.src = imageUrl;
    }
  });
};

export const FichaPdf = ({ ficha, accesories }) => {
  // Definir la base URL para las imágenes
  const baseUrl = "https://cotizador.modasa.com.pe/storage/cotizadormodasa/";

  const { i18n, t } = useTranslation();
  const current = currentLanguage(i18n);
  const countryCode = current.code;

  return (
    <Document title={`${ficha?.sModNombre || "ficha"} - MODASA.pdf`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.cabecera}>
          <View style={styles.header}>
            <Text style={[styles.headerText, { textTransform: "uppercase" }]}>
              {t("technical_report_pdf.generator_set")} {ficha.sModNombre}
            </Text>
          </View>
          <View>
            <Image src={modasa} style={styles.logo} />
          </View>
        </View>

        <View style={[styles.table, { border: "1px solid #f3f4f6" }]}>
          {/* Table Header */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <View
              style={[
                styles.tableCell,
                styles.modelCell,
                { borderRightColor: "#7c7c7c" },
              ]}
            >
              <Text style={styles.textHead}>
                {t("technical_report_pdf.model")}
              </Text>
            </View>
            <View
              style={[
                styles.tableCell,
                styles.potenciaCell,
                { borderRightColor: "#7c7c7c" },
              ]}
            >
              <Text style={styles.textHead}>
                {t("technical_report_pdf.prime_power")}
              </Text>
            </View>
            <View
              style={[
                styles.tableCell,
                styles.potenciaCell,
                { borderRightColor: "#7c7c7c" },
              ]}
            >
              <Text style={styles.textHead}>
                {t("technical_report_pdf.standby_power")}
              </Text>
            </View>
            <View
              style={[
                styles.tableCell,
                styles.potenciaCell,
                { borderRightColor: "#7c7c7c" },
              ]}
            >
              <Text style={styles.textHead}>
                {t("technical_report_pdf.voltage")}
              </Text>
            </View>
            <View
              style={[
                styles.tableCell,
                styles.potenciaCell,
                { borderRightColor: "#7c7c7c" },
              ]}
            >
              <Text style={styles.textHead}>
                {t("technical_report_pdf.frequency")}
              </Text>
            </View>
            <View
              style={[
                styles.tableCell,
                styles.potenciaCell,
                { borderRightColor: "#7c7c7c" },
              ]}
            >
              <Text style={[styles.textHead, { fontSize: 6 }]}>
                {t("technical_report_pdf.power_factor")}
              </Text>
            </View>
            <View
              style={[
                styles.tableCell,
                styles.potenciaCell,
                { borderRightColor: "#7c7c7c" },
              ]}
            >
              <Text style={styles.textHead}>
                {t("technical_report_pdf.electric_current")}
              </Text>
            </View>
          </View>
          {/* Table Data */}
          <View
            style={[
              styles.tableRow,
              { borderBottomWidth: 0, backgroundColor: "#fafafa" },
            ]}
          >
            <View
              style={[
                styles.tableCell,
                styles.modelCell,
                styles.lastRowCell,
                { backgroundColor: "#fafafa" },
              ]}
            >
              <Text
                style={{ color: "#333333", fontWeight: "500", fontSize: 6.5 }}
              >
                {ficha.sModNombre}
              </Text>
            </View>
            <View
              style={[
                styles.tableCell,
                styles.potenciaCell,
                styles.lastRowCell,
                { backgroundColor: "#fafafa" },
              ]}
            >
              <Text style={{ color: "#333333", fontSize: 6.5 }}>
                {`${ficha.PrimeKW} ${site.powerUnits.kilowatt}`} /{" "}
                {`${ficha.PrimeKVA} ${site.powerUnits.kilovoltAmpere}`}
              </Text>
            </View>
            <View
              style={[
                styles.tableCell,
                styles.potenciaCell,
                styles.lastRowCell,
                { backgroundColor: "#fafafa" },
              ]}
            >
              <Text style={{ color: "#333333", fontSize: 6.5 }}>
                {`${ficha.StandByKW} ${site.powerUnits.kilowatt}`} /{" "}
                {`${ficha.StandByKVA} ${site.powerUnits.kilovoltAmpere}`}
              </Text>
            </View>
            <View
              style={[
                styles.tableCell,
                styles.potenciaCell,
                styles.lastRowCell,
                { backgroundColor: "#fafafa" },
              ]}
            >
              <Text
                style={{ color: "#333333", fontSize: 6.5 }}
              >{`${ficha.nIntVoltaje}V`}</Text>
            </View>
            <View
              style={[
                styles.tableCell,
                styles.potenciaCell,
                styles.lastRowCell,
                { backgroundColor: "#fafafa" },
              ]}
            >
              <Text
                style={{ color: "#333333", fontSize: 6.5 }}
              >{`${ficha.nIntFrecuencia}Hz`}</Text>
            </View>
            <View
              style={[
                styles.tableCell,
                styles.potenciaCell,
                styles.lastRowCell,
                { backgroundColor: "#fafafa" },
              ]}
            >
              <Text style={{ color: "#333333", fontSize: 6.5 }}>{`${Number(
                ficha.nIntFP
              ).toFixed(1)}`}</Text>
            </View>
            <View
              style={[
                styles.tableCell,
                styles.potenciaCell,
                styles.lastRowCell,
                { backgroundColor: "#fafafa" },
              ]}
            >
              <Text style={{ color: "#333333", fontSize: 6.5 }}>{`${
                ficha?.CorrienteStandByA
                  ? Number.parseInt(ficha.CorrienteStandByA) || "--"
                  : "--"
              }A`}</Text>
            </View>
          </View>
        </View>

        <View style={styles.imagesContainer}>
          <View style={styles.imageWrapper}>
            <Image
              src={getImageSource(
                ficha?.uModImgInsonoro
                  ? `${baseUrl}${ficha.uModImgInsonoro}`
                  : null,
                geinsonoro
              )}
              style={styles.image}
            />
            {/* <Text style={[styles.imageCaption, { textTransform: "uppercase" }]}>
              {t("technical_report_pdf.generator_set_soundproof")}
            </Text> */}
          </View>
          {ficha?.sTipoFabricacion !== "CHINO" && (
            <View style={styles.imageWrapper}>
              <Image
                src={getImageSource(
                  ficha?.uModImgAbierto
                    ? `${baseUrl}${ficha.uModImgAbierto}`
                    : null,
                  geabierto
                )}
                style={styles.image}
              />
              {/* <Text style={[styles.imageCaption, { textTransform: "uppercase" }]}>
              {t("technical_report_pdf.generator_set_open")}
            </Text> */}
            </View>
          )}
        </View>
        <View style={styles.tecnicos}>
          <Text style={[styles.tecnicosText, { textTransform: "uppercase" }]}>
            {t("technical_report_pdf.technical_data")}
          </Text>
        </View>

        <View
          style={{ backgroundColor: "#f0ecec", paddingBottom: 20, flex: 1 }}
        >
          <View>
            <View style={styles.grupoHeader}>
              <Text style={styles.grupoHeaderText}>
                {t("technical_report_pdf.generator_set")}
              </Text>
            </View>

            <View style={[styles.container, { flexDirection: "row" }]}>
              <View style={[styles.specificationsContainer, { flex: 1 }]}>
                <SpecificationRow
                  label={t("technical_report_pdf.model")}
                  value={`${ficha.sModNombre}`}
                />
                <SpecificationRow
                  label={t("technical_report_pdf.motor")}
                  value={`${ficha.sMotModelo} ${safeString(
                    ficha?.sMotNivelEmision,
                    ""
                  )}`}
                />
                <SpecificationRow
                  label={t("technical_report_pdf.alternator")}
                  value={`${ficha.sAltModelo}`}
                />
                <SpecificationRow
                  label={t("technical_report_pdf.control_module")}
                  value={`${
                    ficha.sIntModControl
                      ? ficha.sIntModControl
                      : "No disponible"
                  }`}
                />
                <SpecificationRow
                  label={t("technical_report_pdf.phases")}
                  value={`${
                    ficha.nIntFases == 2
                      ? t("technical_report_pdf.single-phase")
                      : t("technical_report_pdf.three-phase")
                  }`}
                />
                {ficha?.sTipoFabricacion !== "CHINO" ? (
                  <SpecificationRow
                    label={t("technical_report_pdf.fuel_tank")}
                    value={`${safeString(ficha?.nModTcombAbierto)} ${t(
                      "technical_report_pdf.gallons"
                    )} / ${safeString(ficha.nModTcombInsonoro)} ${t(
                      "technical_report_pdf.gallons"
                    )}`}
                  />
                ) : (
                  <SpecificationRow
                    label={t("technical_report_pdf.fuel_tank")}
                    value={`${safeString(ficha.nModTcombInsonoro)} ${t(
                      "technical_report_pdf.gallons"
                    )}`}
                  />
                )}
                <SpecificationRow
                  label={t("technical_report_pdf.electric_system")}
                  value={`${safeString(ficha?.nMotSisElectrico)} V`}
                />
                <SpecificationRow
                  label={t("technical_report_pdf.frequency")}
                  value={`${safeString(ficha?.nIntFrecuencia)} Hz`}
                />
                <SpecificationRow
                  label={t("technical_report_pdf.cooling_fan_air_flow")}
                  value={`${
                    safeString(ficha?.nMotGasRadiadorFA) === "0.0"
                      ? "--"
                      : safeString(
                          countryCode === "en"
                            ? convertUnit(
                                ficha?.nMotGasRadiadorFA,
                                "m3/min",
                                "cfm",
                                1
                              )
                            : ficha?.nMotGasRadiadorFA
                        )
                  } ${t("units.m3/min")}`}
                />
                <SpecificationRow
                  label={t("technical_report_pdf.combustion_air_flow")}
                  value={`${safeString(
                    countryCode === "en"
                      ? convertUnit(
                          ficha?.nMotGasCombustionFA,
                          "m3/min",
                          "cfm",
                          1
                        )
                      : ficha?.nMotGasCombustionFA
                  )} ${t("units.m3/min")}`}
                />
                <SpecificationRow
                  label={t("technical_report_pdf.exhaust_gas_flow")}
                  value={`${safeString(
                    countryCode === "en"
                      ? convertUnit(
                          ficha?.nMotGasGasEscFlujo,
                          "m3/min",
                          "cfm",
                          1
                        )
                      : ficha?.nMotGasGasEscFlujo
                  )} ${t("units.m3/min")}`}
                />
                <SpecificationRow
                  label={t("technical_report_pdf.exhaust_gas_temperature")}
                  value={`${safeString(
                    countryCode === "en"
                      ? convertTemperature(
                          ficha?.nMotGasTempGasesEscape,
                          "°C",
                          "°F",
                          1
                        )
                      : ficha?.nMotGasTempGasesEscape
                  )} ${t("units.temperature")}`}
                />
              </View>
              <NoiseIndicator
                level={ficha.sModNiveldeRuido}
                ambient={
                  ficha.sModRuidoAmbiental
                    ? ficha.sModRuidoAmbiental
                    : "No disponible"
                }
              />
            </View>
          </View>

          <View>
            <View style={styles.grupoHeader}>
              <Text
                style={[styles.grupoHeaderText, { textTransform: "uppercase" }]}
              >
                {t("technical_report_pdf.engine")}
              </Text>
            </View>

            <View style={[styles.container, { flexDirection: "row" }]}>
              <View style={[styles.specificationsContainer, { flex: 1 }]}>
                <SpecificationRow
                  label={t("technical_report_pdf.number_of_cylinders")}
                  value={`${safeString(ficha.sMotNoCilindros)}`}
                />
                <SpecificationRow
                  label={t("technical_report_pdf.governor_type")}
                  value={`${safeString(ficha.sMotSisGobernacion)}`}
                />
                <SpecificationRow
                  label={t("technical_report_pdf.cycle")}
                  value={`${safeString(ficha.sMotCiclo)}`}
                />
                <SpecificationRow
                  label={t("technical_report_pdf.aspiration")}
                  value={`${safeString(ficha.sMotAspiracion)}`}
                />
                <SpecificationRow
                  label={t("technical_report_pdf.fuel")}
                  value={`${safeString(ficha.sMotCombustible)}`}
                />
                <SpecificationRow
                  label={t("technical_report_pdf.combustion_system")}
                  value={`${safeString(ficha.sMotSisCombustion)}`}
                />
                <SpecificationRow
                  label={t("technical_report_pdf.cooling_method")}
                  value={`${safeString(ficha.sMotSisEnfriamiento)}`}
                />
                <SpecificationRow
                  label={t("technical_report_pdf.bore")}
                  value={`${safeString(
                    countryCode === "en"
                      ? convertUnit(ficha.nMotDiametroPiston, "mm", "in", 1)
                      : ficha.nMotDiametroPiston
                  )} ${t("units.mm")}`}
                />
                <SpecificationRow
                  label={t("technical_report_pdf.stroke")}
                  value={`${safeString(
                    countryCode === "en"
                      ? convertUnit(ficha.nMotCarreraPiston, "mm", "in", 1)
                      : ficha.nMotCarreraPiston
                  )} ${t("units.mm")}`}
                />
                <SpecificationRow
                  label={t("technical_report_pdf.displacement")}
                  value={`${safeString(
                    countryCode === "en"
                      ? convertUnit(ficha.nMotCapacidad, "cc", "in3", 1)
                      : ficha.nMotCapacidad
                  )} ${t("units.cc")}`}
                />
                <SpecificationRow
                  label={t("technical_report_pdf.compression_ratio")}
                  value={`${safeString(ficha.sMotRelCompresion)}`}
                />
                <SpecificationRow
                  label={t("technical_report_pdf.lubrication_system_capacity")}
                  value={`${safeString(
                    convertUnit(ficha.nMotCapSisLubricacion, "l", "gal", 1)
                  )} gal`}
                />
                <SpecificationRow
                  label={t("technical_report_pdf.cooling_system_capacity")}
                  value={`${safeString(
                    convertUnit(ficha.nMotCapSisRefrigeracion, "l", "gal", 1)
                  )} gal`}
                />
              </View>
              <MotorIndicator
                frecuencia={ficha.nIntFrecuencia}
                standBy1800={ficha.nMotConsStandBy1800}
                prime1800={ficha.nMotConsPrime1800}
                prime1800_75={ficha.nMotConsPrime1800_75porc}
                prime1800_50={ficha.nMotConsPrime1800_50porc}
                standBy1500={ficha.nMotConsStandBy1500}
                prime1500={ficha.nMotConsPrime1500}
                prime1500_75={ficha.nMotConsPrime1500_75porc}
                prime1500_50={ficha.nMotConsPrime1500_50porc}
              />
            </View>
          </View>

          <View style={{ flexDirection: "row", alignItems: "stretch" }}>
            {/* Alternador */}
            <View style={{ flex: 1 }}>
              <View style={styles.grupoHeader}>
                <Text
                  style={[
                    styles.grupoHeaderText,
                    { textTransform: "uppercase" },
                  ]}
                >
                  {t("technical_report_pdf.alternator")}
                </Text>
              </View>

              <View
                style={[styles.container, { flexGrow: 1, minHeight: "70px" }]}
              >
                <View style={styles.specificationsContainer}>
                  <SpecificationRow
                    label={t("technical_report_pdf.insulation_system")}
                    value={`${ficha.sAltAislamiento}`}
                  />
                  <SpecificationRow
                    label={t("technical_report_pdf.exciter_type")}
                    value={`${ficha.sAltSistemaExitacion}`}
                  />
                  <SpecificationRow
                    label={t("technical_report_pdf.voltage_regulation_card")}
                    value={`${ficha.sAltTarjetaAVR}`}
                  />
                  <SpecificationRow
                    label={t("technical_report_pdf.protection_class")}
                    value={`${ficha.sAltGradoIP}`}
                  />
                </View>
              </View>
            </View>

            {/* Normas Técnicas */}
            <View style={{ flex: 1 }}>
              <View style={styles.grupoHeader}>
                <Text
                  style={[
                    styles.grupoHeaderText,
                    {
                      textTransform: "uppercase",
                    },
                  ]}
                >
                  {t("technical_report_pdf.reference_technical_standards")}
                </Text>
              </View>

              <View
                style={[styles.container, { flexGrow: 1, minHeight: "70px" }]}
              >
                <View style={styles.specificationsContainer}>
                  <SpecificationRow
                    label={t("technical_report_pdf.motor")}
                    value={`${safeString(ficha.sMotNormasTecnicas)}`}
                  />
                  <SpecificationRow
                    label={t("technical_report_pdf.alternator")}
                    value={`${safeString(ficha.sAltNormaTecnica)}`}
                  />
                  <SpecificationRow
                    label={t("technical_report_pdf.generator_set")}
                    value={`${safeString(ficha.sModNormaTecnica)}`}
                  />
                </View>
                <Text
                  style={{
                    fontSize: 7,
                    color: "#040f67",
                    textAlign: "right",
                    marginRight: 20,
                    marginTop: 5,
                  }}
                >
                  *
                  {t(
                    "technical_report_pdf.reference_technical_standards_warning"
                  )}
                </Text>
              </View>
            </View>
          </View>

          <View style={{ backgroundColor: "#ffffff", marginTop: 10 }}>
            <View
              style={{
                padding: 6,
                height: 72,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginLeft: 20,
                marginRight: 20,
              }}
            >
              <View style={{ flex: 1, marginBottom: 3, gap: 2 }}>
                <Text style={{ fontSize: 7, color: "#666363" }}>
                  {t("technical_report_pdf.footer_1")}
                </Text>
                <Text style={{ fontSize: 7, color: "#666363" }}>
                  {t("technical_report_pdf.footer_2")}
                </Text>
                <Text style={{ fontSize: 7, color: "#666363" }}>
                  {t("technical_report_pdf.footer_3")}
                </Text>
              </View>
              <View style={{ marginLeft: 10 }}>
                <Image src={footerLogo} style={{ width: 53, height: 50 }} />
              </View>
            </View>
          </View>

          <View break>
            <View>
              <View style={styles.grupoHeader}>
                <Text
                  style={[
                    styles.grupoHeaderText,
                    { textTransform: "uppercase" },
                  ]}
                >
                  {t("technical_report_pdf.dimensions")}
                </Text>
              </View>

              <View style={[styles.container, { flexDirection: "row" }]}>
                <View style={{ flex: 1 }}>
                  <View>
                    {ficha?.sTipoFabricacion !== "CHINO" && (
                      <View style={styles.specificationsContainer}>
                        <Text style={{ fontSize: 10 }}>
                          {t("technical_report_pdf.generator_set_open")}
                        </Text>
                        <SpecificationRow
                          label="A"
                          value={`${safeString(
                            countryCode === "en"
                              ? convertUnit(
                                  ficha.nModDimensionesA,
                                  "mm",
                                  "in",
                                  0
                                )
                              : ficha.nModDimensionesA
                          )} ${t("units.mm")}`}
                        />
                        <SpecificationRow
                          label="B"
                          value={`${safeString(
                            countryCode === "en"
                              ? convertUnit(
                                  ficha.nModDimensionesB,
                                  "mm",
                                  "in",
                                  0
                                )
                              : ficha.nModDimensionesB
                          )} ${t("units.mm")}`}
                        />
                        <SpecificationRow
                          label="C"
                          value={`${safeString(
                            countryCode === "en"
                              ? convertUnit(
                                  ficha.nModDimensionesC,
                                  "mm",
                                  "in",
                                  0
                                )
                              : ficha.nModDimensionesC
                          )} ${t("units.mm")}`}
                        />
                        <SpecificationRow
                          label={t("technical_report_pdf.weight")}
                          value={`${safeString(
                            countryCode === "en"
                              ? convertUnit(
                                  ficha.nModDimensionesPeso1,
                                  "kg",
                                  "lb",
                                  0
                                )
                              : ficha.nModDimensionesPeso1
                          )} ${t("units.kg")}`}
                        />
                        <SpecificationRow
                          label={`Ø ${t("technical_report_pdf.exh")}`}
                          value={`${
                            safeString(ficha.nModDimensionesEsc1) || "0.00"
                          } "`}
                        />
                      </View>
                    )}

                    <View style={styles.specificationsContainer}>
                      <Text style={{ fontSize: 10 }}>
                        {t("technical_report_pdf.generator_set_soundproof")}
                      </Text>
                      <SpecificationRow
                        label="X"
                        value={`${safeString(
                          countryCode === "en"
                            ? convertUnit(ficha.nModDimensionesX, "mm", "in", 0)
                            : ficha.nModDimensionesX
                        )} ${t("units.mm")}`}
                      />
                      <SpecificationRow
                        label="Y"
                        value={`${safeString(
                          countryCode === "en"
                            ? convertUnit(ficha.nModDimensionesY, "mm", "in", 0)
                            : ficha.nModDimensionesY
                        )} ${t("units.mm")}`}
                      />
                      <SpecificationRow
                        label="Z"
                        value={`${safeString(
                          countryCode === "en"
                            ? convertUnit(ficha.nModDimensionesZ, "mm", "in", 0)
                            : ficha.nModDimensionesZ
                        )} ${t("units.mm")}`}
                      />
                      <SpecificationRow
                        label={t("technical_report_pdf.weight")}
                        value={`${safeString(
                          countryCode === "en"
                            ? convertUnit(
                                ficha.nModDimensionesPeso2,
                                "kg",
                                "lb",
                                0
                              )
                            : ficha.nModDimensionesPeso2
                        )} ${t("units.kg")}`}
                      />
                      <SpecificationRow
                        label={`Ø ${t("technical_report_pdf.exh")}`}
                        value={`${
                          safeString(ficha.nModDimensionesEsc2) || "0.00"
                        } "`}
                      />
                    </View>
                  </View>
                  <Text
                    style={{
                      fontSize: 7,
                      color: "#040f67",
                      textAlign: "left",
                      paddingTop: 5,
                    }}
                  >
                    *{t("technical_report_pdf.dimensions_note")}
                  </Text>
                </View>

                <View
                  style={{
                    flex: 1,
                    marginLeft: 10,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {ficha?.sTipoFabricacion !== "CHINO" && (
                    <Image
                      src={getImageSource(
                        ficha?.uModImgDimensiones
                          ? `${baseUrl}${ficha.uModImgDimensiones}`
                          : null,
                        dimensionesPrueba
                      )}
                      style={{
                        width: "auto",
                        height: "auto",
                        maxWidth: 180,
                        maxHeight: 100,
                        borderWidth: 1,
                        borderColor: "#e5e7eb",
                        backgroundColor: "#f9fafb",
                        marginBottom: 10,
                      }}
                    />
                  )}

                  <Image
                    src={getImageSource(
                      ficha?.uModImgDimensionesInsonoro
                        ? `${baseUrl}${ficha.uModImgDimensionesInsonoro}`
                        : null,
                      dimensionesPrueba
                    )}
                    style={{
                      width: "auto",
                      height: "auto",
                      maxWidth: 180,
                      maxHeight: 100,
                      borderWidth: 1,
                      borderColor: "#e5e7eb",
                      backgroundColor: "#f9fafb",
                    }}
                  />
                </View>
              </View>
            </View>

            <View>
              <View style={styles.grupoHeader}>
                <Text
                  style={[
                    styles.grupoHeaderText,
                    { textTransform: "uppercase" },
                  ]}
                >
                  {t("technical_report_pdf.control_panel")}
                </Text>
              </View>

              <View
                style={[
                  styles.container,
                  { flexDirection: "row", lineHeight: 0.6, gap: 10 },
                ]}
              >
                <View style={{ flex: 1, marginTop: 10 }}>
                  <View
                    style={[
                      styles.specificationsContainer,
                      { alignItems: "center" },
                    ]}
                  >
                    <View>
                      <Image
                        src={imageTableroControlPrueba}
                        style={{
                          width: 100,
                          height: "auto",
                          textAlign: "center",
                        }}
                      />
                    </View>
                    <Text style={{ fontSize: 8, color: "#333", marginTop: 20 }}>
                      {t("technical_report_pdf.control_panel_description")}
                    </Text>
                  </View>
                </View>
                <View style={{ flex: 1, marginTop: 10 }}>
                  <View style={styles.specificationsContainer}>
                    <Text style={{ fontSize: 8, color: "#0f0f0e" }}>
                      {t("technical_report_pdf.measurements")}
                    </Text>
                    {/* Mediciones del tablero */}
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                        marginBottom: 5,
                      }}
                    >
                      {ficha?.tablero?.measures?.length > 0 &&
                        ficha?.tablero?.measures.map((medicion, index) => (
                          <Text
                            key={index}
                            style={{
                              fontSize: 8,
                              color: "#333",
                              lineHeight: 1,
                            }}
                          >
                            - {medicion?.sTableroMedicionNombre}
                          </Text>
                        ))}
                    </View>
                  </View>
                </View>
                <View style={{ flex: 1, marginTop: 10 }}>
                  <View style={styles.specificationsContainer}>
                    <Text style={{ fontSize: 8, color: "#0f0f0e" }}>
                      {t("technical_report_pdf.protections")}
                    </Text>
                    {/* Protecciones del tablero */}
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                        marginBottom: 5,
                      }}
                    >
                      {ficha?.tablero?.protections?.length > 0 &&
                        ficha?.tablero?.protections.map((proteccion, index) => (
                          <Text
                            key={index}
                            style={{
                              fontSize: 8,
                              color: "#333",
                              lineHeight: 1,
                            }}
                          >
                            - {proteccion?.sTableroProteccionNombre}
                          </Text>
                        ))}
                    </View>
                  </View>
                </View>
              </View>
            </View>

            <View style={{ flexDirection: "row", alignItems: "stretch" }}>
              <View style={{ flex: 1 }}>
                <View style={styles.grupoHeaderWide}>
                  <Text
                    style={[
                      styles.grupoHeaderText,
                      { textTransform: "uppercase" },
                    ]}
                  >
                    {t("technical_report_pdf.standard_accessories")}
                  </Text>
                </View>

                <View style={[styles.container, { flexGrow: 1 }]}>
                  <View
                    style={[
                      styles.specificationsContainer,
                      { marginTop: 3, lineHeight: 0.6 },
                    ]}
                  >
                    <View
                      style={{
                        fontSize: 8,
                        color: "#333",
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                      }}
                    >
                      {/* Accesorios de la cotizacion */}
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 6,
                          marginBottom: 5,
                        }}
                      >
                        {/* No existe equipamiento estandar del modelo de grupo electrógeno. */}
                        {ficha?.standardEquipment?.length === 0 && (
                          <Text
                            style={{
                              fontSize: 8,
                              color: "#333",
                              lineHeight: 1,
                            }}
                          >
                            {t(
                              "technical_report_pdf.standard_accessories_not_stock"
                            )}
                          </Text>
                        )}

                        {/* Equipamiento estandar del grupo electrogeno */}
                        {ficha?.standardEquipment?.length > 0 &&
                          ficha?.standardEquipment.map((accesory, index) => (
                            <Text
                              key={index}
                              style={{
                                fontSize: 8,
                                color: "#333",
                                lineHeight: 1,
                              }}
                            >
                              - {accesory?.sEquipamientoEstandarNombre}
                            </Text>
                          ))}

                        {/* Accesorios de la cotización */}
                        {accesories &&
                          accesories.length > 0 &&
                          accesories.map((accesory, index) => (
                            <Text
                              key={index}
                              style={{
                                fontSize: 8,
                                color: "#333",
                                lineHeight: 1,
                              }}
                            >
                              - {accesory.Nombre}
                            </Text>
                          ))}
                      </View>
                    </View>
                  </View>
                </View>
                <Text
                  style={{
                    fontSize: 7,
                    color: "#666",
                    fontStyle: "italic",
                    textAlign: "start",
                    marginLeft: 20,
                    marginRight: 20,
                    marginTop: 2,
                  }}
                >
                  * {t("technical_report_pdf.standard_accessories_more_info")}
                </Text>
              </View>

              <View style={{ flex: 1 }}>
                <View style={[styles.grupoHeader]}>
                  <Text
                    style={[
                      styles.grupoHeaderText,
                      { textTransform: "uppercase" },
                    ]}
                  >
                    {t("technical_report_pdf.optional_accessories")}
                  </Text>
                </View>

                <View style={[styles.container, { flexGrow: 1 }]}>
                  {/* Opcionales del Grupo Electrógeno */}
                  <View
                    style={[
                      styles.specificationsContainer,
                      { marginTop: 3, lineHeight: 0.6 },
                    ]}
                  >
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                        marginBottom: 5,
                      }}
                    >
                      {!accesories && ficha?.optionals?.length === 0 && (
                        <Text
                          style={{
                            fontSize: 8,
                            color: "#333",
                            lineHeight: 1,
                          }}
                        >
                          {t(
                            "technical_report_pdf.optional_accessories_not_stock"
                          )}
                        </Text>
                      )}

                      {/* Opcionales del grupo electrogeno */}
                      {ficha?.optionals?.length > 0 &&
                        ficha?.optionals?.map((accesory, index) => (
                          <Text
                            key={index}
                            style={{
                              fontSize: 8,
                              color: "#333",
                              lineHeight: 1,
                            }}
                          >
                            - {accesory?.sEquipamientoOpcionalNombre}
                          </Text>
                        ))}
                    </View>
                  </View>
                </View>
                <Text
                  style={{
                    fontSize: 7,
                    color: "#666",
                    fontStyle: "italic",
                    textAlign: "start",
                    marginLeft: 20,
                    marginRight: 20,
                    marginTop: 2,
                  }}
                >
                  * {t("technical_report_pdf.optional_accessories_more_info")}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          <View>
            <View>
              <View style={styles.container}>
                <View style={styles.specificationsContainer}>
                  <Text
                    style={{
                      fontSize: 8,
                      color: "#565454",
                      padding: 4,
                      textAlign: "center",
                    }}
                  >
                    M: Modasa /{" "}
                    {ficha?.sMotMarca === "HYUNDAI" ||
                    ficha?.sMotMarca === "HYUNDAI UL"
                      ? "D"
                      : ficha?.sMotMarca.charAt(0)}
                    : {t("technical_report_pdf.motor")} {ficha?.sMotMarca} /{" "}
                    {ficha?.sModNombre?.split("-")[1]}:{" "}
                    {t("technical_report_pdf.power_reference_ge")}
                  </Text>
                </View>
              </View>
            </View>

            <View style={{ marginTop: 7, marginBottom: 7 }}>
              <View style={[styles.container, { backgroundColor: "#7c7a7a" }]}>
                <View style={styles.specificationsContainer}>
                  <Text
                    style={{
                      fontSize: 8,
                      color: "#eae7e7",
                      padding: 4,
                      textAlign: "center",
                    }}
                  >
                    * {t("technical_report_pdf.note")}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 2 }}>
              <View style={[{ backgroundColor: "#fea029", height: 8 }]}>
                <View style={styles.specificationsContainer}></View>
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <View style={[{ backgroundColor: "#030963", height: 8 }]}>
                <View style={styles.specificationsContainer}></View>
              </View>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              backgroundColor: "#ffffff",
              marginTop: 12,
              padding: 10,
            }}
          >
            <View style={{ flex: 2, flexDirection: "row", marginLeft: 10 }}>
              <View style={{ flex: 1 }}>
                <View
                  style={[styles.specificationsContainer, { lineHeight: 0.5 }]}
                >
                  <Text style={{ fontSize: 8, color: "#403f3f" }}>
                    {t("technical_report_pdf.international_sales")}:{" "}
                    <Text style={{ color: "#565454" }}> (+51 1) 615 8500 </Text>{" "}
                  </Text>
                  <Text style={{ fontSize: 8, color: "#403f3f" }}>
                    {t("technical_report_pdf.national_sales")}:{" "}
                    <Text style={{ color: "#565454" }}>
                      {" "}
                      ES (+51 1) 615 8500{" "}
                    </Text>{" "}
                  </Text>
                  <Text
                    style={{
                      fontSize: 8,
                      color: "#fe9014",
                      fontWeight: "bold",
                    }}
                  >
                    {getFormattedDate()}
                  </Text>
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <View
                  style={[styles.specificationsContainer, { lineHeight: 0.5 }]}
                >
                  <Text style={{ fontSize: 8, color: "#403f3f" }}>
                    {t("technical_report_pdf.offices")}:{" "}
                    <Text style={{ color: "#565454" }}>
                      {" "}
                      Av. Santa Lucía 356, Ate Vitarte{" "}
                    </Text>{" "}
                  </Text>
                  <Text style={{ fontSize: 8, color: "#403f3f" }}>
                    {t("technical_report_pdf.manufacturing_plant")}:{" "}
                    <Text style={{ color: "#565454" }}>
                      {" "}
                      Ant. Panamericana Sur Km 38.2 - Lurín{" "}
                    </Text>{" "}
                  </Text>
                  <Text
                    style={{
                      fontSize: 8,
                      color: "#fe9014",
                      fontWeight: "bold",
                    }}
                    onPress={"https://www.modasa.com.pe"}
                  >
                    www.modasa.com.pe
                  </Text>
                </View>
              </View>
            </View>

            <View style={{ flex: 1, marginRight: 10 }}>
              <View style={{}}>
                <View style={styles.specificationsContainer}>
                  <Image src={modasa} style={styles.logo} />
                </View>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};
