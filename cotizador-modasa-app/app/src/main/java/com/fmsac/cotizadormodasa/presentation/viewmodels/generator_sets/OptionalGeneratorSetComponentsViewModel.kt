package com.fmsac.cotizadormodasa.presentation.viewmodels.generator_sets

import android.app.Application
import android.os.Parcelable
import android.util.Log
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.fmsac.cotizadormodasa.core.generator_sets.OptionalGeneratorSetComponent
import com.fmsac.cotizadormodasa.data.mappers.generator_sets.OptionalGeneratorSetComponentsMapper
import com.fmsac.cotizadormodasa.data.network.ApiService
import com.fmsac.cotizadormodasa.data.network.RetrofitInstance
import com.fmsac.cotizadormodasa.data.repositories.OptionalGeneratorSetComponentRepository
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
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import kotlinx.parcelize.Parcelize

class OptionalGeneratorSetComponentsViewModel(
    application: Application
) : AndroidViewModel(application) {

    private val ctx = application

    private val API: Deferred<ApiService> = viewModelScope.async { RetrofitInstance.API(ctx) }

    private val repository = viewModelScope.async {
        OptionalGeneratorSetComponentRepository(
            mapper = OptionalGeneratorSetComponentsMapper(),
            api = API.await(),
            ctx = ctx
        )
    }

    // Estado de componentes opcionales cargados
    private val _allComponents = MutableStateFlow<List<OptionalGeneratorSetComponent>>(emptyList())
    val allComponents: StateFlow<List<OptionalGeneratorSetComponent>> = _allComponents.asStateFlow()

    var optionalGeneratorSetComponentsGroupByType =
        MutableStateFlow<Map<String?, List<OptionalGeneratorSetComponent>>>(emptyMap())
        private set

    private val _fetchState = MutableSharedFlow<FetchState>()
    val fetchState: SharedFlow<FetchState> = _fetchState.asSharedFlow()

    // Estado de búsqueda
    private val _searchQuery = MutableStateFlow("")
    val searchQuery: StateFlow<String> = _searchQuery.asStateFlow()

    // Componentes filtrados por búsqueda
    val filteredComponents: StateFlow<List<OptionalGeneratorSetComponent>> = combine(
        _allComponents,
        _searchQuery
    ) { components, query ->
        if (query.isBlank()) {
            components
        } else {
            components.filter { comp ->
                comp.name?.contains(query, ignoreCase = true) == true ||
                        comp.code?.contains(query, ignoreCase = true) == true ||
                        comp.description?.contains(query, ignoreCase = true) == true
            }
        }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    // Componentes agrupados por categoría Y filtrados
    val filteredComponentsByCategory: StateFlow<Map<String, List<OptionalGeneratorSetComponent>>> =
        filteredComponents.map { components ->
            components.groupBy { it.type ?: "Sin categoría" }
        }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyMap())

    // Selecciones temporales (antes de aplicar)
    private val _tempSelectedComponentIds = MutableStateFlow<Set<Int>>(emptySet())
    val tempSelectedComponentIds: StateFlow<Set<Int>> = _tempSelectedComponentIds.asStateFlow()

    @Parcelize
    data class ToolItem(
        val id: Int,
        val name: String,
        val price: Float,
        var isSelected: Boolean = false
    ) : Parcelable

    var componentsByCategory: MutableStateFlow<Map<String?, List<ToolItem>>> =
        MutableStateFlow(emptyMap())
        private set


    fun setComponentsByCategory(newComponentsByCategory: Map<String?, List<ToolItem>>) {
        componentsByCategory.value = newComponentsByCategory
    }

    /**
     * Carga todos los componentes opcionales disponibles
     * Para uso en el modal de accesorios
     */
    fun loadAllComponents() {
        viewModelScope.launch {
            try {
                Log.d(TAG, "Loading all optional components")
                _fetchState.emit(FetchState.Loading)

                val components = repository.await().getAll()
                _allComponents.value = components

                val groupedComponentsByType = components
                    .sortedBy { it.name }
                    .groupBy { it.type }

                optionalGeneratorSetComponentsGroupByType.value = groupedComponentsByType

                Log.d(TAG, "Loaded ${components.size} components in ${groupedComponentsByType.size} categories")
                _fetchState.emit(FetchState.Success)
            } catch (e: Exception) {
                Log.e(TAG, "Error loading components: ${e.message}", e)
                _fetchState.emit(
                    FetchState.Error(
                        e.message ?: "Error desconocido al obtener los componentes opcionales"
                    )
                )
            }
        }
    }

    fun getOptionalComponents(modelName: String) {
        viewModelScope.launch {
            try {
                _fetchState.emit(FetchState.Loading)

                val response = repository.await().getAllByModelName(modelName)

                val groupedComponentsByType = response
                    .sortedBy { it.name }
                    .groupBy { it.type }

                optionalGeneratorSetComponentsGroupByType.value = groupedComponentsByType

                setComponentsByCategory(groupedComponentsByType.map { entries ->
                    entries.key to entries.value.map {
                        ToolItem(
                            id = it.id!!,
                            name = it.name ?: "",
                            price = (it.price ?: "0").toFloat(),
                            isSelected = false
                        )
                    }
                }.toMap())
            } catch (e: retrofit2.HttpException) {
                _fetchState.emit(FetchState.Error(e.message()))
            } catch (e: Exception) {
                _fetchState.emit(
                    FetchState.Error(
                        e.message ?: "Error desconocido al obtener los componentes opcionales"
                    )
                )
            }
        }
    }

    /**
     * Actualiza el query de búsqueda
     */
    fun setSearchQuery(query: String) {
        _searchQuery.value = query
    }

    /**
     * Toggle selección de un componente (para modal de accesorios)
     */
    fun toggleTempComponentSelection(componentId: Int) {
        val current = _tempSelectedComponentIds.value
        _tempSelectedComponentIds.value = if (componentId in current) {
            current - componentId
        } else {
            current + componentId
        }
    }

    /**
     * Establece las selecciones temporales
     */
    fun setTempSelections(ids: Set<Int>) {
        _tempSelectedComponentIds.value = ids
    }

    /**
     * Limpia las selecciones temporales
     */
    fun clearTempSelections() {
        _tempSelectedComponentIds.value = emptySet()
    }

    /**
     * Limpia el query de búsqueda
     */
    fun clearSearch() {
        _searchQuery.value = ""
    }

    /**
     * Obtiene componentes por sus IDs
     * @param ids Set de IDs de componentes
     * @return Lista de componentes completos
     */
    fun getComponentsByIds(ids: Set<Int>): List<OptionalGeneratorSetComponent> {
        return _allComponents.value.filter { comp ->
            comp.id?.let { it in ids } ?: false
        }
    }

    companion object {
        private const val TAG = "OptionalComponentsVM"
    }
}