import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { useTranslation } from "react-i18next";
import { currentLanguage } from "../../../../libs/i18n";
import { convertUnit } from "../../../../utils/unitConversion";

export const MotorIndicator = ({
  frecuencia = 60,
  standBy1800,
  prime1800,
  prime1800_75,
  prime1800_50,
  standBy1500,
  prime1500,
  prime1500_75,
  prime1500_50,
}) => {
  const { i18n, t } = useTranslation();
  const current = currentLanguage(i18n);
  const countryCode = current.code;

  return (
    <View style={styles.container}>
      <View style={styles.titleSection}>
        <Text style={styles.titleText}>
          {t("technical_report_pdf.fuel_consumption")} {t("units.liquid/h")}
        </Text>
      </View>
      <View style={styles.gridContainer}>
        <View style={styles.noiseSection}>
          <Text style={styles.value}>
            {t("technical_report_pdf.engine_speed")}
          </Text>
          <Text style={styles.value}>
            {t("technical_report_pdf.standby_power")}
          </Text>
          <Text style={styles.value}>
            {t("technical_report_pdf.prime_power")}
          </Text>
          <Text style={styles.value}>
            75% {t("technical_report_pdf.prime_power")}
          </Text>
          <Text style={styles.value}>
            50% {t("technical_report_pdf.prime_power")}
          </Text>
        </View>

        {frecuencia === 60 ? (
          <View style={styles.noiseSection}>
            <Text style={styles.value}>1800 RPM</Text>
            <Text style={styles.value}>
              {countryCode === "en"
                ? convertUnit(standBy1800, "l", "gal", 1)
                : standBy1800}
            </Text>
            <Text style={styles.value}>
              {countryCode === "en"
                ? convertUnit(prime1800, "l", "gal", 1)
                : prime1800}
            </Text>
            <Text style={styles.value}>
              {countryCode === "en"
                ? convertUnit(prime1800_75, "l", "gal", 1)
                : prime1800_75}
            </Text>
            <Text style={styles.value}>
              {countryCode === "en"
                ? convertUnit(prime1800_50, "l", "gal", 1)
                : prime1800_50}
            </Text>
          </View>
        ) : (
          <View style={styles.noiseSection}>
            <Text style={styles.label}>1500 RPM {t("units.liquid/h")}</Text>
            <Text style={styles.value}>{standBy1500}</Text>
            <Text style={styles.value}>{prime1500}</Text>
            <Text style={styles.value}>{prime1500_75}</Text>
            <Text style={styles.value}>{prime1500_50}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
    borderRadius: 4,
    marginBottom: 1,
    textAlign: "center",
  },

  titleSection: {
    backgroundColor: "#4b5563",
    padding: 8,
    textAlign: "center",
  },
  titleText: {
    color: "#ffffff",
    fontSize: 8,
    fontWeight: "bold",
  },

  gridContainer: {
    flexDirection: "row",
    textAlign: "center",
    marginTop: 2,
  },

  noiseSection: {
    backgroundColor: "#ffffff",
    padding: 8,
    marginBottom: 4,
    textAlign: "center",
    flex: 1,
  },

  label: {
    fontSize: 7,
    color: "#4b5563",
    marginBottom: 2,
    textAlign: "center",
  },

  value: {
    fontSize: 8,
    fontWeight: "normal",
    color: "#717171",
    textAlign: "center",
  },

  noteContainer: {
    borderTop: "1pt solid #e5e7eb",
    padding: "4 8",
  },
  noteText: {
    fontSize: 7,
    fontStyle: "italic",
    color: "#6b7280",
  },
});
