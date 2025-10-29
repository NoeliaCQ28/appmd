package com.fmsac.cotizadormodasa.data.mappers.generator_sets

import com.fmsac.cotizadormodasa.core.generator_sets.GeneratingSetsParameters
import com.fmsac.cotizadormodasa.data.mappers.Mapper
import com.fmsac.cotizadormodasa.data.network.request.generator_sets.GeneratingSetsParametersRequest

class GeneratingSetsParametersMapper : Mapper {
    fun toDTO(model: GeneratingSetsParameters): GeneratingSetsParametersRequest {
        return GeneratingSetsParametersRequest(
            voltage = model.voltage,
            frequency = model.frequency,
            phases = model.phases,
            powerFactor = model.powerFactor,
            heightAtSeaLevel = model.heightAtSeaLevel,
            temperature = model.temperature,
            isSoundProof = model.isSoundproof,
            modelo = model.modelo,
            motorMarca = model.motorMarca,
            primePower = model.primePower,
            standbyPower = model.standbyPower,
            powerThreshold = model.powerThreshold,
            marketId = model.marketId
        )
    }
}