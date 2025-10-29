import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  createUser,
  editUser,
  getUser,
  userLogout,
} from "../modules/auth/services/AuthService";

export const useAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  // State para tiempo restante de sesión (ms)
  const [timeLeft, setTimeLeft] = useState(null);
  // Efecto para actualizar cada segundo el tiempo restante
  useEffect(() => {
    const token = Cookies.get("AUTH_TOKEN");
    if (token) {
      try {
        const { exp } = jwtDecode(token);
        const expirationTime = exp * 1000;
        const update = () => {
          const now = Date.now();
          const remaining = expirationTime - now;
          if (remaining > 60000) return;
          setTimeLeft(remaining > 0 ? remaining : 0);
        };
        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
      } catch (err) {
        console.error("Error al decodificar token:", err);
      }
    }
  }, []);

  const { data, isError, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const { mutate: logout } = useMutation({
    mutationFn: userLogout,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["user"] });
      navigate("/login");
    },
  });

  const { mutate: create } = useMutation({
    mutationFn: createUser,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("Usuario creado correctamente");
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
    },
  });

  const { mutate: update } = useMutation({
    mutationFn: editUser,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
    },
  });

  return {
    data, // Para mantener la compatibilidad
    user: data,
    isError,
    isLoading,
    logout,
    create,
    update,
    timeLeft,
  };
};
