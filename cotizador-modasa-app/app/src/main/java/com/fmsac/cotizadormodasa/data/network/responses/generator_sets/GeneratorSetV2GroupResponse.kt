package com.fmsac.cotizadormodasa.data.network.responses.generator_sets

import com.google.gson.annotations.SerializedName

data class GeneratorSetV2GroupResponse(
    @SerializedName("sIntKey")
    val intKey: String,

    @SerializedName("sModNombre")
    val modelName: String,

    @SerializedName("sMotModelo")
    val motorModel: String,

    @SerializedName("sMotMarca")
    val motorBrand: String,

    @SerializedName("sMotMarcaVisual")
    val motorBrandVisual: String,

    @SerializedName("nIntITMA")
    val itmId: Int,

    @SerializedName("combinations")
    val combinations: List<GeneratorSetV2CombinationResponse>
)
