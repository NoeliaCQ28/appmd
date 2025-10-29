package com.fmsac.cotizadormodasa.presentation.viewmodels.generator_sets

import android.app.Application
import android.util.Log
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.fmsac.cotizadormodasa.core.generator_sets.AlternatorExtended
import com.fmsac.cotizadormodasa.data.mappers.generator_sets.AlternatorExtendedMapper
import com.fmsac.cotizadormodasa.data.network.ApiService
import com.fmsac.cotizadormodasa.data.network.RetrofitInstance
import com.fmsac.cotizadormodasa.data.repositories.AlternatorExtendedRepository
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
 * ViewModel para gestionar la selección de alternadores extendidos
 * Maneja el estado de la lista de alternadores, búsqueda y selección temporal
 */
class AlternatorSelectionViewModel(application: Application) : AndroidViewModel(application) {

    private val ctx = application

    private val API: Deferred<ApiService> = viewModelScope.async {
        RetrofitInstance.API(ctx)
    }

    private val mapper = AlternatorExtendedMapper()

    private val repository = viewModelScope.async {
        AlternatorExtendedRepository(
            mapper = mapper,
            api = API.await(),
            ctx = ctx
        )
    }

    // Estado de alternadores cargados
    private val _alternators = MutableStateFlow<List<AlternatorExtended>>(emptyList())
    val alternators: StateFlow<List<AlternatorExtended>> = _alternators.asStateFlow()

    // Estado de búsqueda
    private val _searchQuery = MutableStateFlow("")
    val searchQuery: StateFlow<String> = _searchQuery.asStateFlow()

    // Alternadores filtrados por búsqueda
    val filteredAlternators: StateFlow<List<AlternatorExtended>> = combine(
        _alternators,
        _searchQuery
    ) { alts, query ->
        if (query.isBlank()) {
            alts
        } else {
            alts.filter { alt ->
                alt.name.contains(query, ignoreCase = true) ||
                        alt.brand.contains(query, ignoreCase = true) ||
                        alt.family?.contains(query, ignoreCase = true) == true
            }
        }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    // Estado de carga/error
    private val _fetchState = MutableSharedFlow<FetchState>()
    val fetchState: SharedFlow<FetchState> = _fetchState.asSharedFlow()

    // ID del alternador seleccionado temporalmente en el modal
    private val _tempSelectedAlternatorId = MutableStateFlow<Int?>(null)
    val tempSelectedAlternatorId: StateFlow<Int?> = _tempSelectedAlternatorId.asStateFlow()

    /**
     * Carga los alternadores disponibles para una integradora
     * @param integradoraId ID de la integradora
     */
    fun loadAlternators(integradoraId: Int) {
        viewModelScope.launch {
            try {
                Log.d(TAG, "Loading alternators for integradora: $integradoraId")
                _fetchState.emit(FetchState.Loading)

                val alts = repository.await().getAllByIntegradora(integradoraId)
                _alternators.value = alts

                Log.d(TAG, "Loaded ${alts.size} alternators successfully")
                _fetchState.emit(FetchState.Success)
            } catch (e: Exception) {
                Log.e(TAG, "Error loading alternators: ${e.message}", e)
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
     * Establece el alternador seleccionado temporalmente
     * @param id ID del alternador seleccionado
     */
    fun setTempSelectedAlternatorId(id: Int?) {
        _tempSelectedAlternatorId.value = id
    }

    /**
     * Limpia la selección temporal
     */
    fun clearTempSelection() {
        _tempSelectedAlternatorId.value = null
    }

    /**
     * Limpia el query de búsqueda
     */
    fun clearSearch() {
        _searchQuery.value = ""
    }

    /**
     * Obtiene un alternador por su ID
     * @param id ID del alternador
     * @return AlternatorExtended o null si no se encuentra
     */
    fun getAlternatorById(id: Int): AlternatorExtended? {
        return _alternators.value.find { it.id == id }
    }

    companion object {
        private const val TAG = "AlternatorSelectionVM"
    }
}
