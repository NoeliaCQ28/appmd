package com.fmsac.cotizadormodasa.presentation.components.generator_sets

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.selection.selectable
import androidx.compose.foundation.selection.selectableGroup
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.ArrowDropDown
import androidx.compose.material.icons.outlined.Create
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedCard
import androidx.compose.material3.RadioButton
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.unit.dp
import com.fmsac.cotizadormodasa.presentation.components.inputs.SelectInput
import com.fmsac.cotizadormodasa.presentation.components.inputs.SwitchInput

@Composable
fun GeneratorSetModelCardDiscount(
    modifier: Modifier = Modifier,
    discount: Pair<Int, String> = 0 to "Sin Descuento",
    onDiscount: (Int, String) -> Unit,
    onNotifyDiscount: (Boolean) -> Unit = {},
    enabled: Boolean
) {

    var expanded by remember { mutableStateOf(false) }

    val onDismissRequest = {
        expanded = false
    }

    val onConfirmation = {
        expanded = false
    }

    Column {
        OutlinedCard(
            modifier = Modifier
                .fillMaxWidth()
                .clickable {
                    if (enabled) {
                        expanded = true
                    }
                },
            colors = if (enabled) CardDefaults.outlinedCardColors() else CardDefaults.outlinedCardColors()
                .copy(
                    containerColor = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.12f)
                )
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(10.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    "Descuentos",
                    modifier = Modifier
                        .padding(4.dp)
                        .padding(horizontal = 4.dp)
                )


                Icon(
                    imageVector = Icons.Outlined.ArrowDropDown,
                    contentDescription = "Arrow down"
                )
            }
        }
    }

    if (expanded) {

        val discountOptions = mapOf(
            0 to "Sin Descuento",
            10 to "10%",
            20 to "20%",
            30 to "30%",
            40 to "40%",
            50 to "50%",
            60 to "60%",
            70 to "70%",
            80 to "80%",
            90 to "90%",
            100 to "100%"
        )

        val inRadioButtons = discountOptions.filter { (k, v) -> k < 50 }
        val inSelectable = discountOptions.filter { (k, v) -> k >= 50 }

        var selectedOption by remember {
            mutableIntStateOf(discount.first)
        }

        AlertDialog(
            icon = {
                Icon(Icons.Outlined.Create, contentDescription = "Create Discount Icon")
            },
            title = {
                Text(text = "Agregar descuento")
            },
            text = {
                Column {

                    Column(Modifier.selectableGroup()) {
                        inRadioButtons.forEach { (discountValue, discountDescription) ->
                            Row(
                                Modifier
                                    .fillMaxWidth()
                                    .height(36.dp)
                                    .selectable(
                                        selected = (discountValue == selectedOption),
                                        onClick = {
                                            selectedOption = discountValue
                                            onDiscount(
                                                discountValue,
                                                discountDescription
                                            )
                                        },
                                        role = Role.RadioButton
                                    )
                                    .padding(horizontal = 16.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                RadioButton(
                                    selected = (discountValue == selectedOption),
                                    onClick = null
                                )
                                Text(
                                    text = discountDescription,
                                    style = MaterialTheme.typography.bodyLarge,
                                    modifier = Modifier.padding(start = 16.dp)
                                )
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(6.dp))

                    SelectInput(
                        label = "Cantidad",
                        selectedOption = selectedOption.toString(),
                        options = inSelectable.keys.map { it.toString() },
                        onOptionSelected = { option ->
                            selectedOption = option.toInt()
                            onDiscount(
                                option.toInt(),
                                inSelectable[option.toInt()] ?: ""
                            )
                        }
                    )

                    Spacer(modifier = Modifier.height(6.dp))

                    Row {
                        SwitchInput(
                            checked = selectedOption >= 50,
                            onCheckedChange = {
                                onNotifyDiscount(it)
                            }
                        )

                        Spacer(modifier = Modifier.width(6.dp))

                        Text("NOTIFICAR AUMENTO DE DESCUENTO")
                    }
                }
            },
            onDismissRequest = {
                onDismissRequest()
            },
            confirmButton = {
                TextButton(
                    onClick = {
                        onConfirmation()
                    }
                ) {
                    Text("Guardar")
                }
            },
            dismissButton = {
                TextButton(
                    onClick = {
                        onDismissRequest()
                    }
                ) {
                    Text("Cancelar")
                }
            }
        )
    }

}
