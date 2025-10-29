package com.fmsac.cotizadormodasa.data.network.request.generator_sets

import com.google.gson.annotations.SerializedName

data class GeneratingSetsParametersRequest(
    @SerializedName("voltaje")
    val voltage: Int,

    @SerializedName("frecuencia")
    val frequency: Int,

    @SerializedName("fases")
    val phases: Int,

    @SerializedName("factorPotencia")
    val powerFactor: Double,

    @SerializedName("altura")
    val heightAtSeaLevel: Int,

    @SerializedName("temperatura")
    val temperature: Int,

    @SerializedName("insonoro")
    val isSoundProof: Boolean,

    @SerializedName("modelo")
    val modelo: String,

    @SerializedName("motorMarca")
    val motorMarca: String,

    @SerializedName("primePower")
    val primePower: String,

    @SerializedName("standbyPower")
    val standbyPower: String,

    @SerializedName("powerThreshold")
    val powerThreshold: Int,

    @SerializedName("marketId")
    val marketId: Int
)