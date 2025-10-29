import { DeleteModal } from "@components/modals/DeleteModal";
import { Document, Page, pdf, Text, View } from "@react-pdf/renderer";
import { getFilas } from "@utils/utils";
import { isAxiosError } from "axios";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { QuoteStateBadge } from "../../../../components/QuoteStateBadge";
import Operation from "../../../../components/QuoteStateOperations";
import { Tooltip } from "../../../../components/Tooltip";
import { useAuth } from "../../../../hooks/useAuth";
import { api } from "../../../../libs/axios";
import { FichaPdf } from "../../fichas/components/FichaPdf";
import { useCablesStore } from "../hooks/useCablesStore";
import { useCellsStore } from "../hooks/useCellsStore";
import { useElectrogenosStore } from "../hooks/useElectrogenosStore";
import useEndOfTimeQuoteERP from "../hooks/useEndOfTimeQuoteERP";
import useQuote from "../hooks/useQuote";
import useSingleQuote from "../hooks/useSingleQuote";
import { useTransformersStore } from "../hooks/useTransformersStore";
import { useExchangeStore } from "../store/useExchangeStore";
import { useQuoteDetailStore } from "../store/useQuoteDetailStore";
import { ApproveQuoteModal } from "./forms/modals/ApproveQuoteModal";
import { RequireApprovalDiscountOfModels } from "./forms/modals/RequireApprovalDiscountOfModels";
import { SendToSAPQuoteModal } from "./forms/modals/SendToSAPQuoteModal";
import { QuoteOfferPDF } from "./QuoteOfferPDF";
import Roles from "../../../../constants/Roles";

