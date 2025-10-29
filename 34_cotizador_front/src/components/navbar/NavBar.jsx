import { AlignLeft, TriangleAlert } from "lucide-react";
import { HiBell } from "react-icons/hi";
import { useLocation } from "react-router-dom";
import { useSidebar } from "../../contexts/SidebarContext";
import { Links } from "../../data/sidebar";
import { useAuth } from "../../hooks/useAuth";
import { useNavBar } from "../../hooks/useNavbar";
import { HealthCheck } from "../monitoring/HealthCheck";
import "./NavBar.css";
import fmsac from "/fmsac.png";

const inDev = import.meta.env.VITE_NODE_ENV === "development";

export const NavBar = () => {
  const { data: user, logout, timeLeft } = useAuth();
  const { isDropdownOpen, toggleDropdown, dropdownRef, buttonRef } =
    useNavBar();
  const { toggleMobileMenu, open } = useSidebar();

  const location = useLocation();
  const currentPath = location.pathname;

  const getCurrentNavName = () => {
    const pathSegments = currentPath.split("/").filter(Boolean);
    const basePath = pathSegments[0];

    for (let item of Links) {
      if (item.path && item.path.includes(basePath)) {
        return item.name;
      }
      if (item.subitems) {
        for (let subitem of item.subitems) {
          if (subitem.path && subitem.path.includes(basePath)) {
            return subitem.name;
          }
        }
      }
    }
    return "Inicio";
  };

  // Formatear tiempo restante ms a Xm Ys
  const formatTime = (ms) => {
    if (ms == null) return "";
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return min > 0 ? `${min}m ${sec}s` : `${sec}s`;
  };

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-30 navbar-glass transition-all duration-300
        ${open ? "navbar--with-sidebar" : "w-full"} border-b-[1.7px] border-gray-200 rounded-b-md`}
    >
      <div className=" h-14 sm:h-16 px-3 sm:px-5 flex items-center justify-between">
        {/* Left: menu + title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={toggleMobileMenu}
            className="max-[1170px]:inline-flex hidden items-center justify-center p-2 rounded-xl text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            aria-label="Abrir menú lateral"
            title="Menú"
          >
            <AlignLeft className="text-2xl sm:text-3xl" />
          </button>
          <span className="font-semibold text-sm sm:text-base md:text-lg whitespace-nowrap truncate max-w-[45vw]">
            {getCurrentNavName()}
          </span>
        </div>

        {/* Right: pills + actions */}
        <div className="relative flex items-center gap-2 sm:gap-3">
          {/* Entorno dev pill (compact en móvil) */}
          {inDev && (
            <>
              <span className="hidden md:inline-flex items-center text-xs font-semibold  text-amber-900 px-3 py-1 rounded-full border border-amber-200 border-dashed">
                Entorno de desarrollo
                <TriangleAlert className="ml-2 h-4 w-4 animate-pulse" />
              </span>
              <span className="inline-flex md:hidden items-center text-[10px] font-semibold  text-amber-900 px-2 py-0.5 rounded-full border border-amber-200 border-dashed">
                DEV
                <TriangleAlert className="ml-1 h-3 w-3" />
              </span>
            </>
          )}

          {/* Tiempo restante de sesión */}
          {timeLeft != null && (
            <span
              className="inline-flex items-center bg-yellow-100 text-yellow-800 text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-full"
              title={`Sesión expira en ${formatTime(timeLeft)}`}
            >
              Sesión: {formatTime(timeLeft)}
            </span>
          )}

          {/* Notificaciones */}
          <button
            className="relative p-2 bg-white/60 hover:bg-white/80 backdrop-blur-sm rounded-2xl transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Notificaciones"
            title="Notificaciones"
          >
            <HiBell className="text-xl sm:text-2xl text-gray-800 hover:text-blue-600" />
            <span className="absolute top-0 right-0 block w-2 h-2 bg-amber-600 rounded-full" />
          </button>

          {/* Perfil / Usuario */}
          <section
            className="group flex items-center cursor-pointer select-none"
            onClick={toggleDropdown}
            role="button"
            aria-haspopup="menu"
            aria-expanded={isDropdownOpen}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") toggleDropdown();
            }}
            tabIndex={0}
          >
            <div ref={buttonRef} className="flex items-center gap-2 sm:gap-3">
              <div className="border-2 border-gray-200 rounded-full overflow-hidden w-9 h-9 sm:w-11 sm:h-11 transition-transform duration-200 group-hover:scale-105">
                <img
                  className="rounded-full w-full h-full object-cover"
                  src={fmsac}
                  alt="Imagen de perfil"
                />
              </div>
              <div className="flex flex-col text-left leading-tight min-w-0">
                <span className="font-semibold text-gray-800 text-xs sm:text-sm truncate max-w-[24ch]">
                  {user?.name}
                </span>
                <span className="font-light text-gray-600 text-[10px] sm:text-xs truncate max-w-[24ch] hidden xs:block">
                  {user?.role}
                </span>
              </div>
            </div>
          </section>

          {isDropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute top-12 sm:top-14 right-0 bg-white border shadow-md rounded-md w-40 sm:w-48 z-40"
            >
              {/* Estado de servicios (solo móvil) */}
              <div className="md:hidden">
                <div className="px-3 pt-3 pb-2">
                  <p className="text-[10px] uppercase tracking-wide text-gray-500 mb-2">
                    Estado servicios
                  </p>
                  <div className="flex flex-col gap-2">
                    <HealthCheck serverName={"MODASA S.A."} />
                    <HealthCheck
                      serverName={"MODASA S.A. ERP (QAS)"}
                      alias={"ERP (QAS)"}
                    />
                  </div>
                </div>
                <div className="h-px bg-gray-100" />
              </div>
              <ul className="py-2">
                <li
                  className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer text-red-600 font-semibold"
                  onClick={logout}
                >
                  Cerrar sesión
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
