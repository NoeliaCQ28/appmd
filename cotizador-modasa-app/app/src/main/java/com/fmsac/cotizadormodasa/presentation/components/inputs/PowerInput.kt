package com.fmsac.cotizadormodasa.presentation.components.inputs

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun PowerInput(
    label: String,
    value: String,
    onValueChange: (String) -> Unit,
    isTodos: Boolean,
    onTodosChange: (Boolean) -> Unit,
    unit: String,
    onUnitChange: (String) -> Unit,
    threshold: Int = 20,
    modifier: Modifier = Modifier
) {
    Column(modifier = modifier) {
        Text(label, fontSize = 15.sp, fontWeight = FontWeight.Medium)
        Spacer(modifier = Modifier.height(8.dp))

        // Row for Todos button and unit selector
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Todos button
            OutlinedButton(
                onClick = { onTodosChange(!isTodos) },
                colors = ButtonDefaults.outlinedButtonColors(
                    containerColor = if (isTodos) MaterialTheme.colorScheme.primary else Color.Transparent,
                    contentColor = if (isTodos) Color.White else MaterialTheme.colorScheme.primary
                ),
                modifier = Modifier.weight(1f)
            ) {
                Text("Todos")
            }

            Spacer(modifier = Modifier.width(16.dp))

            // Unit selector button
            OutlinedButton(
                onClick = { onUnitChange(if (unit == "kW") "kVA" else "kW") },
                enabled = !isTodos,
                colors = ButtonDefaults.outlinedButtonColors(
                    containerColor = Color.Transparent,
                    contentColor = MaterialTheme.colorScheme.primary
                ),
                modifier = Modifier.weight(1f)
            ) {
                Text(unit)
            }
        }

        Spacer(modifier = Modifier.height(8.dp))

        // Power value input
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            OutlinedTextField(
                value = if (isTodos) "" else value,
                onValueChange = onValueChange,
                label = { Text(unit) },
                enabled = !isTodos,
                shape = CardDefaults.outlinedShape,
                suffix = { Text(unit) },
                colors = OutlinedTextFieldDefaults.colors(
                    unfocusedBorderColor = Color(0xFFc6cfd1),
                    disabledBorderColor = Color(0xFFe0e0e0)
                ),
                modifier = Modifier.weight(1f)
            )

            Spacer(modifier = Modifier.width(8.dp))

            // Reset button
            TextButton(
                onClick = {
                    onTodosChange(true)
                    onValueChange("")
                },
                enabled = !isTodos
            ) {
                Text("Restablecer")
            }
        }

        // Threshold and range info
        if (!isTodos && value.isNotEmpty()) {
            Spacer(modifier = Modifier.height(4.dp))
            val numericValue = value.toDoubleOrNull()
            if (numericValue != null) {
                val minValue = numericValue * (1 - threshold / 100.0)
                val maxValue = numericValue * (1 + threshold / 100.0)
                Column(modifier = Modifier.padding(start = 4.dp)) {
                    Text(
                        "Umbral establecido en +/- $threshold %",
                        fontSize = 12.sp,
                        color = Color.Gray
                    )
                    Text(
                        "Rango: ${String.format("%.2f", minValue)} $unit - ${String.format("%.2f", maxValue)} $unit",
                        fontSize = 12.sp,
                        color = Color.Gray
                    )
                }
            }
        } else if (isTodos) {
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                "Umbral establecido en +/- $threshold %",
                fontSize = 12.sp,
                color = Color.Gray,
                modifier = Modifier.padding(start = 4.dp)
            )
        }
    }
}
