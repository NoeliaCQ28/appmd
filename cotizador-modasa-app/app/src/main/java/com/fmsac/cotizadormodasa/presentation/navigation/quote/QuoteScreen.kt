package com.fmsac.cotizadormodasa.presentation.navigation.quote

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavHostController
import androidx.navigation.compose.rememberNavController
import com.fmsac.cotizadormodasa.presentation.components.Button
import com.fmsac.cotizadormodasa.presentation.components.Filter
import com.fmsac.cotizadormodasa.presentation.components.Search
import com.fmsac.cotizadormodasa.presentation.components.SingleChoiceSegmentedButton
import com.fmsac.cotizadormodasa.presentation.components.Table
import com.fmsac.cotizadormodasa.presentation.navigation.Screen
import com.fmsac.cotizadormodasa.presentation.navigation.quote.create.CreateQuote
import com.fmsac.cotizadormodasa.presentation.state.FetchState
import com.fmsac.cotizadormodasa.presentation.theme.ui.CotizadorModasaTheme
import com.fmsac.cotizadormodasa.presentation.viewmodels.quotes.QuoteViewModel

@Composable
fun QuoteScreen(
    modifier: Modifier = Modifier,
    controller: NavHostController,
    quoteViewModel: QuoteViewModel
) = Screen(controller = controller, modifier = modifier, route = "Cotizaciones", onRefresh = {
    quoteViewModel.getAllQuotes()
}) { snackbarHostState ->

    var searchQuery by remember { mutableStateOf("") }
    var selectedFilterIndex by remember { mutableStateOf(0) }

    val quotes by quoteViewModel.quotes.collectAsStateWithLifecycle()
    val quotesDataTable by quoteViewModel.quotesDataTable.collectAsStateWithLifecycle()

    // Mapeo de índice a tipo de cotización
    val quoteTypeMapping = mapOf(
        0 to null,  // "Todo"
        1 to "Grupos electrógenos",  // "G.electrogenos"
        2 to "Cables",
        3 to "Celdas",
        4 to "Transformadores"
    )

    fun performSearch() {

        println("Buscar: $searchQuery")
    }

    val headers = listOf("Nro", "Fecha", "Producto", "Cliente", "Importe", "Estado")

    LaunchedEffect(Unit) {
        if (quotes.isEmpty()) {
            quoteViewModel.getAllQuotes()
        }
    }

    LaunchedEffect(Unit) {

        quoteViewModel.fetchState.collect { fetchState ->
            if (fetchState is FetchState.Success) {
                snackbarHostState.showSnackbar("Cotizaciones consultadas con éxito")
            }

            if (fetchState is FetchState.Error) {
                snackbarHostState.showSnackbar(fetchState.error)
            }
        }
    }

    LaunchedEffect(Unit) {

        quoteViewModel.postState.collect { postState ->
            if (postState is FetchState.Success) {
                snackbarHostState.showSnackbar("Cotizacion creada con éxito")
            }

            if (postState is FetchState.Error) {
                snackbarHostState.showSnackbar(postState.error)
            }
        }
    }

    SingleChoiceSegmentedButton(
        options = listOf(
            "Todo",
            "G.electrogenos",
            "Cables",
            "Celdas",
            "Transformadores"
        ),
        selectedIndex = selectedFilterIndex,
        onSelectionChanged = { index ->
            selectedFilterIndex = index
            quoteViewModel.setQuoteTypeFilter(quoteTypeMapping[index])
        }
    )

    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
        Filter()

        Spacer(modifier = Modifier.width(14.dp))

        Button(
            modifier = Modifier.weight(1f),
            onClick = {
                controller.navigate(CreateQuote)
            },
            fontSize = 16.sp,
            text = "AGREGAR"
        )
    }

    Search(
        query = searchQuery,
        onQueryChanged = { searchQuery = it },
        onSearch = { performSearch() }
    )

    Table(headers = headers, data = quotesDataTable, requireStatus = true)

}

@Preview
@Composable
private fun QuoteScreenPreview() {

    val controller = rememberNavController()
    val quoteViewModel = viewModel<QuoteViewModel>()

    CotizadorModasaTheme {

        QuoteScreen(modifier = Modifier, controller = controller, quoteViewModel = quoteViewModel)
    }
}