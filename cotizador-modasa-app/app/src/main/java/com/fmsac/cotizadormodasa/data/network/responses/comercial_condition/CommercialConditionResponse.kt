package com.fmsac.cotizadormodasa.data.network.responses.comercial_condition

import com.google.gson.annotations.SerializedName

data class CommercialConditionResponse(
    @SerializedName("CondicionesComerciales_Id")
    val commercialConditionsId: Int,

    @SerializedName("sConTitulo")
    val title: String,

    @SerializedName("sConDescripcion")
    val description: String,

    @SerializedName("sConDescripcionHTML")
    val htmlDescription: String,

    @SerializedName("nConEstado")
    val status: Int
)