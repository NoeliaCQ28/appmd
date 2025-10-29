import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppLayout } from "./layouts/AppLayout";
import { AuthLayout } from "./layouts/AuthLayout";
import { Login } from "./modules/auth/views/Login";
import CablesView from "./modules/catalagos/cables/views/CablesView";
import AccesoriosCellsView from "./modules/catalagos/celdas/accesorios/views/AccesoriosCellsView";
import CeldasView from "./modules/catalagos/celdas/views/CeldasView";
import { ClientesView } from "./modules/catalagos/clientes/views/ClientesView";
import { CondicionesView } from "./modules/catalagos/condiciones/views/CondicionesView";
import { CreateCondicionesView } from "./modules/catalagos/condiciones/views/CreateCondicionesView";
import AccesoriosGruposElectrogenosView from "./modules/catalagos/grupos_electrogenos/accesorios/views/AccesoriosGruposElectrogenosView";
import GruposElectrogenosView from "./modules/catalagos/grupos_electrogenos/views/GruposElectrogenosView";
import AccesoriosTransformersView from "./modules/catalagos/transformadores/accesorios/views/AccesoriosTransformersView";
import TransformersView from "./modules/catalagos/transformadores/views/TransformersView";
import UsersView from "./modules/catalagos/usuarios/views/UsersView";
import { VendedoresView } from "./modules/catalagos/vendedores/views/VendedoresView";
import PreferenceSettingsView from "./modules/configuracion/views/PreferenceSettingsView";
import { CotizacionsAdjuntarDetalleView } from "./modules/operaciones/cotizaciones/views/CotizacionsAdjuntarDetalleView";
import { CotizacionView } from "./modules/operaciones/cotizaciones/views/CotizacionView";
import { CreateCotizacionView } from "./modules/operaciones/cotizaciones/views/CreateCotizacionView";
import { EditCotizacionView } from "./modules/operaciones/cotizaciones/views/EditCotizacionView";
import { FichaPdfModal } from "./modules/operaciones/fichas/components/modals/FichaPdfModal";
import { CreateCotizar } from "./modules/operaciones/fichas/views/CreateCotizar";
import { FichasView } from "./modules/operaciones/fichas/views/FichasView";
import { PedidosView } from "./modules/operaciones/pedidos/views/PedidosView";
import DashboardReportesView from "./modules/reportes/dashboard/views/DashboardReportesView";
import { DashboardView } from "./views/DashboardView";
import ExecutiveReportView from "./modules/reportes/ejecutivo/views/ExecutiveReportView";
import QuotesReportView from "./modules/reportes/quotes/views/QuotesReportView";
import ClientsReportView from "./modules/reportes/clientes/views/ClientsReportView";
import { MonitoringView } from "./modules/configuracion/monitoring/views/MonitoringView";

export default function AppRouter() {
  const LOCAL = import.meta.env.VITE_NODE_ENV === "local";
  const DEVELOPMENT = import.meta.env.VITE_NODE_ENV === "development";

  return (
    <BrowserRouter
      basename={LOCAL ? "/" : DEVELOPMENT ? "/proyectos/dev-cotizador/" : "/"}
    >
      <Routes>
        <Route element={<AppLayout />}>
          {/* Inicio */}
          <Route path="/" element={<DashboardView />} />

          {/* Operaciones - Cotizaciones */}
          <Route path="/cotizaciones" element={<CotizacionView />} />
          <Route
            path="/cotizaciones/crear"
            element={<CreateCotizacionView />}
          />
          <Route
            path="/cotizaciones/crear/combinaciones"
            element={<CotizacionsAdjuntarDetalleView />}
          />
          <Route
            path="/cotizaciones/editar/:id"
            element={<EditCotizacionView />}
          />

          {/* Operaciones - Fichas y Pedidos (privadas) */}
          <Route path="/fichas-tecnicas" element={<FichasView />} />
          <Route path="/pedidos" element={<PedidosView />} />

          {/* Catálogos */}
          <Route path="/clientes" element={<ClientesView />} />
          <Route path="/ejecutivos" element={<VendedoresView />} />
          <Route
            path="/condiciones-comerciales"
            element={<CondicionesView />}
          />
          <Route
            path="/condiciones-comerciales/crear"
            element={<CreateCondicionesView />}
          />
          <Route
            path="/condiciones-comerciales/editar"
            element={<CreateCondicionesView />}
          />
          <Route
            path="/catalogos/grupos-electrogenos"
            element={<GruposElectrogenosView />}
          />
          <Route path="/accesorios-celdas" element={<AccesoriosCellsView />} />
          <Route
            path="/accesorios-grupos-electrogenos"
            element={<AccesoriosGruposElectrogenosView />}
          />
          <Route
            path="/accesorios-transformadores"
            element={<AccesoriosTransformersView />}
          />
          <Route path="/cables" element={<CablesView />} />
          <Route path="/celdas" element={<CeldasView />} />
          <Route path="/transformadores" element={<TransformersView />} />

          {/* Administración */}
          <Route path="/usuarios" element={<UsersView />} />

          {/* Reportes */}
          <Route path="/dashboard" element={<DashboardReportesView />} />
          <Route path="/reportes-ejecutivo" element={<ExecutiveReportView />} />
          <Route path="/reportes-cotizaciones" element={<QuotesReportView />} />
          <Route path="/reportes-clientes" element={<ClientsReportView />} />

          {/* Configuración */}
          <Route
            path="/configuracion/preferencias"
            element={<PreferenceSettingsView />}
          />
          <Route
            path="/configuracion/monitoreo"
            element={<MonitoringView />}
          />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Rutas libres para las fichas */}
        <Route path="/fichas/cotizar" element={<CreateCotizar />} />
        <Route path="/fichas/pdf/:id" element={<FichaPdfModal />} />
        <Route path="/fichas" element={<FichasView />} />
      </Routes>
    </BrowserRouter>
  );
}
