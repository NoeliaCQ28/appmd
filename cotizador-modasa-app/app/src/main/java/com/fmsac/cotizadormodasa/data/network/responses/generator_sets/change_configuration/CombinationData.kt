package com.fmsac.cotizadormodasa.data.network.responses.generator_sets.change_configuration

import com.fmsac.cotizadormodasa.data.network.responses.generator_sets.GeneratorSetV2CombinationResponse
import com.google.gson.annotations.SerializedName

/**
 * Datos de la combinación recalculada
 */
data class CombinationData(
    @SerializedName("combination")
    val combination: GeneratorSetV2CombinationResponse
)