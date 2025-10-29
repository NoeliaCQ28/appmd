import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import Html from "react-pdf-html";
import RobotoBold from "/assets/fonts/roboto-bold-webfont.ttf";
import RobotoBoldItalic from "/assets/fonts/roboto-bolditalic-webfont.ttf";
import RobotoItalic from "/assets/fonts/roboto-italic-webfont.ttf";
import Roboto from "/assets/fonts/roboto-regular-webfont.ttf";
import iso90012008 from "/iso-9001-2008.png";
import modasa from "/modasa.png";
import paymentInfoImage from "/payment-info-modasa.png";
import paymentInfoExportImage from "/payment-info-modasa-export.jpg";
import site from "../../../../config/site";

Font.register({
  family: "Roboto",
  fonts: [
    {
      src: Roboto,
    },
    {
      src: RobotoBold,
      fontWeight: "bold",
    },
    {
      src: RobotoItalic,
      fontWeight: "normal",
      fontStyle: "italic",
    },
    {
      src: RobotoBoldItalic,
      fontWeight: "bold",
      fontStyle: "italic",
    },
  ],
  format: "truetype",
});

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    padding: 20,
    paddingBottom: 100,
    fontSize: 7,
    fontFamily: "Roboto",
    rowGap: 3,
  },
  header: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  header_title: {
    textAlign: "center",
    fontFamily: "Roboto",
    fontSize: 9,
  },
  header_description_container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  header_description_item_left_container: {
    flex: 1,
    textAlign: "left",
    gap: 3,
  },
  header_description_item_right_container: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 6,
  },
  header_description_item_right_container_left_item: {
    textAlign: "left",
    gap: 3,
  },
  header_description_item_right_container_right_item: {
    textAlign: "center",
    gap: 3,
  },
  logo: {
    width: 110,
    height: 20,
    paddingRight: 10,
    marginBottom: 10,
  },
  ISOSignature: {
    width: 50,
    height: 50,
    objectFit: "contain",
    marginLeft: 10,
    marginBottom: 10,
  },
  horizontal_line: {
    height: "0.5px",
    backgroundColor: "black",
  },
  bold: {
    fontFamily: "Roboto",
    fontWeight: "bold",
  },
  executiveInfo: {
    position: "absolute",
    bottom: 40,
    fontSize: 6,
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: "#3c3c3c",
    fontStyle: "italic",
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    fontSize: 7,
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    gap: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

const sectionStyles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 3,
  },
  title: {
    fontFamily: "Roboto",
    fontWeight: "bold",
  },
});

const tableStyles = StyleSheet.create({
  table: {
    display: "table",
    width: "100%",
    fontSize: 6,
    borderCollapse: "collapse",
    marginBottom: 10,
  },
  table_row: {
    flexDirection: "row",
    borderBottomWidth: 0.1,
    borderBottomColor: "#000",
    padding: 0,
  },
  table_cell: { flex: 1, padding: 3 },
  table_cell_header: {
    flex: 1,
    padding: 3,
    fontFamily: "Roboto",
    fontWeight: "bold",
    fontSize: 7,
  },
});

const IncotermSection = ({
  economicOffer,
  currency,
  table = "SIMPLE" | "DETAIL",
}) => {
  const marketIsNational = economicOffer.MercadoNombre === "NACIONAL";

  const frightAmount = economicOffer?.incoterm_valor_flete_usd || 0;
  const insuranceAmount = economicOffer?.incoterm_valor_seguro_usd || 0;

  const incotermCode = economicOffer?.incoterm_codigo;
  const incotermCategory = economicOffer?.incoterm_categoria_nombre;
  const incotermDescription = economicOffer?.incoterm_descripcion;

  if (!marketIsNational) {
    const rowColumnsSpanStyle =
      table === "SIMPLE"
        ? [{ flex: 2.3 }, { flex: 1.5 }, { flex: 0.5 }, { flex: 0.5 }]
        : [{ flex: 6 }, { flex: 3 }, { flex: 0.5 }, { flex: 0.8 }];

    switch (incotermCategory) {
      case "Flete y Seguros":
        return (
          <>
            <View style={[tableStyles.table_row]}>
              <Text
                style={[tableStyles.table_cell, rowColumnsSpanStyle[0]]}
              ></Text>
              <Text
                style={[
                  tableStyles.table_cell,
                  rowColumnsSpanStyle[1],
                  {
                    fontFamily: "Roboto",
                    fontWeight: "bold",
                  },
                ]}
              >
                Incoterm {incotermCode} - {incotermDescription} (Flete)
              </Text>
              <Text style={[tableStyles.table_cell, rowColumnsSpanStyle[2]]}>
                {`(${currency.code})`}
              </Text>
              <Text style={[tableStyles.table_cell, rowColumnsSpanStyle[3]]}>
                {parseFloat(frightAmount).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>
            </View>
            <View style={[tableStyles.table_row]}>
              <Text
                style={[tableStyles.table_cell, rowColumnsSpanStyle[0]]}
              ></Text>
              <Text
                style={[
                  tableStyles.table_cell,
                  rowColumnsSpanStyle[1],
                  { fontFamily: "Roboto", fontWeight: "bold" },
                ]}
              >
                Incoterm {incotermCode} - {incotermDescription} (Seguro)
              </Text>
              <Text style={[tableStyles.table_cell, rowColumnsSpanStyle[2]]}>
                {`(${currency.code})`}
              </Text>
              <Text style={[tableStyles.table_cell, rowColumnsSpanStyle[3]]}>
                {parseFloat(insuranceAmount).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>
            </View>
          </>
        );

      case "Flete":
        return (
          <View style={[tableStyles.table_row]}>
            <Text
              style={[tableStyles.table_cell, rowColumnsSpanStyle[0]]}
            ></Text>
            <Text
              style={[
                tableStyles.table_cell,
                rowColumnsSpanStyle[1],
                { fontFamily: "Roboto", fontWeight: "bold" },
              ]}
            >
              Incoterm {incotermCode} - {incotermDescription} (Flete)
            </Text>
            <Text style={[tableStyles.table_cell, rowColumnsSpanStyle[2]]}>
              {`(${currency.code})`}
            </Text>
            <Text style={[tableStyles.table_cell, rowColumnsSpanStyle[3]]}>
              {parseFloat(frightAmount).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
          </View>
        );
      case "Sin Flete ni Seguros":
        break;
      default:
        break;
    }
  }

  return null;
};

const composeDescription = ({ item, quoteType }) => {
  let composeDescription = "";

  switch (quoteType) {
    // Grupos Electrogenos
    case 1:
      {
        composeDescription = `GRUPO ELECTROGENO ${item.quote_extra_details?.sModNombre}`;
      }
      break;
    // Cables
    case 2:
      {
        composeDescription = `${item.quote_extra_details?.CableNombre}`;
      }
      break;
    // Celdas
    case 3:
      {
        composeDescription = `${item.quote_extra_details?.CeldaDescripcion}`;
      }
      break;
    // Transformadores
    case 4:
      {
        composeDescription = `${item.quote_extra_details?.TransformadorNombre}`;
      }
      break;
  }

  return composeDescription;
};

const SimpleTable = ({
  items,
  economicOffer,
  quoteType,
  currency,
  evalTypeChange,
}) => {
  const margin = Number.parseFloat(economicOffer.margen_global);

  const marginFactor =
    quoteType === 1 ? 1 : 1 / (1 - Number.parseFloat(margin) / 100);

  const marketName = economicOffer.MercadoNombre;

  let total = Number(economicOffer.total) || 0;

  const IGV_RATE = 1.18;

  switch (marketName) {
    case "NACIONAL":
      total *= IGV_RATE;
      break;
    case "EXPORTACIÓN":
      {
        const frightAmount = Number(
          economicOffer?.incoterm_valor_flete_usd || 0
        );
        const insuranceAmount = Number(
          economicOffer?.incoterm_valor_seguro_usd || 0
        );

        const incotermCategory = economicOffer?.incoterm_categoria_nombre;

        switch (incotermCategory) {
          case "Flete y Seguros": {
            total += frightAmount + insuranceAmount;
            break;
          }
          case "Flete": {
            total += frightAmount;
            break;
          }
          case "Sin Flete ni Seguros":
            break;
        }
      }
      break;
    default:
      break;
  }

  return (
    <View>
      <View style={tableStyles.table}>
        <View
          style={[
            tableStyles.table_row,
            {
              backgroundColor: "#404040",
              color: "white",
            },
          ]}
        >
          <Text style={[tableStyles.table_cell_header, { flex: 0.5 }]}>
            ITEM
          </Text>
          <Text style={[tableStyles.table_cell_header, { flex: 3 }]}>
            DESCRIPCIÓN
          </Text>
          <Text style={[tableStyles.table_cell_header, { flex: 0.3 }]}>
            CTD
          </Text>
          <Text style={[tableStyles.table_cell_header, { flex: 0.5 }]}>
            PRECIO <Text>({currency.code})</Text>
          </Text>
          <Text style={[tableStyles.table_cell_header, { flex: 0.5 }]}>
            PARCIAL <Text>({currency.code})</Text>
          </Text>
        </View>
        {items?.map((item, index) => {
          const description = composeDescription({ item, quoteType });

          const shippingCost =
            Number(item?.nCotDetEnvio) === 1
              ? Number(item?.nCotDetCostoEnvio)
              : 0;
          const startupCost =
            Number(item?.nCotDetPuestoEnMarcha) === 1
              ? Number(item?.nCotDetCostoPuestoEnMarcha)
              : 0;

          const unitPrice = Number.parseFloat(item.nCotDetPrecioUnitario) || 0;

          const unitPriceWithCosts = unitPrice + shippingCost + startupCost;
          const unitPriceForMarginWithCosts = unitPrice + shippingCost;

          const unitPriceStandar =
            quoteType === 1
              ? unitPrice
              : margin > 0.0
              ? unitPriceForMarginWithCosts
              : unitPriceWithCosts;

          const quantity = Number.parseInt(item.nCotDetCantidad) || 1;

          const parcialPrice = unitPriceStandar * quantity;

          const priceWithMargin = Number(
            unitPriceStandar * marginFactor
          ).toFixed(2);
          const itemTotalWithMargin = Number(
            parcialPrice * marginFactor
          ).toFixed(2);

          return (
            <View
              key={index}
              style={[tableStyles.table_row, { backgroundColor: "#e7e6e6" }]}
            >
              <Text style={[tableStyles.table_cell, { flex: 0.5 }]}>
                {`${String(index + 1).padStart(2, "0")}.00`}
              </Text>
              <Text style={[tableStyles.table_cell, { flex: 3 }]}>
                {description}
              </Text>
              <Text style={[tableStyles.table_cell, { flex: 0.3 }]}>
                {quantity}
              </Text>
              <Text style={[tableStyles.table_cell, { flex: 0.5 }]}>
                {evalTypeChange(priceWithMargin)}
              </Text>
              <Text style={[tableStyles.table_cell, { flex: 0.5 }]}>
                {evalTypeChange(itemTotalWithMargin)}
              </Text>
            </View>
          );
        })}
        {/* Fila del total */}
        <View style={[tableStyles.table_row]}>
          <Text style={[tableStyles.table_cell, { flex: 2.3 }]}></Text>
          <Text
            style={[
              tableStyles.table_cell,
              { flex: 1.5, fontFamily: "Roboto", fontWeight: "bold" },
            ]}
          >
            Sub Total en {currency?.description}{" "}
          </Text>
          <Text style={[tableStyles.table_cell, { flex: 0.5 }]}>
            ({currency?.code})
          </Text>
          <Text
            style={[
              tableStyles.table_cell,
              { flex: 0.5, fontFamily: "Roboto", fontWeight: "bold" },
            ]}
          >
            {evalTypeChange(Number(economicOffer.total))}
          </Text>
        </View>
        {/* Fila del IGV  para nacional */}
        {economicOffer.MercadoNombre === "NACIONAL" && (
          <View style={[tableStyles.table_row]}>
            <Text style={[tableStyles.table_cell, { flex: 2.3 }]}></Text>
            <Text style={[tableStyles.table_cell, { flex: 1.5 }]}>IGV</Text>
            <Text style={[tableStyles.table_cell, { flex: 0.5 }]}>18.00%</Text>
            <Text
              style={[
                tableStyles.table_cell,
                { flex: 0.5, fontFamily: "Roboto", fontWeight: "bold" },
              ]}
            >
              {evalTypeChange(total - Number(economicOffer.total))}
            </Text>
          </View>
        )}
        {/* Incoterms */}
        <IncotermSection
          economicOffer={economicOffer}
          currency={currency}
          table={"SIMPLE"}
        />
        {/* Fila del total */}
        <View style={[tableStyles.table_row]}>
          <Text style={[tableStyles.table_cell, { flex: 2.3 }]}></Text>
          <Text
            style={[
              tableStyles.table_cell,
              { flex: 1.5, fontFamily: "Roboto", fontWeight: "bold" },
            ]}
          >
            Total Presupuesto en {currency?.description}{" "}
            {marketName === "NACIONAL" && " (Incluye IGV)"}
          </Text>
          {/* <Text style={[tableStyles.table_cell, { flex: 0.3 }]}></Text> */}
          <Text style={[tableStyles.table_cell, { flex: 0.5 }]}>
            ({currency?.code})
          </Text>
          <Text
            style={[
              tableStyles.table_cell,
              { flex: 0.5, fontFamily: "Roboto", fontWeight: "bold" },
            ]}
          >
            {evalTypeChange(total)}
          </Text>
        </View>
      </View>
      <View id="table_footer" style={tableStyles.table}>
        <Text>
          *Depósitos en {currency.description}, favor consultar el tipo de
          cambio
        </Text>
      </View>
    </View>
  );
};

const observationsStyles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  title: {
    fontFamily: "Roboto",
    fontWeight: "bold",
  },
});

const comercialConditionsStyles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  title: {
    fontFamily: "Roboto",
    fontWeight: "bold",
  },
});

