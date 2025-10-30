package com.fmsac.cotizadormodasa.data.network.request.generator_sets.change_configuration

import com.google.gson.annotations.SerializedName

// Esta clase solo se usará para 'change-configuration'
data class ChangeConfigParams(

    @SerializedName("altura")
    val altura: Int,

    @SerializedName("factorPotencia")
    val factorPotencia: Double,

    @SerializedName("fases")
    val fases: Int,

    @SerializedName("frecuencia")
    val frecuencia: Int,

    @SerializedName("insonoro")
    val insonoro: Boolean,

    @SerializedName("marketId")
    val marketId: Int,

    @SerializedName("modelo")
    val modelo: String,

    @SerializedName("powerThreshold")
    val powerThreshold: Int,

    @SerializedName("primePower")
    val primePower: String,

    @SerializedName("standbyPower")
    val standbyPower: String,

    @SerializedName("temperatura")
    val temperatura: Int,

    @SerializedName("voltaje")
    val voltaje: Int

    // Nota: 'motorMarca' se omite intencionalmente para este endpoint.
)