export const Table = ({ filteredData, onERP = false }) => {
  const { data: user } = useAuth();

  const userIsAdmin = React.useMemo(
    () => user.role === Roles.ADMINISTRADOR,
    [user]
  );

  const [openDelete, setOpenDelete] = React.useState(false);
  const { selectedQuote, setQuoteSelected } = useQuoteDetailStore();
  const { resetExchange } = useExchangeStore();

  const navigate = useNavigate();

  const { deleteMutate, mutateState, isPendingMutateState, errorMutateState } =
    useQuote();
  const {
    quote,
    technicalReport,
    refetch: refetchQuote,
    refetchEconomicOffer,
  } = useSingleQuote();

  const [onRenderQuoteOfferPDF, setOnRenderQuoteOfferPDF] =
    React.useState(false);

  const openModalDelete = (item) => {
    setQuoteSelected(item);
    setOpenDelete(true);
  };

  const confirmDelete = () => {
    if (selectedQuote) {
      deleteMutate({ id: selectedQuote.Cotizacon_Id });
      setQuoteSelected(null);
    }
  };

  const [shouldDownload, setShouldDownload] = React.useState(false);

  React.useEffect(() => {
    if (!selectedQuote || selectedQuote === null || !onRenderQuoteOfferPDF) {
      return;
    }

    const generatePDFWithFreshData = async () => {
      try {
        const [quoteResult, offerResult] = await Promise.all([
          refetchQuote(),
          refetchEconomicOffer(),
        ]);

        const freshQuote = quoteResult.data;
        const freshEconomicOffer = offerResult.data;

        if (freshQuote && freshQuote.details && freshEconomicOffer) {
          await openQuoteOfferPDF(freshEconomicOffer, freshQuote.details);
        } else {
          toast.error("Error al generar el PDF: datos no disponibles");
        }
      } catch (error) {
        toast.error("Error al generar el PDF: " + error.message);
      } finally {
        setQuoteSelected(null);
        setOnRenderQuoteOfferPDF(false);
      }
    };

    generatePDFWithFreshData();
  }, [
    onRenderQuoteOfferPDF,
    selectedQuote,
    refetchQuote,
    refetchEconomicOffer,
    setQuoteSelected,
  ]);

  const openQuoteOfferPDF = async (economicOffer, details) => {
    const blob = await pdf(
      <QuoteOfferPDF economicOffer={economicOffer} details={details} />
    ).toBlob();

    const blobUrl = URL.createObjectURL(blob);

    // Create a meaningful filename based on quote information
    const filename = `${economicOffer.codigo || "SN"} - MODASA - ${
      economicOffer.razon_social
    } - ${economicOffer.proyecto}.pdf`;

    // Create temporary download link
    const downloadLink = document.createElement("a");
    downloadLink.href = blobUrl;
    downloadLink.download = filename;

    // Append to body, click and remove
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    // Also open in browser
    const newWindow = window.open(blobUrl, "_blank");
    if (newWindow === null || typeof newWindow === "undefined") {
      toast.info(
        "Por favor, active las ventanas emergentes (popups) en su navegador para ver los archivos PDF."
      );
    }

    // Clean up the blob URL after download starts
    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
    }, 1000); // Increased timeout to ensure the PDF loads in the new tab
  };

  const openTechnicalReport = async (technicalReport) => {
    const { data } = await api.get(
      `/fichas/tecnicas/${technicalReport.id}?altura=${technicalReport.altura}&temperatura=${technicalReport.temperatura}&alternatorSwapped=${technicalReport.alternatorSwapped}&alternatorSwappedId=${technicalReport.alternatorSwappedId}`
    ); // workaround

    const fichaTecnica = data.data;

    const blob = await pdf(
      <FichaPdf ficha={fichaTecnica} accesories={technicalReport.accesories} />
    ).toBlob();

    const blobUrl = URL.createObjectURL(blob);

    // Crear un nombre por defecto usando el modelo
    const modelName = fichaTecnica[0]?.sModNombre || "ficha";
    const defaultFileName = `${modelName} - MODASA.pdf`;

    // Create temporary download link
    const downloadLink = document.createElement("a");
    downloadLink.href = blobUrl;
    downloadLink.download = defaultFileName;

    // Append to body, click and remove
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    const newWindow = window.open(blobUrl, "_blank");

    if (newWindow === null || typeof newWindow === "undefined") {
      alert(
        "Por favor, active las ventanas emergentes (popups) en su navegador para ver los archivos PDF."
      );
      return;
    }

    // Clean up the blob URL after download starts
    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
    }, 1000); // Increased timeout to ensure the PDF loads in the new tab
  };

  React.useEffect(() => {
    if (shouldDownload && selectedQuote && technicalReport) {
      const technicalReports = technicalReport.map((tr) => {
        const id = tr.integradora[0].IntegradoraID;
        return {
          id,
          accesories: tr.accesories,
          alternatorSwapped: tr?.alternatorSwapped,
          alternatorSwappedId: tr?.alternatorSwappedId,
          altura: tr?.altura,
          temperatura: tr?.temperatura,
        };
      });

      const isNullPresentInIntegradoraIds = technicalReports
        .map((tc) => tc.id)
        .includes(null);

      if (isNullPresentInIntegradoraIds) {
        toast.error(
          "Ficha técnica no disponible en algunos modelos de la cotización."
        );
      }

      try {
        const promises = technicalReports.map((tr) => {
          return openTechnicalReport(tr);
        });

        Promise.all(promises);
      } catch (error) {
        if (isAxiosError(error) && error.response) {
          alert(error.response.data.message);
        }
        alert(
          "Por favor, active las ventanas emergentes (popups) en su navegador para ver los archivos PDF."
        );
      }
      setQuoteSelected(null);
      setShouldDownload(false);
    }
  }, [shouldDownload, selectedQuote, technicalReport, setQuoteSelected]);

  const { removeAllDetailsForDelete } = useQuoteDetailStore();

  const { clearDetails } = useElectrogenosStore();
  const { clearCablesAdded } = useCablesStore();
  const { clearCellsAdded } = useCellsStore();
  const { clearTransformersAdded } = useTransformersStore();

  const openModalEdit = (item) => {
    const quoteType = item?.nCotTipo;

    resetExchange();

    switch (quoteType) {
      case "Grupos electrógenos":
        clearDetails();
        break;
      case "Cables":
        clearCablesAdded();
        break;
      case "Celdas":
        clearCellsAdded();
        break;
      case "Transformadores":
        clearTransformersAdded();
        break;
      default:
        clearDetails();
        clearCablesAdded();
        clearCellsAdded();
        clearTransformersAdded();
        break;
    }

    removeAllDetailsForDelete();
    setQuoteSelected(item);
    navigate(`/cotizaciones/editar/${item.Cotizacon_Id}`);
  };

  const [openApproveQuoteModal, setOpenApproveQuoteModal] =
    React.useState(false);

  const [openApproveDiscountModal, setOpenApproveDiscountModal] =
    React.useState(false);

  const [openSendToSAPQuoteModal, setOpenSendToSAPQuoteModal] =
    React.useState(false);

  const handleApprovedQuote = (item) => {
    if (item.nCotEstado === 6) {
      return;
    }

    mutateState({
      id: item.Cotizacon_Id,
      data: {
        state: 6,
      },
    });
  };

  const handleRejectQuote = (item) => {
    if (item.nCotEstado === 6) {
      return;
    }

    mutateState({
      id: item.Cotizacon_Id,
      data: {
        state: 5,
      },
    });
  };

  const handleApprovedDiscountOfModels = (item) => {
    if (item.nCotEstado !== 2) {
      return;
    }

    mutateState({ id: item.Cotizacon_Id, data: { state: 3 } });
  };

  const handleSendToSAPQuote = (item) => {
    if (item.nCotEstado === 8) {
      return;
    }

    mutateState({
      id: item.Cotizacon_Id,
      data: {
        state: 8,
      },
    });
  };

  const toastIdRef = React.useRef(null);

  const { eot } = useEndOfTimeQuoteERP({
    quantityItems: selectedQuote?.CantidadDetalles || 0,
    startEventName: "startTimer",
  });

  React.useEffect(() => {
    const isPendingProcessing = isPendingMutateState && !toastIdRef.current;
    const processHasEnded =
      !isPendingMutateState && toastIdRef.current && !errorMutateState;
    const processHasError =
      !isPendingMutateState && toastIdRef.current && errorMutateState;

    if (isPendingProcessing) {
      window.dispatchEvent(new Event("startTimer"));
      toastIdRef.current = toast.loading(
        <div className="flex items-center gap-2">
          <span>Procesando pedido en el ERP... {eot}</span>
          <svg
            role="img"
            viewBox="0 0 24 24"
            width="5rem"
            height="3rem"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient
                id="sapGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  style={{ stopColor: "#0073e6", stopOpacity: 1 }}
                />
                <stop
                  offset="50%"
                  style={{ stopColor: "#00b4f0", stopOpacity: 1 }}
                />
                <stop
                  offset="100%"
                  style={{ stopColor: "#004c9a", stopOpacity: 1 }}
                />
              </linearGradient>
            </defs>
            <title>ERP</title>
            <path
              fill="url(#sapGradient)"
              d="M0 6.064v11.872h12.13L24 6.064zm3.264 2.208h.005c.863.001 1.915.245 2.676.633l-.82 1.43c-.835-.404-1.255-.442-1.73-.467-.708-.038-1.064.215-1.069.488-.007.332.669.633 1.305.838.964.306 2.19.715 2.377 1.9L7.77 8.437h2.046l2.064 5.576-.007-5.575h2.37c2.257 0 3.318.764 3.318 2.519 0 1.575-1.09 2.514-2.936 2.514h-.763l-.01 2.094-3.588-.003-.25-.908c-.37.122-.787.189-1.23.189-.456 0-.885-.071-1.263-.2l-.358.919-2 .006.09-.462c-.029.025-.057.05-.087.074-.535.43-1.208.629-2.037.644l-.213.002a5.075 5.075 0 0 1-2.581-.675l.73-1.448c.79.467 1.286.572 1.956.558.347-.007.598-.07.761-.239a.557.557 0 0 0 .156-.369c.007-.376-.53-.553-1.185-.756-.531-.164-1.135-.389-1.606-.735-.559-.41-.825-.924-.812-1.65a1.99 1.99 0 0 1 .566-1.377c.519-.537 1.357-.863 2.363-.863zm10.597 1.67v1.904h.521c.694 0 1.247-.23 1.248-.964 0-.709-.554-.94-1.248-.94zm-5.087.767l-.748 2.362c.223.085.481.133.757.133.268 0 .52-.047.742-.126l-.736-2.37z"
            />
          </svg>
        </div>,
        {
          id: toastIdRef.current,
          duration: Infinity,
          style: {
            background: "#FFF",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            borderLeft: "4px solid #3B82F6",
          },
          className: "bodyClassName-animate-pulse",
        }
      );
    } else if (processHasEnded || processHasError) {
      toast.dismiss(toastIdRef.current);
      toastIdRef.current = null;
    }

    return () => {
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPendingMutateState, errorMutateState]);

  // — Efecto B: actualizar contenido del toast cada vez que cambie `eot` —
  React.useEffect(() => {
    if (toastIdRef.current) {
      toast.update(toastIdRef.current, {
        render: (
          <div className="flex items-center gap-2">
            <span>Procesando pedido en el ERP... {eot}</span>
            <svg
              role="img"
              viewBox="0 0 24 24"
              width="5rem"
              height="3rem"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient
                  id="sapGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop
                    offset="0%"
                    style={{ stopColor: "#0073e6", stopOpacity: 1 }}
                  />
                  <stop
                    offset="50%"
                    style={{ stopColor: "#00b4f0", stopOpacity: 1 }}
                  />
                  <stop
                    offset="100%"
                    style={{ stopColor: "#004c9a", stopOpacity: 1 }}
                  />
                </linearGradient>
              </defs>
              <title>ERP</title>
              <path
                fill="url(#sapGradient)"
                d="M0 6.064v11.872h12.13L24 6.064zm3.264 2.208h.005c.863.001 1.915.245 2.676.633l-.82 1.43c-.835-.404-1.255-.442-1.73-.467-.708-.038-1.064.215-1.069.488-.007.332.669.633 1.305.838.964.306 2.19.715 2.377 1.9L7.77 8.437h2.046l2.064 5.576-.007-5.575h2.37c2.257 0 3.318.764 3.318 2.519 0 1.575-1.09 2.514-2.936 2.514h-.763l-.01 2.094-3.588-.003-.25-.908c-.37.122-.787.189-1.23.189-.456 0-.885-.071-1.263-.2l-.358.919-2 .006.09-.462c-.029.025-.057.05-.087.074-.535.43-1.208.629-2.037.644l-.213.002a5.075 5.075 0 0 1-2.581-.675l.73-1.448c.79.467 1.286.572 1.956.558.347-.007.598-.07.761-.239a.557.557 0 0 0 .156-.369c.007-.376-.53-.553-1.185-.756-.531-.164-1.135-.389-1.606-.735-.559-.41-.825-.924-.812-1.65a1.99 1.99 0 0 1 .566-1.377c.519-.537 1.357-.863 2.363-.863zm10.597 1.67v1.904h.521c.694 0 1.247-.23 1.248-.964 0-.709-.554-.94-1.248-.94zm-5.087.767l-.748 2.362c.223.085.481.133.757.133.268 0 .52-.047.742-.126l-.736-2.37z"
              />
            </svg>
          </div>
        ),
        // mantenemos el mismo estilo y duración
        duration: Infinity,
        style: {
          background: "#FFF",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          borderLeft: "4px solid #3B82F6",
        },
      });
    }
  }, [eot]);

  const operaciones = (rowData) => {
    const { sCotEstado: originalState, nCotTipo, Usuario_Id: userId } = rowData;

    const isRegister = originalState === "REGISTRADA";
    const state = isRegister
      ? userIsAdmin
        ? "POR APROBAR"
        : originalState
      : originalState;

    const canEdit =
      (user?.id === userId || userIsAdmin) &&
      (state === "BORRADOR" ||
        state === "APROBACIÓN DE DESCUENTO" ||
        state === "REGISTRADA" ||
        state === "POR APROBAR");

    const canDownloadEconomicOffer =
      state === "REGISTRADA" ||
      state === "POR APROBAR" ||
      state === "EN PEDIDO" ||
      state === "EN PROCESO" ||
      state === "PROCESADO" ||
      state === "ENTREGADO";

    const canDownloadTechnicalReportOfModels =
      nCotTipo === "Grupos electrógenos" &&
      (state === "REGISTRADA" ||
        state === "POR APROBAR" ||
        state === "EN PEDIDO" ||
        state === "EN PROCESO" ||
        state === "PROCESADO" ||
        state === "ENTREGADO");

    const canDeleteQuote =
      user?.id === userId ||
      (userIsAdmin &&
        (state === "BORRADOR" ||
          state === "APROBACIÓN DE DESCUENTO" ||
          state === "POR APROBAR" ||
          state === "REGISTRADA"));

    const canApprovalDiscount = state === "APROBACIÓN DE DESCUENTO";

    const canPromoteToDelivery =
      state === "POR APROBAR" || state === "EN PEDIDO" || isRegister;

    const canSendToERP = false;

    return (
      <div className="flex space-x-2 justify-center items-center">
        <Operation availableIn={canEdit}>
          <Operation.EditQuote openModalEdit={openModalEdit} quote={rowData} />
        </Operation>

        <Operation availableIn={canDownloadEconomicOffer}>
          <Tooltip text="Generar oferta económica">
            <Operation.DownloadEconomicOffer
              setOnRenderQuoteOfferPDF={setOnRenderQuoteOfferPDF}
              setSelectedItem={setQuoteSelected}
              quote={rowData}
            />
          </Tooltip>
        </Operation>

        <Operation availableIn={canDownloadTechnicalReportOfModels}>
          <Tooltip text="Fichas técnicas">
            <Operation.DownloadTechnicalReportOfModels
              setShouldDownload={setShouldDownload}
              setSelectedItem={setQuoteSelected}
              quote={rowData}
            />
          </Tooltip>
        </Operation>

        <Operation availableIn={canDeleteQuote}>
          <Operation.DeleteQuote
            openModalDelete={openModalDelete}
            quote={rowData}
          />
        </Operation>

        {userIsAdmin && (
          <Operation availableIn={canApprovalDiscount}>
            <Tooltip text="Requiere aprobar el descuento">
              <Operation.RequireApprovalDiscount
                setOpenApproveDiscountModal={setOpenApproveDiscountModal}
                setQuoteSelected={setQuoteSelected}
                quote={rowData}
              />
            </Tooltip>
          </Operation>
        )}

        {(user?.id === userId || userIsAdmin) && (
          <Operation availableIn={canPromoteToDelivery}>
            <Tooltip
              text={
                state === "POR APROBAR"
                  ? "Promover a pedido"
                  : "El pedido se encuentra en el ERP"
              }
            >
              <Operation.PromoteToDelivery
                setOpenApproveQuoteModal={setOpenApproveQuoteModal}
                setSelectedItem={setQuoteSelected}
                quote={rowData}
                state={state}
              />
            </Tooltip>
          </Operation>
        )}

        <Operation availableIn={canSendToERP}>
          <Operation.SendToERP
            setOpenSendToERPQuoteModal={setOpenSendToSAPQuoteModal}
            setSelectedItem={setQuoteSelected}
            quote={rowData}
          />
        </Operation>
      </div>
    );
  };

  return (
    <div className="pt-0 relative">
      <div className="w-full absolute pt-8 pb-10">
        <DataTable
          emptyMessage="No se encontraron cotizaciones"
          value={filteredData}
          tableStyle={{ minWidth: "50rem" }}
          paginator
          rows={10}
          rowsPerPageOptions={getFilas(filteredData)}
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          currentPageReportTemplate="{first} - {last} de {totalRecords}"
          globalFilterFields={[
            "name",
            "country.name",
            "representative.name",
            "status",
          ]}
        >
          <Column field="nCotCodigo" sortable header="NRO" />
          {onERP && (
            <Column
              field="nSAPQuoteCode"
              sortable
              header="CODIGO ERP DE PEDIDO"
            />
          )}
          <Column
            field="dCotFecha"
            sortable
            header="FECHA"
            body={(rowData) => {
              const date = new Date(rowData.dCotFecha);
              return (
                <span>
                  {new Date(
                    date.getTime() + date.getTimezoneOffset() * 60000
                  ).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </span>
              );
            }}
          />

          <Column
            field="Ejecutivo_Nombre"
            sortable
            header="EJECUTIVO"
            body={(rowData) => {
              return <span>{rowData?.sEjeNombre}</span>;
            }}
          />

          <Column field="nCotTipo" sortable header="PRODUCTO" />

          <Column
            field="Cliente_RUC"
            sortable
            header="N° DE IDENTIFICACIÓN FISCAL"
            body={(rowData) => {
              return <span>{rowData?.sCliRucDni}</span>;
            }}
          />

          <Column
            field="Cliente_Id"
            sortable
            header="CLIENTE"
            body={(rowData) => {
              return <span>{rowData?.sCliNombre}</span>;
            }}
          />

          <Column field="sCotProyecto" sortable header="PROYECTO" />
          <Column field="sCotMateriales" sortable header="MATERIALES" />

          <Column
            field="nCotTotal"
            sortable
            header="IMPORTE"
            body={(rowData) => {
              const currencyId = Number.parseInt(rowData.Moneda_Id);
              const currency = rowData?.sMonedaCodigo;

              let total = Number.parseFloat(rowData.nCotTotal);

              if (currencyId === 1) {
                const exchangeRate = Number.parseFloat(rowData.nCotTipoCambio);
                total = total * exchangeRate;
              }

              let truncatedTotal = Math.floor(total * 100) / 100;

              const marketName = rowData.sMercadoNombre;
              const incotermCategory = rowData.sIncotermCategoriaNombre;

              if (marketName !== "NACIONAL") {
                const incotermFrightAmount = Number.parseFloat(
                  rowData?.nCotIncotermValor || 0
                );

                const incotermInsuranceAmount = Number.parseFloat(
                  rowData?.nCotIncotermValorSeguro || 0
                );

                switch (incotermCategory) {
                  case "Flete y Seguros":
                    {
                      truncatedTotal +=
                        incotermFrightAmount + incotermInsuranceAmount;
                    }
                    break;
                  case "Flete":
                    {
                      truncatedTotal += incotermFrightAmount;
                    }
                    break;
                  case "Sin Flete ni Seguros":
                    {
                      // No se agrega nada
                    }
                    break;
                  default:
                    break;
                }
              }

              // Format with commas but don't round
              const formattedTotal = truncatedTotal.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              });

              return (
                <section className="flex items-center gap-1">
                  <span>{currency}</span> <span>{formattedTotal}</span>
                </section>
              );
            }}
          />
          <Column
            sortable
            field="sCotEstado"
            header="ESTADO"
            body={(rowData) => {
              const isRegister = rowData.sCotEstado === "REGISTRADA";
              const state = isRegister
                ? userIsAdmin
                  ? "POR APROBAR"
                  : rowData.sCotEstado
                : rowData.sCotEstado;
              return <QuoteStateBadge state={state} />;
            }}
          />
          <Column body={operaciones} />
        </DataTable>
      </div>
      <DeleteModal
        open={openDelete}
        setOpen={setOpenDelete}
        onConfirm={confirmDelete}
      />
      <ApproveQuoteModal
        open={openApproveQuoteModal}
        setOpen={setOpenApproveQuoteModal}
        onConfirm={() => handleApprovedQuote(selectedQuote)}
        onReject={() => handleRejectQuote(selectedQuote)}
        quote={quote}
      />

      <RequireApprovalDiscountOfModels
        open={openApproveDiscountModal}
        modelsWithApprovalDiscount={
          quote?.details?.filter(
            (detail) => detail.quote_extra_details?.nIncrementoDescuento === 1
          ) || false
        }
        setOpen={setOpenApproveDiscountModal}
        onConfirm={() => handleApprovedDiscountOfModels(selectedQuote)}
      />
      <SendToSAPQuoteModal
        open={openSendToSAPQuoteModal}
        setOpen={setOpenSendToSAPQuoteModal}
        onConfirm={() => handleSendToSAPQuote(selectedQuote)}
      />
    </div>
  );
};