const Observations = ({ observationsHtml }) => {
  return (
    <View style={observationsStyles.container}>
      <Text style={observationsStyles.title}>OBSERVACIONES</Text>
      <Html
        style={{ fontSize: 7, lineHeight: 1.6 }}
        stylesheet={{
          p: {
            marginBottom: 2,
            marginTop: 0,
          },
        }}
      >
        {observationsHtml}
      </Html>
    </View>
  );
};

const ComercialConditions = ({ comercialConditionsHtml }) => {
  if (!comercialConditionsHtml || comercialConditionsHtml.trim() === "") {
    return null;
  }

  return (
    <View style={comercialConditionsStyles.container}>
      <Html
        style={{ fontSize: 7, lineHeight: 1.6 }}
        stylesheet={{
          p: {
            marginBottom: 2,
            marginTop: 0,
          },
        }}
      >
        {comercialConditionsHtml}
      </Html>
    </View>
  );
};

const Section = ({ title, description }) => {
  return (
    <View style={sectionStyles.container}>
      <Text style={sectionStyles.title}>{title}</Text>

      <Text>{description}</Text>
    </View>
  );
};

const ExtendDescription = ({ item, quoteType }) => {
  switch (quoteType) {
    // Grupos Electrogenos
    case 1: {
      return (
        <View style={tableStyles.table_row}>
          <Text style={[tableStyles.table_cell, { flex: 0.5 }]}></Text>
          <View style={[tableStyles.table_cell, { flex: 4, gap: "2px" }]}>
            <Text>MARCA: MODASA</Text>
            <Text style={{ fontFamily: "Roboto" }}>
              MODELO:{" "}
              <Text style={{ fontWeight: "bold" }}>
                {item.quote_extra_details.sModNombre}
              </Text>
            </Text>
            <Text style={{ color: "#5c7dad" }}>
              TIEMPO ESTIMADO DE ENTREGA:{" "}
              {item.quote_extra_details.nIntDiasParaEntrega} DIAS
            </Text>
            <Text>Especificaciones:</Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingLeft: 10,
              }}
            >
              <View
                style={{
                  display: "flex",
                  flex: 1,
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <Text>- Motor: Marca / Modelo </Text>
                <Text>- Alternador: Marca / Modelo </Text>
                <Text>- Tensión (V)</Text>
                <Text>- Frecuencia (Hz)</Text>
                <Text>- Fases</Text>
                <Text>- Altura de trabajo</Text>
                <Text>- Potencia prime (kW/kVA)</Text>
                <Text>- Potencia stand by (kW/kVA)</Text>
                <Text>- Regimén</Text>
                <Text>- ITM </Text>
                <Text>- Módulo de Control </Text>
                {/* <Text>- Señales de arranque</Text>
                <Text>- Cargador de Bateria</Text> */}
                <Text>- Tipo de GE </Text>
                <Text>- Silenciador (Indicar para GE abierto) </Text>
                <Text>- Capacidad de tanque en Galones </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flex: 0.3,
                  flexDirection: "column",
                }}
              >
                <Text>:</Text>
                <Text>:</Text>
                <Text>:</Text>
                <Text>:</Text>
                <Text>:</Text>
                <Text>:</Text>
                <Text>:</Text>
                <Text>:</Text>
                <Text>:</Text>
                <Text>:</Text>
                <Text>:</Text>
                {/* <Text>:</Text>
                <Text>:</Text> */}
                <Text>:</Text>
                <Text>:</Text>
                <Text>:</Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flex: 1,
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Text>
                  {item.quote_extra_details?.sMotMarcaVisual}{" "}
                  {item.quote_extra_details?.sMotModelo}
                </Text>
                <Text>
                  {item.quote_extra_details?.sAltMarca}{" "}
                  {item.quote_extra_details?.sAltModelo}
                </Text>
                <Text>{item.quote_extra_details.nIntVoltaje}V</Text>
                <Text>{item.quote_extra_details.nIntFrecuencia} Hz</Text>
                <Text>{item.quote_extra_details.nIntFases}</Text>
                <Text>{item.quote_extra_details.nIntAltura} msnm</Text>
                <Text>
                  {item.quote_extra_details.PrimeKW || "--"}{" "}
                  {site.powerUnits.kilowatt} ({" "}
                  {item.quote_extra_details.PrimeKVA || "--"}{" "}
                  {site.powerUnits.kilovoltAmpere})
                </Text>
                <Text>
                  {item.quote_extra_details.StandByKW || "--"}{" "}
                  {site.powerUnits.kilowatt} ({" "}
                  {item.quote_extra_details.StandByKVA || "--"}{" "}
                  {site.powerUnits.kilovoltAmpere})
                </Text>
                <Text>{item.quote_extra_details.sRegimen}</Text>
                <Text>
                  {item.quote_extra_details?.nITMAActual ? `3x${item.quote_extra_details?.nITMAActual}A` : "--A"}
                </Text>
                <Text>{item.quote_extra_details.sModuloDeControl}</Text>
                {/* <Text>--</Text>
                <Text>--</Text> */}
                <Text>{item.quote_extra_details.sTipoGrupoElectrogeno}</Text>
                <Text>{item.quote_extra_details?.sIntSileciadorTipo}</Text>
                <Text>
                  {item.quote_extra_details.nIntInsonoro === 0
                    ? item.quote_extra_details.nModTcombAbierto
                    : item.quote_extra_details.nModTcombInsonoro}{" "}
                  Gal
                </Text>
              </View>
            </View>

            {item?.quote_extra_details?.accessories?.length > 0 && (
              <Text>Accesorios:</Text>
            )}

            <View
              style={{
                display: "flex",
                flexDirection: "column",
                paddingLeft: 10,
              }}
            >
              {item?.quote_extra_details?.accessories?.map(
                (accessory, index) => (
                  <Text key={index}>
                    -{" "}
                    {accessory?.name?.trim() +
                      " " +
                      accessory?.description?.trim()}
                  </Text>
                )
              )}
            </View>

            {(item?.quote_extra_details?.operativeCosts?.shipping?.isPresent ===
              1 ||
              item?.quote_extra_details?.operativeCosts?.startup?.isPresent ===
                1) && <Text>Incluye:</Text>}

            <View
              style={{
                display: "flex",
                flexDirection: "column",
                paddingLeft: 10,
              }}
            >
              {item?.quote_extra_details?.operativeCosts?.shipping
                ?.isPresent === 1 && <Text>- Envio</Text>}
              {item?.quote_extra_details?.operativeCosts?.startup?.isPresent ===
                1 && <Text>- Puesta en Marcha</Text>}
            </View>

            <Text style={{ marginTop: "16px" }}>
              <Text style={{ fontFamily: "Roboto", fontWeight: "bold" }}>
                NORMAS Y CONDICIONES DE AMBIENTE
              </Text>
            </Text>
            <Text>25°C / + 100 msnm / 60 % humedad relativa</Text>
            <Text>
              El grupo electrógeno está diseñado y fabricado en las
              instalaciones de MODASA, certificada según la norma ISO 9001:
            </Text>
            <Text>
              -{" "}
              <Text style={{ fontFamily: "Roboto", fontWeight: "bold" }}>
                Grupos electrógenos
              </Text>
              :{" "}
              <Text>
                {item.quote_extra_details.sModNormaTecnica !== ""
                  ? item.quote_extra_details.sModNormaTecnica
                  : "--"}
              </Text>
            </Text>
            <Text>
              -{" "}
              <Text style={{ fontFamily: "Roboto", fontWeight: "bold" }}>
                Motor
              </Text>
              :{" "}
              <Text>
                {item.quote_extra_details.sMotNormasTecnicas !== ""
                  ? item.quote_extra_details.sMotNormasTecnicas
                  : "--"}
              </Text>
            </Text>
            <Text>
              -{" "}
              <Text style={{ fontFamily: "Roboto", fontWeight: "bold" }}>
                Alternador
              </Text>{" "}
              <Text style={{ fontFamily: "Roboto", fontWeight: "bold" }}>
                {item.quote_extra_details.sAltMarca}
              </Text>
              :{" "}
              <Text>
                {item.quote_extra_details.sAltNormaTecnica !== ""
                  ? item.quote_extra_details.sAltNormaTecnica
                  : "--"}
              </Text>
            </Text>
          </View>
          <Text style={[tableStyles.table_cell, { flex: 0.5 }]}></Text>
          <Text style={[tableStyles.table_cell, { flex: 0.5 }]}></Text>
          <Text style={[tableStyles.table_cell, { flex: 0.5 }]}></Text>
          <Text style={[tableStyles.table_cell, { flex: 0.5 }]}></Text>
        </View>
      );
    }

    // Cables
    case 2: {
      return (
        <View style={tableStyles.table_row}>
          <Text style={[tableStyles.table_cell, { flex: 0.5 }]}></Text>
          <View style={[tableStyles.table_cell, { flex: 4 }]}>
            <Text>MARCA: {item.quote_extra_details.CableMarca}</Text>
            <Text>TIPO: {item.quote_extra_details.CableTipo}</Text>
            <Text style={{ color: "#5c7dad" }}>
              TIEMPO ESTIMADO DE ENTREGA:{" "}
              {item.quote_extra_details.CableDiasParaEntrega} DIAS
            </Text>
            <Text>
              CANTIDAD:{" "}
              {Number.parseInt(item.quote_extra_details.CableCantidad)}{" "}
              UNIDAD(S) {/* Updated to plural for consistency */}
            </Text>

            <Text>Especificaciones:</Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingLeft: 10,
              }}
            >
              <View
                style={{
                  display: "flex",
                  flex: 1,
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <Text>- Detalles</Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flex: 0.3,
                  flexDirection: "column",
                }}
              >
                <Text>:</Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flex: 1,
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Text>{item.quote_extra_details.CableDescripcion}</Text>
              </View>
            </View>

            {(item.nCotDetEnvio === 1 || item.nCotDetPuestoEnMarcha === 1) && (
              <Text>Incluye:</Text>
            )}

            <View
              style={{
                display: "flex",
                flexDirection: "column",
                paddingLeft: 10,
              }}
            >
              {item.nCotDetEnvio === 1 && <Text>- Envio</Text>}
              {item.nCotDetPuestoEnMarcha === 1 && (
                <Text>- Puesta en Marcha</Text>
              )}
            </View>
          </View>
          <Text style={[tableStyles.table_cell, { flex: 0.5 }]}></Text>
          <Text style={[tableStyles.table_cell, { flex: 0.5 }]}></Text>
          <Text style={[tableStyles.table_cell, { flex: 0.5 }]}></Text>
          <Text style={[tableStyles.table_cell, { flex: 0.5 }]}></Text>
        </View>
      );
    }
    // Celdas
    case 3: {
      return (
        <View style={tableStyles.table_row}>
          <Text style={[tableStyles.table_cell, { flex: 0.5 }]}></Text>
          <View style={[tableStyles.table_cell, { flex: 4 }]}>
            <Text>MARCA: {item.quote_extra_details.CeldaMarca}</Text>
            <Text>TIPO: {item.quote_extra_details.CeldaTipo}</Text>
            <Text style={{ color: "#5c7dad" }}>
              TIEMPO ESTIMADO DE ENTREGA:{" "}
              {item.quote_extra_details.CeldaDiasParaEntrega} DIAS
            </Text>
            <Text>
              CANTIDAD:{" "}
              {Number.parseInt(item.quote_extra_details.CeldaCantidad)}{" "}
              UNIDAD(S) {/* Updated to plural for consistency */}
            </Text>
            <Text>Especificaciones:</Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingLeft: 10,
              }}
            >
              <View
                style={{
                  display: "flex",
                  flex: 1,
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <Text>- Detalles</Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flex: 0.3,
                  flexDirection: "column",
                }}
              >
                <Text>:</Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flex: 1,
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Text>{item.quote_extra_details.CeldaDetalle}</Text>
              </View>
            </View>
            {item?.otherComponents?.length > 0 && <Text>Accesorios:</Text>}

            <View
              style={{
                display: "flex",
                flexDirection: "column",
                paddingLeft: 10,
              }}
            >
              {item?.otherComponents?.map((component, index) => (
                <Text key={index}>
                  - {component.sCelAccDescripcion} MARCA:{" "}
                  {component.sCelMarDescripcion || "No especificado"}
                </Text>
              ))}
            </View>

            {(item.nCotDetEnvio === 1 || item.nCotDetPuestoEnMarcha === 1) && (
              <Text>Incluye:</Text>
            )}

            <View
              style={{
                display: "flex",
                flexDirection: "column",
                paddingLeft: 10,
              }}
            >
              {item.nCotDetEnvio === 1 && <Text>- Envio</Text>}
              {item.nCotDetPuestoEnMarcha === 1 && (
                <Text>- Puesta en Marcha</Text>
              )}
            </View>
          </View>

          <Text style={[tableStyles.table_cell, { flex: 0.5 }]}></Text>
          <Text style={[tableStyles.table_cell, { flex: 0.5 }]}></Text>
          <Text style={[tableStyles.table_cell, { flex: 0.5 }]}></Text>
          <Text style={[tableStyles.table_cell, { flex: 0.5 }]}></Text>
        </View>
      );
    }

    // Transformadores
    case 4: {
      return (
        <View style={tableStyles.table_row}>
          <Text style={[tableStyles.table_cell, { flex: 0.5 }]}></Text>
          <View style={[tableStyles.table_cell, { flex: 4 }]}>
            <Text>MARCA: {item.quote_extra_details.TransformadorMarca}</Text>
            <Text>TIPO: {item.quote_extra_details.TransformadorTipo}</Text>
            <Text style={{ color: "#5c7dad" }}>
              TIEMPO ESTIMADO DE ENTREGA:{" "}
              {item.quote_extra_details.TransformadorDiasParaEntrega} DIAS
            </Text>
            <Text>
              CANTIDAD:{" "}
              {Number.parseInt(item.quote_extra_details.TransformadorCantidad)}{" "}
              UNIDAD(S) {/* Updated to plural for consistency */}
            </Text>
            <Text>Especificaciones:</Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingLeft: 10,
              }}
            >
              <View
                style={{
                  display: "flex",
                  flex: 1,
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <Text>- Detalles</Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flex: 0.3,
                  flexDirection: "column",
                }}
              >
                <Text>:</Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flex: 1,
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Text>{item.quote_extra_details.TransformadorDescripcion}</Text>
              </View>
            </View>
            {item?.otherComponents?.length > 0 && <Text>Accesorios:</Text>}

            <View
              style={{
                display: "flex",
                flexDirection: "column",
                paddingLeft: 10,
              }}
            >
              {item?.otherComponents?.map((component, index) => (
                <Text key={index}>
                  - {component.sTraAccDescripcion} TIPO:{" "}
                  {component.sTraAccTipo || "No especificado"}
                </Text>
              ))}
            </View>

            {(item.nCotDetEnvio === 1 || item.nCotDetPuestoEnMarcha === 1) && (
              <Text>Incluye:</Text>
            )}

            <View
              style={{
                display: "flex",
                flexDirection: "column",
                paddingLeft: 10,
              }}
            >
              {item.nCotDetEnvio === 1 && <Text>- Envio</Text>}
              {item.nCotDetPuestoEnMarcha === 1 && (
                <Text>- Puesta en Marcha</Text>
              )}
            </View>
          </View>
          <Text style={[tableStyles.table_cell, { flex: 0.5 }]}></Text>
          <Text style={[tableStyles.table_cell, { flex: 0.5 }]}></Text>
          <Text style={[tableStyles.table_cell, { flex: 0.5 }]}></Text>
          <Text style={[tableStyles.table_cell, { flex: 0.5 }]}></Text>
        </View>
      );
    }
  }
};

