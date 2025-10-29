package com.fmsac.cotizadormodasa.data.network.responses.generator_sets

import com.google.gson.annotations.SerializedName

/**
 * DTO para la respuesta del API de alternadores extendidos
 * Endpoint: GET /api/v2/generator-sets/alternators/by-combination/:id
 */
data class AlternatorExtendedResponse(
    @SerializedName("Alternador_Id") val id: Int,
    @SerializedName("sAltModelo") val name: String?,
    @SerializedName("sAltMarca") val brand: String?,
    @SerializedName("sAltFamilia") val family: String?,
    @SerializedName("sAltGradoIP") val ipGrade: String?,
    @SerializedName("sAltAislamiento") val insulation: String?,
    @SerializedName("nAltBrida") val frame: String?,
    @SerializedName("nAltDisco") val disk: String?,
    @SerializedName("sAltSistemaExitacion") val excitationSystem: String?,
    @SerializedName("sAltTarjetaAVR") val avrCard: String?,
    @SerializedName("nAltPesoKg") val weight: Double?,
    @SerializedName("sAltNormaTecnica") val technicalNorms: String?,
    @SerializedName("nAltPrecioUSD") val price: Double?,
    @SerializedName("integradora_Id") val integradoraId: Int?
)
