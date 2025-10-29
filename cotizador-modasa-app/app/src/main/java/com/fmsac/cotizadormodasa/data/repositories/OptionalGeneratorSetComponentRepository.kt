package com.fmsac.cotizadormodasa.data.repositories

import android.content.Context
import com.fmsac.cotizadormodasa.core.generator_sets.OptionalGeneratorSetComponent
import com.fmsac.cotizadormodasa.data.mappers.generator_sets.OptionalGeneratorSetComponentsMapper
import com.fmsac.cotizadormodasa.data.network.ApiService

class OptionalGeneratorSetComponentRepository(
    private val mapper: OptionalGeneratorSetComponentsMapper,
    private val api: ApiService,
    private val ctx: Context
) {

    suspend fun getAllByModelName(modelName: String): List<OptionalGeneratorSetComponent> {
        val response = api.getOptionalComponentsOfGeneratorSetModel(modelName)

        if (!response.success) {
            throw Exception("Error al obtener los componentes opcionales")
        }

        return response.data?.map { customerResponse ->
            mapper.fromDTO(customerResponse)
        } ?: emptyList()
    }

    /**
     * Obtiene todos los componentes opcionales disponibles
     * @return Lista de todos los componentes opcionales
     * @throws Exception si hay error en la respuesta del API
     */
    suspend fun getAll(): List<OptionalGeneratorSetComponent> {
        val response = api.getAllOptionalComponents()

        if (!response.success) {
            throw Exception("Error al obtener todos los componentes opcionales")
        }

        return response.data?.map { componentResponse ->
            mapper.fromDTO(componentResponse)
        } ?: emptyList()
    }

}