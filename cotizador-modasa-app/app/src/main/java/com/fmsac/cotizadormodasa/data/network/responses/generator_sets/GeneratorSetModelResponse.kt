package com.fmsac.cotizadormodasa.data.network.responses.generator_sets

import com.google.gson.annotations.SerializedName

data class GeneratorSetModelResponse(
    @SerializedName("ModeloGE_Id")
    val id: Int,

    @SerializedName("Modelo")
    val name: String,

    @SerializedName("motor")
    val motor: GeneratorSetMotorResponse,

    @SerializedName("alternadores")
    val alternators: List<GeneratorSetAlternatorResponse>,

    @SerializedName("Integradora_Id")
    val integradoraId: Int? = null
)


data class GeneratorSetMotorResponse(
    @SerializedName("Motor_Id")
    val id: Int,

    @SerializedName("Motor")
    val name: String
)

data class GeneratorSetAlternatorResponse(
    @SerializedName("Alternador_Id")
    val id: Int,

    @SerializedName("Alternador")
    val name: String,

    @SerializedName("price")
    val modelPrice: Double,

    @SerializedName("derate")
    val modelDerate: GeneratorSetDerateModelResponse,

    @SerializedName("itms")
    val itms: List<GeneratorSetItmResponse>
)

data class GeneratorSetDerateModelResponse(
    @SerializedName("prime")
    val prime: GeneratorSetPowerResponse,

    @SerializedName("standby")
    val standby: GeneratorSetPowerResponse
)

data class GeneratorSetPowerResponse(
    @SerializedName("kw")
    val kw: Double,

    @SerializedName("kva")
    val kva: Double
)

data class GeneratorSetItmResponse(
    @SerializedName("Itm_Id")
    val id: Int,

    @SerializedName("KITITM")
    val kitName: String?
)