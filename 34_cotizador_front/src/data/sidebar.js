export const Links = [
  {
    name: "Inicio",
    path: "/",
    icon: "HiOutlineHome",
  },
  {
    name: "Operaciones",
    submenu: true,
    icon: "HiOutlineClipboardCheck",
    subitems: [
      {
        name: "Cotizaciones",
        path: "/cotizaciones",
        icon: "",
      },
      {
        name: "Pedidos",
        path: "/pedidos",
        icon: "",
      },
      // {
      //      name: 'Programa de Producción',
      //      path: '/produccion',
      //      icon: ""
      // },
      // {
      //      name: 'Programa de Semi-Elaborados',
      //      path: '/semielaborados',
      //      icon: ""
      // },
      {
        name: "Fichas Técnicas",
        path: "/fichas-tecnicas",
        icon: "",
      },
    ],
  },
  {
    name: "Catálogos",
    submenu: true,
    icon: "HiOutlineViewGrid",
    subitems: [
      // {
      //      name: 'Modelos GE',
      //      path: '/modelos',
      //      icon: ""
      // },
      {
        name: "Clientes/Prospectos",
        path: "/clientes",
        icon: "",
      },
      {
        name: "Ejecutivos Comerciales",
        path: "/ejecutivos",
        icon: "",
      },
      // {
      //      name: 'Componentes (Precios)',
      //      path: '/componentes',
      //      icon: ""
      // },
      {
        name: "Condiciones Comerciales",
        path: "/condiciones-comerciales",
        icon: "",
      },
      {
        name: "Cables",
        path: "/cables",
        icon: "",
      },
      {
        name: "Celdas",
        path: "/celdas",
        icon: "",
      },
      {
        name: "Transformadores",
        path: "/transformadores",
        icon: "",
      },
      {
        name: "Grupos Electrógenos",
        path: "/catalogos/grupos-electrogenos",
        icon: "",
      },
      {
        name: "Accesorios para Grupos Electrógenos",
        path: "/accesorios-grupos-electrogenos",
        icon: "",
      },
      {
        name: "Accesorios para Celdas",
        path: "/accesorios-celdas",
        icon: "",
      },
      {
        name: "Accesorios para Transformadores",
        path: "/accesorios-transformadores",
        icon: "",
      },
      {
        name: "Usuarios",
        path: "/usuarios",
        icon: "",
      },
    ],
  },
  {
    name: "Reportes",
    submenu: true,
    icon: "HiOutlineDocumentReport",
    subitems: [
      {
        name: "Dashboard",
        path: "/dashboard",
        icon: "",
      },
      {
        name: "Reporte por Ejecutivo",
        path: "/reportes-ejecutivo",
        icon: "",
      },
      {
        name: "Reporte por Cotizaciones",
        path: "/reportes-cotizaciones",
        icon: "",
      },
      {
        name: "Reporte de Clientes",
        path: "/reportes-clientes",
        icon: "",
      },
    ],
  },
  {
    name: "Manual de Usuario",
    path: "#",
    icon: "HiOutlineBookOpen",
  },
  {
    name: "Configuración",
    submenu: true, // Changed to true
    icon: "HiCog", // Keep HiCog or similar
    subitems: [
      {
        name: "Preferencias",
        path: "/configuracion/preferencias",
        icon: "",
      },
      {
        name: "Monitoreo del Sistema",
        path: "/configuracion/monitoreo",
        icon: "",
      },
    ],
  },
];