const DetailTable = ({
  economicOffer,
  items,
  quoteType,
  currency,
  evalTypeChange,
}) => {
  const margin = Number.parseFloat(economicOffer.margen_global);

  const marginFactor = quoteType === 1 ? 1 : 1 / (1 - margin / 100);

  const marketIsNational = economicOffer.MercadoNombre === "NACIONAL";

  const totalWithMargin = Number(economicOffer.total);

  let totalWithIGV = marketIsNational
    ? totalWithMargin * 1.18
    : totalWithMargin;

  if (!marketIsNational) {
    switch (economicOffer.incoterm_categoria_nombre) {
      case "Flete y Seguros":
        totalWithIGV +=
          Number(economicOffer?.incoterm_valor_flete_usd || 0) +
          Number(economicOffer?.incoterm_valor_seguro_usd || 0);
        break;
      case "Flete":
        totalWithIGV += Number(economicOffer?.incoterm_valor_flete_usd || 0);
        break;
      case "Sin Flete ni Seguros":
        break;
      default:
        break;
    }
  }

  return (
    <View>
      <View style={tableStyles.table}>
        <View
          style={[
            tableStyles.table_row,
            {
              backgroundColor: "#404040",
              color: "white",
            },
          ]}
        >
          <Text style={[tableStyles.table_cell_header, { flex: 0.5 }]}>
            Item
          </Text>
          <Text style={[tableStyles.table_cell_header, { flex: 4 }]}>
            Descripción
          </Text>
          <Text style={[tableStyles.table_cell_header, { flex: 0.5 }]}>
            Und
          </Text>
          <Text style={[tableStyles.table_cell_header, { flex: 0.5 }]}>
            Cantidad
          </Text>
          <Text style={[tableStyles.table_cell_header, { flex: 0.5 }]}>
            Precio <Text>({currency.code})</Text>
          </Text>
          <Text style={[tableStyles.table_cell_header, { flex: 0.5 }]}>
            Parcial <Text>({currency.code})</Text>
          </Text>
        </View>
        {/* Row */}
        {items?.map((item, index) => {
          const description = composeDescription({ item, quoteType });

          const unitPrice = Number.parseFloat(item.nCotDetPrecioUnitario) || 0;

          const shippingCost =
            Number(item?.nCotDetEnvio) === 1
              ? Number(item?.nCotDetCostoEnvio)
              : 0;
          const startupCost =
            Number(item?.nCotDetPuestoEnMarcha) === 1
              ? Number(item?.nCotDetCostoPuestoEnMarcha)
              : 0;

          const unitPriceWithCosts = unitPrice + shippingCost + startupCost;
          const unitPriceForMarginWithCosts = unitPrice + shippingCost;

          const unitPriceStandar =
            quoteType === 1
              ? unitPrice
              : margin > 0.0
              ? unitPriceForMarginWithCosts
              : unitPriceWithCosts;

          const quantity = Number.parseInt(item.nCotDetCantidad) || 1;

          const parcialPrice = unitPriceStandar * quantity;

          const priceWithMargin = Number(
            unitPriceStandar * marginFactor
          ).toFixed(2);
          const itemTotalWithMargin = Number(
            parcialPrice * marginFactor
          ).toFixed(2);

          return (
            <View key={index}>
              <View
                style={[tableStyles.table_row, { backgroundColor: "#e7e6e6" }]}
              >
                <Text style={[tableStyles.table_cell, { flex: 0.5 }]}>
                  {`${String(index + 1).padStart(2, "0")}.00`}
                </Text>
                <Text style={[tableStyles.table_cell, { flex: 4 }]}>
                  {description}
                </Text>
                <Text style={[tableStyles.table_cell, { flex: 0.5 }]}>Und</Text>
                <Text style={[tableStyles.table_cell, { flex: 0.5 }]}>
                  {item.nCotDetCantidad}
                </Text>
                <Text style={[tableStyles.table_cell, { flex: 0.5 }]}>
                  {evalTypeChange(priceWithMargin)}
                </Text>
                <Text style={[tableStyles.table_cell, { flex: 0.5 }]}>
                  {evalTypeChange(itemTotalWithMargin)}
                </Text>
              </View>
              {/* Extend Description */}
              <ExtendDescription item={item} quoteType={quoteType} />
            </View>
          );
        })}

        {/* Table Footer - Show total with margin already included */}
        <View style={[tableStyles.table_row, { backgroundColor: "#ddffdf" }]}>
          <Text style={[tableStyles.table_cell, { flex: 6 }]}></Text>
          <Text
            style={[
              tableStyles.table_cell,
              { flex: 3, fontFamily: "Roboto", fontWeight: "bold" },
            ]}
          >
            Sub Total en {currency.description}{" "}
            {economicOffer.MercadoNombre === "NACIONAL" &&
              "y no incluye el IGV"}
          </Text>
          <Text
            style={[tableStyles.table_cell, { flex: 0.5 }]}
          >{`(${currency.code})`}</Text>
          <Text
            style={[
              tableStyles.table_cell,
              { flex: 0.8, fontFamily: "Roboto", fontWeight: "bold" },
            ]}
          >
            {evalTypeChange(Number(totalWithMargin))}
          </Text>
        </View>

        {/* Costo de envio */}
        {Number(economicOffer.costo_envio) > 0 && (
          <View style={[tableStyles.table_row]}>
            <Text style={[tableStyles.table_cell, { flex: 6 }]}></Text>
            <Text style={[tableStyles.table_cell, { flex: 3 }]}>
              Costo de Envío
            </Text>
            <Text
              style={[tableStyles.table_cell, { flex: 0.5 }]}
            >{`(${currency.code})`}</Text>
            <Text style={[tableStyles.table_cell, { flex: 0.8 }]}>
              {economicOffer.costo_envio}
            </Text>
          </View>
        )}

        {/* Costo de Instalación */}
        {Number(economicOffer.costo_instalacion) > 0 && (
          <View style={[tableStyles.table_row]}>
            <Text style={[tableStyles.table_cell, { flex: 6 }]}></Text>
            <Text style={[tableStyles.table_cell, { flex: 3 }]}>
              Costo de Instalación
            </Text>
            <Text
              style={[tableStyles.table_cell, { flex: 0.5 }]}
            >{`(${currency.code})`}</Text>
            <Text style={[tableStyles.table_cell, { flex: 0.8 }]}>
              {economicOffer.costo_instalacion}
            </Text>
          </View>
        )}

        {/* Costo de Puesta en Marcha */}
        {Number(economicOffer.costo_puesta_en_marcha) > 0 && (
          <View style={[tableStyles.table_row]}>
            <Text style={[tableStyles.table_cell, { flex: 6 }]}></Text>
            <Text style={[tableStyles.table_cell, { flex: 3 }]}>
              Costo de Puesto en Marcha
            </Text>
            <Text
              style={[tableStyles.table_cell, { flex: 0.5 }]}
            >{`(${currency.code})`}</Text>
            <Text style={[tableStyles.table_cell, { flex: 0.8 }]}>
              {economicOffer.costo_puesta_en_marcha}
            </Text>
          </View>
        )}

        {/* IGV */}
        {Number(economicOffer.MercadoId) === 1 && (
          <View style={[tableStyles.table_row]}>
            <Text style={[tableStyles.table_cell, { flex: 6 }]}></Text>
            <Text style={[tableStyles.table_cell, { flex: 3 }]}>IGV</Text>
            <Text style={[tableStyles.table_cell, { flex: 0.5 }]}>18.00%</Text>
            <Text style={[tableStyles.table_cell, { flex: 0.8 }]}>
              {evalTypeChange(Number(totalWithMargin) * 0.18)}
            </Text>
          </View>
        )}

        {/* Tipo de Cambio */}
        {economicOffer.TipoMoneda == "1" && (
          <View style={[tableStyles.table_row]}>
            <Text style={[tableStyles.table_cell, { flex: 6 }]}></Text>
            <Text style={[tableStyles.table_cell, { flex: 3 }]}>
              Tipo de Cambio USD/PEN
            </Text>
            <Text style={[tableStyles.table_cell, { flex: 0.5 }]}>T.C.</Text>
            <Text style={[tableStyles.table_cell, { flex: 0.8 }]}>
              {parseFloat(economicOffer.TipoCambio).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
          </View>
        )}

        {/* Incoterm */}
        <IncotermSection
          economicOffer={economicOffer}
          currency={currency}
          table={"DETAIL"}
        />

        {/* TOTAL */}
        <View style={[tableStyles.table_row]}>
          <Text style={[tableStyles.table_cell, { flex: 6 }]}></Text>
          <Text
            style={[
              tableStyles.table_cell,
              { flex: 3, fontFamily: "Roboto", fontWeight: "bold" },
            ]}
          >
            Total Presupuesto en {currency.description}{" "}
            {Number(economicOffer.MercadoId) === 1 && "(Incluye IGV)"}
          </Text>
          <Text
            style={[tableStyles.table_cell, { flex: 0.5 }]}
          >{`(${currency.code})`}</Text>
          <Text
            style={[
              tableStyles.table_cell,
              { flex: 0.8, fontFamily: "Roboto", fontWeight: "bold" },
            ]}
          >
            {evalTypeChange(Number(totalWithIGV))}
          </Text>
        </View>
      </View>
    </View>
  );
};

const Header = ({ economicOffer }) => {
  return (
    <View style={styles.header} id="header">
      <Text style={styles.header_title}>OFERTA ECONOMICA</Text>
      <View style={styles.horizontal_line}></View>
      <View style={styles.header_description_container}>
        <View style={styles.header_description_item_left_container}>
          <Text>Obra: {economicOffer.proyecto}</Text>
          <Text>N° de identificación fiscal: {economicOffer.ruc_dni}</Text>
          <Text>Razón Social: {economicOffer.razon_social}</Text>
          {economicOffer.MercadoNombre !== "NACIONAL" && (
            <Text>Pais: {economicOffer.cliente_pais}</Text>
          )}
          <Text>Lugar: {economicOffer.lugar}</Text>
          <Text>Contacto: {economicOffer.contacto}</Text>
          <Text>Nº Oferta: {economicOffer.codigo}</Text>
        </View>
        <View style={styles.header_description_item_right_container}>
          <View
            style={styles.header_description_item_right_container_left_item}
          >
            <Text>Fecha de oferta:</Text>
            <Text>Ejecutivo comercial:</Text>
            <Text>Validez de oferta:</Text>
          </View>
          <View
            style={styles.header_description_item_right_container_right_item}
          >
            <Text>
              {new Date(new Date(economicOffer.fecha).getTime() + 86400000)
                .toLocaleDateString("es-PE", {
                  day: "2-digit",
                  month: "short",
                  year: "2-digit",
                })
                .replace(".", "")
                .split(" ")
                .join("/")}
            </Text>
            <Text>{economicOffer.ejecutivo_comercial}</Text>
            <Text>{economicOffer.validez_oferta} días</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const paymentInfoStyles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 3,
  },
  payment_info_image_container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  payment_info_image: {
    width: 400,
    height: 400,
    objectFit: "contain",
  },
});

