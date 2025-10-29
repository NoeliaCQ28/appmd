import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import SAPService from "../services/SAPService";

const useSAP = ({ showToast } = { showToast: true }) => {
  const queryClient = useQueryClient();

  const { findCustomer, createCustomerFromModel } = SAPService;

  const {
    data: customerFromSAP,
    isPending: isPendingCustomerFromSAP,
    error: errorCustomerFromSAP,
    mutate: findCustomerMutate,
  } = useMutation({
    mutationFn: findCustomer,
    onSuccess: (data) => {
      if (!showToast) return;

      if (data && data.O_TIPO !== "E") {
        toast.success("Cliente obtenido correctamente desde el ERP");
      } else {
        toast.error("No se encontro el cliente en el ERP");
      }
    },
    onError: (error) => {
      if (!showToast) return;
      toast.error(`Error al obtener cliente: ${error.message}`);
    },
  });

  const {
    mutate: createCustomerFromModelMutate,
    isPending: isPendingCreateCustomerFromModelMutate,
    error: errorCreateCustomerFromModelMutate,
    data: createCustomerFromModelData,
  } = useMutation({
    mutationFn: createCustomerFromModel,
    onSuccess: (data) => {

      if (data && data.SAPCode && data.SAPCode !== "") {
        toast.success("Cliente creado correctamente en el ERP");
      } else {
        toast.error("Error al crear el cliente en el ERP");
      }
    },
    onError: (error) => {
      toast.error(`Error al crear cliente: ${error.message}`);
    },
  });

  return {
    findCustomerMutate,
    customerFromSAP,
    isPendingCustomerFromSAP,
    errorCustomerFromSAP,
    createCustomerFromModelMutate,
    isPendingCreateCustomerFromModelMutate,
    errorCreateCustomerFromModelMutate,
    createCustomerFromModelData,
  };
};

export default useSAP;
