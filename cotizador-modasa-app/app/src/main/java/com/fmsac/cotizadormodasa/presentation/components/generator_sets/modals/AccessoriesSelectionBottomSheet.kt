package com.fmsac.cotizadormodasa.presentation.components.generator_sets.modals

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.expandVertically
import androidx.compose.animation.shrinkVertically
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.ExpandLess
import androidx.compose.material.icons.filled.ExpandMore
import androidx.compose.material3.Badge
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Checkbox
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.fmsac.cotizadormodasa.core.generator_sets.OptionalGeneratorSetComponent
import com.fmsac.cotizadormodasa.presentation.components.inputs.ComponentSearchBar
import com.fmsac.cotizadormodasa.presentation.state.FetchState
import com.fmsac.cotizadormodasa.presentation.viewmodels.generator_sets.OptionalGeneratorSetComponentsViewModel

/**
 * Modal Bottom Sheet para seleccionar accesorios opcionales
 * Con categorías colapsables y selección múltiple
 *
 * @param isOpen Estado de visibilidad del modal
 * @param currentSelectedIds IDs de accesorios actualmente seleccionados
 * @param onDismiss Callback cuando se cierra el modal
 * @param onApply Callback cuando se aplica la selección (Set de IDs)
 * @param viewModel ViewModel para gestionar estado
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AccessoriesSelectionBottomSheet(
    isOpen: Boolean,
    currentSelectedIds: Set<Int>,
    onDismiss: () -> Unit,
    onApply: (Set<Int>) -> Unit,
    viewModel: OptionalGeneratorSetComponentsViewModel
) {
    val sheetState = rememberModalBottomSheetState(
        skipPartiallyExpanded = true
    )

    // Cargar accesorios cuando se abre el modal
    LaunchedEffect(isOpen) {
        if (isOpen) {
            viewModel.loadAllComponents()
            viewModel.setTempSelections(currentSelectedIds)
        }
    }

    if (isOpen) {
        ModalBottomSheet(
            onDismissRequest = {
                viewModel.clearSearch()
                viewModel.clearTempSelections()
                onDismiss()
            },
            sheetState = sheetState
        ) {
            AccessoriesSelectionContent(
                viewModel = viewModel,
                onDismiss = {
                    viewModel.clearSearch()
                    viewModel.clearTempSelections()
                    onDismiss()
                },
                onApply = { selectedIds ->
                    viewModel.clearSearch()
                    onApply(selectedIds)
                }
            )
        }
    }
}

@Composable
private fun AccessoriesSelectionContent(
    viewModel: OptionalGeneratorSetComponentsViewModel,
    onDismiss: () -> Unit,
    onApply: (Set<Int>) -> Unit
) {
    val componentsByCategory by viewModel.filteredComponentsByCategory.collectAsStateWithLifecycle()
    val searchQuery by viewModel.searchQuery.collectAsStateWithLifecycle()
    val tempSelectedIds by viewModel.tempSelectedComponentIds.collectAsStateWithLifecycle()
    val fetchState by viewModel.fetchState.collectAsStateWithLifecycle(initialValue = FetchState.Idle)

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(bottom = 16.dp)
    ) {
        // Header
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 8.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "Seleccionar Accesorios",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold
            )

            if (tempSelectedIds.isNotEmpty()) {
                Badge {
                    Text("${tempSelectedIds.size}")
                }
            }
        }

        // SearchBar
        ComponentSearchBar(
            searchQuery = searchQuery,
            onSearchQueryChange = { viewModel.setSearchQuery(it) },
            placeholder = "Buscar por nombre, código..."
        )

        // Content
        Box(
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth()
        ) {
            when (fetchState) {
                is FetchState.Loading -> {
                    CircularProgressIndicator(
                        modifier = Modifier.align(Alignment.Center)
                    )
                }

                is FetchState.Error -> {
                    Text(
                        text = "Error: ${(fetchState as FetchState.Error).error}",
                        color = MaterialTheme.colorScheme.error,
                        modifier = Modifier
                            .align(Alignment.Center)
                            .padding(16.dp)
                    )
                }

                else -> {
                    if (componentsByCategory.isEmpty()) {
                        Text(
                            text = if (searchQuery.isBlank()) {
                                "No hay accesorios disponibles"
                            } else {
                                "No se encontraron accesorios"
                            },
                            modifier = Modifier
                                .align(Alignment.Center)
                                .padding(16.dp)
                        )
                    } else {
                        LazyColumn(
                            modifier = Modifier.fillMaxSize(),
                            verticalArrangement = Arrangement.spacedBy(4.dp)
                        ) {
                            componentsByCategory.forEach { (category, components) ->
                                item(key = "category_$category") {
                                    CategorySection(
                                        category = category,
                                        components = components,
                                        selectedIds = tempSelectedIds,
                                        onToggleSelection = { componentId ->
                                            viewModel.toggleTempComponentSelection(componentId)
                                        },
                                        // Auto-expandir si hay búsqueda activa
                                        initiallyExpanded = searchQuery.isNotBlank()
                                    )
                                }
                            }

                            // Spacer al final
                            item {
                                Spacer(modifier = Modifier.height(80.dp))
                            }
                        }
                    }
                }
            }
        }

        // Footer sticky
        Surface(
            modifier = Modifier.fillMaxWidth(),
            tonalElevation = 8.dp,
            shadowElevation = 8.dp
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                OutlinedButton(
                    onClick = onDismiss,
                    modifier = Modifier.weight(1f)
                ) {
                    Text("CANCELAR")
                }

                Button(
                    onClick = {
                        onApply(tempSelectedIds)
                    },
                    modifier = Modifier.weight(1f)
                ) {
                    Icon(Icons.Default.Check, contentDescription = null)
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("APLICAR")
                }
            }
        }
    }
}

@Composable
private fun CategorySection(
    category: String,
    components: List<OptionalGeneratorSetComponent>,
    selectedIds: Set<Int>,
    onToggleSelection: (Int) -> Unit,
    initiallyExpanded: Boolean = false
) {
    var expanded by rememberSaveable(initiallyExpanded) {
        mutableStateOf(initiallyExpanded)
    }

    // Auto-expandir si hay búsqueda activa
    LaunchedEffect(initiallyExpanded) {
        if (initiallyExpanded) {
            expanded = true
        }
    }

    val selectedCount = components.count { comp ->
        comp.id?.let { it in selectedIds } ?: false
    }

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surfaceVariant
        )
    ) {
        Column {
            // Header de categoría (clickeable para expandir/colapsar)
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { expanded = !expanded }
                    .padding(16.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = category,
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = "$selectedCount/${components.size} seleccionados",
                        style = MaterialTheme.typography.bodySmall,
                        color = if (selectedCount > 0) {
                            MaterialTheme.colorScheme.primary
                        } else {
                            MaterialTheme.colorScheme.onSurfaceVariant
                        }
                    )
                }

                IconButton(onClick = { expanded = !expanded }) {
                    Icon(
                        imageVector = if (expanded) Icons.Default.ExpandLess else Icons.Default.ExpandMore,
                        contentDescription = if (expanded) "Colapsar" else "Expandir"
                    )
                }
            }

            // Items de la categoría (expandible)
            AnimatedVisibility(
                visible = expanded,
                enter = expandVertically(),
                exit = shrinkVertically()
            ) {
                Column {
                    components.forEach { component ->
                        component.id?.let { compId ->
                            AccessoryItem(
                                component = component,
                                isSelected = compId in selectedIds,
                                onToggle = { onToggleSelection(compId) }
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun AccessoryItem(
    component: OptionalGeneratorSetComponent,
    isSelected: Boolean,
    onToggle: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onToggle() }
            .padding(horizontal = 16.dp, vertical = 8.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Row(
            modifier = Modifier.weight(1f),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Checkbox(
                checked = isSelected,
                onCheckedChange = { onToggle() }
            )

            Spacer(modifier = Modifier.width(8.dp))

            Column {
                Text(
                    text = component.name ?: "Sin nombre",
                    style = MaterialTheme.typography.bodyLarge,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis
                )

                component.code?.let { code ->
                    Text(
                        text = code,
                        style = MaterialTheme.typography.bodySmall,
                        color = Color.Gray
                    )
                }

                component.description?.takeIf { it.isNotBlank() }?.let { desc ->
                    Text(
                        text = desc,
                        style = MaterialTheme.typography.bodySmall,
                        maxLines = 2,
                        overflow = TextOverflow.Ellipsis,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        }

        Spacer(modifier = Modifier.width(8.dp))

        // Precio o badge ESTÁNDAR
        val price = component.price?.toDoubleOrNull()
        if (price != null && price > 0) {
            Text(
                text = "USD ${String.format("%.2f", price)}",
                style = MaterialTheme.typography.titleSmall,
                color = MaterialTheme.colorScheme.primary,
                fontWeight = FontWeight.Bold
            )
        } else {
            Badge(
                containerColor = MaterialTheme.colorScheme.secondaryContainer
            ) {
                Text("ESTÁNDAR", style = MaterialTheme.typography.labelSmall)
            }
        }
    }
}
