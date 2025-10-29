package com.fmsac.cotizadormodasa.presentation.navigation.quote.create

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.width
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavHostController
import androidx.navigation.compose.rememberNavController
import com.fmsac.cotizadormodasa.core.customers.Customer
import com.fmsac.cotizadormodasa.core.customers.CustomerContact
import com.fmsac.cotizadormodasa.data.markets
import com.fmsac.cotizadormodasa.data.mockup.currenciesMockup
import com.fmsac.cotizadormodasa.data.quoteTypes
import com.fmsac.cotizadormodasa.presentation.components.Button
import com.fmsac.cotizadormodasa.presentation.components.ButtonVariant
import com.fmsac.cotizadormodasa.presentation.components.SummaryCard
import com.fmsac.cotizadormodasa.presentation.components.SummaryItem
import com.fmsac.cotizadormodasa.presentation.components.Table
import com.fmsac.cotizadormodasa.presentation.components.inputs.DateInput
import com.fmsac.cotizadormodasa.presentation.components.inputs.NumberInput
import com.fmsac.cotizadormodasa.presentation.components.inputs.SelectInput
import com.fmsac.cotizadormodasa.presentation.components.inputs.SwitchInput
import com.fmsac.cotizadormodasa.presentation.components.inputs.TextInput
import com.fmsac.cotizadormodasa.presentation.navigation.Screen
import com.fmsac.cotizadormodasa.presentation.navigation.quote.create.attach_details.AttachDetailsToQuote
import com.fmsac.cotizadormodasa.presentation.state.ui.form.rememberMapFormState
import com.fmsac.cotizadormodasa.presentation.theme.ui.CotizadorModasaTheme
import com.fmsac.cotizadormodasa.presentation.viewmodels.commercial_conditions.CommercialConditionViewModel
import com.fmsac.cotizadormodasa.presentation.viewmodels.customers.CustomerViewModel
import com.fmsac.cotizadormodasa.presentation.viewmodels.distribution_channels.DistributionChannelsViewModel
import com.fmsac.cotizadormodasa.presentation.viewmodels.generator_sets.GeneratorSetViewModel
import com.fmsac.cotizadormodasa.presentation.viewmodels.incoterms.IncotermsViewModel
import com.fmsac.cotizadormodasa.presentation.viewmodels.quotes.QuoteViewModel
import com.fmsac.cotizadormodasa.presentation.viewmodels.sellers.SellerViewModel
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.Locale
import java.util.TimeZone

