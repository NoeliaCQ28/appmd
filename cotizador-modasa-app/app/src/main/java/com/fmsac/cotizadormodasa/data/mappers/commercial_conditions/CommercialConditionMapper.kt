package com.fmsac.cotizadormodasa.data.mappers.commercial_conditions

import com.fmsac.cotizadormodasa.core.commercial_conditions.CommercialCondition
import com.fmsac.cotizadormodasa.data.mappers.Mapper
import com.fmsac.cotizadormodasa.data.network.responses.comercial_condition.CommercialConditionResponse

class CommercialConditionMapper : Mapper {

    fun fromDTO(dto: CommercialConditionResponse): CommercialCondition {
        return CommercialCondition(
            commercialConditionsId = dto.commercialConditionsId,
            title = dto.title,
            description = dto.description,
            htmlDescription = dto.htmlDescription,
            status = dto.status
        )
    }
}