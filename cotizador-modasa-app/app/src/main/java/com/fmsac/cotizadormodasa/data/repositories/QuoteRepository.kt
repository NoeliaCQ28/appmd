package com.fmsac.cotizadormodasa.data.repositories

import android.content.Context
import com.fmsac.cotizadormodasa.core.quotes.AllQuote
import com.fmsac.cotizadormodasa.core.quotes.CreateQuoteGeneratorSet
import com.fmsac.cotizadormodasa.data.mappers.quotes.QuoteGeneratorSetMapper
import com.fmsac.cotizadormodasa.data.network.ApiService
import com.fmsac.cotizadormodasa.data.repositories.common.Repository

class QuoteRepository(
    private val mapper: QuoteGeneratorSetMapper,
    private val api: ApiService,
    private val ctx: Context
) : Repository<AllQuote> {

    override suspend fun getAll(): List<AllQuote> {
        val response = api.getAllQuotes()

        if (!response.success) {
            throw Exception("Error al obtener las cotizaciones")
        }

        if (response.data.isNullOrEmpty()) {
            throw Exception("No existen cotizaciones")
        }

        return response.data.map { quotesResponse ->
            mapper.fromDTO(quotesResponse)
        }
    }

    override suspend fun delete(data: AllQuote) {
        TODO("Not yet implemented")
    }

    override suspend fun update(data: AllQuote) {
        TODO("Not yet implemented")
    }

    suspend fun save(data: CreateQuoteGeneratorSet): Int {
        val quoteMapped = mapper.toDTO(data)

        val response = api.createQuote(quoteMapped)

        if (!response.success) {
            throw Exception("Error al crear la cotización")
        }

        if (response.data == null) {
            throw Exception("Error al crear la cotización")
        }

        return response.data.quoteId
    }
}