const PaymentInfo = ({ economicOffer }) => {
  return (
    <View style={paymentInfoStyles.container}>
      <Text>
        En caso de aceptación, favor de realizar abono en cuenta corriente y
        generar O/C a nombre de
        <Text> </Text>
        <Text style={styles.bold}>
          MOTORES DIESEL ANDINOS S.A.- MODASA, RUC: 20417926632
        </Text>
      </Text>
      <Text style={styles.bold}>NÚMEROS DE CUENTA</Text>
      <View style={paymentInfoStyles.payment_info_image_container}>
        <Image
          src={
            economicOffer.MercadoNombre === "NACIONAL"
              ? paymentInfoImage
              : paymentInfoExportImage
          }
          style={paymentInfoStyles.payment_info_image}
        />
      </View>
    </View>
  );
};

const ExecutiveInfo = ({ economicOffer }) => {
  return (
    <View style={[styles.executiveInfo, { position: "absolute" }]} fixed>
      <Text>{economicOffer.ejecutivo_comercial}</Text>
      <Text>Ejecutivo de Ventas</Text>
      <Text>Cel. {economicOffer?.ejecutivo_comercial_telefono || "--"}</Text>
      <Text
        style={{
          textDecoration: "underline",
          color: "blue",
        }}
      >
        {economicOffer.ejecutivo_comercial_correo}
      </Text>
    </View>
  );
};

