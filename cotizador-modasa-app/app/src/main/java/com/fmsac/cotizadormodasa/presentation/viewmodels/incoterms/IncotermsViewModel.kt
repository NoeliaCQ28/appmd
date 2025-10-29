package com.fmsac.cotizadormodasa.presentation.viewmodels.incoterms

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.fmsac.cotizadormodasa.core.incoterms.Incoterm
import com.fmsac.cotizadormodasa.data.mappers.incoterms.IncotermMapper
import com.fmsac.cotizadormodasa.data.network.ApiService
import com.fmsac.cotizadormodasa.data.network.RetrofitInstance
import com.fmsac.cotizadormodasa.data.repositories.IncotermRepository
import com.fmsac.cotizadormodasa.presentation.state.FetchState
import kotlinx.coroutines.Deferred
import kotlinx.coroutines.async
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.launch

class IncotermsViewModel(application: Application) : AndroidViewModel(application) {

    private val ctx = application

    private val API: Deferred<ApiService> = viewModelScope.async { RetrofitInstance.API(ctx) }

    private val repository = viewModelScope.async {
        IncotermRepository(
            mapper = IncotermMapper(),
            api = API.await(),
            ctx = ctx
        )
    }

    private val _fetchState = MutableSharedFlow<FetchState>()
    val fetchState = _fetchState.asSharedFlow()

    var incoterms = MutableStateFlow<List<Incoterm>>(emptyList())
        private set

    fun getAllIncoterms() {
        viewModelScope.launch {
            try {
                _fetchState.emit(FetchState.Loading)

                val response = repository.await().getAll()

                incoterms.value = response

                _fetchState.emit(FetchState.Success)
            } catch (t: Throwable) {
                _fetchState.emit(
                    FetchState.Error(
                        t.message ?: "Error desconocido al obtener los Incoterms"
                    )
                )
            }
        }
    }
}