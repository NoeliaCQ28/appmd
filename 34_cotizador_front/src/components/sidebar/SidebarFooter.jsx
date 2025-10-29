import { FaExpandAlt } from "react-icons/fa";
import { IoIosLogOut } from "react-icons/io";
import { useSidebar } from "../../contexts/SidebarContext";
import { useAuth } from "../../hooks/useAuth";

export const SidebarFooter = () => {
  const { toggleSidebar, isMobileMenuOpen } = useSidebar();
  const { logout } = useAuth();

  return (
    <div className="mt-auto p-3 bg-[#f2d5c8]">
      {!isMobileMenuOpen && (
        <button
          className="footer-button w-full flex items-center text-gray-600 font-medium py-2 px-3 rounded-md
            hover:bg-[#ffede4] hover:text-gray-900 hover:shadow-sm transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          onClick={toggleSidebar}
        >
          <FaExpandAlt className="text-base rotate-180 mr-3" />
          <span>Ocultar</span>
        </button>
      )}

      <button
        className="footer-button w-full flex items-center text-red-600 font-medium py-2 px-3 mt-1 rounded-md
          hover:bg-[#ffede4] hover:text-red-700 hover:shadow-sm transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
        onClick={logout}
      >
        <IoIosLogOut className="text-lg mr-3" />
        <span>Cerrar Sesión</span>
      </button>
    </div>
  );
};
