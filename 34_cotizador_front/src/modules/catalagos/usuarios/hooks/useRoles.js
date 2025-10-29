import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import RoleService from "../services/roleService";

const QUERY_KEY = "roles";

const useRoles = () => {
  const queryClient = useQueryClient();

  const { getAll } = RoleService;

  const {
    data: roles,
    error: errorRoles,
    isLoading: isLoadingRoles,
  } = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: getAll,
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { roles, errorRoles, isLoadingRoles };
};

export default useRoles;
