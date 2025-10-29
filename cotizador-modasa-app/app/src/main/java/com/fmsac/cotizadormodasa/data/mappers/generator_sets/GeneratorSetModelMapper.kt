package com.fmsac.cotizadormodasa.data.mappers.generator_sets

import com.fmsac.cotizadormodasa.core.generator_sets.GeneratorSetAlternator
import com.fmsac.cotizadormodasa.core.generator_sets.GeneratorSetDerateModel
import com.fmsac.cotizadormodasa.core.generator_sets.GeneratorSetItm
import com.fmsac.cotizadormodasa.core.generator_sets.GeneratorSetModel
import com.fmsac.cotizadormodasa.core.generator_sets.GeneratorSetMotor
import com.fmsac.cotizadormodasa.core.generator_sets.GeneratorSetPower
import com.fmsac.cotizadormodasa.data.mappers.Mapper
import com.fmsac.cotizadormodasa.data.network.responses.generator_sets.GeneratorSetAlternatorResponse
import com.fmsac.cotizadormodasa.data.network.responses.generator_sets.GeneratorSetDerateModelResponse
import com.fmsac.cotizadormodasa.data.network.responses.generator_sets.GeneratorSetItmResponse
import com.fmsac.cotizadormodasa.data.network.responses.generator_sets.GeneratorSetModelResponse
import com.fmsac.cotizadormodasa.data.network.responses.generator_sets.GeneratorSetMotorResponse
import com.fmsac.cotizadormodasa.data.network.responses.generator_sets.GeneratorSetPowerResponse
import com.fmsac.cotizadormodasa.data.network.responses.generator_sets.GeneratorSetV2CombinationResponse
import com.fmsac.cotizadormodasa.data.network.responses.generator_sets.GeneratorSetV2GroupResponse
import com.fmsac.cotizadormodasa.data.network.responses.generator_sets.GeneratorSetV2WrapperResponse
import android.util.Log

class GeneratorSetModelMapper : Mapper {
    fun fromDTO(dto: GeneratorSetModelResponse): GeneratorSetModel {
        return GeneratorSetModel(
            id = dto.id,
            name = dto.name,
            motor = fromDTOGeneratorSetMotor(dto.motor),
            alternators = dto.alternators.map { fromDTOGeneratorSetAlternator(it) },
            integradoraId = dto.integradoraId ?: 0
        )
    }

    private fun fromDTOGeneratorSetMotor(dto: GeneratorSetMotorResponse): GeneratorSetMotor {
        return GeneratorSetMotor(
            id = dto.id,
            name = dto.name,
        )
    }

    private fun fromDTOGeneratorSetAlternator(dto: GeneratorSetAlternatorResponse): GeneratorSetAlternator {
        return GeneratorSetAlternator(
            id = dto.id,
            name = dto.name,
            modelPrice = dto.modelPrice,
            modelDerate = fromDTOGeneratorSetDerateModel(dto.modelDerate),
            itms = dto.itms.map { fromDTOGeneratorSetItm(it) }
        )
    }

    private fun fromDTOGeneratorSetDerateModel(dto: GeneratorSetDerateModelResponse): GeneratorSetDerateModel {
        return GeneratorSetDerateModel(
            prime = fromDTOGeneratorSetPower(dto.prime),
            standby = fromDTOGeneratorSetPower(dto.standby)
        )
    }

    private fun fromDTOGeneratorSetPower(dto: GeneratorSetPowerResponse): GeneratorSetPower {
        return GeneratorSetPower(
            kw = dto.kw,
            kva = dto.kva
        )
    }

    private fun fromDTOGeneratorSetItm(dto: GeneratorSetItmResponse): GeneratorSetItm {
        return GeneratorSetItm(
            id = dto.id,
            kitName = dto.kitName ?: "Sin ITM"
        )
    }

