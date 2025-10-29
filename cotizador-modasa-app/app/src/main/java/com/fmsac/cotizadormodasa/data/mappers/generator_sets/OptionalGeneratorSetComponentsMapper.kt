package com.fmsac.cotizadormodasa.data.mappers.generator_sets

import com.fmsac.cotizadormodasa.core.generator_sets.OptionalGeneratorSetComponent
import com.fmsac.cotizadormodasa.data.mappers.Mapper
import com.fmsac.cotizadormodasa.data.network.responses.quote.OptionalComponentResponse

class OptionalGeneratorSetComponentsMapper : Mapper {
    fun fromDTO(dto: OptionalComponentResponse): OptionalGeneratorSetComponent {
        return OptionalGeneratorSetComponent(
            id = dto.id,
            type = dto.type,
            code = dto.code,
            name = dto.name,
            name_ = dto.name_,
            description = dto.description,
            brand = dto.brand,
            application = dto.application,
            price = dto.price
        )
    }
}