const Footer = () => {
  return (
    <View style={[styles.footer, { position: "absolute" }]} fixed>
      <Text>
        Tel.: (511) 6158000 / CAR.ANTIGUA PANAMERICANA SUR KM. 38.2 FND. LAS
        SALINAS LOTE. 3 LURIN LIMA LIMA
      </Text>
      <Text>www.modasa.com.pe</Text>
    </View>
  );
};

const LogoModasa = () => {
  return (
    <View fixed>
      <Image src={modasa} style={styles.logo} />
    </View>
  );
};

const ISOCertificationSignature = () => {
  return (
    <View fixed>
      <Image src={iso90012008} style={styles.ISOSignature} />
    </View>
  );
};

const genericConditionsStyles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 3,
  },
  title: {
    fontFamily: "Roboto",
    fontWeight: "bold",
    fontSize: 8,
    textAlign: "center",
  },
  parraf_title: {
    fontFamily: "Roboto",
    fontWeight: "bold",
    fontSize: 6,
  },
  parraf: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    marginBottom: 2,
  },
  parraf_text: {
    fontFamily: "Roboto",
    fontSize: 5,
    lineHeight: 1.6,
  },
});

const GenericConditions = () => {
  return (
    <View style={genericConditionsStyles.container}>
      <Text style={genericConditionsStyles.title}>
        CONDICIONES GENERALES DE VENTA
      </Text>
      <View style={genericConditionsStyles.container}>
        <Text style={genericConditionsStyles.parraf_title}>
          PRIMERA: Objeto. -
        </Text>
        <View style={genericConditionsStyles.parraf}>
          <Text style={genericConditionsStyles.parraf_text}>
            1.1 Las presentes Condiciones Generales regirán las relaciones
            comerciales entre Motores Diesel Andinos S.A (“Modasa”) y el
            “Cliente” que se individualiza en la respectiva cotización, orden de
            compra u orden de servicios (ambas en conjunto, las “Partes”), en
            virtud de las cuales el Cliente entregará a Modasa bienes y/o
            prestará servicios de los que comercializa, siempre que Modasa así
            los requiera y los pagará de conformidad a las siguientes reglas; y
          </Text>
          <Text style={genericConditionsStyles.parraf_text}>
            {" "}
            1.2 En caso de contrataciones en que las partes celebren un acuerdo
            por escrito que regule expresamente el suministro de bienes y/o
            prestación de servicios de que se trate, primarán dichos acuerdos
            por sobre estas Condiciones Generales.{" "}
          </Text>
        </View>

        <Text style={genericConditionsStyles.parraf_title}>
          SEGUNDA: Cotización -
        </Text>
        <View style={genericConditionsStyles.parraf}>
          <Text style={genericConditionsStyles.parraf_text}>
            2.1 De tiempo en tiempo Modasa podrá emitir cotizaciones al Cliente,
            (“CO”), detallando los bienes y/o servicios que venderá o prestará,
            el lugar y/o plazo de su entrega o prestación, entre otros, según
            corresponda. Para estos efectos, la CO corresponde a una Oferta
            Comercial presentada por Modasa y aceptada por el Cliente, motivo
            por el cual el Cliente estará obligado a respetar los Precios y
            Condiciones ofertadas al amparo de lo dispuesto en la legislación
            vigente sin perjuicio de lo indicado en las secciones 2.2 y 2.3.
            Cuando no haya mediado aceptación expresa, la CO constituirá
            manifestación inequívoca de Cliente de aceptar la OC presentada por
            Modasa;
          </Text>
          <Text style={genericConditionsStyles.parraf_text}>
            2.2R especto de la CO que el Cliente reciba, éste podrá: /i/
            aceptarla incondicional e irrevocablemente enviando una confirmación
            por correo electrónico o carta a Modasa; /ii/ rechazarla
            fundadamente; o /iii/ formular las observaciones que estime
            pertinentes. No obstante, lo anterior, la CO se entenderá aceptada
            por el Cliente si dentro de los dos /5/ días hábiles siguientes a la
            recepción, éste no ha rechazado fundadamente o formulado las
            observaciones pertinentes.
          </Text>
          <Text style={genericConditionsStyles.parraf_text}>
            2.3 Frente al rechazo fundado o a las observaciones pertinentes,
            Modasa podrá discrecionalmente adoptar cualquiera de las siguientes:
            /i/ modificar la CO rechazada o respecto de la cual se formularon
            observaciones; /ii/ emitir una nueva CO; o /iii/ desistirse de la
            solicitud, dejando sin efecto la respectiva CO por escrito y en
            forma expresa, o tácitamente si dentro de los cinco /5/ días hábiles
            siguientes a la recepción del rechazo fundado o de las observaciones
            pertinentes, no ejercita alguna de las opciones de las Subsecciones
            /i/ y /ii/ anteriores. En caso de que la CO queda sin efecto y
            continúe el requerimiento del Cliente, a solicitud de este último
            Modasa podrá a su sola discreción emitir una nueva CO con los
            precios y condiciones actualizadas.
          </Text>
        </View>

        <Text style={genericConditionsStyles.parraf_title}>
          TERCERA: Condiciones Generales de la Entrega y Recepción de Bienes y/o
          Servicios. -
        </Text>
        <View style={genericConditionsStyles.parraf}>
          <Text style={genericConditionsStyles.parraf_text}>
            3.1 Las CO indicarán el lugar, fecha y demás condiciones específicas
            de la entrega de bienes y/o servicios;
          </Text>
          <Text style={genericConditionsStyles.parraf_text}>
            3.2 El Cliente tendrá el derecho a realizar inspecciones y pruebas,
            directamente o por terceros a su encargo, de los bienes que pretenda
            adquirir de Modasa para certificar la calidad, funcionalidad e
            idoneidad requeridas. Modasa facilitará el acceso a sus
            instalaciones para tales efectos, previo aviso escrito del Cliente
            con a lo menos tres /3/ días hábiles de anticipación a la visita de
            que se trate;
          </Text>
          <Text style={genericConditionsStyles.parraf_text}>
            3.3 Los bienes que serán entregados por Modasa estarán libres de
            todo gravamen, carga, derechos de terceros constituidos sobre ellos,
            deuda, litigio, embargo u otras limitaciones de cualquier tipo que
            puedan perturbar su uso y goce legítimos o impedir su libre
            disposición, enajenación o comercialización, sin excepción alguna.
            Modasa responderá del saneamiento de los bienes de conformidad a la
            ley aplicable;
          </Text>
          <Text style={genericConditionsStyles.parraf_text}>
            3.4 Puestos los bienes requeridos a disposición del Cliente y/o
            ejecutadas las prestaciones de los servicios que correspondan, el
            Cliente deberá en el acto realizar las inspecciones y pruebas
            destinadas a corroborar el cumplimiento de las obligaciones del
            Modasa, a través de una constancia escrita o por correo electrónico,
            donde podrá dejarse registro de las observaciones relativas a la
            entrega de los bienes y/o servicios que estimen pertinentes o de la
            conformidad de los bienes o servicios.
          </Text>
          <Text style={genericConditionsStyles.parraf_text}>
            3.5 El Cliente asumirá todos los costos y gastos en que se incurran
            para la entrega de los bienes y/o para la prestación de los
            servicios requeridos, hasta el lugar indicado por el Cliente,
            incluyendo, pero sin limitarse a transporte, embalaje, seguros,
            rodamientos, cargue, descargue, entre otros e incorporados dentro de
            la CO. Modasa no estará obligado a asumir otras obligaciones que no
            estuviesen incluidas en la CO presentada por el Cliente.
          </Text>
          <Text style={genericConditionsStyles.parraf_text}>
            3.6 Sin perjuicio de lo que determine la CO, la respectiva
            adquisición de bienes no incluirá en su precio prestación de
            servicios alguna.
          </Text>
        </View>

        <Text style={genericConditionsStyles.parraf_title}>
          CUARTA: Origen, Calidad y Garantía de los Productos y Servicios. -
        </Text>
        <View style={genericConditionsStyles.parraf}>
          <Text style={genericConditionsStyles.parraf_text}>
            4.1 Modasa cuenta con la propiedad plena sobre los bienes o
            servicios que entregue al Cliente y/o titulo legítimo, facultades,
            permisos, autorizaciones y/o licencias suficientes para su
            comercialización. Asimismo, deberán ser legítimos en su origen, esto
            es, producidos y distribuidos inicialmente por su creador y/o
            legítimo titular de los derechos respectivos y, en su caso,
            adquiridos de un distribuidor o fabricante oficial y, junto a los
            servicios que preste o involucren, que cumplen con los más altos
            estándares de calidad;
          </Text>
          <Text style={genericConditionsStyles.parraf_text}>
            4.2 Entregados los bienes y/o prestados los servicios contratados
            totalmente y para el caso que corresponda, el Modasa otorga a Modasa
            una garantia sin costo por el plazo determinado en la CO, para la
            atención de desperfectos de fábrica debidamente acreditados, los
            cuales no tendrán costo para el cliente.
          </Text>
        </View>

        <Text style={genericConditionsStyles.parraf_title}>
          QUINTA: Precio, forma de pago y gastos. -
        </Text>
        <View style={genericConditionsStyles.parraf}>
          <Text style={genericConditionsStyles.parraf_text}>
            5.1 El Cliente pagará a Modasa los precios o contraprestaciones
            contenido en la CO, por los bienes y/o servicios que se requieran de
            conformidad con estas Condiciones Generales y que hayan sido
            efectivamente entregados y/o efectivamente ejecutados a satisfacción
            de Modasa. Salvo pacto expreso en contrario establecido en la
            respectiva CO, los referidos precios o contraprestaciones incluirán
            el Impuesto General a las Ventas o Impuesto a la Renta
            correspondiente.
          </Text>
          <Text style={genericConditionsStyles.parraf_text}>
            5.2 Una vez recibida una factura correctamente emitida, el Cliente
            tendrá un plazo de 5 días calendario para su revisión, aprobación
            y/u objeción. Los pagos serán efectuados dentro del plazo que señale
            la OC respectiva, de conformidad a la normativa legal vigente, el
            que se contará desde el recibo de la factura. Todos los pagos de los
            valores involucrados en esta relación contractual serán realizados
            en la moneda establecida en el precio contenido en la CO.
          </Text>
          <Text style={genericConditionsStyles.parraf_text}>
            5.3 En el evento que el retardo en el pago el plazo acordado en la
            CO, Modasa podrá suspender la entrega de bienes o la prestación de
            los servicios respectivos que se encontrare pendiente a esa fecha y
            poner término a la relación contractual en forma anticipada;
          </Text>
        </View>

        <Text style={genericConditionsStyles.parraf_title}>
          SEXTA: Vigencia. -
        </Text>
        <View style={genericConditionsStyles.parraf}>
          <Text style={genericConditionsStyles.parraf_text}>
            6.1 La relación contractual regulada por estas Condiciones Generales
            regirá a contar de la fecha de la aceptación o cumplimiento de las
            condiciones de la aceptación contenidas en la respectiva CO y tendrá
            la duración que ésta misma indique.
          </Text>
          <Text style={genericConditionsStyles.parraf_text}>
            6.2 Modasa tendrá derecho a poner término a la respectiva relación
            contractual regida por la CO en forma inmediata, sin necesidad de
            declaración judicial ni indemnización alguna para el Cliente,
            mediante aviso escrito que tendrá efectos al momento de su
            comunicación, en caso que concurra uno cualquiera de los siguientes
            eventos: /i/ resolución unilateral o cancelación del Cliente en la
            entrega de bienes y/o prestación de servicios acordadas; /ii/
            negativa del Cliente a pagar el precio por los bienes y/o servicios
            detallados en la CO; /iii/ incumplimiento de cualquiera de las
            obligaciones contenidas tanto en la CO; /iv/ impedimento del Cliente
            para recibir los bienes y/o prestar los servicios pactados por más
            de diez /10/ días calendario; /v/ insolvencia del Cliente,
            entendiéndose por tal el no pago de cualquiera de las obligaciones
            relevantes a que deba responder derivadas de cualquier concepto o si
            el Cliente entra en algún tipo de procedimiento de declaración de
            quiebra, concursal, intervención o retención de sus bienes, que no
            sea resuelto dentro de quince /15/ días corridos siguientes a dicha
            solicitud; y /vi/ si el Cliente no cumple con una cualquiera de las
            obligaciones indicadas en las cláusulas Novena y Décima siguientes.
          </Text>
        </View>

        <Text style={genericConditionsStyles.parraf_title}>
          SÉPTIMA: Confidencialidad. -
        </Text>
        <View style={genericConditionsStyles.parraf}>
          <Text style={genericConditionsStyles.parraf_text}>
            7.1 Toda información que las Partes hayan intercambiado o
            intercambien, o a la que cualquiera de ellas o sus dependientes,
            personas que presten servicios bajo su dependencia o
            subcontratistas, tengan acceso sea directa o indirectamente, con
            motivo u ocasión o esté relacionada con la negociación, suscripción,
            o ejecución del presente Contrato, así como los términos del mismo,
            será considerada como confidencial, en adelante la “Información
            Confidencial”;
          </Text>
          <Text style={genericConditionsStyles.parraf_text}>
            7.2 Las Partes se obligan a tratar la Información Confidencial con
            el cuidado y discreción con que se administra esta clase de
            información. En particular, sin que la enumeración sea taxativa, las
            Partes se obligan, en relación con la Información Confidencial, a:
            /i/ Mantenerla debidamente custodiada y resguardada; /ii/ No
            revelarla a terceras personas; /iii/ Devolver cada Parte a la otra,
            a su requerimiento por escrito, la Información Confidencial que esta
            última le haya proporcionado /salvo que deba conservarla bajo la
            normativa que le sea aplicable/; y /iv/ no utilizarla en beneficio
            propio /salvo en lo relativo al cumplimiento de este Contrato/ o de
            terceros;
          </Text>
          <Text style={genericConditionsStyles.parraf_text}>
            7.3 No se considerará Información Confidencial: /i/ La información
            de público conocimiento con anterioridad a la fecha del presente
            Contrato; /ii/ La información que llegue a estar disponible para el
            público por causas ajenas a las Partes; /iii/ Aquella cuya
            divulgación haya sido requerida por o deba ser revelada a alguna
            autoridad pública debidamente facultada por la ley o producto de un
            procedimiento judicial o administrativo; y /iv/ La información cuya
            publicación o divulgación pública haya sido aprobada previamente y
            por escrito por la otra Parte;
          </Text>
          <Text style={genericConditionsStyles.parraf_text}>
            7.4 La Parte receptora de Información Confidencial notificará
            inmediatamente a la Parte que se la haya revelado en caso de
            descubrir alguna divulgación o uso no autorizado de la Información
            Confidencial, o cualquier otra violación de cualquiera otra
            infracción a las normas establecidas en esta cláusula en materia de
            Información Confidencial, que sea efectuada por la misma Parte
            receptora, sus directores, ejecutivos, trabajadores, agentes,
            asesores o consultores, y cooperará en forma razonable con la Parte
            reveladora con el fin de recuperar la Información Confidencial y
            evitar divulgaciones o usos no autorizados ulteriores de la misma.
            Del mismo modo, la Parte receptora podrá revelar Información
            Confidencial de la Parte reveladora cuando así lo ordene una orden
            administrativa o judicial o sea requerido por la legislación
            aplicable, siempre que, la Parte receptora notifique a la Parte
            reveladora acerca de tal circunstancia, con la antelación razonable
            necesaria para darle a esta última la oportunidad de obtener medidas
            de protección o una disposición equivalente;
          </Text>
          <Text style={genericConditionsStyles.parraf_text}>
            7.5 Con todo queda expresamente prohibido para la Empresa, sin
            contar con el consentimiento previo y por escrito de MODASA,
            efectuar cualquier tipo de declaración o aclaración pública respecto
            de las materias objeto del presente contrato.
          </Text>
          <Text style={genericConditionsStyles.parraf_text}>
            7.6 Las obligaciones de confidencialidad establecidas en esta
            cláusula subsistirán hasta que la Información Confidencial sea
            considerada pública o sea hecha pública de acuerdo con las
            excepciones establecidas en la sección 7.3 anterior, y con
            independencia de la terminación de este contrato por cualquier
            causa.
          </Text>
        </View>

        <Text style={genericConditionsStyles.parraf_title}>
          OCTAVA: Indemnidad
        </Text>
        <View style={genericConditionsStyles.parraf}>
          <Text style={genericConditionsStyles.parraf_text}>
            8.1 El Cliente deberá mantener indemne a Modasa respecto de
            cualquier acción, reclamación, sanción o sentencia de todo tipo que
            pudiere interponerse o dictarse en su contra y que encuentre causa u
            origen en acciones u omisiones del Cliente o terceros relacionados a
            éste. En tal contexto, el Cliente deberá indemnizar a Modasa de toda
            cantidad que se vea expuesta a pagar con motivo de una sentencia o
            resolución de autoridad, así como proporcionar o reembolsar todos
            los costos y gastos de cualquier naturaleza en que haya debido
            incurrir con motivo de lo anterior, en un plazo máximo de diez (10)
            días corridos, contados desde el requerimiento escrito que, al
            efecto, le formule Modasa; y
          </Text>
          <Text style={genericConditionsStyles.parraf_text}>
            8.2 En el evento que el Cliente, habiendo sido requerido por escrito
            por Modasa, no cumpla con la obligación referida en la sección
            precedente, Modasa podrá: /i/ retener cualquier suma que deba pagar
            al Cliente hasta que se le garantice total indemnidad o; /ii/ poner
            término al respectivo proceso judicial o extrajudicial en lo que a
            ella respecta, de conformidad a la ley, en el que podrá acordar, a
            su sola discreción, el pago de hasta el total de las sumas exigidas.
          </Text>
        </View>

        <Text style={genericConditionsStyles.parraf_title}>
          NOVENO: Penalidades.
        </Text>
        <View style={genericConditionsStyles.parraf}>
          <Text style={genericConditionsStyles.parraf_text}>
            9.1 En caso de incumplimiento total o parcial de cualquier
            obligación a cargo del Cliente, según lo estipulado en la CO así
            como en estas Condiciones Generales, aquel se obliga a pagar a
            Modasa, a titulo de Cláusula Penal y como abono anticipado de daños
            y perjuicios, sin perjuicio del cumplimiento de la obligación
            principal y de la indemnización de daños y perjuicios
            correspondiente, un valor equivalente al 10 por ciento (10%) del
            valor total de la CO. El Cliente renuncia desde ahora a cualquier
            requerimiento para ser constituido en mora y se obliga a pagar el
            monto previsto dentro de los quince (15) días hábiles siguientes
            contados a partir de la cuenta de cobro dirigida al domicilio
            registrado de la parte incumplida. A partir del vencimiento del
            plazo mencionado, se causarán intereses moratorios a la tasa más
            alta permitida.
          </Text>
          <Text style={genericConditionsStyles.parraf_text}>
            9.2 La cantidad debida por el Cliente a titulo de Cláusula Penal
            podrá compensarse con las sumas que por cualquier motivo le adeude
            Modasa. El pago que se efectúe a titulo de penalidad no extinguirá
            las obligaciones contraídas por el Cliente en virtud del presente
            Contrato.
          </Text>
          <Text style={genericConditionsStyles.parraf_text}>
            9.3 Las eventuales indemnizaciones, penalidades y/o multas que deba
            asumir Modasa derivadas de la ejecución de la OC se encuentran
            limitadas un pago que no podrá exceder del tope máximo del 10% del
            valor de la CO.
          </Text>
        </View>

        <Text style={genericConditionsStyles.parraf_title}>
          DÉCIMA: Responsabilidad Laboral. -
        </Text>
        <View style={genericConditionsStyles.parraf}>
          <Text style={genericConditionsStyles.parraf_text}>
            El Cliente no tendrá vinculación de tipo laboral alguna con los
            dependientes, trabajadores y eventuales terceros del Modasa
            destinados a efectuar la entrega de bienes y/o prestación de
            servicios contratados, quien será el único responsable de los actos
            realizados por éstos y del debido y oportuno cumplimiento de las
            obligaciones establecidas por la legislación laboral, tributaria,
            seguridad y salud en el trabajo, previsional y de la seguridad
            social en relación con su personal, dependientes y/o terceros.
          </Text>
        </View>

        <Text style={genericConditionsStyles.parraf_title}>
          ÚNDÉCIMA: Responsabilidad penal del Cliente. -
        </Text>
        <View style={genericConditionsStyles.parraf}>
          <Text style={genericConditionsStyles.parraf_text}>
            11.1 Las partes declaran expresamente que han tomado conocimiento de
            las disposiciones legales aplicables sobre los Delitos de Lavado de
            Activos, Financiamiento del Terrorismo y Delitos de Cohecho de
            Funcionario;
          </Text>
          <Text style={genericConditionsStyles.parraf_text}>
            11.2 En atención a lo anterior, el Cliente se obliga a: /i/
            Participar sólo en negocios legítimos que no contravengan la
            legislación vigente; /ii/ Adoptar controles internos eficientes y
            eficaces que prevengan la comisión de los delitos señalados en la
            respectiva normativa por parte de sus propios trabajadores evitando
            incurrir en la responsabilidad penal como persona jurídica. En
            relación con ello, el Cliente declara que ni éste ni alguno de sus
            trabajadores, han sido condenados por las conductas antes referidas;
            y /iii/ Conocer y cumplir, en lo que le sea aplicable como Cliente
            durante la vigencia del contrato, con las normas del Código de Ética
            de Modasa /iv/ Reportar al Oficial de Cumplimiento de Modasa todo
            pago, transacción o la realización de cualquier conducta delictual
            contemplada en la normativa aplicable y en general, informar de
            cualquier conducta sospechosa de los Colaboradores del Cliente que
            pueda conllevar la responsabilidad penal del Cliente o de Modasa;
            /v/ Acceder, cuando lo requiera Modasa y a costo de éste, a la
            realización de auditorías independientes que permitan establecer el
            cumplimiento de la normativa aplicable; /vi/ Cooperar oportunamente
            y de buena fe con cualquier investigación que lleve adelante Modasa
            frente al conocimiento o indicio que adquiera sobre la realización
            de alguna de las conductas establecidas en la normativa aplicable o
            conductas que vayan en contra del Código de Ética de Modasa; /vii/
            No efectuar a nombre de Modasa y sus relacionadas, o en beneficio de
            ellas, cualquier especie de pago indebido o ilegítimo a funcionarios
            de la administración pública de cualquier tipo de repartición;
            /viii/ Tomar inmediatamente todas las medidas que sean necesarias
            para esclarecer hechos que revistan caracteres de alguno de los
            delitos contemplados en la normativa aplicable que violan las normas
            y principios que informa el Código de Ética de Modasa por parte de
            algún trabajador del Cliente y evitar cualquier daño eventual al
            patrimonio o imagen de Modasa, por tales conductas y; /ix/ Mantener
            indemne de cualquier perjuicio causado a Modasa en su reputación,
            integridad, imagen, o cualquier otro daño patrimonial, como
            consecuencia de la realización de conductas contrarias a lo
            dispuesto en la señalada Ley o en el presente contrato, para lo cual
            Modasa se reserva todas las acciones judiciales pertinentes.
          </Text>
          <Text style={genericConditionsStyles.parraf_text}>
            11.3 El incumplimiento de alguna de las obligaciones establecidas en
            la presente cláusula por parte del Cliente a, dará derecho a Modasa
            de resolver en forma inmediata el presente contrato, sin que de ello
            resulte para Modasa responsabilidad alguna, y sin perjuicio de los
            derechos y acciones que pudieran surgir a su favor, por tal
            incumplimiento.
          </Text>
        </View>

        <Text style={genericConditionsStyles.parraf_title}>
          DUODÉCIMO: Normas sobre Libre Competencia. -
        </Text>
        <View style={genericConditionsStyles.parraf}>
          <Text style={genericConditionsStyles.parraf_text}>
            12.1 Modasa basa sus relaciones comerciales en principios éticos,
            sustentados en la buena fe, confianza mutua, lealtad comercial y
            profesionalismo, atributos esperados en toda economía de libre
            mercado. Nuestra cultura empresarial, en ninguna circunstancia
            acepta o apoya cualquier tipo de acción u omisión que pueda
            presuponer una limitación a la defensa de la competencia leal.
          </Text>
          <Text style={genericConditionsStyles.parraf_text}>
            12.2 En virtud de la importancia que tiene para Modasa la Libre
            Competencia, manifestado especialmente en su Código de Ética, viene
            en acordar con el Cliente lo siguiente:
          </Text>
          <Text style={genericConditionsStyles.parraf_text}>
            a) Modasa y el Cliente, se comprometen a no realizar cualquier
            hecho, acto o convención que impida, restrinja o entorpezca la Libre
            Competencia;
          </Text>
          <Text style={genericConditionsStyles.parraf_text}>
            b) Modasa, en su calidad de agente económico independiente, tiene la
            libertad de fijar el precio al público que estime conveniente, según
            su propia política comercial. Cualquier sugerencia de venta al
            público, son meras sugerencias y no obligan a Modasa a fijar dichos
            precios de venta. El Cliente, por medio de Modasa, no fijará precios
            de venta al público, bandas de precios, límites a los descuentos o
            establecimiento de condiciones de compra y venta al Público;
          </Text>
          <Text style={genericConditionsStyles.parraf_text}>
            c) Las Partes se comprometen a no realizar prácticas predatorias o
            de competencia desleal, realizadas con el objeto de alcanzar,
            mantener o a incrementar su posición dominante;
          </Text>
          <Text style={genericConditionsStyles.parraf_text}>
            d)L as Partes, se comprometen a no celebrar acuerdos de exclusividad
            cuando estos pudiesen afectar la Libre Competencia;
          </Text>
          <Text style={genericConditionsStyles.parraf_text}>
            e) El Cliente se compromete a no vender sus productos a Modasa bajo
            la condición de que esta deba adquirir previamente cualquier otro
            producto o servicio;
          </Text>
          <Text style={genericConditionsStyles.parraf_text}>
            f) Las Partes se comprometen a no dar un trato desigual a cualquier
            otro agente económico que se encuentre en condiciones similares, sin
            que exista razón legítima de negocios para ello y que tenga efectos
            anticompetitivos;
          </Text>
          <Text style={genericConditionsStyles.parraf_text}>
            g) Modasa no solicitará, ni el Cliente entregará, información sobre
            las condiciones comerciales que el Cliente tenga con competidores de
            Modasa. En este sentido, Modasa exige a sus Clientes que mantengan
            relaciones independientes y autónomas con cada uno de sus clientes,
            competidores de Modasa.
          </Text>
        </View>

        <Text style={genericConditionsStyles.parraf_title}>
          DÉCIMO TERCERO: Domicilio, Ley Aplicable y Solución de Controversias.
          -
        </Text>
        <View style={genericConditionsStyles.parraf}>
          <Text style={genericConditionsStyles.parraf_text}>
            13.1 Para todos los efectos legales a que haya lugar con ocasión de
            la entrega de bienes y/o prestación de servicios contratada conforme
            las presentes Condiciones Generales, las Partes fijan su domicilio
            en la ciudad capital donde se ubica el domicilio principal de
            Modasa.
          </Text>
          <Text style={genericConditionsStyles.parraf_text}>
            13.2L a legislación aplicable a la relación contractual existente de
            conformidad a estas Condiciones Generales será la peruana; y
          </Text>
          <Text style={genericConditionsStyles.parraf_text}>
            13.3 Cualquier dificultad o controversia que se produzca entre los
            contratantes respecto de la aplicación, interpretación, duración,
            validez o ejecución de la entrega de bienes y/o prestación de
            servicios contratados o cualquier otro motivo, las partes renuncian
            al fuero de sus domicilios para someter la controversia a la
            competencia y jurisdicción de los jueces y tribunales de Lima
            Cercado.
          </Text>
        </View>

        <Text style={genericConditionsStyles.parraf_title}>
          DÉCIMO CUARTO: Disposiciones Finales. -
        </Text>
        <View style={genericConditionsStyles.parraf}>
          <Text style={genericConditionsStyles.parraf_text}>
            14.1 Comunicaciones entre partes.- Todas las comunicaciones entre
            las Partes se harán por escrito y exclusivamente a la o las personas
            designadas como el “Contacto comercial” en la CO respectiva, a
            través del medio que al caso resulte con mayor idoneidad, de
            preferencia por correo electrónico, salvo que la comunicación de que
            se trate exija, a discreción de la parte emisora, que exista certeza
            respecto de su envío y/o recepción, en cuyo caso este último las
            comunicaciones entre las Partes se realizarán por correo
            certificado;
          </Text>
          <Text style={genericConditionsStyles.parraf_text}>
            14.2 Modificaciones a estas Condiciones Generales. - Modasa podrá
            actualizar o modificar las presentes Condiciones Generales de tiempo
            en tiempo, en cualquier comunicación actualizada o modificada por
            escrito. Las referidas actualizaciones o modificaciones comenzarán a
            regir luego de diez /10/ días corridos de publicadas o comunicadas
            en la forma indicada. En tal periodo, el Cliente puede realizar un
            reclamo justificado que, de no acogerse, el Cliente que no esté de
            acuerdo con las modificaciones o actualizaciones realizadas podrá
            poner término ipso facto a la relación contractual respectiva,
            comunicándoselo a Modasa;
          </Text>
          <Text style={genericConditionsStyles.parraf_text}>
            14.3 Relación entre las partes. - Las partes declaran que la
            relación contractual regida por estas Condiciones Generales no podrá
            ser interpretada en ningún caso como que se ha formado entre las
            partes una asociación permanente, joint venture, comunidad ni una
            sociedad de ningún tipo; y
          </Text>
          <Text style={genericConditionsStyles.parraf_text}>
            14.4 Cesión. - El Cliente no podrá ceder, total o parcialmente, una
            o más CO sin previa autorización escrita de Modasa.
          </Text>
        </View>
      </View>
    </View>
  );
};

