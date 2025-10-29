package com.fmsac.cotizadormodasa.presentation.viewmodels.sellers

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.fmsac.cotizadormodasa.core.seller.Seller
import com.fmsac.cotizadormodasa.data.mappers.sellers.SellerMapper
import com.fmsac.cotizadormodasa.data.network.ApiService
import com.fmsac.cotizadormodasa.data.network.RetrofitInstance
import com.fmsac.cotizadormodasa.data.repositories.SellersRepository
import kotlinx.coroutines.Deferred
import kotlinx.coroutines.async
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class SellerViewModel(application: Application) : AndroidViewModel(application) {
    private val ctx = application

    private val API: Deferred<ApiService> = viewModelScope.async { RetrofitInstance.API(ctx) }

    private val repository = viewModelScope.async {
        SellersRepository(
            mapper = SellerMapper(),
            api = API.await(),
            ctx = ctx
        )
    }

    private val _sellers = MutableStateFlow(emptyList<Seller>())
    val sellers = _sellers.asStateFlow()

    fun getAllSellers() {
        viewModelScope.launch {
            val sellers = repository.await().getAll()
            _sellers.value = sellers
        }
    }
}