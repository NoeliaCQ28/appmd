package com.fmsac.cotizadormodasa.presentation.components

import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.width
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.FilterAlt
import androidx.compose.material.icons.filled.FilterList
import androidx.compose.material3.Icon
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.navigation.compose.rememberNavController
import com.fmsac.cotizadormodasa.presentation.navigation.Screen
import com.fmsac.cotizadormodasa.presentation.theme.ui.CotizadorModasaTheme

@Composable
fun Filter(modifier: Modifier = Modifier) {

    OutlinedButton(modifier = modifier, onClick = {}) {

        Row(verticalAlignment = Alignment.CenterVertically) {
            Icon(
                imageVector = Icons.Default.FilterAlt,
                contentDescription = "Filter",
                tint = Color.Gray
            )

            Spacer(modifier = Modifier.width(8.dp))

            Text("Filtro", color = Color.Gray)
        }

    }

}

@Preview
@Composable
private fun FilterPreview() {

    val controller = rememberNavController()

    CotizadorModasaTheme {

        Screen(modifier = Modifier, controller = controller, route = "Clientes/Prospectos") {
            Filter()
        }
    }
}