export const QuoteOfferPDF = ({ economicOffer, details }) => {
  const typeChange = economicOffer.TipoCambio || 1;

  const currency = {
    code: economicOffer.MonedaCodigo,
    symbol: economicOffer.MonedaSimbolo,
    description: economicOffer.MonedaDescripcion,
  };

  const formatCurrency = (amount) => {
    const truncatedAmount = Math.floor(amount * 100) / 100;

    const formattedAmount = truncatedAmount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return formattedAmount;
  };

  const evalTypeChange = (amount) => {
    switch (currency?.code) {
      case "USD":
        return formatCurrency(amount / typeChange);
      case "PEN":
        return formatCurrency(amount * typeChange);
      default:
        return formatCurrency(amount);
    }
  };

  return (
    <Document
      title={`${economicOffer.codigo || "SN"} - MODASA - ${
        economicOffer.razon_social
      } - ${economicOffer.proyecto}.pdf`}
    >
      <Page size={"A4"} style={styles.page}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <LogoModasa />
          <ISOCertificationSignature />
        </View>
        <Header economicOffer={economicOffer} />

        <SimpleTable
          items={details}
          economicOffer={economicOffer}
          quoteType={economicOffer.tipo_cotizacion}
          currency={currency}
          evalTypeChange={evalTypeChange}
        />

        {economicOffer.observaciones_html && economicOffer.observaciones && (
          <Observations observationsHtml={economicOffer.observaciones_html} />
        )}

        <ComercialConditions
          comercialConditionsHtml={economicOffer?.condiciones_comerciales_html}
        />

        {/* <Considerations /> */}

        {/* {economicOffer.exclusiones !== "" && (
          <Section
            title={"EXCLUSIONES"}
            description={economicOffer.exclusiones}
          />
        )}

        {economicOffer.se_incluye !== "" && (
          <Section
            title={"SE INCLUYE"}
            description={economicOffer.se_incluye}
          />
        )} */}

        <Section
          title={"VALIDEZ DE LA OFERTA"}
          description={`${economicOffer.validez_oferta} días`}
        />

        <PaymentInfo economicOffer={economicOffer} />

        <ExecutiveInfo economicOffer={economicOffer} />

        <Footer />
      </Page>
      <Page size={"A4"} style={styles.page}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <LogoModasa />
          <ISOCertificationSignature />
        </View>

        <Header economicOffer={economicOffer} />

        <DetailTable
          items={details}
          economicOffer={economicOffer}
          quoteType={economicOffer.tipo_cotizacion}
          currency={currency}
          evalTypeChange={evalTypeChange}
        />

        <ExecutiveInfo economicOffer={economicOffer} />
        <Footer />
      </Page>

      <Page size={"A4"} style={styles.page}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <LogoModasa />
          <ISOCertificationSignature />
        </View>

        <GenericConditions />
        <Footer />
      </Page>
    </Document>
  );
};
