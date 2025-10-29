package com.fmsac.cotizadormodasa.presentation.components

import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.background
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.ArrowForward
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.times

@OptIn(ExperimentalFoundationApi::class)
@Composable
fun Table(
    headers: List<String>,
    data: List<List<String>>,
    requireStatus: Boolean = false,
    isDarkMode: Boolean = isSystemInDarkTheme(),
    // Altura fija para la tabla (área scrollable)
    tableHeight: Dp = 400.dp,
    // Ancho mínimo de cada columna en caso de que el espacio sea limitado
    columnMinWidth: Dp = 150.dp,
    // Valor inicial de ítems por página y opciones disponibles
    initialItemsPerPage: Int = 10,
    itemsPerPageOptions: List<Int> = listOf(5, 10, 20, 50)
) {
    // Estados de paginación
    var currentPage by remember { mutableStateOf(1) }
    var itemsPerPage by remember { mutableStateOf(initialItemsPerPage) }

    // Se calcula el total de páginas (mínimo 1)
    val totalPages = if (data.isEmpty()) 1 else ((data.size - 1) / itemsPerPage) + 1

    // Aseguramos que la página actual no supere el total
    if (currentPage > totalPages) {
        currentPage = totalPages
    }

    // Se determina el subconjunto de datos correspondiente a la página actual.
    val startIndex = (currentPage - 1) * itemsPerPage
    val endIndex = (startIndex + itemsPerPage).coerceAtMost(data.size)
    val visibleData = if (data.isNotEmpty()) data.subList(startIndex, endIndex) else emptyList()

    Column(
        modifier = Modifier.fillMaxWidth(),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // La tabla (área scrollable) se coloca en un BoxWithConstraints para adaptar su ancho
        BoxWithConstraints(modifier = Modifier.fillMaxWidth()) {
            val parentWidth = maxWidth
            // Ancho requerido si cada columna tuviera al menos columnMinWidth
            val requiredWidth = headers.size * columnMinWidth
            // Si el ancho del contenedor es menor, se habilita el scroll horizontal
            val tableWidth = if (parentWidth < requiredWidth) requiredWidth else parentWidth
            // Altura de la tabla dinamica a la cantidad de items
            val tableHeightDynamic = (itemsPerPage * 45.dp)
            val isScrollable = parentWidth < requiredWidth
            val horizontalScrollState = rememberScrollState()

            Box(
                modifier = if (isScrollable) Modifier
                    .horizontalScroll(horizontalScrollState)
                else Modifier
            ) {
                LazyColumn(
                    modifier = Modifier
                        .width(tableWidth)
                        .heightIn(max = tableHeightDynamic)
                        .padding(vertical = 16.dp)
                ) {
                    // Cabecera sticky: permanece fija al hacer scroll vertical
                    stickyHeader {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(topEnd = 8.dp, topStart = 8.dp))
                                .background(
                                    if (isDarkMode) Color(0xFF43455f) else Color(0xFFf4f2ff)
                                )
                        ) {
                            headers.forEach { header ->
                                Text(
                                    text = header.uppercase(),
                                    modifier = if (isScrollable)
                                        Modifier
                                            .width(columnMinWidth)
                                            .padding(horizontal = 8.dp, vertical = 16.dp)
                                    else
                                        Modifier
                                            .weight(1f)
                                            .padding(horizontal = 8.dp, vertical = 16.dp),
                                    fontWeight = FontWeight.Bold,
                                    textAlign = TextAlign.Center,
                                    style = MaterialTheme.typography.bodyMedium
                                )
                            }
                        }
                        HorizontalDivider(
                            thickness = 1.dp,
                            color = Color(0xFFBDBDBD)
                        )
                    }
                    // Filas de datos correspondientes a la página actual
                    items(visibleData) { rowData ->
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            rowData.forEachIndexed { index, cell ->
                                if (index == rowData.lastIndex && requireStatus) {
                                    StatusBadge(
                                        status = cell,
                                        modifier = if (isScrollable)
                                            Modifier
                                                .width(columnMinWidth)
                                                .padding(8.dp)
                                        else
                                            Modifier
                                                .weight(1f)
                                                .padding(8.dp)
                                    )
                                } else {
                                    Text(
                                        text = cell,
                                        modifier = if (isScrollable)
                                            Modifier
                                                .width(columnMinWidth)
                                                .padding(8.dp)
                                        else
                                            Modifier
                                                .weight(1f)
                                                .padding(8.dp),
                                        textAlign = TextAlign.Center,
                                        style = MaterialTheme.typography.bodyMedium
                                    )
                                }
                            }
                        }
                        HorizontalDivider(
                            thickness = 0.5.dp,
                            color = Color(0xFFD5D5D5)
                        )
                    }
                }
            }
        }

        // Espaciado entre la tabla y los controles de paginación
        Spacer(modifier = Modifier.height(2.dp))

        // Controles de paginación (fuera de la tabla, centrados)
        PaginationControls(
            currentPage = currentPage,
            totalPages = totalPages,
            itemsPerPage = itemsPerPage,
            itemsPerPageOptions = itemsPerPageOptions,
            onPageChange = { newPage -> currentPage = newPage },
            onItemsPerPageChange = { newItemsPerPage ->
                itemsPerPage = newItemsPerPage
                currentPage = 1 // Reiniciamos a la primera página al cambiar el número de ítems
            }
        )
    }
}

@Composable
private fun PaginationControls(
    currentPage: Int,
    totalPages: Int,
    itemsPerPage: Int,
    itemsPerPageOptions: List<Int>,
    onPageChange: (Int) -> Unit,
    onItemsPerPageChange: (Int) -> Unit
) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.Center,
        modifier = Modifier.fillMaxWidth()
    ) {

        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Center,
            modifier = Modifier
        ) {
            Text(
                text = "Items por página:",
                style = MaterialTheme.typography.bodyMedium
            )
            Spacer(modifier = Modifier.width(8.dp))
            var expanded by remember { mutableStateOf(false) }
            Box {
                OutlinedButton(onClick = { expanded = true }) {
                    Text(text = itemsPerPage.toString())
                }
                DropdownMenu(
                    expanded = expanded,
                    onDismissRequest = { expanded = false }
                ) {
                    itemsPerPageOptions.forEach { option ->
                        DropdownMenuItem(
                            text = { Text(text = option.toString()) },
                            onClick = {
                                onItemsPerPageChange(option)
                                expanded = false
                            }
                        )
                    }
                }
            }
        }

        Spacer(modifier = Modifier.width(8.dp))

        IconButton(
            onClick = { if (currentPage > 1) onPageChange(currentPage - 1) },
            enabled = currentPage > 1
        ) {
            Icon(
                imageVector = Icons.Filled.ArrowBack,
                contentDescription = "Anterior"
            )
        }
        Text(
            text = "Página $currentPage de $totalPages",
            style = MaterialTheme.typography.bodyMedium,
            modifier = Modifier.padding(horizontal = 16.dp)
        )
        IconButton(
            onClick = { if (currentPage < totalPages) onPageChange(currentPage + 1) },
            enabled = currentPage < totalPages
        ) {
            Icon(
                imageVector = Icons.Filled.ArrowForward,
                contentDescription = "Siguiente"
            )
        }
    }
}
