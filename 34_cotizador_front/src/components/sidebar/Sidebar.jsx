import React from "react";
import { FaExpandAlt } from "react-icons/fa";
import * as Icons from "react-icons/hi";
import { HiChevronRight } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useSidebar } from "../../contexts/SidebarContext";
import { Links } from "../../data/sidebar";
import { useHeaderCotizacion } from "../../hooks/useHeader";
import { Logo } from "../custom/icons/Logo";
import "./Sidebar.css";
import { SidebarFooter } from "./SidebarFooter";

export const Sidebar = () => {
  // Usar el contexto
  const {
    isMobileMenuOpen,
    open,
    expanded,
    selectedSubitem,
    toggleMobileMenu,
    toggleExpand,
    handleSubitemClick,
    toggleSidebar,
  } = useSidebar();

  const { resetHeader } = useHeaderCotizacion();

  const resetHeaderBreadcrumb = () => resetHeader();
  return (
    <div className="relative">
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-10 transition-opacity duration-200"
          onClick={() => toggleMobileMenu(false)}
        />
      )}
      {/* Sidebar */}
      {open && (
        <div
          className={`flex flex-col bg-gradient-to-b from-[#f8f6f5] via-custom-orange-light to-[#f0cdbb] h-full border-r border-gray-200 shadow-sm
            ${
              isMobileMenuOpen
                ? "fixed top-0 left-0 z-40 w-80"
                : "max-[1170px]:hidden fixed top-0 left-0 z-40 w-72 h-screen"
            } transition-all duration-300 ease-out`}
        >
          {/* Logo section */}
          <div className="flex justify-center items-center p-6 border-b border-gray-100">
            <Link
              to={"/"}
              onClick={() => resetHeaderBreadcrumb()}
              className="transition-transform duration-200 hover:scale-105"
            >
              <Logo className="w-32" />
            </Link>
          </div>

          {/* Navigation menu */}
          <ul className="flex-1 overflow-y-auto py-4 px-3 sidebar-scrollbar">
            {Links.map((item, index) => (
              <li key={item.name} className="mb-1">
                {" "}
                <Link
                  className={`sidebar-item group flex items-center justify-between p-3 rounded-lg font-medium
                    transition-all duration-200 ease-out
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                    ${
                      expanded === item.name
                        ? "text-blue-700 bg-blue-50 border-l-3 border-blue-600"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  onClick={() => toggleExpand(item.name)}
                  to={item.path}
                >
                  {" "}
                  <div className="flex items-center space-x-3">
                    <div
                      className={`text-xl transition-colors duration-200 ${
                        expanded === item.name
                          ? "text-blue-600"
                          : "text-gray-500 group-hover:text-blue-600"
                      }`}
                    >
                      {React.createElement(Icons[item.icon])}
                    </div>
                    <span className="font-medium">{item.name}</span>
                  </div>
                  {item.subitems && (
                    <HiChevronRight
                      className={`text-gray-400 transition-all duration-200 ${
                        expanded === item.name ? "rotate-90 text-blue-600" : ""
                      }`}
                    />
                  )}
                </Link>
                {/* Subitems */}
                {item.subitems && (
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-out ${
                      expanded === item.name
                        ? "max-h-196 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="relative mt-2 ml-6 mr-2">
                      {/* Connection line */}
                      <div className="connection-line"></div>

                      <ul className="space-y-1 mb-3">
                        {item.subitems.map((subitem, subIndex) => (
                          <li key={subitem.name} className={`relative`}>
                            {" "}
                            <Link
                              to={subitem.path}
                              onClick={() => {
                                handleSubitemClick(subitem.name);
                                resetHeaderBreadcrumb();
                              }}
                              className={`subitem-link group/sub flex items-center py-2 pl-6 pr-3 rounded-md text-sm font-medium
                                transition-all duration-200 ease-out
                                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
                                ${
                                  selectedSubitem === subitem.name
                                    ? "text-blue-600 bg-blue-50"
                                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                }`}
                            >
                              {/* Dot indicator */}
                              <span
                                className={`dot-indicator ${
                                  selectedSubitem === subitem.name
                                    ? "dot-indicator-active"
                                    : "dot-indicator-inactive group-hover/sub:dot-indicator-hover"
                                }`}
                              ></span>

                              <span className="relative z-10">
                                {subitem.name}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>

          <SidebarFooter />
        </div>
      )}{" "}
      {/* Collapse button */}
      {!open && (
        <button
          onClick={() => toggleSidebar(true)}
          className="floating-button fixed bottom-6 left-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50
            focus:outline-none focus:ring-4 focus:ring-blue-500/50"
        >
          <FaExpandAlt className="text-base" />
        </button>
      )}
    </div>
  );
};
