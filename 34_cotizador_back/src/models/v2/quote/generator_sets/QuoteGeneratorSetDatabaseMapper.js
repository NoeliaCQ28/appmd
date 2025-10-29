/**
 * @module QuoteGeneratorSetDatabaseMapper
 *
 * @description Funciones de utilidad que mapean los campos de la base de datos a objetos consumibles para el frontend
 *
 * @stream Database -> Backend -> Frontend
 */

export function composeExtraDetails(detail, extraDetails, accessories) {
  return {
    IntegradoraId: Number(extraDetails.nIntegradoraId),
    nCotizacionDetalleId: Number(extraDetails?.CotizacionDetalle_Id),
    sModNombre: extraDetails.sModNombre,
    nModPesoKgAbierto: extraDetails.nModDimensionesPeso1,
    nModPesoKgInsonoro: extraDetails.nModDimensionesPeso2,
    nModEstado: extraDetails.nModEstado,
    nModEliminado: extraDetails.nModEliminado,
    ModeloGE_Id: extraDetails.ModeloGE_Id,
    sMotModelo: extraDetails.sMotModelo,
    sMotMarca: extraDetails.sMotMarca,
    sMotMarcaVisual: extraDetails.sMotMarcaVisual,
    Motor_Id: extraDetails.Motor_Id,
    sAltModelo: extraDetails.sAltModelo,
    sAltFamilia: extraDetails.sAltFamilia,
    sAltCodigoSAP: extraDetails.sAltCodigoSAP,
    nAltPesoKg: Number(extraDetails.nAltPesoKg),
    nAltCostoUSD: Number(extraDetails.nAltCostoUSD),
    nAltPrecioUSD: Number(extraDetails.nAltPrecioUSD),
    nAltNroHilos: extraDetails.nAltNroHilos,
    sAltMarca: extraDetails.sAltMarca,
    Alternador_Id: extraDetails.Alternador_Id,
    nITMId: extraDetails.nITMId,
    sMercadoNombre: extraDetails.sMercadoNombre,
    MercadoId: extraDetails.MercadoId,
    nIntCostoGEAbierto: Number(extraDetails.nIntCostoGEAbierto),
    nIntCostoGECabina: Number(extraDetails.nIntCostoGECabina),
    nIntPrecioGEAbierto: Number(extraDetails.nIntPrecioGEAbierto),
    nIntPrecioGECabina: Number(extraDetails.nIntPrecioGECabina),
    nIntVoltaje: extraDetails.nParamVoltaje,
    nIntFrecuencia: extraDetails.nParamFrecuencia,
    nIntFases: extraDetails.nParamFases,
    nIntFP: extraDetails.nParamFactorPotencia,
    nIntAltura: extraDetails.nParamAltura,
    nITMABase: extraDetails.nITMABase,
    nITMAActual: extraDetails.nITMAActual,
    sITMCodigoSAP: extraDetails.sITMCodigoSAP,
    sITMKitNombre: extraDetails.sITMKitNombre,
    sITMMarca: extraDetails.sITMMarca,
    sITMMarcaVisual: extraDetails.sITMMarcaVisual,
    nIntPrimeKW: extraDetails.nIntPrimeKW,
    nIntStandBy: extraDetails.nIntStandBy,
    sIntKey: extraDetails.sIntKey,
    nIntCostoTotalUSD: Number(extraDetails.nIntCostoTotalUSD),
    nIntPrecioTotalUSD: Number(extraDetails.nIntPrecioTotalUSD),
    nIntPesoTotalKg: Number(extraDetails.nIntPesoTotalKg),
    PrimeKW: Number(extraDetails.nPotenciaPrimeKW),
    PrimeKVA: Number(extraDetails.nPotenciaPrimeKVA),
    StandByKW: Number(extraDetails.nPotenciaStandByKW),
    StandByKVA: Number(extraDetails.nPotenciaStandByKVA),
    PrimeKWEstandar: Number(extraDetails.nPotenciaPrimeKWEstandar),
    PrimeKVAEstandar: Number(extraDetails.nPotenciaPrimeKVAEstandar),
    StandByKWEstandar: Number(extraDetails.nPotenciaStandByKWEstandar),
    StandByKVAEstandar: Number(extraDetails.nPotenciaStandByKVAEstandar),
    CorrientePrimeA: Number(extraDetails?.CorrientePrimeA),
    CorrienteStandByA: Number(extraDetails?.CorrienteStandByA),
    nIntTemperatura: extraDetails.nParamTemperatura,
    nIntInsonoro: extraDetails.nParamInsonoro,
    nIntSileciadorTipo: Number(extraDetails.nTipoSilenciador),
    sIntSileciadorTipo:
      extraDetails.nTipoSilenciador === 1 ? "Industrial" : "Residencial",
    nIntSileciadorPermiteCambio: extraDetails.nIntSilenciadorPermiteCambio,
    nIntDescuentoPorcentaje: Number(extraDetails.nDescuentoValue),
    nIntMargenExportacionPorcentaje: Number(
      extraDetails.nMargenExportacionPorcentaje,
    ),
    nIntDiasParaEntrega: Number(extraDetails.nDiasEntrega),
    sModuloDeControl: extraDetails?.sModuloDeControlId,
    sTipoGrupoElectrogeno: extraDetails?.sTipoGrupoElectrogeno,
    nModTcombAbierto: extraDetails?.nModTcombAbierto,
    nModTcombInsonoro: extraDetails?.nModTcombInsonoro,
    sModNormaTecnica: extraDetails?.sModNormaTecnica,
    sMotNormasTecnicas: extraDetails?.sMotNormasTecnicas,
    sAltNormaTecnica: extraDetails?.sAltNormaTecnica,
    sRegimen: extraDetails?.sRegimen,
    accessories:
      accessories?.map((accessory) => {
        return {
          id: accessory.Opcionales_Id,
          name: accessory.sOpcNombre,
          description: accessory.sOpcDescripcion,
          price: Number(accessory.nOpcPrecio),
        };
      }) || [],
    operativeCosts: {
      shipping: {
        isPresent: Number(detail.nCotDetEnvio) === 1,
        amount: Number(detail.nCotDetCostoEnvio),
      },
      startup: {
        isPresent: Number(detail.nCotDetPuestoEnMarcha) === 1,
        amount: Number(detail.nCotDetCostoPuestoEnMarcha),
      },
    },
    nIntCantidad: Number(detail.nCotDetCantidad),
    configuration: {
      alternator: {
        isPresent: Number(extraDetails.nHuboCambioDeAlternador) === 1,
        alternatorSwappedId: extraDetails.nAltCambioId,
        alternatorBaseId: extraDetails.nAltBaseId,
      },
      itm: {
        isPresent: Number(extraDetails.nHuboCambioDeITM) === 1,
        itmSwappedId: extraDetails.nITMCambioId,
        itmBaseId: extraDetails.nITMBaseId,
      },
    },
  };
}
