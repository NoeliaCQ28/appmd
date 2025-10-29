import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { useTranslation } from "react-i18next";

export const NoiseIndicator = ({ level, ambient }) => {
  const { t } = useTranslation();

  return (
    <View style={[styles.container]}>
      <View style={styles.gridContainer}>
        <View style={styles.titleSection}>
          <Text style={styles.titleText}>
            {t("technical_report_pdf.enclosed_genset")} dBA @ 7m
          </Text>
        </View>
        <View style={styles.noiseSection}>
          <Text style={styles.label}>
            {t("technical_report_pdf.noise_level")}
          </Text>
          <Text style={styles.value}>{level}</Text>
        </View>
        <View style={styles.noiseSection}>
          <Text style={styles.label}>
            {t("technical_report_pdf.environment_noise")}
          </Text>
          <Text style={styles.value}>{ambient}</Text>
        </View>
      </View>
      <Text style={styles.noteText}>
        {t("technical_report_pdf.reference_noise_level")}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
    borderRadius: 4,
    marginBottom: 1,
  },

  gridContainer: {
    flexDirection: "row",
  },
  titleSection: {
    flex: 1,
    backgroundColor: "#4b5563",
    padding: 8,
  },
  titleText: {
    color: "#ffffff",
    fontSize: 8,
    fontWeight: "bold",
  },
  noiseSection: {
    flex: 1.2,
    backgroundColor: "#ffffff",
    padding: 8,
  },
  label: {
    fontSize: 7,
    color: "#4b5563",
    marginBottom: 2,
  },
  value: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#1f2937",
  },

  noteContainer: {
    borderTop: "1pt solid #e5e7eb",
    padding: "4 8",
  },
  noteText: {
    fontSize: 7,
    fontStyle: "italic",
    color: "#040f67",
    textAlign: "right",
    marginRight: 20,
  },
});
