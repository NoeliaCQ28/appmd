package com.fmsac.cotizadormodasa.data.mappers.generator_sets

import com.fmsac.cotizadormodasa.core.generator_sets.GeneratorSetParametersAvailable
import com.fmsac.cotizadormodasa.data.mappers.Mapper
import com.fmsac.cotizadormodasa.data.network.responses.generating_sets_parameters_values.GeneratingSetsParametersValuesResponse

class GeneratingSetsParameterValuesMapper : Mapper {

    fun fromDTO(dto: GeneratingSetsParametersValuesResponse): GeneratorSetParametersAvailable {
        return GeneratorSetParametersAvailable(
            voltages = dto.voltages,
            frequencies = dto.frequencies,
            phases = dto.phases,
            powerFactors = dto.powerFactors,
            temperatures = dto.temperatures,
            heightAtSeaLevels = dto.heightAtSeaLevels
        )
    }
}