import { motion } from "framer-motion";
import React from "react";
import modasa from "/modasa.png";

const AppleSpinner = () => {
  return (
    <motion.svg
      viewBox="0 0 50 50"
      xmlns="http://www.w3.org/2000/svg"
      className="w-10 h-10 text-indigo-600" // spinner más pequeño y color moderno
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
    >
      <path d="m25 18c-.6 0-1-.4-1-1v-8c0-.6.4-1 1-1s1 .4 1 1v8c0 .6-.4 1-1 1z" />
      <path
        d="m25 42c-.6 0-1-.4-1-1v-8c0-.6.4-1 1-1s1 .4 1 1v8c0 .6-.4 1-1 1z"
        opacity=".3"
      />
      <path
        d="m29 19c-.2 0-.3 0-.5-.1-.4-.3-.6-.8-.3-1.3l4-6.9c.3-.4.8-.6 1.3-.3.4.3.6.8.3 1.3l-4 6.9c-.2.2-.5.4-.8.4z"
        opacity=".3"
      />
      <path
        d="m17 39.8c-.2 0-.3 0-.5-.1-.4-.3-.6-.8-.3-1.3l4-6.9c.3-.4.8-.6 1.3-.3.4.3.6.8.3 1.3l-4 6.9c-.2.2-.5.4-.8.4z"
        opacity=".3"
      />
      <path
        d="m21 19c-.3 0-.6-.2-.8-.5l-4-6.9c-.3-.4-.1-1 .3-1.3s1-.1 1.3.3l4 6.9c.3.4.1 1-.3 1.3-.2.2-.3.2-.5.2z"
        opacity=".93"
      />
      <path
        d="m33 39.8c-.3 0-.6-.2-.8-.5l-4-6.9c-.3-.4-.1-1 .3-1.3s1-.1 1.3.3l4 6.9c.3.4.1 1-.3 1.3-.2.1-.3.2-.5.2z"
        opacity=".3"
      />
      <path
        d="m17 26h-8c-.6 0-1-.4-1-1s.4-1 1-1h8c.6 0 1 .4 1 1s-.4 1-1 1z"
        opacity=".65"
      />
      <path
        d="m41 26h-8c-.6 0-1-.4-1-1s.4-1 1-1h8c.6 0 1 .4 1 1s-.4 1-1 1z"
        opacity=".3"
      />
      <path
        d="m18.1 21.9c-.2 0-.3 0-.5-.1l-6.9-4c-.4-.3-.6-.8-.3-1.3.3-.4.8-.6 1.3-.3l6.9 4c.4.3.6.8.3 1.3-.2.3-.5.4-.8.4z"
        opacity=".86"
      />
      <path
        d="m38.9 33.9c-.2 0-.3 0-.5-.1l-6.9-4c-.4-.3-.6-.8-.3-1.3.3-.4.8-.6 1.3-.3l6.9 4c.4.3.6.8.3 1.3-.2.3-.5.4-.8.4z"
        opacity=".3"
      />
      <path
        d="m11.1 33.9c-.3 0-.6-.2-.8-.5-.3-.4-.1-1 .3-1.3l6.9-4c.4-.3 1-.1 1.3.3s.1 1-.3 1.3l-6.9 4c-.1.2-.3.2-.5.2z"
        opacity=".44"
      />
      <path
        d="m31.9 21.9c-.3 0-.6-.2-.8-.5-.3-.4-.1-1 .3-1.3l6.9-4c.4-.3 1-.1 1.3.3s.1 1-.3 1.3l-6.9 4c-.2.2-.3.2-.5.2z"
        opacity=".3"
      />
    </motion.svg>
  );
};

export const MainLoading = () => {
  return (
    <motion.section
      className="h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-br from-white to-gray-50"
      role="status"
      aria-live="polite"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        y: "-100vh",
        opacity: 0,
        transition: { duration: 0.5, ease: "easeInOut" },
      }}
    >
      <motion.div
        className="relative w-56 h-56 mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <img
          src={modasa}
          alt="Logo de la aplicación"
          className="w-full h-full object-contain filter drop-shadow-2xl hover:drop-shadow-[0_0_25px_rgba(99,102,241,0.2)] transition-all duration-500"
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
          animate={{
            x: ["-200%", "200%"],
          }}
          transition={{
            repeat: Infinity,
            duration: 2.5,
            ease: "linear",
          }}
        />
      </motion.div>

      <motion.div
        className="mb-8"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <AppleSpinner />
      </motion.div>
    </motion.section>
  );
};
