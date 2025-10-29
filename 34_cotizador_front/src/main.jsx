import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "katex/dist/katex.min.css";
import "primeicons/primeicons.css";
import { PrimeReactProvider } from "primereact/api";
import React from "react";
import ReactDOM from "react-dom/client";
import { toast, ToastContainer } from "react-toastify";
import "./index.css";
import Router from "./router.jsx";
import "./libs/i18n.js"

// Guarda la referencia original a toast.error
const originalToastError = toast.error;

// Sobrescribe toast.error para que siempre establezca autoClose en false.
toast.error = (content, options = {}) => {
  const newOptions = { ...options, autoClose: false };
  return originalToastError(content, newOptions);
};

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <PrimeReactProvider>
      <QueryClientProvider client={queryClient}>
        <Router />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </PrimeReactProvider>
  </React.StrictMode>
);

const toastContainer = document.createElement("div");
toastContainer.id = "toast-container";
document.body.appendChild(toastContainer);

ReactDOM.createRoot(toastContainer).render(
  <ToastContainer
    pauseOnFocusLoss={false}
    autoClose={3000}
    newestOnTop={true}
    position="top-center"
    draggable
    pauseOnHover
    stacked
  />
);
