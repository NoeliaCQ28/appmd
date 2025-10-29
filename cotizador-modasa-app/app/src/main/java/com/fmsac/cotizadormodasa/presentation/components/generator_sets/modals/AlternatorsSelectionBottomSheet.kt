package com.fmsac.cotizadormodasa.presentation.components.generator_sets.modals

import androidx.compose.foundation.BorderStroke
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
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.SheetState
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.fmsac.cotizadormodasa.core.generator_sets.AlternatorExtended
import com.fmsac.cotizadormodasa.presentation.components.inputs.ComponentSearchBar
import com.fmsac.cotizadormodasa.presentation.state.FetchState
import com.fmsac.cotizadormodasa.presentation.viewmodels.generator_sets.AlternatorSelectionViewModel

/**
 * Modal Bottom Sheet para seleccionar alternadores
 * Muestra lista completa de alternadores disponibles con búsqueda
 *
 * @param isOpen Estado de visibilidad del modal
 * @param currentAlternatorId ID del alternador actualmente seleccionado
 * @param integradoraId ID de la integradora para cargar alternadores
 * @param onDismiss Callback cuando se cierra el modal
 * @param onApply Callback cuando se aplica la selección
 * @param viewModel ViewModel para gestionar estado
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AlternatorsSelectionBottomSheet(
    isOpen: Boolean,
    currentAlternatorId: Int?,
    integradoraId: Int?,
    onDismiss: () -> Unit,
    onApply: (Int) -> Unit,
    viewModel: AlternatorSelectionViewModel
) {
    val sheetState = rememberModalBottomSheetState(
        skipPartiallyExpanded = true
    )

    // Cargar alternadores cuando se abre el modal
    LaunchedEffect(isOpen, integradoraId) {
        if (isOpen && integradoraId != null) {
            viewModel.loadAlternators(integradoraId)
            viewModel.setTempSelectedAlternatorId(currentAlternatorId)
        }
    }

    if (isOpen) {
        ModalBottomSheet(
            onDismissRequest = {
                viewModel.clearSearch()
                viewModel.clearTempSelection()
                onDismiss()
            },
            sheetState = sheetState
        ) {
            AlternatorsSelectionContent(
                viewModel = viewModel,
                integradoraId = integradoraId,
                onDismiss = {
                    viewModel.clearSearch()
                    viewModel.clearTempSelection()
                    onDismiss()
                },
                onApply = { selectedId ->
                    viewModel.clearSearch()
                    onApply(selectedId)
                }
            )
        }
    }
}

@Composable
private fun AlternatorsSelectionContent(
    viewModel: AlternatorSelectionViewModel,
    integradoraId: Int?,
    onDismiss: () -> Unit,
    onApply: (Int) -> Unit
) {
    val filteredAlternators by viewModel.filteredAlternators.collectAsStateWithLifecycle()
    val searchQuery by viewModel.searchQuery.collectAsStateWithLifecycle()
    val tempSelectedId by viewModel.tempSelectedAlternatorId.collectAsStateWithLifecycle()
    val fetchState by viewModel.fetchState.collectAsStateWithLifecycle(initialValue = FetchState.Idle)

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(bottom = 16.dp)
    ) {
        // Header
        Text(
            text = "Seleccionar Alternador",
            style = MaterialTheme.typography.titleLarge,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)
        )

        // SearchBar
        ComponentSearchBar(
            searchQuery = searchQuery,
            onSearchQueryChange = { viewModel.setSearchQuery(it) },
            placeholder = "Buscar por modelo, marca, familia..."
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
                    if (integradoraId == null) {
                        Text(
                            text = "No se puede cargar alternadores: integradora no disponible",
                            color = MaterialTheme.colorScheme.error,
                            modifier = Modifier
                                .align(Alignment.Center)
                                .padding(16.dp)
                        )
                    } else if (filteredAlternators.isEmpty()) {
                        Text(
                            text = if (searchQuery.isBlank()) {
                                "No hay alternadores disponibles"
                            } else {
                                "No se encontraron alternadores"
                            },
                            modifier = Modifier
                                .align(Alignment.Center)
                                .padding(16.dp)
                        )
                    } else {
                        LazyColumn(
                            modifier = Modifier.fillMaxSize(),
                            verticalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            items(
                                items = filteredAlternators,
                                key = { it.id }
                            ) { alternator ->
                                AlternatorCard(
                                    alternator = alternator,
                                    isSelected = tempSelectedId == alternator.id,
                                    onSelect = {
                                        viewModel.setTempSelectedAlternatorId(alternator.id)
                                    }
                                )
                            }

                            // Spacer al final para que el último item no quede pegado al footer
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
                        tempSelectedId?.let { onApply(it) }
                    },
                    modifier = Modifier.weight(1f),
                    enabled = tempSelectedId != null
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
private fun AlternatorCard(
    alternator: AlternatorExtended,
    isSelected: Boolean,
    onSelect: () -> Unit
) {
    var expanded by rememberSaveable { mutableStateOf(false) }

    Card(
        onClick = onSelect,
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp),
        border = if (isSelected) {
            BorderStroke(2.dp, MaterialTheme.colorScheme.primary)
        } else {
            null
        },
        colors = CardDefaults.cardColors(
            containerColor = if (isSelected) {
                MaterialTheme.colorScheme.primaryContainer
            } else {
                MaterialTheme.colorScheme.surface
            }
        )
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            // Header con nombre y marca
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = alternator.name,
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                    Text(
                        text = alternator.brand,
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }

                Text(
                    text = "USD ${String.format("%.2f", alternator.price)}",
                    style = MaterialTheme.typography.titleMedium,
                    color = MaterialTheme.colorScheme.primary,
                    fontWeight = FontWeight.Bold
                )
            }

            // Familia si existe
            alternator.family?.let { family ->
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "Familia: $family",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            // Botón expandir/colapsar detalles técnicos
            if (hasTechnicalDetails(alternator)) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 8.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Detalles técnicos",
                        style = MaterialTheme.typography.labelMedium,
                        color = MaterialTheme.colorScheme.primary
                    )

                    IconButton(onClick = { expanded = !expanded }) {
                        Icon(
                            imageVector = if (expanded) Icons.Default.ExpandLess else Icons.Default.ExpandMore,
                            contentDescription = if (expanded) "Ocultar detalles" else "Ver detalles"
                        )
                    }
                }

                // Detalles técnicos expandibles
                if (expanded) {
                    Column(
                        modifier = Modifier.padding(top = 8.dp),
                        verticalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        alternator.ipGrade?.let {
                            TechnicalDetailRow("Grado IP", it)
                        }
                        alternator.insulation?.let {
                            TechnicalDetailRow("Aislamiento", it)
                        }
                        alternator.frame?.let {
                            TechnicalDetailRow("Bastidor", it)
                        }
                        alternator.disk?.let {
                            TechnicalDetailRow("Disco", it)
                        }
                        alternator.excitationSystem?.let {
                            TechnicalDetailRow("Sistema de Excitación", it)
                        }
                        alternator.avrCard?.let {
                            TechnicalDetailRow("Tarjeta AVR", it)
                        }
                        alternator.weight?.let {
                            TechnicalDetailRow("Peso", "$it kg")
                        }
                        alternator.technicalNorms?.let {
                            TechnicalDetailRow("Normas Técnicas", it)
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun TechnicalDetailRow(label: String, value: String) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(
            text = "$label:",
            style = MaterialTheme.typography.bodySmall,
            fontWeight = FontWeight.Medium,
            modifier = Modifier.weight(0.4f)
        )
        Text(
            text = value,
            style = MaterialTheme.typography.bodySmall,
            modifier = Modifier.weight(0.6f)
        )
    }
}

private fun hasTechnicalDetails(alternator: AlternatorExtended): Boolean {
    return alternator.ipGrade != null ||
            alternator.insulation != null ||
            alternator.frame != null ||
            alternator.disk != null ||
            alternator.excitationSystem != null ||
            alternator.avrCard != null ||
            alternator.weight != null ||
            alternator.technicalNorms != null
}
