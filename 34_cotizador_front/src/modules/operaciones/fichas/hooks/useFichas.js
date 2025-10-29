import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getModelosFichas } from "../services/fichasTecnicasService";
/**
 * @param {Object} param0
 * @param {String} param0.environment - 'INTERNAL' | 'PUBLIC'
 */
export const useFichas = ({ environment }) => {
  const {
    data: technicalReports,
    mutate: findTechnicalReports,
    isPending: isPendingFindTechnicalReports,
  } = useMutation({
    mutationFn: getModelosFichas,
    onError: (error) => {
      if (environment === "PUBLIC") {
        toast.warning(error.message);
      } else {
        toast.error(error.message);
      }
    },
    onSuccess: (data) => {
      if (data.generatorSets.length == 0) {
        if (environment === "PUBLIC") {
          toast.warning("No existen modelos que mostrar");
        } else {
          toast.error("No existen modelos que mostrar");
        }
      } else {
        toast.success("Fichas técnicas encontradas correctamente");
      }
    },
  });

  return {
    technicalReports,
    findTechnicalReports,
    isPendingFindTechnicalReports,
  };
};
