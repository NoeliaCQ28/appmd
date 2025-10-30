package com.fmsac.cotizadormodasa.presentation.viewmodels.generator_sets

import android.app.Application
import android.util.Log
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.fmsac.cotizadormodasa.core.generator_sets.GeneratingSetsParameters
import com.fmsac.cotizadormodasa.core.generator_sets.ITMExtended
import com.fmsac.cotizadormodasa.data.mappers.generator_sets.ITMExtendedMapper
import com.fmsac.cotizadormodasa.data.network.ApiService
import com.fmsac.cotizadormodasa.data.network.RetrofitInstance
import com.fmsac.cotizadormodasa.data.network.responses.generator_sets.GeneratorSetV2CombinationResponse
import com.fmsac.cotizadormodasa.data.repositories.ITMExtendedRepository
import com.fmsac.cotizadormodasa.presentation.state.FetchState
import kotlinx.coroutines.Deferred
import kotlinx.coroutines.async
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharedFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

/**
 * ViewModel para gestionar la selección de ITMs extendidos
 * Maneja el estado de la lista de ITMs, búsqueda y selección temporal
 */
class ITMSelectionViewModel(application: Application) : AndroidViewModel(application) {

    private val ctx = application

    private val API: Deferred<ApiService> = viewModelScope.async {
        RetrofitInstance.API(ctx)
    }

    private val mapper = ITMExtendedMapper()

    private val repository = viewModelScope.async {
        ITMExtendedRepository(
            mapper = mapper,
            api = API.await(),
            ctx = ctx
        )
    }

    // Referencias para obtener estado compartido con GeneratorSetViewModel
    private var sharedGeneratorSetViewModel: GeneratorSetViewModel? = null
    fun setSharedViewModel(viewModel: GeneratorSetViewModel) {
        sharedGeneratorSetViewModel = viewModel
    }

    // Estado de ITMs cargados
    private val _itms = MutableStateFlow<List<ITMExtended>>(emptyList())
    val itms: StateFlow<List<ITMExtended>> = _itms.asStateFlow()

    // Estado de búsqueda
    private val _searchQuery = MutableStateFlow("")
    val searchQuery: StateFlow<String> = _searchQuery.asStateFlow()

    // ITMs filtrados por búsqueda
    val filteredITMs: StateFlow<List<ITMExtended>> = combine(
        _itms,
        _searchQuery
    ) { itms, query ->
        if (query.isBlank()) {
            itms
        } else {
            itms.filter { itm ->
                itm.kitName.contains(query, ignoreCase = true) ||
                        itm.brand?.contains(query, ignoreCase = true) == true ||
                        itm.amperage.toString().contains(query) ||
                        itm.poles.toString().contains(query)
            }
        }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    // Estado de carga/error
    private val _fetchState = MutableSharedFlow<FetchState>()
    val fetchState: SharedFlow<FetchState> = _fetchState.asSharedFlow()

    // ID del ITM seleccionado temporalmente en el modal
    private val _tempSelectedITMId = MutableStateFlow<Int?>(null)
    val tempSelectedITMId: StateFlow<Int?> = _tempSelectedITMId.asStateFlow()

    // Callback para notificar cambios en el precio
    private var onPriceRecalculatedCallback: ((GeneratorSetV2CombinationResponse) -> Unit)? = null

    fun setOnPriceRecalculatedCallback(callback: (GeneratorSetV2CombinationResponse) -> Unit) {
        this.onPriceRecalculatedCallback = callback
    }

    /**
     * Método público para disparar la recalculación de precio con ITM
     * Usado por la UI a través del callback
     */
    fun recalculatePriceWithITM(
        currentCombination: GeneratorSetV2CombinationResponse,
        originalParams: GeneratingSetsParameters,
        newITMId: Int,
        currentAlternatorId: Int?
    ) {
        viewModelScope.launch {
            try {
                val repository = sharedGeneratorSetViewModel?.getGeneratorSetRepository()?.await()
                    ?: throw Exception("Repository no disponible")

                val result = repository.simulateAlternatorSwap(
                    originalParams = originalParams,
                    integradoraId = currentCombination.integradoraId,
                    modelName = currentCombination.modelName,
                    currentAlternatorId = currentCombination.alternatorId,
                    currentItmId = currentCombination.itmId,
                    newAlternatorId = currentAlternatorId,
                    newItmId = newITMId
                )
                
                result.fold(
                    onSuccess = { updatedCombination ->
                        // Llamar al callback con la combinación actualizada
                        onPriceRecalculatedCallback?.invoke(updatedCombination)
                        
                        // Notificar al GeneratorSetViewModel de la actualización
                        sharedGeneratorSetViewModel?.updateCombinationInLocalList(
                            com.fmsac.cotizadormodasa.core.generator_sets.UpdatedCombinationResult(
                                originalIntegradoraId = currentCombination.integradoraId,
                                updatedCombination = updatedCombination,
                                componentChanged = "itm",
                                oldAlternatorId = currentCombination.alternatorId,
                                oldItmId = currentCombination.itmId,
                                newAlternatorId = currentCombination.alternatorId,
                                newItmId = newITMId
                            )
                        )
                        
                        Log.d(TAG, "Price recalculated with new ITM: $newITMId")
                    },
                    onFailure = { error ->
                        Log.e(TAG, "Error recalculating price with ITM: ${error.message}", error)
                    }
                )
            } catch (e: Exception) {
                Log.e(TAG, "Exception recalculating price with ITM: ${e.message}", e)
            }
        }
    }

    /**
     * Carga los ITMs disponibles para una integradora
     * @param integradoraId ID de la integradora
     */
    fun loadITMs(integradoraId: Int) {
        viewModelScope.launch {
            try {
                Log.d(TAG, "Loading ITMs for integradora: $integradoraId")
                _fetchState.emit(FetchState.Loading)

                val itmsList = repository.await().getAllByIntegradora(integradoraId)
                _itms.value = itmsList

                Log.d(TAG, "Loaded ${itmsList.size} ITMs successfully")
                _fetchState.emit(FetchState.Success)
            } catch (e: Exception) {
                Log.e(TAG, "Error loading ITMs: ${e.message}", e)
                _fetchState.emit(FetchState.Error(e.message ?: "Error desconocido"))
            }
        }
    }

    /**
     * Actualiza el query de búsqueda
     * @param query Texto de búsqueda
     */
    fun setSearchQuery(query: String) {
        _searchQuery.value = query
    }

    /**
     * Establece el ITM seleccionado temporalmente
     * @param id ID del ITM seleccionado
     */
    fun setTempSelectedITMId(id: Int?) {
        _tempSelectedITMId.value = id
    }

    /**
     * Limpia la selección temporal
     */
    fun clearTempSelection() {
        _tempSelectedITMId.value = null
    }

    /**
     * Limpia el query de búsqueda
     */
    fun clearSearch() {
        _searchQuery.value = ""
    }

    /**
     * Obtiene un ITM por su ID
     * @param id ID del ITM
     * @return ITMExtended o null si no se encuentra
     */
    fun getITMById(id: Int): ITMExtended? {
        return _itms.value.find { it.id == id }
    }

    companion object {
        private const val TAG = "ITMSelectionVM"
    }
}
