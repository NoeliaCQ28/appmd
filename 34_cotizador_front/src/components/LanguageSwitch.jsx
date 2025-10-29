import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { availableLanguages, changeLanguage } from "@libs/i18n";
import { currentLanguage } from "../libs/i18n";

export const LanguageSwitch = ({ className = "" }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  const { i18n } = useTranslation();

  const current = currentLanguage(i18n);

  const onSelect = (code) => {
    changeLanguage(code);
    setOpen(false);
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={ref}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((s) => !s)}
        className="inline-flex items-center gap-2 rounded-md bg-white/70 px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400"
      >
        <span className="uppercase tracking-wider flex items-center gap-2">
          {current.flagPath ? (
            <img
              src={current.flagPath}
              alt={`${current.name} flag`}
              className="h-5 w-5 object-contain rounded-md"
            />
          ) : (
            <span className="text-lg">{current.flag || "🌐"}</span>
          )}
        </span>
        <span className="text-xs text-slate-400">{current.name}</span>
        <svg
          className={`ml-2 h-3 w-3 transition-transform ${
            open ? "transform rotate-180" : ""
          }`}
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 7l5 5 5-5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-slate-200 z-10">
          <div className="py-1">
            {availableLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => onSelect(lang.code)}
                className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 ${
                  lang.code === current.code ? "font-semibold" : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  {lang.flagPath ? (
                    <img
                      src={lang.flagPath}
                      alt={`${lang.name} flag`}
                      className="h-5 w-5 object-contain rounded-md"
                    />
                  ) : (
                    <span className="text-lg">{lang.flag || "🌐"}</span>
                  )}
                  <span className="capitalize">{lang.name}</span>
                </div>
                <span className="text-xs text-slate-400">{lang.code}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitch;
