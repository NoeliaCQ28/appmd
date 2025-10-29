import { NavBar } from "@components/navbar/NavBar";
import { Sidebar } from "@components/sidebar/Sidebar";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Navigate, Outlet } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ErrorComponent } from "../components/error/ErrorComponent";
import { MainLoading } from "../components/MainLoading";
import { Footer } from "../components/navbar/Footer";
import { SidebarProvider, useSidebar } from "../contexts/SidebarContext";
import { useAuth } from "../hooks/useAuth";

// Componente de carga más ligero para usar dentro del layout
const InlineLoading = () => (
  <div className="w-full h-full flex justify-center items-center">
    <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
  </div>
);

// Nested component so we can consume sidebar context after provider
const LayoutContent = () => {
  const { open } = useSidebar();
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div
        className={`flex flex-col w-full transition-all duration-300 ease-out ${
          open ? "pl-72 max-[1170px]:pl-0" : "pl-0"
        }`}
      >
        <NavBar />
        {/* offset padding for fixed navbar: h-14 sm:h-16 */}
          <section className="flex-1 overflow-auto w-full pt-14 sm:pt-16">
            <Suspense fallback={<InlineLoading />}>
              <Outlet />
            </Suspense>
          </section>
        <ErrorBoundary fallbackRender={ErrorComponent}>
          <Footer />
        </ErrorBoundary>
      </div>
    </div>
  );
};

export const AppLayout = () => {
  const { data, isError, isLoading } = useAuth();

  if (isLoading) {
    return <MainLoading />;
  }

  if (isError) {
    return <Navigate to={"/login"} />;
  }

  if (!data) return null;

  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};
