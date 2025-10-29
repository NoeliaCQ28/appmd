package com.fmsac.cotizadormodasa.presentation.viewmodels.customers

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.fmsac.cotizadormodasa.core.customers.Customer
import com.fmsac.cotizadormodasa.core.customers.CustomerContact
import com.fmsac.cotizadormodasa.data.mappers.customers.CustomerContactMapper
import com.fmsac.cotizadormodasa.data.mappers.customers.CustomerMapper
import com.fmsac.cotizadormodasa.data.network.ApiService
import com.fmsac.cotizadormodasa.data.network.RetrofitInstance
import com.fmsac.cotizadormodasa.data.repositories.CustomerRepository
import com.fmsac.cotizadormodasa.presentation.state.FetchState
import kotlinx.coroutines.Deferred
import kotlinx.coroutines.async
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

class CustomerViewModel(application: Application) : AndroidViewModel(application) {

    private val ctx = application

    private val API: Deferred<ApiService> = viewModelScope.async { RetrofitInstance.API(ctx) }

    private val repository = viewModelScope.async {
        CustomerRepository(
            mapper = CustomerMapper(),
            contactsMapper = CustomerContactMapper(),
            api = API.await(),
            ctx = ctx
        )
    }

    var fetchState = MutableSharedFlow<FetchState>()
        private set

    private val _customers = MutableStateFlow<List<Customer>>(emptyList())
    val customers = _customers.asStateFlow()

    private val _contactsOfCurrentCustomer = MutableStateFlow<List<CustomerContact>>(emptyList())
    val contactsOfCurrentCustomer = _contactsOfCurrentCustomer.asStateFlow()

    val customersDataTable: StateFlow<List<List<String>>> = customers
        .map { customerList ->
            customerList.map { customer ->
                listOf(
                    customer.clientCode ?: "-",
                    customer.taxId ?: "-",
                    customer.clientName,
                    customer.address ?: "-",
                    customer.cliengoId ?: "-"
                )
            }
        }
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(0),
            initialValue = emptyList()
        )

    fun getAllCustomers() {
        viewModelScope.launch {
            try {
                fetchState.emit(FetchState.Loading)

                val response = repository.await().getAll()

                _customers.value = response

                fetchState.emit(FetchState.Success)
            } catch (t: Throwable) {
                fetchState.emit(
                    FetchState.Error(
                        t.message ?: "Error desconocido al obtener los clientes"
                    )
                )
            }
        }
    }

    fun getAllContactsByCustomerID(customerId: Int) {
        viewModelScope.launch {
            try {

                val response = repository.await().getAllContactsByCustomerId(customerId)
                _contactsOfCurrentCustomer.value = response

            } catch (t: Throwable) {
                fetchState.emit(
                    FetchState.Error(
                        t.message ?: "Error desconocido al obtener los contactos del cliente"
                    )
                )
            }
        }
    }
}