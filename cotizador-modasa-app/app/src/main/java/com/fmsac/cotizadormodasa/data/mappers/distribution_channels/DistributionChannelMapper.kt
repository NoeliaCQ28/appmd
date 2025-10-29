package com.fmsac.cotizadormodasa.data.mappers.distribution_channels

import com.fmsac.cotizadormodasa.core.distribution_channels.DistributionChannel
import com.fmsac.cotizadormodasa.data.mappers.Mapper
import com.fmsac.cotizadormodasa.data.network.responses.distribution_channels.DistributionChannelResponse

class DistributionChannelMapper : Mapper {
    fun fromDTO(response: DistributionChannelResponse): DistributionChannel {
        return DistributionChannel(
            id = response.id,
            code = response.code,
            name = response.name,
            areaCode = response.areaCode,
            state = response.state
        )
    }
}