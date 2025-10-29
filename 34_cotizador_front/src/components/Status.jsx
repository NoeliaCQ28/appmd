import { getEstado } from "@utils/utils";

export const EstadoBadge = ({ estado }) => {
  const { className, label } = getEstado(estado);
  return (
    <li
      className={`flex items-center w-32 px-2 py-1 rounded-full text-xs sm:text-sm ${className}`}
    >
      <span className={`mr-2 ${className}`}>•</span>
      {label}
    </li>
  );
};
