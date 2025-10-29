package com.fmsac.cotizadormodasa.presentation.components.inputs

import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.height
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.navigation.compose.rememberNavController
import com.fmsac.cotizadormodasa.presentation.navigation.Screen
import com.fmsac.cotizadormodasa.presentation.theme.ui.CotizadorModasaTheme
import com.fmsac.cotizadormodasa.presentation.theme.ui.checkedColor

@Composable
fun SwitchInput(
    modifier: Modifier = Modifier,
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit,
    enabled: Boolean = true
) {
    Switch(
        enabled = enabled,
        colors = SwitchDefaults.colors(
            checkedThumbColor = Color.White,
            checkedTrackColor = checkedColor,
            uncheckedThumbColor = Color.White,
            uncheckedTrackColor = Color(0XFF7D7D7D),
            uncheckedBorderColor = Color.Gray.copy(alpha = 0.3f)
        ),
        checked = checked,
        onCheckedChange = onCheckedChange
    )
}

@Preview
@Composable
private fun SwitchInputPreview() {
    val controller = rememberNavController()

    CotizadorModasaTheme {
        Screen(route = "Cotizaciones", controller = controller) {
            SwitchInput(
                checked = true,
                onCheckedChange = { println("Checked: $it") }
            )

            Spacer(modifier = Modifier.height(16.dp))

            SwitchInput(
                checked = false,
                onCheckedChange = { println("Checked: $it") }
            )

            Spacer(modifier = Modifier.height(16.dp))

            SwitchInput(
                enabled = false,
                checked = false,
                onCheckedChange = { println("Checked: $it") }
            )

            Spacer(modifier = Modifier.height(16.dp))

            SwitchInput(
                enabled = false,
                checked = true,
                onCheckedChange = { println("Checked: $it") }
            )
        }
    }
}