package com.fmsac.cotizadormodasa.data.mappers.incoterms

import com.fmsac.cotizadormodasa.core.incoterms.Incoterm
import com.fmsac.cotizadormodasa.data.mappers.Mapper
import com.fmsac.cotizadormodasa.data.network.responses.incoterm.IncotermResponse

class IncotermMapper : Mapper {
    fun fromDTO(dto: IncotermResponse): Incoterm {
        return Incoterm(
            id = dto.id,
            code = dto.code,
            requireLocation = dto.requireLocation,
            transportType = dto.transportType,
            SMC = dto.SMC,
            description = dto.description
        )
    }

}