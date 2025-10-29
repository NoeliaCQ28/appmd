import { Link } from "react-router-dom";
import site from "../../config/site";
import { HealthCheck } from "../monitoring/HealthCheck";

const currentYear = new Date().getFullYear();

export const Footer = () => {
  return (
    <footer className="w-full bg-white/90 supports-[backdrop-filter]:bg-white/70 backdrop-blur border-t">
      <div className="container md:w-full md:max-w-none mx-auto px-3 py-2">
        <div className="flex items-center justify-between gap-2 whitespace-nowrap overflow-hidden">
          {/* Left: brand + meta */}
          <div className="flex items-center gap-x-2 min-w-0 text-[#0055BE]">
            <Link
              to="https://www.fmsac.com/es/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm"
              aria-label="Sitio FMSAC (abre en nueva pestaña)"
            >
              FMSAC
            </Link>
            <span className="text-xs font-semibold shrink-0">
              &copy; {currentYear}
            </span>
            <span className="text-xs shrink-0">•</span>
            <span className="text-xs truncate max-w-[45vw] md:max-w-none">
              Todos los derechos reservados
            </span>
            <span className="text-[0.65rem] md:text-xs font-medium text-gray-500 ml-1 shrink-0">
              {site.siteVersion}
            </span>
          </div>

          {/* Right: health checks */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <HealthCheck serverName={"MODASA S.A."} />
            {/* <HealthCheck
              serverName={"MODASA S.A. ERP (QAS)"}
              alias={"ERP (QAS)"}
            /> */}
            <HealthCheck
              serverName={"MODASA S.A. ERP (PROD)"}
              alias={"ERP (PROD)"}
            />
          </div>
        </div>
      </div>
    </footer>
  );
};
