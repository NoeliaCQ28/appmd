import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import UserService from "../services/userService";

const QUERY_KEY = "usuarios";

const useUsuarios = () => {
  const queryClient = useQueryClient();

  const { getAll } = UserService;

  const {
    data: users,
    error: errorUsers,
    isLoading: isLoadingUsers,
  } = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: getAll,
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { users, errorUsers, isLoadingUsers };
};

export default useUsuarios;
