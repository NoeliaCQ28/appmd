package com.fmsac.cotizadormodasa.data.network.responses.generator_sets.change_configuration

import com.fmsac.cotizadormodasa.data.network.responses.generator_sets.GeneratorSetV2CombinationResponse
import com.google.gson.annotations.SerializedName

data class ChangeConfigurationResponse(
    // Este campo mapea "data.sIntKey" del JSON
    @SerializedName("sIntKey") val sIntKey: String?,
    // Este campo mapea "data.combination" del JSON
    @SerializedName("combination") val combination: GeneratorSetV2CombinationResponse?
)