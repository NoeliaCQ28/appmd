package com.fmsac.cotizadormodasa.data.repositories

import android.content.Context
import com.fmsac.cotizadormodasa.core.customers.Customer
import com.fmsac.cotizadormodasa.core.customers.CustomerContact
import com.fmsac.cotizadormodasa.data.mappers.customers.CustomerContactMapper
import com.fmsac.cotizadormodasa.data.mappers.customers.CustomerMapper
import com.fmsac.cotizadormodasa.data.network.ApiService
import com.fmsac.cotizadormodasa.data.repositories.common.Repository

class CustomerRepository(
    private val mapper: CustomerMapper,
    private val contactsMapper: CustomerContactMapper,
    private val api: ApiService,
    private val ctx: Context
) : Repository<Customer> {
    override suspend fun getAll(): List<Customer> {
        val response = api.getAllCustomers()

        if (!response.success) {
            throw Exception("Error al obtener los clientes")
        }

        return response.data?.mapNotNull { customerResponse ->
            try {
                mapper.fromDTO(customerResponse)
            } catch (e: Exception) {
                android.util.Log.w("CustomerRepository", "Failed to map customer: ${e.message}", e)
                null
            }        }?.filter { customer ->
            // Solo incluir clientes con información válida
            !customer.clientName.isNullOrBlank()
        } ?: emptyList()
    }

    suspend fun getAllContactsByCustomerId(customerId: Int): List<CustomerContact> {
        val response = api.getContactsByCustomerId(customerId)

        if (!response.success) {
            throw Exception("Error al obtener los contactos del cliente")
        }

        return response.data?.map { contactsResponse ->
            contactsMapper.fromDTO(contactsResponse)
        } ?: emptyList()
    }

    override suspend fun delete(data: Customer) {
        TODO("Not yet implemented")
    }

    override suspend fun update(data: Customer) {
        TODO("Not yet implemented")
    }

    suspend fun save(data: Customer) {
        TODO("Not yet implemented")
    }
}