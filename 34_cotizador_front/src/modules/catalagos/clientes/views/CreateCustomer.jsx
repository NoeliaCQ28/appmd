import { Mail, Phone } from "lucide-react";
import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Button } from "../../../../components/custom/buttons/Button";
import { ErrorComponent } from "../../../../components/error/ErrorComponent";
import { CustomerContactsTableSkeleton } from "../../../../components/skeletons/CustomerContactsTableSkeleton";
import { CustomerFormSkeleton } from "../../../../components/skeletons/CustomerFormSkeleton";
import { useVendedores } from "../../vendedores/hooks/useVendedores";
import { CustomerContactsTable } from "../components/CustomerContactsTable";
import { CustomerForm } from "../components/forms/CustomerForm";
import { ContactModal } from "../components/forms/modals/ContactModal";
import useCustomersContacts from "../hooks/useCustomerContacts";
import { useCustomerStore } from "../stores/useCustomerStore";

export const CreateCustomer = ({
  setVisibility,
  isEditMode,
  selectedEditItem,
  marketType,
  onCustomerCreated,
  customersList,
  setMarketType,
}) => {
  // --------------------- HOOKS ---------------------

  const [newCustomerId, setNewCustomerId] = React.useState(null);

  //Estado para almacenar el cliente creado
  const [createdCustomer, setCreatedCustomer] = React.useState(null);

  // --------------------- STORES ---------------------

  const { customerFromSAP } = useCustomerStore();

  // Cuando se crea un nuevo cliente
  React.useEffect(() => {
    if (newCustomerId && customersList && onCustomerCreated) {
      // Esperar a que customersList tenga el nuevo cliente
      const newCustomer = customersList.find(
        (c) => c.Cliente_Id === newCustomerId
      );

      if (newCustomer && newCustomer !== createdCustomer) {
        setCreatedCustomer(newCustomer);
        onCustomerCreated(newCustomer);
      }
    }
  }, [newCustomerId, customersList, onCustomerCreated, createdCustomer]);

  const {
    data,
    isLoading: isLoadingContacts,
    denominationsData,
    departmentsData,
  } = useCustomersContacts(
    (isEditMode ? selectedEditItem?.Cliente_Id : null) || newCustomerId
  );

  const denominationsOptions = React.useMemo(() => {
    return (
      denominationsData?.map((denomination) => ({
        code: denomination.ContactoDenominacionId,
        name: denomination.ContactoDenominacionDescripcion,
      })) || []
    );
  }, [denominationsData]);

  const departmentsOptions = React.useMemo(() => {
    return (
      departmentsData?.map((department) => ({
        code: department.ConDepartamentoId,
        name: department.ConDepartamentoNombre,
      })) || []
    );
  }, [departmentsData]);

  const [isOpenContactModal, setIsOpenContactModal] = React.useState(false);

  const { data: sellers = [], isLoading: isLoadingSellers } = useVendedores();

  const filterSellers = React.useMemo(
    () => sellers.filter((seller) => seller.nEjeEstado === 1),
    [sellers]
  );

  const sortedSellers = React.useMemo(
    () =>
      [...filterSellers].sort((a, b) =>
        a.sEjeNombre.localeCompare(b.sEjeNombre)
      ),
    [filterSellers]
  );

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-3">
      <section className="lg:border-r-[1px] pr-2">
        <h1 className="text-xl font-bold">
          {isEditMode ? "Editar datos del Cliente" : "Datos del Nuevo Cliente"}
        </h1>
        {isLoadingSellers ? (
          <CustomerFormSkeleton />
        ) : (
          <ErrorBoundary fallbackRender={ErrorComponent}>
            <CustomerForm
              isEditMode={isEditMode}
              selectedEditItem={selectedEditItem}
              setVisibility={setVisibility}
              setNewCustomerId={setNewCustomerId}
              sellers={sortedSellers}
              marketType={marketType}
              setMarketType={setMarketType}
            />
          </ErrorBoundary>
        )}
      </section>
      <section className="flex flex-col space-y-3">
        <h1 className="text-xl font-bold">Agregar Nuevo Contacto</h1>
        <Button
          onClick={() => {
            setIsOpenContactModal(true);
          }}
          type="button"
          className="w-fit self-end"
          disabled={!newCustomerId && !isEditMode}
        >
          Agregar
        </Button>

        {isLoadingContacts ? (
          <CustomerContactsTableSkeleton />
        ) : data ? (
          <CustomerContactsTable
            filteredData={data}
            customerId={selectedEditItem?.Cliente_Id || newCustomerId}
          />
        ) : (
          <>
            {customerFromSAP && customerFromSAP?.contacts?.length > 0 && (
              <section className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Contactos encontrados en ERP:
                </p>
                <ul className="space-y-2 max-h-96 overflow-y-auto scroll-mask-white">
                  {customerFromSAP?.contacts?.map((contact, index) => (
                    <li
                      key={index}
                      className="bg-white p-2 rounded-lg shadow-sm border border-gray-100 flex items-start gap-3"
                    >
                      <div className="flex-shrink-0">
                        <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center text-sm font-medium text-slate-700">
                          {contact.name?.charAt(0) || "-"}
                          {contact.lastName?.charAt(0) || ""}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium truncate">
                            {contact.lastName} {contact.name}
                          </p>
                          <div className="text-xs text-gray-400">
                            #{index + 1}
                          </div>
                        </div>

                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md">
                            {denominationsOptions.find(
                              (d) => d.code === contact.role
                            )?.name || "-"}
                          </span>
                          <span className="text-xs px-2 py-0.5 bg-gray-50 text-gray-700 rounded-md">
                            {departmentsOptions.find(
                              (d) => d.code === contact.department
                            )?.name || "-"}
                          </span>
                        </div>

                        <div className="mt-2 text-xs text-slate-600 flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-1">
                          <div className="flex items-center gap-1">
                            <Mail height={16} width={16} />
                            <span className="truncate">
                              {contact.email || "-"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone height={16} width={16} />
                            <span className="truncate">
                              {contact.phone || "-"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            <div className="text-center py-8 flex flex-col items-center">
              <div className="bg-white border-[1px] border-yellow-200 border-dashed rounded-lg p-2 max-w-md flex gap-2 items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-yellow-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-xs text-gray-700">
                  Los contactos se guardan una vez que el cliente ha sido
                  registrado.
                </p>
              </div>
            </div>
          </>
        )}

        <ContactModal
          isOpen={isOpenContactModal}
          setIsOpen={setIsOpenContactModal}
          customerId={selectedEditItem?.Cliente_Id || newCustomerId}
        />
      </section>
    </section>
  );
};
