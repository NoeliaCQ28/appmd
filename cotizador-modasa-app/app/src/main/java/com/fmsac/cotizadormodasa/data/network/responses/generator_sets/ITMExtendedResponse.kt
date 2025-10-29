package com.fmsac.cotizadormodasa.data.network.responses.generator_sets

import com.google.gson.annotations.SerializedName

/**
 * DTO para la respuesta del API de ITMs extendidos
 * Endpoint: GET /api/v2/generator-sets/itms/by-combination/:id
 */
data class ITMExtendedResponse(
    @SerializedName("nITMId") val id: Int,
    @SerializedName("sITMKit") val kitName: String?,
    @SerializedName("sITMMarca") val brand: String?,
    @SerializedName("nITMAmperaje") val amperage: Int?,
    @SerializedName("nITMPolos") val poles: Int?,
    @SerializedName("nITMPrecioUSD") val price: Double?,
    @SerializedName("integradora_Id") val integradoraId: Int?
)
