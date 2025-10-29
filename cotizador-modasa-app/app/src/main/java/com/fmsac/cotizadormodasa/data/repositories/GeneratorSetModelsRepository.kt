package com.fmsac.cotizadormodasa.data.repositories

import android.content.Context
import android.util.Log
import com.fmsac.cotizadormodasa.core.generator_sets.GeneratingSetsParameters
import com.fmsac.cotizadormodasa.core.generator_sets.GeneratorSetModel
import com.fmsac.cotizadormodasa.core.generator_sets.GeneratorSetParametersAvailable
import com.fmsac.cotizadormodasa.data.mappers.generator_sets.GeneratingSetsParameterValuesMapper
import com.fmsac.cotizadormodasa.data.mappers.generator_sets.GeneratingSetsParametersMapper
import com.fmsac.cotizadormodasa.data.mappers.generator_sets.GeneratorSetModelMapper
import com.fmsac.cotizadormodasa.data.network.ApiService

class GeneratorSetModelsRepository(
    private val mapper: GeneratorSetModelMapper,
    private val paramsMapper: GeneratingSetsParametersMapper,
    private val paramsValueMapper: GeneratingSetsParameterValuesMapper,
    private val api: ApiService,
    private val ctx: Context
) {

    suspend fun getParamsAvailable(): GeneratorSetParametersAvailable {
        val response = api.getGeneratorSetModelsParamsAvailable()

        if (!response.success) {
            throw Exception("Error al obtener los parámetros de los modelos de generadores")
        }

        if (response.data == null) {
            throw Exception("Error al obtener los parámetros de los modelos de generadores")
        }

        return paramsValueMapper.fromDTO(response.data)
    }

    suspend fun getModelsByParams(params: GeneratingSetsParameters): List<GeneratorSetModel> {
        Log.d("GeneratorSetRepository", "=== START getModelsByParams ===")
        Log.d("GeneratorSetRepository", "Fetching models with params: $params")

        val requestDTO = paramsMapper.toDTO(params)
        Log.d("GeneratorSetRepository", "Request DTO: $requestDTO")

        val response = api.getGeneratorSetModelsByParams(requestDTO)

        Log.d("GeneratorSetRepository", "=== API RESPONSE RECEIVED ===")
        Log.d("GeneratorSetRepository", "Response success: ${response.success}")
        Log.d("GeneratorSetRepository", "Response message: ${response.message}")
        Log.d("GeneratorSetRepository", "Response data is null: ${response.data == null}")

        if (response.data != null) {
            Log.d("GeneratorSetRepository", "Response data.generatorSets.size: ${response.data.generatorSets.size}")
            Log.d("GeneratorSetRepository", "Response data.derates: ${response.data.derates}")

            response.data.generatorSets.forEachIndexed { index, group ->
                Log.d("GeneratorSetRepository", "  Group[$index]: modelName='${group.modelName}', motorModel='${group.motorModel}', combinations.size=${group.combinations.size}")
                if (group.combinations.isNotEmpty()) {
                    Log.d("GeneratorSetRepository", "    First combination: ${group.combinations.first()}")
                } else {
                    Log.w("GeneratorSetRepository", "    ⚠️ Group has ZERO combinations!")
                }
            }

            if (response.data.generatorSets.isEmpty()) {
                Log.w("GeneratorSetRepository", "⚠️ API returned empty generatorSets list!")
            }
        } else {
            Log.e("GeneratorSetRepository", "❌ API response data is null!")
        }

        if (!response.success) {
            Log.e("GeneratorSetRepository", "❌ API response success=false, throwing exception")
            throw Exception("Error al obtener los modelos de generadores")
        }

        if (response.data == null) {
            Log.e("GeneratorSetRepository", "❌ API response data is null, throwing exception")
            throw Exception("No se encontraron modelos de generadores")
        }

        Log.d("GeneratorSetRepository", "=== STARTING MAPPER ===")
        val models = mapper.fromV2DTO(response.data)
        Log.d("GeneratorSetRepository", "=== MAPPER COMPLETE ===")
        Log.d("GeneratorSetRepository", "Repository returning ${models.size} models")

        if (models.isEmpty() && response.data.generatorSets.isNotEmpty()) {
            Log.e("GeneratorSetRepository", "❌ ERROR: Mapper received ${response.data.generatorSets.size} groups but returned 0 models!")
        }

        return models
    }

    suspend fun getAvailableModels(): List<String> {
        Log.d("GeneratorSetRepository", "Fetching available models")
        val response = api.getAvailableGeneratorModels()

        if (!response.success) {
            throw Exception("Error al obtener los modelos disponibles")
        }

        if (response.data == null) {
            throw Exception("No se encontraron modelos disponibles")
        }

        // Agregar "Todos" al inicio de la lista
        return listOf("Todos") + response.data
    }

    suspend fun getAvailableMotorBrands(): List<String> {
        Log.d("GeneratorSetRepository", "Fetching available motor brands")
        val response = api.getAvailableMotorBrands()

        if (!response.success) {
            throw Exception("Error al obtener las marcas de motor disponibles")
        }

        if (response.data == null) {
            throw Exception("No se encontraron marcas de motor disponibles")
        }

        // Agregar "Todos" al inicio de la lista
        return listOf("Todos") + response.data
    }
}