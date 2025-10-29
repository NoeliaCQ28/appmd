import React, { createContext, useState, useContext } from "react";

// Crear el contexto
const SidebarContext = createContext();

// Crear el proveedor del contexto
export const SidebarProvider = ({ children }) => {

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [open, setOpen] = useState(true);
  const [expanded, setExpanded] = useState({});
  const [selectedSubitem, setSelectedSubitem] = useState(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleExpand = (name) => {
    setExpanded((prev) => (prev === name ? null : name));
  };

  const handleSubitemClick = (subitem) => {
    setSelectedSubitem(subitem);
  };

  const toggleSidebar = () => {
    setOpen(!open);
  }

  return (
    <SidebarContext.Provider
      value={{
        isMobileMenuOpen,
        open,
        expanded,
        selectedSubitem,
        toggleMobileMenu,
        toggleExpand,
        handleSubitemClick,
        toggleSidebar
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

// Hook para acceder al contexto en cualquier componente
export const useSidebar = () => useContext(SidebarContext)
