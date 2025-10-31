package com.fmsac.cotizadormodasa.data.network.responses.generator_sets

import com.google.gson.annotations.SerializedName

data class GeneratorSetModelNameResponse(
    @SerializedName("sModNombre")
    val modelName: String,

    @SerializedName("ModeloGE_Id")
    val modelId: Int
)
