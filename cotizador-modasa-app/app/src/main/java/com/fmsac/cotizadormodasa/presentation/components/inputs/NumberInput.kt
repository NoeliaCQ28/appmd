package com.fmsac.cotizadormodasa.presentation.components.inputs;

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.tooling.preview.Devices
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.compose.rememberNavController
import com.fmsac.cotizadormodasa.presentation.navigation.Screen
import com.fmsac.cotizadormodasa.presentation.theme.ui.CotizadorModasaTheme

@Composable
fun NumberInput(
    modifier: Modifier = Modifier,
    textFieldModifier: Modifier = Modifier,
    value: String,
    onValueChange: (String) -> Unit,
    label: String,
    placeholder: String,
    maxLength: Int = 50,
    enabled : Boolean = true,
    prefix: @Composable() (() -> Unit)? = null,
    suffix: @Composable() (() -> Unit)? = null,
) {
    Column(modifier = modifier, verticalArrangement = Arrangement.spacedBy(8.dp)) {
        Text(
            label.uppercase(),
            fontSize = 16.sp
        )
        OutlinedTextField(
            modifier = textFieldModifier.fillMaxWidth(),
            shape = CardDefaults.outlinedShape,
            colors = OutlinedTextFieldDefaults.colors(
                unfocusedBorderColor = Color(0xFFc6cfd1),
            ),
            enabled = enabled,
            value = value,
            onValueChange = { newValue ->
                if (newValue.length <= maxLength && (newValue.isEmpty() || newValue.all { it.isDigit() })) {
                    onValueChange(newValue)
                }
            },
            label = null,
            prefix = prefix,
            suffix = suffix,
            placeholder = { Text(placeholder) },
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number) // Muestra teclado numérico.
        )
    }
}

@Preview(device = Devices.PIXEL_7_PRO, showBackground = true, showSystemUi = true)
@Composable
private fun NumberInputPreview() {

    val controller = rememberNavController()

    CotizadorModasaTheme {
        Screen(route = "Cotizacion", controller = controller) {
            NumberInput(
                textFieldModifier = Modifier.fillMaxWidth(),
                value = "954621406",
                prefix = {
                    Text("+51")
                },
                onValueChange = {},
                label = "NÚMERO DE TELEFONO",
                placeholder = "Ingrese un teléfono"
            )
        }
    }
}