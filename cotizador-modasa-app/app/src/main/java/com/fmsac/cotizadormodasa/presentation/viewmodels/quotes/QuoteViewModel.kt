package com.fmsac.cotizadormodasa.presentation.viewmodels.quotes

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.fmsac.cotizadormodasa.core.formatDate
import com.fmsac.cotizadormodasa.core.quotes.AllQuote
import com.fmsac.cotizadormodasa.data.mappers.quotes.QuoteGeneratorSetMapper
import com.fmsac.cotizadormodasa.data.markets
import com.fmsac.cotizadormodasa.data.mockup.currenciesMockup
import com.fmsac.cotizadormodasa.data.network.ApiService
import com.fmsac.cotizadormodasa.data.network.RetrofitInstance
import com.fmsac.cotizadormodasa.data.quoteTypes
import com.fmsac.cotizadormodasa.data.repositories.QuoteRepository
import com.fmsac.cotizadormodasa.presentation.state.FetchState
import com.fmsac.cotizadormodasa.presentation.state.ui.form.mappers.CreateQuoteFormMapper
import kotlinx.coroutines.Deferred
import kotlinx.coroutines.async
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.TimeZone

class QuoteViewModel(application: Application) : AndroidViewModel(application) {

    private val ctx = application

    private val API: Deferred<ApiService> = viewModelScope.async { RetrofitInstance.API(ctx) }

    private val repository = viewModelScope.async {
        QuoteRepository(
            mapper = QuoteGeneratorSetMapper(),
            api = API.await(),
            ctx = ctx
        )
    }

    private val _fetchState = MutableSharedFlow<FetchState>()
    val fetchState = _fetchState.asSharedFlow()

    var postState = MutableSharedFlow<FetchState>()
        private set

    val dateFormat = SimpleDateFormat("dd/MM/yyyy", Locale.getDefault()).apply {
        timeZone = TimeZone.getTimeZone("America/Lima")
    }

    private val _quoteHeaderMap = MutableStateFlow(
        mapOf(
            "cliente_id" to "",
            "ruc_dni" to "",
            "ejecutivo_id" to "",
            "fecha" to dateFormat.format(Date(System.currentTimeMillis())),
            "validez_oferta" to "",
            "proyecto" to "",
            "direccion" to "",
            "contacto" to "",
            "telefono" to "",
            "email" to "",
            "envio" to "",
            "instalacion" to "",
            "mercado" to markets[1]!!,
            "moneda_id" to currenciesMockup[2]!!,
            "condicion_comercial_id" to "",
            "canal_distribucion_id" to "",
            "incoterm_id" to "",
            "cotizador_tipo" to quoteTypes.map { it.value }.first()
        )
    )
    val quoteHeaderMap = _quoteHeaderMap.asStateFlow()

    private val _quotes = MutableStateFlow<List<AllQuote>>(emptyList())
    val quotes = _quotes.asStateFlow()

    private val _selectedQuoteTypeFilter = MutableStateFlow<String?>(null)
    val selectedQuoteTypeFilter = _selectedQuoteTypeFilter.asStateFlow()

    val filteredQuotes: StateFlow<List<AllQuote>> = combine(
        quotes,
        _selectedQuoteTypeFilter
    ) { quotesList, filter ->
        if (filter == null) {
            quotesList
        } else {
            quotesList.filter { it.type == filter }
        }
    }.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = emptyList()
    )

    val quotesDataTable: StateFlow<List<List<String>>> = filteredQuotes
        .map { quotesList ->
            quotesList.map { quote ->
                listOf(
                    quote.code,
                    formatDate(quote.date),
                    quote.type,
                    quote.customerName,
                    "US$ ${quote.total}",
                    quote.status
                )
            }
        }
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(0),
            initialValue = emptyList()
        )


    fun setQuoteHeaderMap(quoteHeaderMap: Map<String, String>) {
        _quoteHeaderMap.value = quoteHeaderMap
    }

    fun createQuote(quoteHeaderMap: Map<String, String>) {
        val createQuoteFormMapper = CreateQuoteFormMapper()

        val quote = createQuoteFormMapper.toModel(quoteHeaderMap)

        viewModelScope.launch {
            try {
                _fetchState.emit(FetchState.Loading)

                val response = repository.await().save(quote)

                postState.emit(FetchState.Success)
            } catch (t: Throwable) {
                postState.emit(
                    FetchState.Error(
                        t.message ?: "Error desconocido al crear la cotización"
                    )
                )
            }
        }
    }

    fun getAllQuotes() {
        viewModelScope.launch {

            try {
                _fetchState.emit(FetchState.Loading)

                val response = repository.await().getAll()

                _quotes.value = response

                _fetchState.emit(FetchState.Success)
            } catch (t: Throwable) {
                _fetchState.emit(
                    FetchState.Error(
                        t.message ?: "Error desconocido al obtener las cotizaciones"
                    )
                )
            }
        }
    }

    fun setQuoteTypeFilter(type: String?) {
        _selectedQuoteTypeFilter.value = type
    }
}