package com.fmsac.cotizadormodasa.presentation.viewmodels.commercial_conditions

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.fmsac.cotizadormodasa.core.commercial_conditions.CommercialCondition
import com.fmsac.cotizadormodasa.data.mappers.commercial_conditions.CommercialConditionMapper
import com.fmsac.cotizadormodasa.data.network.ApiService
import com.fmsac.cotizadormodasa.data.network.RetrofitInstance
import com.fmsac.cotizadormodasa.data.repositories.CommercialConditionRepository
import kotlinx.coroutines.Deferred
import kotlinx.coroutines.async
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.launch

class CommercialConditionViewModel(application: Application) : AndroidViewModel(application) {

    private val ctx = application

    private val API: Deferred<ApiService> = viewModelScope.async { RetrofitInstance.API(ctx) }

    private val repository = viewModelScope.async {
        CommercialConditionRepository(
            mapper = CommercialConditionMapper(),
            api = API.await(),
            ctx = ctx
        )
    }

    private val _commercialConditions = MutableStateFlow<List<CommercialCondition>>(emptyList())
    val commercialConditions = _commercialConditions

    fun getAllCommercialConditions() {
        viewModelScope.launch {
            _commercialConditions.value = repository.await().getAll()
        }
    }
}