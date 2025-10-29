package com.fmsac.cotizadormodasa.data.network.responses.generator_sets

import com.google.gson.annotations.SerializedName

data class GeneratorSetV2WrapperResponse(
    @SerializedName("generatorSets")
    val generatorSets: List<GeneratorSetV2GroupResponse>,

    @SerializedName("derates")
    val derates: GeneratorSetV2DeratesResponse
)
