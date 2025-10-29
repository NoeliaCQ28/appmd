package com.fmsac.cotizadormodasa.data.network.responses.quote

import com.google.gson.annotations.SerializedName

data class AllQuoteResponse(
    @SerializedName("Cotizacon_Id") val id: Int,
    @SerializedName("nCotCodigo") val code: String,
    @SerializedName("Cliente_Id") val customerId: Int,
    @SerializedName("sCliNombre") val customerName: String,
    @SerializedName("Ejecutivo_Id") val executiveId: Int,
    @SerializedName("sEjeNombre") val executiveName: String,
    @SerializedName("dCotFecha") val date: String,
    @SerializedName("nCotTipo") val type: String,
    @SerializedName("sCotProyecto") val project: String,
    @SerializedName("nCotTotal") val total: Double,
    @SerializedName("nCotEstado") val statusId: Int,
    @SerializedName("sCotEstado") val status: String
)
