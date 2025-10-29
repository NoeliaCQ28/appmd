package com.fmsac.cotizadormodasa.data.network.responses.distribution_channels

import com.google.gson.annotations.SerializedName

data class DistributionChannelResponse(
    @SerializedName("CanalId")
    val id: Int,

    @SerializedName("sCodigo")
    val code: String,

    @SerializedName("sNombre")
    val name: String,

    @SerializedName("sCodigoArea")
    val areaCode: Int,

    @SerializedName("nEstado")
    val state: Int
)