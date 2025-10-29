package com.fmsac.cotizadormodasa.presentation.components.inputs

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.width
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ExposedDropdownMenuBox
import androidx.compose.material3.ExposedDropdownMenuDefaults
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.onGloballyPositioned
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.compose.rememberNavController
import com.fmsac.cotizadormodasa.presentation.navigation.Screen
import com.fmsac.cotizadormodasa.presentation.theme.ui.CotizadorModasaTheme

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SelectInput(
    options: List<String>,
    selectedOption: String? = null,
    onOptionSelected: (String) -> Unit,
    placeholder: String = "Seleccione una opción",
    label: String = "Seleccione una opción",
    enabled: Boolean = true,
    isDarkMode: Boolean = isSystemInDarkTheme(),
    modifier: Modifier = Modifier
) {

    var expanded by remember { mutableStateOf(false) }

    var selectedText by remember {
        mutableStateOf(selectedOption.let {
            if (selectedOption == "") placeholder else selectedOption
        } ?: placeholder)
    }

    var textFieldWidth by remember { mutableStateOf(0) }

    val density = LocalDensity.current

    ExposedDropdownMenuBox(
        expanded = expanded,
        onExpandedChange = { expanded = !expanded },
        modifier = modifier.fillMaxWidth()
    ) {
        Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
            Text(
                label.uppercase(),
                fontSize = 16.sp
            )

            OutlinedTextField(
                value = if (selectedText.length > 30) selectedText.substring(
                    0,
                    29
                ) + ".." else selectedText,
                onValueChange = { },
                readOnly = true,
                enabled = enabled,
                label = null,
                shape = CardDefaults.outlinedShape,
                colors = OutlinedTextFieldDefaults.colors(
                    unfocusedBorderColor = if (isDarkMode) Color(0xFFB8B8B8) else Color(0xFFc6cfd1),
                ),
                trailingIcon = {
                    if (enabled) {
                        ExposedDropdownMenuDefaults.TrailingIcon(
                            expanded = expanded
                        )
                    }
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .onGloballyPositioned { coordinates ->
                        textFieldWidth = coordinates.size.width
                    }
                    .menuAnchor()
            )
        }


        DropdownMenu(
            expanded = expanded && enabled,
            onDismissRequest = { expanded = false },
            modifier = Modifier
                .width(with(density) { textFieldWidth.toDp() })
        ) {
            options.forEach { selectionOption ->
                DropdownMenuItem(
                    text = {
                        Text(
                            text = selectionOption,
                            style = TextStyle(fontSize = 16.sp)
                        )
                    },
                    onClick = {
                        selectedText = selectionOption
                        onOptionSelected(selectionOption)
                        expanded = false
                    }
                )
            }
        }
    }
}

@Preview
@Composable
private fun SelectInputPreview() {
    val controller = rememberNavController()

    val options = listOf("Option 1", "Option 2", "Option 3")
    val selectedOption = options[0]

    CotizadorModasaTheme {
        Screen(route = "Cotizaciones", controller = controller) {
            SelectInput(
                options = options,
                selectedOption = selectedOption,
                onOptionSelected = { println("Selected option: $it") },
                label = "Select an option"
            )
        }
    }
}