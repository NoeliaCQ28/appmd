package com.fmsac.cotizadormodasa.data.network.responses.generator_sets

import com.google.gson.annotations.SerializedName

data class GeneratorSetV2DeratesResponse(
    @SerializedName("averageDerate")
    val averageDerate: GeneratorSetDerateModelResponse,

    @SerializedName("derateRange")
    val derateRange: GeneratorSetDerateRangeResponse
)

data class GeneratorSetDerateRangeResponse(
    @SerializedName("prime")
    val prime: GeneratorSetPowerRangeResponse,

    @SerializedName("standby")
    val standby: GeneratorSetPowerRangeResponse
)

data class GeneratorSetPowerRangeResponse(
    @SerializedName("kw")
    val kw: GeneratorSetMinMaxResponse,

    @SerializedName("kva")
    val kva: GeneratorSetMinMaxResponse
)

data class GeneratorSetMinMaxResponse(
    @SerializedName("min")
    val min: Double,

    @SerializedName("max")
    val max: Double
)
