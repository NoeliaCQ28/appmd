package com.fmsac.cotizadormodasa.data.repositories

import android.content.Context
import com.fmsac.cotizadormodasa.core.distribution_channels.DistributionChannel
import com.fmsac.cotizadormodasa.data.mappers.distribution_channels.DistributionChannelMapper
import com.fmsac.cotizadormodasa.data.network.ApiService
import com.fmsac.cotizadormodasa.data.repositories.common.Repository

class DistributionChannelRepository(
    private val mapper: DistributionChannelMapper,
    private val api: ApiService,
    private val ctx: Context
) : Repository<DistributionChannel> {

    override suspend fun getAll(): List<DistributionChannel> {
        val response = api.getAllDistributionChannels()

        if (!response.success) {
            throw Exception("Error al obtener los canales de distribución")
        }

        return response.data?.map { customerResponse ->
            mapper.fromDTO(customerResponse)
        } ?: emptyList()
    }

    override suspend fun delete(data: DistributionChannel) {
        TODO("Not yet implemented")
    }

    override suspend fun update(data: DistributionChannel) {
        TODO("Not yet implemented")
    }
}