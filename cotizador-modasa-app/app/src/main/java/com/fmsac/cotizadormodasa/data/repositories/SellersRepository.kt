package com.fmsac.cotizadormodasa.data.repositories

import android.content.Context
import com.fmsac.cotizadormodasa.core.seller.Seller
import com.fmsac.cotizadormodasa.data.mappers.sellers.SellerMapper
import com.fmsac.cotizadormodasa.data.network.ApiService
import com.fmsac.cotizadormodasa.data.repositories.common.Repository

class SellersRepository(
    private val mapper: SellerMapper,
    private val api: ApiService,
    private val ctx: Context
) : Repository<Seller> {

    override suspend fun getAll(): List<Seller> {
        val response = api.getAllSellers()

        if (!response.success) {
            throw Exception("Error al obtener los ejecutivos de ventas")
        }

        return response.data?.mapNotNull { customerResponse ->
            try {
                mapper.fromDTO(customerResponse)
            } catch (e: Exception) {
                // Log del error pero continúa procesando otros vendedores
                null
            }
        }?.filter { seller ->
            // Solo incluir vendedores con información válida
            !seller.executiveName.isNullOrBlank()
        } ?: emptyList()
    }

    override suspend fun delete(data: Seller) {
        TODO("Not yet implemented")
    }

    override suspend fun update(data: Seller) {
        TODO("Not yet implemented")
    }

    suspend fun save(data: Seller) {
        TODO("Not yet implemented")
    }
}