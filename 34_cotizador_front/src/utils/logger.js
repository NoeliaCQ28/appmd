// src/utils/logger.js

const LEVELS = {
  info:  { emoji: 'ℹ️', style: 'color:#2E86AB; font-weight:bold;' },
  warn:  { emoji: '⚠️', style: 'color:#F39C12; font-weight:bold;' },
  error: { emoji: '❌', style: 'color:#E74C3C; font-weight:bold;' },
  debug: { emoji: '🔍', style: 'color:#8E44AD; font-weight:bold;' },
};

// Lee el entorno desde Vite
const ENV = import.meta.env.VITE_NODE_ENV || 'production';
const isDev = ENV === 'development' || ENV === 'local';

function createLoggerMethod(level) {
  const { emoji, style } = LEVELS[level];
  return (message, meta) => {
    if (!isDev) return; // Silenciar en producción

    const timestamp = new Date().toISOString();
    const prefix = `${timestamp} | ${emoji} ${level.toUpperCase().padEnd(5)} |`;

    if (meta !== undefined) {
      console.log(`%c${prefix} ${message}`, style, meta);
    } else {
      console.log(`%c${prefix} ${message}`, style);
    }
  };
}

export const logger = {
  info: createLoggerMethod('info'),
  warn: createLoggerMethod('warn'),
  error: createLoggerMethod('error'),
  debug: createLoggerMethod('debug'),
};
