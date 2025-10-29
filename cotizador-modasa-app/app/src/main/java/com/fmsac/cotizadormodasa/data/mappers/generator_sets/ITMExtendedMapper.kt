package com.fmsac.cotizadormodasa.data.mappers.generator_sets

import com.fmsac.cotizadormodasa.core.generator_sets.ITMExtended
import com.fmsac.cotizadormodasa.data.mappers.Mapper
import com.fmsac.cotizadormodasa.data.network.responses.generator_sets.ITMExtendedResponse

/**
 * Mapper para convertir entre DTOs y modelos de dominio de ITMs Extendidos
 */
class ITMExtendedMapper : Mapper {

    fun fromDTO(dto: ITMExtendedResponse): ITMExtended {
        return ITMExtended(
            id = dto.id,
            kitName = dto.kitName ?: "N/A",
            brand = dto.brand,
            amperage = dto.amperage ?: 0,
            poles = dto.poles ?: 0,
            price = dto.price ?: 0.0,
            integradoraId = dto.integradoraId
        )
    }

    fun fromDTOList(dtos: List<ITMExtendedResponse>): List<ITMExtended> {
        return dtos.map { fromDTO(it) }
    }
}
