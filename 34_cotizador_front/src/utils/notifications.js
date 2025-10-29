import { toast } from "react-toastify";

export const notify = {
  success: (msg) => toast.success(msg),
  error: (err) => {
    const errorMessage =
      typeof err === "string" ? err : err?.message || "Error desconocido";
    toast.error(errorMessage);
  },
  warning: (msg) => toast.warning(msg),
};
