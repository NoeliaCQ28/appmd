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
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.fmsac.cotizadormodasa.core.generator_sets.ITMExtended
import com.fmsac.cotizadormodasa.presentation.components.inputs.ComponentSearchBar
import com.fmsac.cotizadormodasa.presentation.state.FetchState
import com.fmsac.cotizadormodasa.presentation.viewmodels.generator_sets.ITMSelectionViewModel

/**
 * Modal Bottom Sheet para seleccionar ITMs
 * Muestra lista completa de ITMs disponibles con búsqueda
 *
 * @param isOpen Estado de visibilidad del modal
 * @param currentITMId ID del ITM actualmente seleccionado
 * @param integradoraId ID de la integradora para cargar ITMs
 * @param onDismiss Callback cuando se cierra el modal
 * @param onApply Callback cuando se aplica la selección
 * @param viewModel ViewModel para gestionar estado
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ITMSelectionBottomSheet(
    isOpen: Boolean,
    currentITMId: Int?,
    integradoraId: Int?,
    onDismiss: () -> Unit,
    onApply: (Int) -> Unit,
    viewModel: ITMSelectionViewModel
) {
    val sheetState = rememberModalBottomSheetState(
        skipPartiallyExpanded = true
    )

    // Cargar ITMs cuando se abre el modal
    LaunchedEffect(isOpen, integradoraId) {
        if (isOpen && integradoraId != null) {
            viewModel.loadITMs(integradoraId)
            viewModel.setTempSelectedITMId(currentITMId)
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
            ITMSelectionContent(
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
private fun ITMSelectionContent(
    viewModel: ITMSelectionViewModel,
    integradoraId: Int?,
    onDismiss: () -> Unit,
    onApply: (Int) -> Unit
) {
    val filteredITMs by viewModel.filteredITMs.collectAsStateWithLifecycle()
    val searchQuery by viewModel.searchQuery.collectAsStateWithLifecycle()
    val tempSelectedId by viewModel.tempSelectedITMId.collectAsStateWithLifecycle()
    val fetchState by viewModel.fetchState.collectAsStateWithLifecycle(initialValue = FetchState.Idle)

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(bottom = 16.dp)
    ) {
        // Header
        Text(
            text = "Seleccionar ITM (Interruptor)",
            style = MaterialTheme.typography.titleLarge,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)
        )

        // SearchBar
        ComponentSearchBar(
            searchQuery = searchQuery,
            onSearchQueryChange = { viewModel.setSearchQuery(it) },
            placeholder = "Buscar por nombre, amperaje, marca..."
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
                            text = "No se puede cargar ITMs: integradora no disponible",
                            color = MaterialTheme.colorScheme.error,
                            modifier = Modifier
                                .align(Alignment.Center)
                                .padding(16.dp)
                        )
                    } else if (filteredITMs.isEmpty()) {
                        Text(
                            text = if (searchQuery.isBlank()) {
                                "No hay ITMs disponibles"
                            } else {
                                "No se encontraron ITMs"
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
                                items = filteredITMs,
                                key = { it.id }
                            ) { itm ->
                                ITMCard(
                                    itm = itm,
                                    isSelected = tempSelectedId == itm.id,
                                    onSelect = {
                                        viewModel.setTempSelectedITMId(itm.id)
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
private fun ITMCard(
    itm: ITMExtended,
    isSelected: Boolean,
    onSelect: () -> Unit
) {
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
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = itm.kitName,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis
                )

                Spacer(modifier = Modifier.height(4.dp))

                Row(
                    horizontalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    Text(
                        text = "${itm.amperage}A",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.primary,
                        fontWeight = FontWeight.Medium
                    )

                    Text(
                        text = "${itm.poles} Polos",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }

                itm.brand?.let { brand ->
                    Spacer(modifier = Modifier.height(2.dp))
                    Text(
                        text = "Marca: $brand",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }

            Spacer(modifier = Modifier.width(16.dp))

            Text(
                text = "USD ${String.format("%.2f", itm.price)}",
                style = MaterialTheme.typography.titleMedium,
                color = MaterialTheme.colorScheme.primary,
                fontWeight = FontWeight.Bold
            )
        }
    }
}
