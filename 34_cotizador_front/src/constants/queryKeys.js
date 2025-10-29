export const QUERY_KEYS = Object.freeze({
  models: ["models"],
  combinations: ["combinations"],
  generatorSets: {
    search: ["models-search", "search"],
    params: {
      models: ["models-search", "models"],
      motorBrands: ["models-search", "motor-brands"],
      motorModels: ["models-search", "motor-models"],
      alternatorBrands: ["models-search", "alternator-brands"],
      alternatorModels: ["models-search", "alternator-models"],
      voltages: ["models-search", "voltages"],
      frequencies: ["models-search", "frequencies"],
      phases: ["models-search", "phases"],
      powerFactors: ["models-search", "power-factors"],
      altitudes: ["models-search", "altitudes"],
      itms: ["models-search", "itms"],
      markets: ["models-search", "markets"],
    },
  },
  reports: {
    executiveReport: ["reports", "executiveReport"],
    cardResume: ["reports", "cardResume"],
    quotesReport: ["reports", "quotesReport"],
    clientsReport: ["reports", "clientsReport"],
  },
  monitoring: {
    logs: ["monitoring-logs"],
  },
});
