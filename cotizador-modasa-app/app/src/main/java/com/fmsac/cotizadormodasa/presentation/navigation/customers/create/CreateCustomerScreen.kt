package com.fmsac.cotizadormodasa.presentation.navigation.customers.create

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.width
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavHostController
import androidx.navigation.compose.rememberNavController
import com.fmsac.cotizadormodasa.data.customerOrigin
import com.fmsac.cotizadormodasa.data.customerTypes
import com.fmsac.cotizadormodasa.data.mockup.citiesOrProvincies
import com.fmsac.cotizadormodasa.data.mockup.commercialExecutivesMockup
import com.fmsac.cotizadormodasa.data.mockup.contactsMockup
import com.fmsac.cotizadormodasa.data.mockup.countries
import com.fmsac.cotizadormodasa.data.mockup.states
import com.fmsac.cotizadormodasa.presentation.components.Button
import com.fmsac.cotizadormodasa.presentation.components.ButtonVariant
import com.fmsac.cotizadormodasa.presentation.components.Table
import com.fmsac.cotizadormodasa.presentation.components.customers.CreateContactDialog
import com.fmsac.cotizadormodasa.presentation.components.inputs.NumberInput
import com.fmsac.cotizadormodasa.presentation.components.inputs.SelectInput
import com.fmsac.cotizadormodasa.presentation.components.inputs.TextInput
import com.fmsac.cotizadormodasa.presentation.navigation.Screen
import com.fmsac.cotizadormodasa.presentation.theme.ui.CotizadorModasaTheme

@Composable
fun CreateCustomerScreen(
    modifier: Modifier = Modifier,
    controller: NavHostController
) = Screen(controller = controller, modifier = modifier, route = "Clientes/Prospectos") {

    var isCliengo by remember { mutableStateOf(true) }

    var countrySelected by remember { mutableStateOf("") }

    var stateSelected by remember {
        mutableStateOf("")
    }

    var citySelected by remember {
        mutableStateOf("")
    }

    var openCreateContactDialog by remember {
        mutableStateOf(false)
    }

    Text("Datos del Nuevo Cliente", fontSize = 16.sp, fontWeight = FontWeight.Bold)

    Spacer(modifier = Modifier.height(16.dp))

    Column(
        modifier = Modifier.fillMaxWidth(),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {

        SelectInput(
            options = commercialExecutivesMockup,
            selectedOption = commercialExecutivesMockup[0],
            onOptionSelected = { println("Selected option: $it") },
            label = "EJECUTIVO COMERCIAL"
        )

        SelectInput(
            options = customerOrigin,
            selectedOption = customerOrigin[0],
            onOptionSelected = {
                isCliengo = it == "CLIENGO"
                println("Selected option: $it")
            },
            label = "PROCEDENCIA"
        )

        if (isCliengo) {
            TextInput(
                value = "",
                onValueChange = {},
                label = "ID CLIENGO",
                maxLength = 11,
                placeholder = "Ingrese un ID"
            )
        }

        SelectInput(
            options = customerTypes,
            selectedOption = customerTypes[0],
            onOptionSelected = {
                println("Selected option: $it")
            },
            label = "TIPO DE CLIENTE"
        )

        NumberInput(
            value = "",
            onValueChange = {},
            label = "RUC/DNI",
            maxLength = 11,
            placeholder = "Ingrese el RUC o DNI"
        )

        TextInput(
            value = "",
            onValueChange = {},
            label = "RAZÓN SOCIAL",
            placeholder = "Ingrese la razón social"
        )

        TextInput(
            value = "",
            onValueChange = {},
            label = "DIRECCIÓN",
            maxLength = 100,
            placeholder = "Ingrese la dirección"
        )

        NumberInput(
            value = "",
            onValueChange = {},
            label = "TELÉFONO",
            maxLength = 15,
            placeholder = "Ingrese un numero telefonico"
        )

        TextInput(
            value = "",
            onValueChange = {},
            label = "CORREO ELECTRONICO",
            placeholder = "Ingrese un correo electronico"
        )

        SelectInput(
            options = countries,
            selectedOption = "Perú",
            onOptionSelected = {
                countrySelected = it
            },
            label = "PAÍS"
        )

        SelectInput(
            options = states["Perú"]!!,
            selectedOption = "Lima",
            onOptionSelected = {
                stateSelected = it
            },
            label = "DEPARTAMENTO"
        )

        SelectInput(
            options = citiesOrProvincies["Perú"]!!["Lima"]!!,
            selectedOption = "Lima",
            onOptionSelected = {
                citySelected = it
            },
            label = "PROVINCIA"
        )

        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.End) {
            Button(
                onClick = {
                    openCreateContactDialog = true
                },
                text = "AGREGAR CONTACTO"
            )
        }

        val headers = listOf("Contacto", "Telefono", "Correo")

        Table(headers = headers, data = contactsMockup)

        Row(verticalAlignment = Alignment.CenterVertically) {
            Button(
                onClick = { controller.popBackStack() },
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

        if (openCreateContactDialog) {
            CreateContactDialog(
                onDismissRequest = { openCreateContactDialog = false },
                onConfirmation = { openCreateContactDialog = false }
            )
        }
    }
}

@Preview
@Composable
private fun CustomerScreenPreview() {

    val controller = rememberNavController()

    CotizadorModasaTheme {

        CreateCustomerScreen(modifier = Modifier, controller = controller)
    }
}