package com.fmsac.cotizadormodasa.data.repositories

import android.content.Context
import com.fmsac.cotizadormodasa.core.incoterms.Incoterm
import com.fmsac.cotizadormodasa.data.mappers.incoterms.IncotermMapper
import com.fmsac.cotizadormodasa.data.network.ApiService
import com.fmsac.cotizadormodasa.data.repositories.common.Repository

class IncotermRepository(
    private val mapper: IncotermMapper,
    private val api: ApiService,
    private val ctx: Context
) : Repository<Incoterm> {

    override suspend fun getAll(): List<Incoterm> {
        val response = api.getAllIncoterms()

        if (!response.success) {
            throw Exception("Error al obtener los Incoterms")
        }

        return response.data?.map { customerResponse ->
            mapper.fromDTO(customerResponse)
        } ?: emptyList()
    }

    override suspend fun delete(data: Incoterm) {
        TODO("Not yet implemented")
    }

    override suspend fun update(data: Incoterm) {
        TODO("Not yet implemented")
    }
}