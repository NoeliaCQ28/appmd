export function generateQuotePayload(
  data,
  {
    currencies,
    markets,
    customers,
    sellers,
    comercialConditions,
    distributionChannels,
    incoterms,
    date,
    total,
    details,
    quoteType,
    descuento_global,
    margen_global,
  }
) {

  const payload = {
    ...data,
    codigo: data.codigo,
    cotizador_tipo: quoteType,
    moneda_id: currencies.find(
      (currency) => currency.sMonDescripcion === data.moneda_id.split(" - ")[1].trim()
    )?.Moneda_Id,
    mercado: markets.find((market) => market.sNombre === data.mercado)
      ?.MercadoId,
    cliente_id: customers.find(
      (customer) => customer.sCliNombre === data.cliente_id?.split(" - ")[0]
    )?.Cliente_Id,
    ejecutivo_id: sellers.find(
      (seller) => seller.sEjeNombre === data.ejecutivo_id
    )?.Ejecutivo_Id,
    validez_oferta: parseInt(data.validez_oferta),
    condicion_comercial_id: comercialConditions.find(
      (condition) => condition.sConTitulo === data.condicion_comercial_id
    )?.CondicionesComerciales_Id,

    fecha: new Date(date).toISOString().split("T")[0],
    total,
    canal_distribucion_id: distributionChannels.find(
      (channel) => channel.sNombre === data.canal_distribucion
    )?.CanalId,
    incoterm_id: incoterms.find(
      (incoterm) => incoterm.sDescripcion === data.incoterm
    )?.IncotermId,
    estado: 1,
    details,
    descuento_global: descuento_global,
    margen_global: margen_global,
  };

  return payload;
}

export const getCurrentFormattedDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
