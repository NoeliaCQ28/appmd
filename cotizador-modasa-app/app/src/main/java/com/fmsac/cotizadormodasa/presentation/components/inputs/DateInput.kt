package com.fmsac.cotizadormodasa.presentation.components.inputs

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.DateRange
import androidx.compose.material3.DatePicker
import androidx.compose.material3.DatePickerDialog
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.OutlinedCard
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.rememberDatePickerState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.compose.rememberNavController
import com.fmsac.cotizadormodasa.presentation.navigation.Screen
import com.fmsac.cotizadormodasa.presentation.theme.ui.CotizadorModasaTheme
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.TimeZone

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DateInput(
    @Suppress("UNUSED_PARAMETER") modifier: Modifier = Modifier,
    label: String,
    selectedDate: Date? = null,
    onSelectDate: (String) -> Unit = {}
) {

    val dateFormat = SimpleDateFormat("dd/MM/yyyy", Locale.getDefault()).apply {
        timeZone = TimeZone.getTimeZone("America/Lima")
    }

    val currentDate = System.currentTimeMillis()

    // Usar directamente el prop sin estado local para evitar loop infinito
    val dateText = dateFormat.format(selectedDate ?: Date(currentDate))

    val showDatePicker = remember { mutableStateOf(false) }

    val datePickerState = rememberDatePickerState(
        initialSelectedDateMillis = selectedDate?.time ?: currentDate
    )

    if (showDatePicker.value) {
        DatePickerDialog(
            onDismissRequest = { showDatePicker.value = false },
            confirmButton = {
                TextButton(
                    onClick = {
                        datePickerState.selectedDateMillis?.let { millis ->
                            val timeZoneOffset = TimeZone.getTimeZone("America/Lima").rawOffset
                            val correctedMillis = millis - timeZoneOffset
                            onSelectDate(dateFormat.format(Date(correctedMillis)))
                        }
                        showDatePicker.value = false
                    }
                ) {
                    Text(text = "OK")
                }
            },
            dismissButton = {
                TextButton(
                    onClick = { showDatePicker.value = false }
                ) {
                    Text(text = "Cancelar")
                }
            }
        ) {
            DatePicker(state = datePickerState)
        }
    }

    Column(
        modifier = Modifier.fillMaxWidth(),
        verticalArrangement = Arrangement.spacedBy(4.dp)
    ) {
        Text(
            label.uppercase(),
            fontSize = 16.sp
        )

        OutlinedCard(
            modifier = Modifier
                .fillMaxWidth()
                .clickable { showDatePicker.value = true }
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(text = dateText)
                Icon(
                    imageVector = Icons.Filled.DateRange,
                    contentDescription = "Seleccionar fecha"
                )
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
private fun DateInputPreview() {
    val controller = rememberNavController()

    CotizadorModasaTheme {
        Screen(route = "Cotizaciones", controller = controller) {
            DateInput(
                label = "Selecciona una fecha"
            )
        }
    }
}
