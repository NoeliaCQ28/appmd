package com.fmsac.cotizadormodasa.presentation.components.customers

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Create
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.fmsac.cotizadormodasa.presentation.components.Button
import com.fmsac.cotizadormodasa.presentation.components.ButtonVariant
import com.fmsac.cotizadormodasa.presentation.components.inputs.NumberInput
import com.fmsac.cotizadormodasa.presentation.components.inputs.TextInput

@Composable
fun CreateContactDialog(
    onDismissRequest: () -> Unit,
    onConfirmation: () -> Unit,
) {
    AlertDialog(
        icon = {
            Icon(Icons.Outlined.Create, contentDescription = "Example Icon")
        },
        title = {
            Text(text = "Datos del nuevo contacto")
        },
        text = {
            Column(
                modifier = Modifier.fillMaxWidth(),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {

                TextInput(
                    value = "",
                    onValueChange = {},
                    label = "NOMBRE DEL CONTACTO",
                    placeholder = "Ingrese un nombre"
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
            }
        },
        onDismissRequest = {
            onDismissRequest()
        },
        confirmButton = {
            Button(
                modifier = Modifier.fillMaxWidth(),
                onClick = {
                    onConfirmation()
                },
                text = "Guardar"
            )
        },
        dismissButton = {
            Button(
                modifier = Modifier.fillMaxWidth(),
                onClick = {
                    onDismissRequest()
                },
                text = "Cancelar",
                variant = ButtonVariant.DESTRUCTIVE
            )
        }
    )
}
