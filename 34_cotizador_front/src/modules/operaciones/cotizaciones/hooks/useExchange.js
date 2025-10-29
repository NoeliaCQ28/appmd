import React from "react";
import { useExchangeStore } from "../store/useExchangeStore";

export const useExchange = () => {
  const { typeChange, currency } = useExchangeStore();

  const formatCurrency = React.useCallback((amount) => {
    const newAmount = new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
    return newAmount;
  }, []);

  const evalTypeChange = React.useCallback(
    (amount) => {
      switch (currency?.code) {
        case "USD":
          return formatCurrency(amount / typeChange);
        case "PEN":
          return formatCurrency(amount * typeChange);
        case "MXN":
          return formatCurrency(amount * typeChange);
        case "COP":
          return formatCurrency(amount * typeChange);
        case "CLP":
          return formatCurrency(amount * typeChange);
        default:
          return formatCurrency(amount);
      }
    },
    [currency?.code, formatCurrency, typeChange]
  );

  return {
    currency: {
      code: currency?.code,
      description: currency?.description,
      symbol: currency?.symbol,
    },
    evalTypeChange,
  };
};
