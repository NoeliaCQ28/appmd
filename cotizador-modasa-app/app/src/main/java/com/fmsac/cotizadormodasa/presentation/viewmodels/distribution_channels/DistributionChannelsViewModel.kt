package com.fmsac.cotizadormodasa.presentation.viewmodels.distribution_channels

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.fmsac.cotizadormodasa.core.distribution_channels.DistributionChannel
import com.fmsac.cotizadormodasa.data.mappers.distribution_channels.DistributionChannelMapper
import com.fmsac.cotizadormodasa.data.network.ApiService
import com.fmsac.cotizadormodasa.data.network.RetrofitInstance
import com.fmsac.cotizadormodasa.data.repositories.DistributionChannelRepository
import com.fmsac.cotizadormodasa.presentation.state.FetchState
import kotlinx.coroutines.Deferred
import kotlinx.coroutines.async
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.launch

class DistributionChannelsViewModel(application: Application) : AndroidViewModel(application) {

    private val ctx = application

    private val API: Deferred<ApiService> = viewModelScope.async { RetrofitInstance.API(ctx) }

    private val repository = viewModelScope.async {
        DistributionChannelRepository(
            mapper = DistributionChannelMapper(),
            api = API.await(),
            ctx = ctx
        )
    }

    private val _fetchState = MutableSharedFlow<FetchState>()
    val fetchState = _fetchState.asSharedFlow()

    var distributionChannels = MutableStateFlow<List<DistributionChannel>>(emptyList())
        private set

    fun getAllDistributionChannels() {
        viewModelScope.launch {
            try {
                _fetchState.emit(FetchState.Loading)

                val response = repository.await().getAll()

                distributionChannels.value = response

                _fetchState.emit(FetchState.Success)
            } catch (t: Throwable) {
                _fetchState.emit(
                    FetchState.Error(
                        t.message ?: "Error desconocido al obtener los canales de distribución"
                    )
                )
            }
        }
    }
}