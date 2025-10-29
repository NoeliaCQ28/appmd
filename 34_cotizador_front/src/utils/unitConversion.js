export function convertUnit(value, fromUnit, toUnit, precision = 2) {
  const conversionRates = {
    // Length
    m: { m: 1, cm: 100, mm: 1000, in: 39.3701, ft: 3.28084 },
    cm: { m: 0.01, cm: 1, mm: 10, in: 0.393701, ft: 0.0328084 },
    mm: { m: 0.001, cm: 0.1, mm: 1, in: 0.0393701, ft: 0.00328084 },
    in: { m: 0.0254, cm: 2.54, mm: 25.4, in: 1, ft: 0.0833333 },
    ft: { m: 0.3048, cm: 30.48, mm: 304.8, in: 12, ft: 1 },
    cc: { cc: 1, in3: 0.0610237, l: 0.001 },

    // Weight
    kg: { kg: 1, g: 1000, lb: 2.20462, oz: 35.274 },
    g: { kg: 0.001, g: 1, lb: 0.00220462, oz: 0.035274 },
    lb: { kg: 0.453592, g: 453.592, lb: 1, oz: 16 },
    oz: { kg: 0.0283495, g: 28.3495, lb: 0.0625, oz: 1 },

    // Liquid Volume
    l: { l: 1, ml: 1000, gal: 0.264172, qt: 1.05669 },
    ml: { l: 0.001, ml: 1, gal: 0.000264172, qt: 0.00105669 },
    gal: { l: 3.78541, ml: 3785.41, gal: 1, qt: 4 },
    qt: { l: 0.946353, ml: 946.353, gal: 0.25, qt: 1 },

    // Flow Rate
    "m3/min": { cfm: 35.314699885085965 },
  };

  if (!conversionRates[fromUnit] || !conversionRates[fromUnit][toUnit]) {
    throw new Error(
      `Conversion from ${fromUnit} to ${toUnit} is not supported.`
    );
  }
  const conversionRate = conversionRates[fromUnit][toUnit];
  return parseFloat((value * conversionRate).toFixed(precision));
}

export function convertTemperature(value, fromUnit, toUnit, precision = 2) {
  let convertedValue;

  if (fromUnit === "°C" && toUnit === "°F") {
    convertedValue = (value * 9) / 5 + 32;
  } else if (fromUnit === "°F" && toUnit === "°C") {
    convertedValue = ((value - 32) * 5) / 9;
  } else if (fromUnit === toUnit) {
    convertedValue = value;
  } else {
    throw new Error(
      `Conversion from ${fromUnit} to ${toUnit} is not supported.`
    );
  }

  return parseFloat(convertedValue.toFixed(precision));
}
