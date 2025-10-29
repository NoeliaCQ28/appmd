package com.fmsac.cotizadormodasa.presentation.components.inputs;

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.tooling.preview.Devices
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.compose.rememberNavController
import com.fmsac.cotizadormodasa.presentation.navigation.Screen
import com.fmsac.cotizadormodasa.presentation.theme.ui.CotizadorModasaTheme

@Composable
fun TextInput(
    modifier: Modifier = Modifier,
    textFieldModifier: Modifier = Modifier,
    value: String,
    onValueChange: (String) -> Unit,
    label: String,
    placeholder: String,
    maxLength: Int = 50,
    enabled: Boolean = true,
    prefix: @Composable() (() -> Unit)? = null,
    suffix: @Composable() (() -> Unit)? = null,
    readOnly: Boolean = false
) {
    Column(modifier = modifier, verticalArrangement = Arrangement.spacedBy(8.dp)) {
        Text(
            label.uppercase(),
            fontSize = 16.sp,
            color = MaterialTheme.colorScheme.onSurface,
        )
        OutlinedTextField(
            modifier = textFieldModifier
                .fillMaxWidth(),
            readOnly = readOnly,
            shape = CardDefaults.outlinedShape,
            colors = OutlinedTextFieldDefaults.colors(
                unfocusedBorderColor = Color(0xFFc6cfd1),
            ),
            value = value,
            enabled = enabled,
            prefix = prefix,
            suffix = suffix,
            onValueChange = {
                if (it.length <= maxLength) onValueChange(it)
            },
            label = null,
            placeholder = { Text(placeholder) },
        )
    }
}

@Preview(device = Devices.PIXEL_7_PRO, showBackground = true, showSystemUi = true)
@Composable
private fun TextFieldPreview() {

    val controller = rememberNavController()

    CotizadorModasaTheme {
        Screen(route = "Cotizacion", controller = controller) {
            TextInput(
                textFieldModifier = Modifier.fillMaxWidth(),
                value = "0001-2025",
                onValueChange = {},
                label = "Código de Cotización",
                placeholder = "Ingrese el Código"
            )
        }
    }
}