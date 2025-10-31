package com.fmsac.cotizadormodasa.data.network.responses.generator_sets

import com.google.gson.annotations.SerializedName

data class MotorBrandResponse(
    @SerializedName("MotorMarca_Id")
    val brandId: Int,

    @SerializedName("sMotMarca")
    val brandName: String,

    @SerializedName("sMotMarcaVisual")
    val brandVisualName: String
)