@Composable
fun CreateQuoteScreen(
    modifier: Modifier = Modifier,
    controller: NavHostController,
    quoteViewModel: QuoteViewModel,
    customerViewModel: CustomerViewModel,
    generatorSetViewModel: GeneratorSetViewModel,
    sellerViewModel: SellerViewModel,
    commercialConditionViewModel: CommercialConditionViewModel,
    distributionChannelsViewModel: DistributionChannelsViewModel,
    incotermsViewModel: IncotermsViewModel
) = Screen(
    controller = controller,
    modifier = modifier,
    route = "Cotizaciones"
) { snackbarHostState ->

    val coroutine = rememberCoroutineScope()

    // Generator sets
    val modelsAdded by generatorSetViewModel.modelsSelected.collectAsState()

    val customers by customerViewModel.customers.collectAsStateWithLifecycle()
    val contactsOfCurrentCustomer by customerViewModel.contactsOfCurrentCustomer.collectAsStateWithLifecycle()
    val sellers by sellerViewModel.sellers.collectAsStateWithLifecycle()
    val commercialConditions by commercialConditionViewModel.commercialConditions.collectAsStateWithLifecycle()
    val quoteHeaderMap by quoteViewModel.quoteHeaderMap.collectAsStateWithLifecycle()
    val distributionChannels by distributionChannelsViewModel.distributionChannels.collectAsStateWithLifecycle()
    val incoterms by incotermsViewModel.incoterms.collectAsStateWithLifecycle()

    val formHeader = rememberMapFormState(quoteHeaderMap)

    LaunchedEffect(Unit) {
        if (customers.isEmpty()) {
            customerViewModel.getAllCustomers()
        }

        if (sellers.isEmpty()) {
            sellerViewModel.getAllSellers()
        }

        if (commercialConditions.isEmpty()) {
            commercialConditionViewModel.getAllCommercialConditions()
        }

        if (distributionChannels.isEmpty()) {
            distributionChannelsViewModel.getAllDistributionChannels()
        }

        if (incoterms.isEmpty()) {
            incotermsViewModel.getAllIncoterms()
        }
    }

    var selectedCustomer by remember { mutableStateOf<Customer?>(null) }
    var selectedContact by remember { mutableStateOf<CustomerContact?>(null) }
    var checkedDelivery by remember { mutableStateOf(false) }
    var checkedInstalation by remember { mutableStateOf(false) }

    Text("Nueva Cotización", fontSize = 16.sp, fontWeight = FontWeight.Bold)

    Spacer(modifier = Modifier.height(16.dp))

    Column(
        modifier = Modifier.fillMaxWidth(),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        SelectInput(
            options = quoteTypes.map { it.value },
            selectedOption = formHeader.getValue("cotizador_tipo"),
            onOptionSelected = { println("Selected option: $it") },
            label = "TIPO DE COTIZADOR"
        )

        SelectInput(
            options = sellers.filter { !it.executiveName.isNullOrBlank() }.map { it.executiveName },
            selectedOption = formHeader.getValue("ejecutivo_id"),
            placeholder = "Seleccione un ejecutivo",
            onOptionSelected = {
                formHeader.onValueChange("ejecutivo_id", it)
            },
            enabled = sellers.isNotEmpty(),
            label = "EJECUTIVO COMERCIAL"
        )

        SelectInput(
            options = customers.filter { !it.clientName.isNullOrBlank() }.map { it.clientName },
            selectedOption = formHeader.getValue("cliente_id"),
            placeholder = "Seleccione un cliente",
            onOptionSelected = {
                formHeader.onValueChange("cliente_id", it)

                val customerFind =
                    customers.find { customer -> customer.clientName.equals(it, true) }

                if (customerFind == null) {
                    return@SelectInput
                }

                customerViewModel.getAllContactsByCustomerID(
                    customerFind.clientId
                )

                formHeader.onValueChange("ruc_dni", customerFind.taxId ?: "")

                selectedCustomer = customerFind
            },
            label = "CLIENTE/PROSPECTO"
        )

        NumberInput(
            value = formHeader.getValue("ruc_dni"),
            onValueChange = {},
            label = "RUC/DNI",
            maxLength = 11,
            enabled = false,
            placeholder = "Ingrese el RUC o DNI"
        )

        SelectInput(
            options = contactsOfCurrentCustomer.map { it.name },
            selectedOption = formHeader.getValue("contacto"),
            placeholder = "Seleccione un contacto",
            enabled = contactsOfCurrentCustomer.isNotEmpty(),
            onOptionSelected = {
                formHeader.onValueChange("contacto", it)

                val contactFind =
                    contactsOfCurrentCustomer.find { contact -> contact.name.equals(it, true) }

                if (contactFind == null) {
                    return@SelectInput
                }

                selectedContact = contactFind

                formHeader.onValueChange("telefono", contactFind.phone)
                formHeader.onValueChange("email", contactFind.email)
            },
            label = "CONTACTO"
        )

        NumberInput(
            value = formHeader.getValue("telefono"),
            onValueChange = {},
            label = "TELEFONO",
            maxLength = 11,
            enabled = false,
            placeholder = "Ingrese un número de teléfono"
        )

        TextInput(
            value = formHeader.getValue("email"),
            onValueChange = {},
            label = "CORREO ELECTRÓNICO",
            maxLength = 11,
            enabled = false,
            placeholder = "Ingrese un correo electrónico"
        )

        TextInput(
            value = formHeader.getValue("proyecto"),
            onValueChange = {
                formHeader.onValueChange("proyecto", it)
            },
            label = "PROYECTO",
            maxLength = 11,
            placeholder = "Ingrese el nombre del Proyecto"
        )

        TextInput(
            value = formHeader.getValue("direccion"),
            onValueChange = {
                formHeader.onValueChange("direccion", it)
            },
            label = "DIRECCIÓN",
            maxLength = 11,
            placeholder = "Ingrese la dirección del Proyecto"
        )

        SelectInput(
            options = markets.map { it.value },
            selectedOption = formHeader.getValue("mercado"),
            placeholder = "Seleccione un mercado",
            onOptionSelected = {
                formHeader.onValueChange("mercado", it)
            },
            label = "TIPO DE MERCADO"
        )

        SelectInput(
            options = currenciesMockup.map { it.value },
            selectedOption = formHeader.getValue("moneda_id"),
            onOptionSelected = {
                formHeader.onValueChange("moneda_id", it)
            },
            label = "MONEDA"
        )

        val dateFormat = SimpleDateFormat("dd/MM/yyyy", Locale.getDefault()).apply {
            timeZone = TimeZone.getTimeZone("America/Lima")
        }

        DateInput(
            label = "FECHA DE COTIZACIÓN",
            selectedDate = dateFormat.parse(formHeader.getValue("fecha")),
            onSelectDate = {
                formHeader.onValueChange("fecha", it)
            }
        )

        NumberInput(
            value = formHeader.getValue("validez_oferta"),
            suffix = {
                Text("Días")
            },
            onValueChange = {
                formHeader.onValueChange("validez_oferta", it)
            },
            label = "VALIDEZ DE LA OFERTA",
            maxLength = 2,
            placeholder = "Ingrese los días de validez"
        )

        SelectInput(
            options = distributionChannels.map { it.name },
            selectedOption = formHeader.getValue("canal_distribucion_id"),
            placeholder = "Seleccione un canal de distribución",
            onOptionSelected = {
                formHeader.onValueChange("canal_distribucion_id", it)
            },
            enabled = distributionChannels.isNotEmpty(),
            label = "CANAL DE DISTRIBUCIÓN"
        )

        SelectInput(
            options = incoterms.map { it.description },
            selectedOption = formHeader.getValue("incoterm_id"),
            placeholder = "Seleccione un Incoterm",
            onOptionSelected = {
                formHeader.onValueChange("incoterm_id", it)
            },
            enabled = incoterms.isNotEmpty(),
            label = "INCOTERMS"
        )

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceEvenly,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {

                Text("ENVIO", fontSize = 14.sp)

                SwitchInput(
                    checked = checkedDelivery,
                    onCheckedChange = {
                        checkedDelivery = it

                        formHeader.onValueChange(
                            "envio",
                            it.toString()
                        )
                    }
                )

            }

            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {

                Text("INSTALACIÓN", fontSize = 14.sp)

                SwitchInput(
                    checked = checkedInstalation,
                    onCheckedChange = {
                        checkedInstalation = it

                        formHeader.onValueChange(
                            "instalacion",
                            it.toString()
                        )
                    }
                )
            }
        }

        Button(
            onClick = {
                quoteViewModel.setQuoteHeaderMap(formHeader.values)
                controller.navigate(AttachDetailsToQuote)
            },
            modifier = Modifier.fillMaxWidth(),
            text = "AGREGAR"
        )

        val headers = listOf(
            "ITEM",
            "DESCRIPCIÓN",
            "CDT",
            "PARCIAL US$",
        )

        val detailItems = when (formHeader.getValue("cotizador_tipo")) {
            "Grupos Electrógenos" -> {
                modelsAdded.mapIndexed { index, generatorSetModel ->

                    val params = generatorSetModel.params

                    val composeName =
                        "${generatorSetModel.modelName} ${generatorSetModel.motorName} ${generatorSetModel.alternatorName} ${params.voltage}V ${params.frequency}Hz ${params.phases}F ${params.powerFactor}PF ${params.heightAtSeaLevel}M ${params.temperature}°C ${if (params.isSoundproof) "INSONORO" else "CABINA ABIERTA"}"

                    val price = generatorSetModel.finalPrice

                    listOf(
                        (index + 1).toString(),
                        composeName,
                        "1",
                        price.toString()
                    )
                }
            }

            else -> {
                emptyList()
            }
        }

        if (detailItems.isNotEmpty()) {
            Table(headers = headers, data = detailItems)
        }

        SelectInput(
            options = commercialConditions.map { it.title },
            selectedOption = formHeader.getValue("condicion_comercial_id"),
            placeholder = "Seleccione una condición comercial",
            enabled = commercialConditions.isNotEmpty(),
            onOptionSelected = {
                formHeader.onValueChange("condicion_comercial_id", it)
            },
            label = "CONDICIONES"
        )

        val summaryItems = when (formHeader.getValue("cotizador_tipo")) {
            "Grupos Electrógenos" -> {
                modelsAdded.map { generatorSetModel ->

                    val params = generatorSetModel.params

                    val composeName =
                        "${generatorSetModel.modelName} ${generatorSetModel.motorName} ${generatorSetModel.alternatorName} ${params.voltage}V ${params.frequency}Hz ${params.phases}F ${params.powerFactor}PF ${params.heightAtSeaLevel}M ${params.temperature}°C ${if (params.isSoundproof) "INSONORO" else "CABINA ABIERTA"}"

                    val price = generatorSetModel.finalPrice

                    SummaryItem(
                        name = composeName,
                        price = price
                    )
                }
            }

            else -> {
                emptyList()
            }
        }

        if (summaryItems.isNotEmpty()) {

            SummaryCard(items = summaryItems)
        }

        Row(verticalAlignment = Alignment.CenterVertically) {
            Button(
                onClick = {

                    val detailsIsEmpty = when (formHeader.getValue("cotizador_tipo")) {
                        "Grupos Electrógenos" -> {
                            modelsAdded.isEmpty()
                        }

                        else -> {
                            true
                        }
                    }

                    if (detailsIsEmpty) {

                        coroutine.launch {
                            snackbarHostState.showSnackbar(
                                message = "Debe agregar al menos un detalle",
                                actionLabel = "Entendido"
                            )
                        }

                        return@Button
                    }

                    val formCompose = formHeader.values.toMutableMap()

                    // Set Id's

                    val quoteTypeName = formCompose.getValue("cotizador_tipo")
                    val quoteTypeId = quoteTypes.entries.map { k -> k.key }
                        .first { k -> quoteTypes[k] == quoteTypeName }
                    formCompose["cotizador_tipo"] = quoteTypeId.toString()

                    val sellerName = formCompose.getValue("ejecutivo_id")
                    val sellerId =
                        sellers.find { seller -> seller.executiveName == sellerName && !seller.executiveName.isNullOrBlank() }?.executiveId
                    formCompose["ejecutivo_id"] = sellerId.toString()

                    val customerName = formCompose.getValue("cliente_id")
                    val customerId =
                        customers.find { customer -> customer.clientName == customerName }?.clientId
                    formCompose["cliente_id"] = customerId.toString()

                    val marketName = formCompose.getValue("mercado")
                    val marketId = markets.entries.map { k -> k.key }
                        .first { k -> markets[k] == marketName }
                    formCompose["mercado"] = marketId.toString()

                    val currencyName = formCompose.getValue("moneda_id")
                    val currencyId = currenciesMockup.entries.map { k -> k.key }
                        .first { k -> currenciesMockup[k] == currencyName }
                    formCompose["moneda_id"] = currencyId.toString()

                    val delivery = formCompose.getValue("envio")
                    val deliveryId = if (delivery == "true") 1 else 0
                    formCompose["envio"] = deliveryId.toString()

                    val installation = formCompose.getValue("instalacion")
                    val installationId = if (installation == "true") 1 else 0
                    formCompose["instalacion"] = installationId.toString()

                    val commercialConditionName = formCompose.getValue("condicion_comercial_id")
                    val commercialConditionId =
                        commercialConditions.find { condition -> condition.title == commercialConditionName }?.commercialConditionsId
                    formCompose["condicion_comercial_id"] = commercialConditionId.toString()

                    val distributionChannelName = formCompose.getValue("canal_distribucion_id")
                    val distributionChannelId =
                        distributionChannels.find { channel -> channel.name == distributionChannelName }?.id
                    formCompose["canal_distribucion_id"] = distributionChannelId.toString()

                    val incotermName = formCompose.getValue("incoterm_id")
                    val incotermId =
                        incoterms.find { incoterm -> incoterm.description == incotermName }?.id
                    formCompose["incoterm_id"] = incotermId.toString()

                    quoteViewModel.setQuoteHeaderMap(formHeader.values)
                    quoteViewModel.createQuote(formCompose)

                    controller.popBackStack()
                },
                modifier = Modifier.weight(1f),
                text = "GUARDAR"
            )

            Spacer(modifier = Modifier.width(16.dp))

            Button(
                onClick = { controller.popBackStack() },
                modifier = Modifier.weight(1f),
                text = "CANCELAR",
                variant = ButtonVariant.DESTRUCTIVE
            )
        }
    }
}

@Preview
@Composable
private fun CreateQuoteScreenPreview() {

    val controller = rememberNavController()
    val quoteViewModel = viewModel<QuoteViewModel>()
    val customerViewModel = viewModel<CustomerViewModel>()
    val generatorSetViewModel = viewModel<GeneratorSetViewModel>()
    val sellerViewModel = viewModel<SellerViewModel>()
    val commercialConditionViewModel = viewModel<CommercialConditionViewModel>()
    val distributionChannelsViewModel = viewModel<DistributionChannelsViewModel>()
    val incotermsViewModel = viewModel<IncotermsViewModel>()

    CotizadorModasaTheme {

        CreateQuoteScreen(
            modifier = Modifier,
            controller = controller,
            quoteViewModel = quoteViewModel,
            customerViewModel = customerViewModel,
            generatorSetViewModel = generatorSetViewModel,
            sellerViewModel = sellerViewModel,
            commercialConditionViewModel = commercialConditionViewModel,
            distributionChannelsViewModel = distributionChannelsViewModel,
            incotermsViewModel = incotermsViewModel
        )
    }
}