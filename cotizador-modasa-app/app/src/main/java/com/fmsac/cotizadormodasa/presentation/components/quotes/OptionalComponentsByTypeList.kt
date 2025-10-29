package com.fmsac.cotizadormodasa.presentation.components.quotes

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedCard
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.fmsac.cotizadormodasa.core.generator_sets.OptionalGeneratorSetComponent
import com.fmsac.cotizadormodasa.presentation.components.inputs.TextInput
import com.fmsac.cotizadormodasa.presentation.theme.ui.buttonTertiary

@Composable
fun OptionalComponentsByTypeList(
    modifier: Modifier = Modifier,
    optionalGeneratorSetComponents: List<OptionalGeneratorSetComponent>
) {

    val optionalComponentsGroupByType = optionalGeneratorSetComponents.groupBy { it.type }

    optionalComponentsGroupByType.forEach { optionalComponent ->
        OptionalComponentList(
            modifier = modifier,
            optionalGeneratorSetComponent = Pair(optionalComponent.key, optionalComponent.value)
        )

        Spacer(modifier = Modifier.height(16.dp))
    }
}

@Composable
fun OptionalComponentList(
    modifier: Modifier = Modifier,
    optionalGeneratorSetComponent: Pair<String?, List<OptionalGeneratorSetComponent>>
) {

    val title = optionalGeneratorSetComponent.first!!
    val items = optionalGeneratorSetComponent.second

    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
        Text(text = title, style = TextStyle(fontSize = 14.sp, fontWeight = FontWeight.SemiBold))

        Text(
            text = "(${items.size})",
            style = TextStyle(fontSize = 12.sp, fontWeight = FontWeight.SemiBold),
            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f),
            modifier = Modifier.padding(start = 8.dp)
        )
    }

    var searchTerm by remember { mutableStateOf("") }

    TextInput(
        value = searchTerm,
        onValueChange = { searchTerm = it },
        label = "",
        modifier = Modifier.fillMaxWidth(),
        placeholder = "Buscar..."
    )

    val filteredItems = if (searchTerm.isNotEmpty()) {
        items.filter { component ->
            val searchLower = searchTerm.lowercase()
            (component.name?.lowercase()?.contains(searchLower) ?: false) ||
                    (component.description?.lowercase()?.contains(searchLower) ?: false) ||
                    (component.brand?.lowercase()?.contains(searchLower) ?: false)
        }
    } else {
        items
    }

    Spacer(modifier = Modifier.height(8.dp))

    if (filteredItems.isEmpty()) {
        Text(
            text = "No se encontraron resultados.",
            style = MaterialTheme.typography.bodySmall,
            modifier = Modifier.padding(16.dp)
        )
    } else {

        LazyRow(modifier = modifier) {
            items(filteredItems) { item ->
                OptionalComponentItem(optionalGeneratorSetComponent = item)
            }
        }
    }

}

@Composable
fun OptionalComponentItem(optionalGeneratorSetComponent: OptionalGeneratorSetComponent) {
    OutlinedCard(
        modifier = Modifier
            .height(190.dp)
            .width(350.dp)
            .padding(vertical = 8.dp)
            .padding(end = 8.dp),
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            Text(
                text = optionalGeneratorSetComponent.name ?: "",
                style = TextStyle(fontSize = 16.sp, fontWeight = FontWeight.SemiBold),
                softWrap = true
            )

            Spacer(modifier = Modifier.height(8.dp))

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .fillMaxHeight(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {

                Column(
                    modifier = Modifier
                        .weight(0.6f)
                        .verticalScroll(rememberScrollState())
                ) {
                    Text(
                        text = optionalGeneratorSetComponent.description ?: "",
                        style = TextStyle(fontSize = 14.sp),
                        softWrap = true
                    )

                    Spacer(modifier = Modifier.weight(1f))

                    Text(
                        text = optionalGeneratorSetComponent.brand ?: "",
                        style = TextStyle(fontSize = 12.sp),
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                    )
                }

                Text(
                    text = "$ ${optionalGeneratorSetComponent.price}",
                    style = TextStyle(fontSize = 16.sp, fontWeight = FontWeight.SemiBold),
                    color = buttonTertiary,
                    modifier = Modifier
                        .padding(start = 8.dp)
                        .weight(0.4f)
                )
            }
        }
    }
}
