import { CloudUpload, RefreshCw, XCircleIcon } from "lucide-react";
import { Card } from "primereact/card";
import { InputSwitch } from "primereact/inputswitch";
import React from "react";
import { Button } from "../../../../../../components/custom/buttons/Button";
import { Modal } from "../../../../../../components/modals/Modal";
import useSAP from "../../../../../../hooks/useSAP";
import useQuote from "../../../hooks/useQuote";
import { ValidationField } from "../../ValidationField";

export const ApproveQuoteModal = ({
  open,
  setOpen,
  onConfirm,
  onReject,
  quote,
}) => {
  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };

  const handleReject = () => {
    onReject();
    setOpen(false);
  };

  const {
    customerFromSAP,
    findCustomerMutate,
    createCustomerFromModelMutate,
    isPendingCustomerFromSAP,
  } = useSAP({ showToast: false });
  const {
    validateQuoteMutate,
    validateQuoteData,
    isPendingValidateQuote,
    validateQuoteError,
  } = useQuote();

  const quoteId = React.useMemo(() => quote?.Cotizacon_Id, [quote]);
  const quoteType = React.useMemo(() => quote?.nCotTipo, [quote]);
  const customerRUC = React.useMemo(() => quote?.sCliRucDni, [quote]);

  const [forceSendToSAP, setForceSendToSAP] = React.useState(false);

  const checkCustomerInSAP = React.useCallback(
    ({ ruc }) => {
      findCustomerMutate({ ruc });
    },
    [findCustomerMutate]
  );

  const handleCreate = () => {
    createCustomerFromModelMutate(
      { customerId: quote.Cliente_Id },
      {
        onSuccess: () => {
          // Vuelve a disparar la búsqueda para actualizar el estado
          findCustomerMutate({ ruc: customerRUC });
        },
      }
    );
  };

  React.useEffect(() => {
    if (quoteId) {
      validateQuoteMutate({ quoteId });
    }
  }, [quoteId, validateQuoteMutate]);

  React.useEffect(() => {
    if (customerRUC) {
      checkCustomerInSAP({ ruc: customerRUC });
    }
  }, [customerRUC, checkCustomerInSAP]);

  const validations = React.useMemo(() => {
    const customerExistsOnSAP =
      customerFromSAP && customerFromSAP?.id && customerFromSAP?.id !== "";
    // const customerExistsOnSAP = false;
    const otherValidations = validateQuoteData?.passed;

    return [customerExistsOnSAP, otherValidations];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerFromSAP?.name, validateQuoteData?.passed]);
  // }, [validateQuoteData?.passed]);

  const isValidQuote = validations
    .filter((validation) => validation !== undefined)
    .every((validation) => validation === true);

  // Solo permitir aprobar si todas las validaciones son verdaderas
  const canApprove = isValidQuote || forceSendToSAP;

  const customerIsPresentOnSAP =
    customerFromSAP && customerFromSAP?.id && customerFromSAP?.id !== "";

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title="Aprobar Cotización"
      width="max-w-3xl"
      footer={
        <>
          <Button onClick={handleConfirm} disabled={!canApprove}>
            <CloudUpload className="w-5 h-5 mr-2" /> Si, Aprobar
          </Button>
          <Button variant="destructive" onClick={handleReject}>
            No, Rechazar
          </Button>
          <Button variant="destructive" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
        </>
      }
    >
      <section className="flex flex-col space-y-2 my-4">
        <section className="flex gap-3">
          <h3 className="font-semibold">Validaciónes para promover al ERP</h3>
          <button
            className="flex items-center gap-2 md:text-sm font-semibold p-1 border border-zinc-300 rounded-lg text-green-800 hover:text-green-900 hover:bg-green-50 transition-colors duration-300 text-xs"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              checkCustomerInSAP({ ruc: customerRUC });
              validateQuoteMutate({ quoteId });
            }}
          >
            <RefreshCw height={16} width={16} />
            {isPendingCustomerFromSAP || isPendingValidateQuote
              ? "Cargando..."
              : "Actualizar"}
          </button>
        </section>

        <section>
          {(validateQuoteError ||
            validateQuoteData?.SAPValidations?.serviceDown) && (
            <div className="p-3 mb-3 text-sm text-red-700 bg-red-100 rounded-lg flex items-center gap-2">
              <XCircleIcon className="fill-red-500 text-white" />
              <span>
                {validateQuoteError?.message ||
                  validateQuoteData?.SAPValidations?.message}
              </span>
            </div>
          )}
        </section>

        {!validateQuoteError &&
          !validateQuoteData?.SAPValidations?.serviceDown && (
            <>
              <ValidationField
                title="Cliente registrado en el ERP."
                isValid={customerIsPresentOnSAP}
                onInvalidate={handleCreate}
                invalidateMessage="Crear en ERP"
                isLoading={isPendingCustomerFromSAP || isPendingValidateQuote}
              />

              <ValidationField
                title="Cliente creado correctamente"
                isValid={
                  customerIsPresentOnSAP &&
                  validateQuoteData?.general.customer.hasSAPCodeInDatabase
                }
                isLoading={isPendingValidateQuote}
              />

              <ValidationField
                title="Cotización y cliente comparten canal."
                isValid={
                  validateQuoteData?.general.customer.sameDistributionChannel
                }
                isLoading={isPendingValidateQuote}
              />

              <ValidationField
                title="El cliente esta habilitado para cotizar en la moneda de la cotización."
                isValid={validateQuoteData?.general.customer.sameCurrency}
                isLoading={isPendingValidateQuote}
              />

              <ValidationField
                title="Ejecutivo registrado en el ERP"
                isValid={validateQuoteData?.general.executive.existsOnSAP}
                isLoading={isPendingValidateQuote}
              />
            </>
          )}

        {/* ERP Validations  */}
        {isPendingValidateQuote ? (
          <div className="animate-pulse">
            <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              {[1, 2].map((item) => (
                <div key={item} className="bg-gray-100 rounded-lg p-4 h-40">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <section>
            <ul>
              {validateQuoteData?.SAPValidations?.hasErrors &&
                validateQuoteData?.SAPValidations?.errors?.length > 0 &&
                validateQuoteData?.SAPValidations?.errors?.map(
                  (error, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <XCircleIcon className="fill-red-500 text-white" />
                      <span className="max-w-[320px]">{error?.message}</span>
                    </li>
                  )
                )}
            </ul>
          </section>
        )}

        {isPendingValidateQuote ? (
          <div className="animate-pulse">
            <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              {[1, 2].map((item) => (
                <div key={item} className="bg-gray-100 rounded-lg p-4 h-40">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          validateQuoteData?.details && (
            <section className="flex flex-col space-y-2">
              <h4 className="font-semibold">Detalles</h4>
              <DetailsValidation
                quoteType={quoteType}
                details={validateQuoteData?.details}
              />
            </section>
          )
        )}
        {!isValidQuote && (
          <div className="mt-6 p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                <div>
                  <h4 className="font-semibold text-gray-800">
                    Forzar Aprobación
                  </h4>
                  <p className="text-sm text-gray-600">Omitir validaciones</p>
                </div>
              </div>
              <InputSwitch
                checked={forceSendToSAP}
                onChange={(e) => setForceSendToSAP(e.value)}
              />
            </div>
            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                forceSendToSAP
                  ? "max-h-20 opacity-100 mt-3"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="text-xs text-orange-700 bg-orange-100 px-3 py-2 rounded-md">
                ⚠️ La cotización se enviará sin validaciones completas
              </div>
            </div>
          </div>
        )}
      </section>
    </Modal>
  );
};

function DetailsValidation({ details, quoteType }) {
  switch (quoteType) {
    case 1:
      return <GeneratorSetDetailsValidation details={details} />;
    case 2:
      return <CableDetailsValidation details={details} />;
    case 3:
      return <CellDetailsValidation details={details} />;
    case 4:
      return <TransformerDetailsValidation details={details} />;
    default:
      return null;
  }
}

function GeneratorSetDetailsValidation({ details }) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
      {details?.map((detail, index) => {
        const motor = detail.motor;
        const alternador = detail.alternador;
        const itm = detail.itm;

        const isValidMotor = motor?.existsOnSAP;
        const isValidAlternador = alternador?.existsOnSAP;
        const isValidITM = itm?.existsOnSAP;

        const stockMotor = motor?.stock || 0;
        const stockAlternator = alternador?.stock || 0;
        const stockITM = itm?.stock || 0;

        const isAvailableStockMotor = motor?.isAvailableStock || false;
        const isAvailableStockAlternator =
          alternador?.isAvailableStock || false;
        const isAvailableStockITM = itm?.isAvailableStock || false;

        return (
          <Card
            key={index}
            className="md:w-25rem flex flex-col justify-between shadow-none border rounded-lg overflow-hidden"
            header={
              <div className="px-4 py-3 bg-gray-50 border-b">
                <div className="text-sm font-semibold truncate">
                  {detail?.model?.name}
                </div>
                <div className="text-xs text-gray-500">Grupo Electrógeno</div>
              </div>
            }
          >
            <div className="p-3 space-y-3">
              {/* Motor */}
              <div className="rounded-lg border p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 text-[10px] font-medium bg-gray-100 text-gray-700 rounded-full">
                    Motor: {motor?.name}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <ValidationField
                    title="Código ERP"
                    description={"El motor debe tener código ERP"}
                    isValid={isValidMotor}
                    isLoading={false}
                  />
                  <ValidationField
                    title="Stock"
                    description={`Stock disponible: ${stockMotor}`}
                    isValid={isAvailableStockMotor}
                    isLoading={false}
                  />
                </div>
              </div>

              {/* Alternador */}
              <div className="rounded-lg border p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 text-[10px] font-medium bg-gray-100 text-gray-700 rounded-full">
                    Alternador: {alternador?.name}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <ValidationField
                    title="Código ERP"
                    description={"El alternador debe tener código ERP"}
                    isValid={isValidAlternador}
                    isLoading={false}
                  />
                  <ValidationField
                    title="Stock"
                    description={`Stock disponible: ${stockAlternator}`}
                    isValid={isAvailableStockAlternator}
                    isLoading={false}
                  />
                </div>
              </div>

              {/* Módulo ITM */}
              <div className="rounded-lg border p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 text-[10px] font-medium bg-gray-100 text-gray-700 rounded-full">
                    Módulo ITM: {itm?.name}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <ValidationField
                    title="Código ERP"
                    description={"El Módulo ITM debe tener código ERP"}
                    isValid={isValidITM}
                    isLoading={false}
                  />
                  <ValidationField
                    title="Stock"
                    description={`Stock disponible: ${stockITM}`}
                    isValid={isAvailableStockITM}
                    isLoading={false}
                  />
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </section>
  );
}

function CableDetailsValidation({ details }) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
      {details?.map((detail, index) => {
        const isValidCable = detail?.existsOnSAP;

        const stockAvailable = detail?.stock || 0;
        const isAvailableStock = detail?.isAvailableStock || false;

        return (
          <Card
            key={index}
            title={"Cable"}
            subTitle={`Marca: ${detail?.brand} - Tipo: ${detail?.type}`}
            className="md:w-25rem flex flex-col justify-between text-black shadow-none border rounded-md"
          >
            <ValidationField
              title={`Codigo ERP del cable`}
              description={"El cable debe estar creado en el ERP"}
              isValid={isValidCable}
              isLoading={false}
            />
            <ValidationField
              title={`Stock del Cable`}
              description={`Stock disponible ${stockAvailable}`}
              isValid={isAvailableStock}
              isLoading={false}
            />
          </Card>
        );
      })}
    </section>
  );
}

function CellDetailsValidation({ details }) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
      {details?.map((detail, index) => {
        const isValidCell = detail?.existsOnSAP;

        const stockAvailable = detail?.stock || 0;
        const isAvailableStock = detail?.isAvailableStock || false;

        return (
          <Card
            key={index}
            title={"Celda"}
            subTitle={`Marca: ${detail?.brand} - Tipo: ${detail?.type}`}
            className="md:w-25rem flex flex-col justify-between text-black shadow-none border rounded-md"
          >
            <ValidationField
              title={"Codigo ERP de la celda"}
              description={"La celda debe estar creada en el ERP"}
              isValid={isValidCell}
              isLoading={false}
            />

            <ValidationField
              title={`Stock de la Celda`}
              description={`Stock disponible ${stockAvailable}`}
              isValid={isAvailableStock}
              isLoading={false}
            />
          </Card>
        );
      })}
    </section>
  );
}

function TransformerDetailsValidation({ details }) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
      {details?.map((detail, index) => {
        const isValidTransformer = detail?.existsOnSAP;

        const stockAvailable = detail?.stock || 0;
        const isAvailableStock = detail?.isAvailableStock || false;

        return (
          <Card
            key={index}
            title={"Transformador"}
            subTitle={`Marca: ${detail?.brand} - Tipo: ${detail?.type}`}
            className="md:w-25rem flex flex-col justify-between text-black shadow-none border rounded-md"
          >
            <ValidationField
              title={"Codigo ERP del transformador"}
              description={"El transformador debe estar creado en el ERP"}
              isValid={isValidTransformer}
              isLoading={false}
            />
            <ValidationField
              title={`Stock del Transformador`}
              description={`Stock disponible ${stockAvailable}`}
              isValid={isAvailableStock}
              isLoading={false}
            />
          </Card>
        );
      })}
    </section>
  );
}
