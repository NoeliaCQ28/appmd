package com.fmsac.cotizadormodasa.data.network.responses.sellers

import com.google.gson.annotations.SerializedName

data class SellerResponse(
    @SerializedName("Ejecutivo_Id")
    val executiveId: Int,

    @SerializedName("sEjeCodigo")
    val executiveCode: String?,

    @SerializedName("sEjeSAP")
    val sapCode: String?,

    @SerializedName("sEjeNombre")
    val executiveName: String?,

    @SerializedName("nEjeTelefono")
    val phoneNumber: String?,

    @SerializedName("sEjeCorreo")
    val executiveEmail: String?,

    @SerializedName("nEjeEstado")
    val status: Int,

    @SerializedName("sEjePais")
    val country: String?,

    @SerializedName("sEjeDepartamento")
    val department: String?,

    @SerializedName("sEjeProvincia")
    val province: String?
)