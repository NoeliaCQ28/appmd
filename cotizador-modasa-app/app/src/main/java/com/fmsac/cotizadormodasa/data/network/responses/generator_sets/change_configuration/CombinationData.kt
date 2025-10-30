package com.fmsac.cotizadormodasa.data.network.responses.generator_sets.change_configuration

import com.fmsac.cotizadormodasa.data.network.responses.generator_sets.GeneratorSetV2CombinationResponse
import com.google.gson.annotations.SerializedName

/**
 * Datos de la combinación recalculada (estructura exacta del backend)
 */
data class CombinationData(
    @SerializedName("sIntKey")
    val sIntKey: String?,

    @SerializedName("combination")
    val combination: GeneratorSetV2CombinationResponse?
)