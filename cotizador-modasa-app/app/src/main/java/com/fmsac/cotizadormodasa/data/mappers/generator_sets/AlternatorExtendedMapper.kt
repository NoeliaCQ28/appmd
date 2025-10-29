package com.fmsac.cotizadormodasa.data.mappers.generator_sets

import com.fmsac.cotizadormodasa.core.generator_sets.AlternatorExtended
import com.fmsac.cotizadormodasa.data.mappers.Mapper
import com.fmsac.cotizadormodasa.data.network.responses.generator_sets.AlternatorExtendedResponse

/**
 * Mapper para convertir entre DTOs y modelos de dominio de Alternadores Extendidos
 */
class AlternatorExtendedMapper : Mapper {

    fun fromDTO(dto: AlternatorExtendedResponse): AlternatorExtended {
        return AlternatorExtended(
            id = dto.id,
            name = dto.name ?: "N/A",
            brand = dto.brand ?: "N/A",
            family = dto.family,
            ipGrade = dto.ipGrade,
            insulation = dto.insulation,
            frame = dto.frame,
            disk = dto.disk,
            excitationSystem = dto.excitationSystem,
            avrCard = dto.avrCard,
            weight = dto.weight,
            technicalNorms = dto.technicalNorms,
            price = dto.price ?: 0.0,
            integradoraId = dto.integradoraId
        )
    }

    fun fromDTOList(dtos: List<AlternatorExtendedResponse>): List<AlternatorExtended> {
        return dtos.map { fromDTO(it) }
    }
}