    /**
     * Maps API v2 response structure to domain model
     * Converts grouped generator sets from v2 API to flat list of GeneratorSetModel
     */
    fun fromV2DTO(dto: GeneratorSetV2WrapperResponse): List<GeneratorSetModel> {
        Log.d("GeneratorSetMapper", "=== fromV2DTO: START MAPPING ===")
        Log.d("GeneratorSetMapper", "Received ${dto.generatorSets.size} groups from API")

        // Log each group detail
        dto.generatorSets.forEachIndexed { index, group ->
            Log.d("GeneratorSetMapper", "Group[$index]: modelName='${group.modelName}', motorModel='${group.motorModel}', combinations.size=${group.combinations.size}")
            if (group.combinations.isEmpty()) {
                Log.w("GeneratorSetMapper", "⚠️ Group[$index] '${group.modelName}' has ZERO combinations - will be filtered out!")
            }
        }

        val models = dto.generatorSets.flatMapIndexed { index, group ->
            Log.d("GeneratorSetMapper", "Processing group[$index]: ${group.modelName} with ${group.combinations.size} combinations")
            val result = fromV2GroupDTO(group)
            Log.d("GeneratorSetMapper", "Group[$index] '${group.modelName}' produced ${result.size} models")
            result
        }

        Log.d("GeneratorSetMapper", "=== fromV2DTO: MAPPING COMPLETE ===")
        Log.d("GeneratorSetMapper", "Final result: Generated ${models.size} models from ${dto.generatorSets.size} groups")

        if (models.isEmpty() && dto.generatorSets.isNotEmpty()) {
            Log.e("GeneratorSetMapper", "❌ ERROR: Received ${dto.generatorSets.size} groups but produced 0 models!")
        }

        return models
    }

    /**
     * Maps a single v2 group to a list of GeneratorSetModel
     * Each group represents a unique model+motor configuration
     * Combinations within the group are different alternator/ITM options
     */
    private fun fromV2GroupDTO(group: GeneratorSetV2GroupResponse): List<GeneratorSetModel> {
        Log.d("GeneratorSetMapper", "--- fromV2GroupDTO: '${group.modelName}' ---")

        // If no combinations, return empty list
        if (group.combinations.isEmpty()) {
            Log.w("GeneratorSetMapper", "⚠️ Group '${group.modelName}' has no combinations, skipping")
            return emptyList()
        }

        Log.d("GeneratorSetMapper", "Mapping ${group.combinations.size} combinations to alternators for '${group.modelName}'")

        // Map all combinations to alternators
        val alternators = group.combinations.mapIndexed { index, combination ->
            Log.d("GeneratorSetMapper", "  Combination[$index]: alternatorId=${combination.alternatorId}, alternatorModel='${combination.alternatorModel}', itmId=${combination.itmId}")
            fromV2CombinationToAlternator(combination)
        }

        Log.d("GeneratorSetMapper", "Mapped ${alternators.size} alternators for '${group.modelName}'")

        // Validación preventiva: asegurar que hay alternators válidos
        if (alternators.isEmpty()) {
            Log.e("GeneratorSetMapper", "❌ Group '${group.modelName}' has no valid alternators after mapping (this should never happen!), skipping")
            return emptyList()
        }

        // Use the first combination to get the model ID
        val firstCombination = group.combinations.first()

        Log.d("GeneratorSetMapper", "✅ Creating GeneratorSetModel: id=${firstCombination.integradoraId}, name='${group.modelName}', motor='${group.motorModel}', alternators.size=${alternators.size}")

        // Create a single GeneratorSetModel per group with all alternators
        return listOf(
            GeneratorSetModel(
                id = firstCombination.integradoraId,
                name = group.modelName,
                motor = GeneratorSetMotor(
                    id = 0, // Motor ID not provided in v2 API
                    name = group.motorModel
                ),
                alternators = alternators,
                integradoraId = firstCombination.integradoraId
            )
        )
    }

    /**
     * Creates a GeneratorSetAlternator from a v2 combination
     */
    private fun fromV2CombinationToAlternator(combination: GeneratorSetV2CombinationResponse): GeneratorSetAlternator {
        return GeneratorSetAlternator(
            id = combination.alternatorId,
            name = combination.alternatorModel,
            modelPrice = combination.totalPriceUSD,
            modelDerate = GeneratorSetDerateModel(
                prime = GeneratorSetPower(
                    kw = combination.primeKW,
                    kva = combination.primeKVA
                ),
                standby = GeneratorSetPower(
                    kw = combination.standbyKW,
                    kva = combination.standbyKVA
                )
            ),
            itms = listOf(
                GeneratorSetItm(
                    id = combination.itmId,
                    kitName = combination.itmKitName ?: "Sin ITM"
                )
            )
        )
    }
}