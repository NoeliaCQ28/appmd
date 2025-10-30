package com.fmsac.cotizadormodasa.presentation.viewmodels.generator_sets

import android.app.Application
import android.util.Log
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.fmsac.cotizadormodasa.core.generator_sets.GeneratingSetsParameters
import com.fmsac.cotizadormodasa.core.generator_sets.GeneratorSetModel
import com.fmsac.cotizadormodasa.core.generator_sets.GeneratorSetModelItem
import com.fmsac.cotizadormodasa.core.generator_sets.GeneratorSetParametersAvailable
import com.fmsac.cotizadormodasa.core.generator_sets.UpdatedCombinationResult
import com.fmsac.cotizadormodasa.data.mappers.generator_sets.GeneratingSetsParameterValuesMapper
import com.fmsac.cotizadormodasa.data.mappers.generator_sets.GeneratingSetsParametersMapper
import com.fmsac.cotizadormodasa.data.mappers.generator_sets.GeneratorSetModelMapper
import com.fmsac.cotizadormodasa.data.network.ApiService
import com.fmsac.cotizadormodasa.data.network.RetrofitInstance
import com.fmsac.cotizadormodasa.data.repositories.GeneratorSetModelsRepository
import com.fmsac.cotizadormodasa.presentation.state.FetchState
import kotlinx.coroutines.Deferred
import kotlinx.coroutines.async
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class GeneratorSetViewModel(application: Application) : AndroidViewModel(application) {

    private val ctx = application

    private val API: Deferred<ApiService> = viewModelScope.async { RetrofitInstance.API(ctx) }

    private val repository = viewModelScope.async {
        GeneratorSetModelsRepository(
            mapper = GeneratorSetModelMapper(),
            paramsMapper = GeneratingSetsParametersMapper(),
            paramsValueMapper = GeneratingSetsParameterValuesMapper(),
            api = API.await(),
            ctx = ctx
        )
    }

    var paramsValues = MutableStateFlow<GeneratorSetParametersAvailable>(
        GeneratorSetParametersAvailable(
            voltages = emptyList(),
            phases = emptyList(),
            frequencies = emptyList(),
            temperatures = emptyList(),
            powerFactors = emptyList(),
            heightAtSeaLevels = emptyList(),
        )
    )
        private set

    var params = MutableStateFlow<GeneratingSetsParameters?>(null)
        private set

    var models = MutableStateFlow<List<GeneratorSetModel>>(emptyList())
        private set

    var modelsSelected = MutableStateFlow<List<GeneratorSetModelItem>>(emptyList())
        private set

    var availableModels = MutableStateFlow<List<String>>(listOf("Todos"))
        private set

    var availableMotorBrands = MutableStateFlow<List<String>>(listOf("Todos"))
        private set

    fun addModelSelected(model: GeneratorSetModelItem) {
        val wasAdded = modelsSelected.value.any { it.modelId == model.modelId }
        if (!wasAdded) {
            val newModelsSelected = modelsSelected.value.toMutableList()
            newModelsSelected.add(model)
            modelsSelected.value = newModelsSelected
        } else {
            val newModelsSelected = modelsSelected.value.toMutableList()
            newModelsSelected.removeIf { it.modelId == model.modelId }
            modelsSelected.value = newModelsSelected
        }
    }

    fun setParams(params: GeneratingSetsParameters) {
        this.params.value = params
    }

    var fetchStateModelSearch = MutableSharedFlow<FetchState>()
        private set

    fun getParams() {
        viewModelScope.launch {
            val paramsValuesResponse = repository.await().getParamsAvailable()
            paramsValues.value = paramsValuesResponse
        }
    }

    fun loadAvailableModels() {
        viewModelScope.launch {
            try {
                Log.d("GeneratorSetViewModel", "Loading available models")
                val models = repository.await().getAvailableModels()
                availableModels.value = models
                Log.d("GeneratorSetViewModel", "Loaded ${models.size} models")
            } catch (e: Exception) {
                Log.e("GeneratorSetViewModel", "Error loading available models", e)
                availableModels.value = listOf("Todos")
            }
        }
    }

    fun loadAvailableMotorBrands() {
        viewModelScope.launch {
            try {
                Log.d("GeneratorSetViewModel", "Loading available motor brands")
                val brands = repository.await().getAvailableMotorBrands()
                availableMotorBrands.value = brands
                Log.d("GeneratorSetViewModel", "Loaded ${brands.size} motor brands")
            } catch (e: Exception) {
                Log.e("GeneratorSetViewModel", "Error loading available motor brands", e)
                availableMotorBrands.value = listOf("Todos")
            }
        }
    }

    fun searchModels(generatorSetModelParams: GeneratingSetsParameters) {
        viewModelScope.launch {
            try {
                Log.d("GeneratorSetViewModel", "Starting model search with params: $generatorSetModelParams")
                Log.d("GeneratorSetViewModel", "Params details - voltage: ${generatorSetModelParams.voltage}, frequency: ${generatorSetModelParams.frequency}, phases: ${generatorSetModelParams.phases}, powerFactor: ${generatorSetModelParams.powerFactor}, heightAtSeaLevel: ${generatorSetModelParams.heightAtSeaLevel}, temperature: ${generatorSetModelParams.temperature}, isSoundproof: ${generatorSetModelParams.isSoundproof}")
                fetchStateModelSearch.emit(FetchState.Loading)
                val modelsResponse = repository.await().getModelsByParams(generatorSetModelParams)
                Log.d("GeneratorSetViewModel", "Received ${modelsResponse.size} models from repository")

                // Log first few models if any
                if (modelsResponse.isNotEmpty()) {
                    Log.d("GeneratorSetViewModel", "First model: ${modelsResponse.first()}")
                } else {
                    Log.w("GeneratorSetViewModel", "No models received from API!")
                }

                models.value = modelsResponse
                Log.d("GeneratorSetViewModel", "Models StateFlow updated. Current value size: ${models.value.size}")
                fetchStateModelSearch.emit(FetchState.Success)
            } catch (e: retrofit2.HttpException) {
                Log.e("GeneratorSetViewModel", "HttpException during model search", e)
                fetchStateModelSearch.emit(
                    FetchState.Error(
                        e.message ?: "Error desconocido al buscar modelos"
                    )
                )
            } catch (e: Exception) {
                Log.e("GeneratorSetViewModel", "Exception during model search", e)
                fetchStateModelSearch.emit(
                    FetchState.Error(
                        e.message ?: "Error desconocido al buscar modelos"
                    )
                )
            }
        }
    }

    // Estado para combinaciones actualizadas
    private val _updatedCombinations = MutableStateFlow<List<UpdatedCombinationResult>>(emptyList())
    val updatedCombinations = _updatedCombinations.asStateFlow()

    // Flow para emitir eventos de cambio de combinación
    private val _combinationUpdateEvents = MutableSharedFlow<UpdatedCombinationResult>()
    val combinationUpdateEvents = _combinationUpdateEvents.asSharedFlow()

    /**
     * Actualiza una combinación específica en la lista local
     */
    fun updateCombinationInLocalList(updatedResult: UpdatedCombinationResult) {
        val currentCombinations = _updatedCombinations.value.toMutableList()
        
        // Remover si ya existe
        currentCombinations.removeAll { it.originalIntegradoraId == updatedResult.originalIntegradoraId }
        
        // Añadir la nueva combinación actualizada
        currentCombinations.add(updatedResult)
        
        _updatedCombinations.value = currentCombinations
        
        Log.d("GeneratorSetViewModel", "Updated combination for integradoraId: ${updatedResult.originalIntegradoraId}")
        
        // Emitir evento para que los observers actualicen la UI
        viewModelScope.launch {
            _combinationUpdateEvents.emit(updatedResult)
        }
    }

    /**
     * Obtiene una combinación actualizada por su ID de integradora
     */
    fun getUpdatedCombinationByIntegradoraId(integradoraId: Int): UpdatedCombinationResult? {
        return _updatedCombinations.value.find { it.originalIntegradoraId == integradoraId }
    }

    /**
     * Obtiene el repositorio de modelos de grupos electrógenos
     * Usado por otros ViewModels para acceder a la funcionalidad de changeConfiguration
     */
    fun getGeneratorSetRepository(): Deferred<GeneratorSetModelsRepository> {
        return repository
    }

    /**
     * Limpia todas las combinaciones actualizadas
     */
    fun clearUpdatedCombinations() {
        _updatedCombinations.value = emptyList()
        Log.d("GeneratorSetViewModel", "Cleared all updated combinations")
    }

    /**
     * Actualiza el régimen seleccionado (Prime/Standby) de un modelo específico
     * @param modelId ID del modelo a actualizar
     * @param regimen Nuevo régimen ("Prime" o "Standby")
     */
    fun updateModelRegimen(modelId: Int, regimen: String) {
        models.value = models.value.map { model ->
            if (model.id == modelId) {
                model.copy(selectedRegimen = regimen)
            } else {
                model
            }
        }
        Log.d(TAG, "Updated model $modelId regime to: $regimen")
    }

    companion object {
        private const val TAG = "GeneratorSetViewModel"
    }
}