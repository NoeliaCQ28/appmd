import { useEffect, useState } from "react";
import { BsSearch } from "react-icons/bs";

export const InputSearch = ({
  onSearch,
  type = "text",
  placeholder = "Buscar...",
  className = "",
  delay = 300, // tiempo de debounce en ms
  centered = false, // centra el componente opcionalmente
}) => {
  const [search, setSearch] = useState("");
  const [focused, setFocused] = useState(false);
  const [typing, setTyping] = useState(false);

  // Debounce para la búsqueda
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch?.(search);
    }, delay);

    return () => clearTimeout(handler);
  }, [search, delay, onSearch]);

  const handleChange = (e) => {
    const term = e.target.value;
    setSearch(term);

    // Activa animaciones
    setTyping(true);
    setTimeout(() => setTyping(false), 150);
  };

  return (
    <section className={`w-full flex ${centered ? "justify-center" : ""}`}>
      <div
        className={`relative flex items-center 
        bg-gray-100/80 backdrop-blur-md border border-gray-200 rounded-lg 
        transition-all duration-300 ease-out overflow-hidden
        ${
          focused
            ? "w-[440px] shadow-lg shadow-neutral-100"
            : "w-[380px] hover:shadow-lg"
        }
        ${typing ? "scale-[1.02]" : "scale-100"}
        shadow-neutral-100`}
      >
        <BsSearch
          color="#7D7D7D"
          className={`absolute left-4 pointer-events-none transition-all duration-150 ease-out
          ${
            typing
              ? "scale-110 text-blue-500 drop-shadow-sm"
              : "scale-100 text-gray-500"
          }`}
          size={18}
        />
        <input
          type={type}
          placeholder={placeholder}
          value={search}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`w-full pl-11 pr-4 py-2.5 text-[15px] text-gray-900 
          placeholder-gray-500 bg-transparent outline-none border-none 
          focus:outline-none focus:border-none ${className}`}
        />
      </div>
    </section>
  );
};
