package com.fmsac.cotizadormodasa.presentation.components

import android.annotation.SuppressLint
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Divider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedCard
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.compose.rememberNavController
import com.fmsac.cotizadormodasa.presentation.navigation.Screen
import com.fmsac.cotizadormodasa.presentation.theme.ui.CotizadorModasaTheme

data class SummaryItem(
    val name: String,
    val price: Double
)

@SuppressLint("DefaultLocale")
@Composable
fun SummaryCard(
    items: List<SummaryItem>,
    modifier: Modifier = Modifier
) {
    val total = items.sumOf { it.price }

    OutlinedCard(
        shape = RoundedCornerShape(12.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {

            Text("Resumen", style = TextStyle(fontSize = 16.sp, fontWeight = FontWeight.Bold))

            Spacer(modifier = Modifier.height(8.dp))

            items.forEach { item ->
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text(
                        text = item.name,
                        maxLines = 2,
                        overflow = TextOverflow.Ellipsis,
                        softWrap = true,
                        style = MaterialTheme.typography.bodySmall,
                        modifier = Modifier.width(200.dp)
                    )
                    Text(
                        text = "$${String.format("%.2f", item.price)}",
                        style = MaterialTheme.typography.bodyMedium
                    )
                }
                Spacer(modifier = Modifier.height(8.dp))
            }

            // Línea divisoria
            Divider(modifier = Modifier.padding(vertical = 8.dp))

            // Fila para el TOTAL
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    text = "TOTAL",
                    style = TextStyle(fontSize = 16.sp, fontWeight = FontWeight.Bold)
                )
                Text(
                    text = "$${String.format("%.2f", total)}",
                    style = TextStyle(fontSize = 16.sp, fontWeight = FontWeight.Bold)
                )
            }
        }
    }
}

@Preview
@Composable
private fun SummaryCardPreview() {

    val controller = rememberNavController()

    val items = listOf(
        SummaryItem(name = "Producto 1", price = 29.99),
        SummaryItem(name = "Producto 2", price = 15.50),
        SummaryItem(name = "Producto 3", price = 42.75)
    )

    CotizadorModasaTheme {

        Screen(route = "Cotizaciones", controller = controller) {

            SummaryCard(items = items)
        }
    }

}