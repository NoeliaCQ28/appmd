package com.fmsac.cotizadormodasa.data.network.responses.incoterm

import com.google.gson.annotations.SerializedName

data class IncotermResponse(

    @SerializedName("IncotermId")
    val id: Int,

    @SerializedName("sCodigo")
    val code: String,

    @SerializedName("nRequiereLocacion")
    val requireLocation: Int,

    @SerializedName("sTipoTransporte")
    val transportType: String?,

    @SerializedName("sSMC")
    val SMC: String?,

    @SerializedName("sDescripcion")
    val description: String
)