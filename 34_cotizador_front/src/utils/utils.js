import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

//Cabecera de la cotización
export const HeadersCotizacion = [
  "Todo",
  "Grupos electrógenos",
  "Cables",
  "Celdas",
  "Transformadores",
];
//Cabecera de los Condiciones
export const HeadersCondiciones = [
  "Todo",
  "Condiciones comerciales",
  "Consideraciones",
  "Exclusiones",
];
//Cabecera de los Pedidos
export const HeadersPedidos = [
  "Todo",
  "En Pedido",
  "En Proceso",
  "Procesado",
  "Entregado",
];
//Cabecera de los Produccion
export const HeadersProduccion = ["Todo"];
//Cabecera de los Semielaborados
export const HeadersSemielaborados = ["Todo"];

//Cabecera de los modelos
export const HeadersModelos = ["Todo", "SÍ MODELO BASE", "NO MODELO BASE"];
//Cabecera de los modelos
export const HeadersClientes = ["Todo"];
//Cabecera de los modelos
export const HeadersVendedores = ["Todo", "Habilitado", "Deshabilitado"];

//Funcion para obtener las filas de las tablas
export const getFilas = (data) => {
  const maxRows = data.length;
  const options = [];
  const step = 10;
  for (let i = 10; i <= maxRows; i += step) {
    options.push(i);
  }
  if (maxRows % step !== 0) {
    options.push(Math.ceil(maxRows / step) * step);
  }
  return options;
};

export const getEstado = (estado) => {
  switch (estado) {
    case 0:
      return {
        className: "bg-red-100 text-red-900 font-semibold",
        label: "Deshabilitado",
      };
    case 1:
      return {
        className: "bg-green-100 text-green-900 font-semibold",
        label: "Habilitado",
      };
    default:
      return {
        className: "bg-[#e6e6e6] text-gray-800",
        label: "No definido",
      };
  }
};

//Funcion para formatear Numeros decimales
export const formatAmount = (amount) => {
  const newAmount = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return newAmount;
};

//Funcion para realizar la busqueda
export const searchInput = (SubItems, term) => {
  const filtered = SubItems.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(term.toLowerCase())
    )
  );
  return filtered;
};

export const getObjectHash = (obj) => {
  if (!obj) return "";
  return btoa(JSON.stringify(obj));
};

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const glassClass = `
  backdrop-blur-xl backdrop-saturate-150
  shadow-2xl shadow-cyan-500/5
  hover:shadow-3xl hover:shadow-cyan-400/10
  hover:border-white/10 hover:-translate-y-0.5
  active:scale-95 active:translate-y-0
  disabled:opacity-40 disabled:cursor-not-allowed
  disabled:hover:translate-y-0 disabled:hover:scale-100
  disabled:hover:shadow-2xl disabled:hover:shadow-cyan-500/5
  transition-all duration-300 ease-out
  relative overflow-hidden group
  before:absolute before:inset-0 before:rounded-2xl
  before:bg-gradient-to-br before:from-white/8 before:via-transparent before:to-cyan-200/5
  before:opacity-0 hover:before:opacity-100
  before:transition-all before:duration-500
  after:absolute after:top-0 after:left-0 after:w-full after:h-full
  after:bg-gradient-to-r after:from-transparent after:via-white/10 after:to-transparent
  after:translate-x-[-100%] after:skew-x-12 after:rounded-2xl
  hover:after:translate-x-[100%] hover:after:duration-700
  after:transition-transform after:duration-0
  font-medium tracking-wide`;

export function safeString(value, fallback = "--") {
  if (!value || value === null || value === undefined) return fallback;

  if (typeof value === "string") {
    return value.trim() !== "" ? value : fallback;
  }

  return String(value);
}
