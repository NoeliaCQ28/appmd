package com.fmsac.cotizadormodasa.presentation.navigation.customers

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
import com.fmsac.cotizadormodasa.presentation.components.ButtonVariant
import com.fmsac.cotizadormodasa.presentation.components.Filter
import com.fmsac.cotizadormodasa.presentation.components.Search
import com.fmsac.cotizadormodasa.presentation.components.SingleChoiceSegmentedButton
import com.fmsac.cotizadormodasa.presentation.components.Table
import com.fmsac.cotizadormodasa.presentation.navigation.Screen
import com.fmsac.cotizadormodasa.presentation.navigation.customers.create.CreateCustomer
import com.fmsac.cotizadormodasa.presentation.state.FetchState
import com.fmsac.cotizadormodasa.presentation.theme.ui.CotizadorModasaTheme
import com.fmsac.cotizadormodasa.presentation.viewmodels.customers.CustomerViewModel

@Composable
fun CustomerScreen(
    modifier: Modifier = Modifier,
    controller: NavHostController,
    customerViewModel: CustomerViewModel
) = Screen(
    controller = controller,
    modifier = modifier,
    route = "Clientes/Prospectos",
    onRefresh = {
        customerViewModel.getAllCustomers()
    }) { snackbarHostState ->

    var searchQuery by remember { mutableStateOf("") }

    val customers by customerViewModel.customers.collectAsStateWithLifecycle()
    val customersDataTable by customerViewModel.customersDataTable.collectAsStateWithLifecycle()

    LaunchedEffect(Unit) {
        if (customers.isEmpty()) {
            customerViewModel.getAllCustomers()
        }
    }

    LaunchedEffect(Unit) {
        customerViewModel.fetchState.collect { fetchState ->
            if (fetchState is FetchState.Error) {
                snackbarHostState.showSnackbar(fetchState.error)
            }

            if (fetchState is FetchState.Success) {
                snackbarHostState.showSnackbar("Clientes consultados con éxito")
            }
        }
    }

    fun performSearch() {

        println("Buscar: $searchQuery")
    }

    val headers = listOf("Codigo", "RUC/DNI", "CLIENTE/PROSPECTO", "PROCEDENCIA", "ID CLIENGO")

    SingleChoiceSegmentedButton(options = listOf("Todo"))

    Filter()

    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
        Button(
            modifier = Modifier.weight(1f),
            onClick = {},
            text = "SINCRONIZAR CON SAP",
            fontSize = 12.sp,
            variant = ButtonVariant.TERTIARY
        )

        Spacer(modifier = Modifier.width(14.dp))

        Button(
            modifier = Modifier.weight(1f),
            onClick = {
                controller.navigate(CreateCustomer)
            },
            fontSize = 14.sp,
            text = "AGREGAR"
        )
    }

    Search(
        query = searchQuery,
        onQueryChanged = { searchQuery = it },
        onSearch = { performSearch() }
    )

    Table(headers = headers, data = customersDataTable)
}

@Preview
@Composable
private fun CustomerScreenPreview() {

    val controller = rememberNavController()
    val customerViewModel = viewModel<CustomerViewModel>()

    CotizadorModasaTheme {

        CustomerScreen(
            modifier = Modifier,
            controller = controller,
            customerViewModel = customerViewModel
        )
    }
}