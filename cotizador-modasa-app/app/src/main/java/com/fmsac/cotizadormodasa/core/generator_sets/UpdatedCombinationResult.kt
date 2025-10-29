package com.fmsac.cotizadormodasa.core.generator_sets

import com.fmsac.cotizadormodasa.data.network.responses.generator_sets.GeneratorSetV2CombinationResponse

/**
 * Resultado de una combinación actualizada después de cambiar configuración
 */
data class UpdatedCombinationResult(
    val originalIntegradoraId: Int,
    val updatedCombination: GeneratorSetV2CombinationResponse,
    val componentChanged: String, // "alternator", "itm", "both"
    val oldAlternatorId: Int? = null,
    val oldItmId: Int? = null,
    val newAlternatorId: Int? = null,
    val newItmId: Int? = null
)