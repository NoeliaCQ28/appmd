package com.fmsac.cotizadormodasa.data.repositories

import android.content.Context
import com.fmsac.cotizadormodasa.core.commercial_conditions.CommercialCondition
import com.fmsac.cotizadormodasa.data.mappers.commercial_conditions.CommercialConditionMapper
import com.fmsac.cotizadormodasa.data.network.ApiService
import com.fmsac.cotizadormodasa.data.repositories.common.Repository

class CommercialConditionRepository(
    private val mapper: CommercialConditionMapper,
    private val api: ApiService,
    private val ctx: Context
) : Repository<CommercialCondition> {
    override suspend fun getAll(): List<CommercialCondition> {
        val response = api.getAllCommercialConditions()

        if (!response.success) {
            throw Exception("Error al obtener las condiciones comerciales")
        }

        return response.data?.map { commercialConditionsResponse ->
            mapper.fromDTO(commercialConditionsResponse)
        } ?: emptyList()
    }

    override suspend fun delete(data: CommercialCondition) {
        TODO("Not yet implemented")
    }

    override suspend fun update(data: CommercialCondition) {
        TODO("Not yet implemented")
    }

    suspend fun save(data: CommercialCondition) {
        TODO("Not yet implemented")
    }

}