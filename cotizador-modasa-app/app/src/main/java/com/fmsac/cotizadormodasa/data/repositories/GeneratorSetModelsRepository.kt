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
import com.fmsac.cotizadormodasa.data.network.request.generator_sets.change_configuration.ChangeConfigurationRequest
import com.fmsac.cotizadormodasa.data.network.responses.generator_sets.change_configuration.ChangeConfigurationResponse
import com.fmsac.cotizadormodasa.data.network.responses.generator_sets.GeneratorSetV2CombinationResponse

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

    /**
     * Recalcula el precio de una combinación con nueva configuración de componentes
     * @param originalParams Parámetros de búsqueda originales
     * @param integradoraId ID de la combinación actual
     * @param currentAlternatorId ID del alternador actual (debe ser válido)
     * @param currentItmId ID del ITM actual (debe ser válido)
     * @param newAlternatorId ID del nuevo alternador (null si no cambia)
     * @param newItmId ID del nuevo ITM (null si no cambia)
     * @return Result con la combinación recalculada o error
     */
    suspend fun changeConfiguration(
        originalParams: GeneratingSetsParameters,
        integradoraId: Int,
        currentAlternatorId: Int,
        currentItmId: Int,
        newAlternatorId: Int? = null,
        newItmId: Int? = null
    ): Result<GeneratorSetV2CombinationResponse> {
        return try {
            Log.d("GeneratorSetRepository", "=== START changeConfiguration ===")
            Log.d("GeneratorSetRepository", "Recalculating for integradoraId: $integradoraId")
            Log.d("GeneratorSetRepository", "Current alternatorId: $currentAlternatorId, current itmId: $currentItmId")
            Log.d("GeneratorSetRepository", "New alternatorId: $newAlternatorId, new itmId: $newItmId")

            // Validar parámetros requeridos
            if (integradoraId <= 0) {
                throw Exception("Integradora ID debe ser mayor que 0: $integradoraId")
            }
            if (currentAlternatorId <= 0 || currentItmId <= 0) {
                throw Exception("IDs de componentes actuales deben ser válidos: alternatorId=$currentAlternatorId, itmId=$currentItmId")
            }
            if (newAlternatorId == null && newItmId == null) {
                throw Exception("Debe especificarse al menos un componente nuevo (newAlternatorId o newItmId)")
            }

            // Para usar el endpoint existente, usamos los parámetros originales
            // El backend debería aplicar los cambios automáticamente
            val requestDTO = paramsMapper.toDTO(originalParams)
            Log.d("GeneratorSetRepository", "Using existing endpoint with params: voltage=${requestDTO.voltage}, frequency=${requestDTO.frequency}, model=${requestDTO.modelo}")

            // Crear configuración con AMBOS componentes (usar valores actuales para los que no cambian)
            val configuration = com.fmsac.cotizadormodasa.data.network.request.generator_sets.change_configuration.NewConfiguration(
                alternatorId = newAlternatorId ?: currentAlternatorId,
                itmId = newItmId ?: currentItmId
            )
            
            // Crear request en el ORDEN CORRECTO del JSON web
            val changeConfigRequest = ChangeConfigurationRequest(
                configuration = configuration,
                integradoraId = integradoraId,
                params = requestDTO
            )
            
            Log.d("GeneratorSetRepository", "Request payload: integradoraId=${changeConfigRequest.integradoraId}, marketId=${changeConfigRequest.params.marketId}")
            Log.d("GeneratorSetRepository", "JSON order: configuration, integradoraId, params")

            // Llamar al endpoint real sin fallbacks
            val response = api.changeConfiguration(changeConfigRequest)

            Log.d("GeneratorSetRepository", "=== API RESPONSE RECEIVED ===")
            Log.d("GeneratorSetRepository", "Response success: ${response.success}")
            Log.d("GeneratorSetRepository", "Response message: ${response.message}")

            if (!response.success) {
                val errorMsg = response.message.ifEmpty { "Error al recalcular la configuración" }
                Log.e("GeneratorSetRepository", "❌ API response success=false: $errorMsg")
                throw Exception(errorMsg)
            }

            if (response.data == null || response.data.data == null || response.data.data.combination == null) {
                Log.e("GeneratorSetRepository", "❌ API response data is null")
                throw Exception("No se recibió datos de la combinación recalculada")
            }

            Log.d("GeneratorSetRepository", "=== SUCCESS: Combination recalculated ===")
            Log.d("GeneratorSetRepository", "New combination: ${response.data.data.combination}")

            Result.success(response.data.data.combination)
        } catch (e: Exception) {
            Log.e("GeneratorSetRepository", "❌ Error changing configuration: ${e.message}", e)
            Result.failure(e)
        }
    }

}