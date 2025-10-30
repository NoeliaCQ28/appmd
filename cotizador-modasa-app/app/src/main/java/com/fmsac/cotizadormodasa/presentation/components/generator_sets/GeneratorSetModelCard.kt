package com.fmsac.cotizadormodasa.presentation.components.generator_sets

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.selection.selectable
import androidx.compose.foundation.selection.selectableGroup
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AddCircleOutline
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Done
import androidx.compose.material.icons.filled.OfflineBolt
import androidx.compose.material.icons.filled.Power
import androidx.compose.material3.Badge
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.FilledTonalButton
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedCard
import androidx.compose.material3.RadioButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.derivedStateOf
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableDoubleStateOf
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavHostController
import androidx.navigation.compose.rememberNavController
import android.util.Log
import java.util.Locale
import com.fmsac.cotizadormodasa.core.generator_sets.GeneratingSetsParameters
import com.fmsac.cotizadormodasa.core.generator_sets.GeneratorSetModel
import com.fmsac.cotizadormodasa.core.generator_sets.GeneratorSetModelItem
import com.fmsac.cotizadormodasa.core.generator_sets.GeneratorSetMotor
import com.fmsac.cotizadormodasa.presentation.components.Button
import com.fmsac.cotizadormodasa.presentation.components.ButtonVariant
import com.fmsac.cotizadormodasa.presentation.components.generator_sets.modals.AccessoriesSelectionBottomSheet
import com.fmsac.cotizadormodasa.presentation.components.generator_sets.modals.AlternatorsSelectionBottomSheet
import com.fmsac.cotizadormodasa.presentation.components.generator_sets.modals.ITMSelectionBottomSheet
import com.fmsac.cotizadormodasa.presentation.theme.ui.CotizadorModasaTheme
import com.fmsac.cotizadormodasa.presentation.viewmodels.generator_sets.AlternatorSelectionViewModel
import com.fmsac.cotizadormodasa.presentation.viewmodels.generator_sets.GeneratorSetViewModel
import com.fmsac.cotizadormodasa.presentation.viewmodels.generator_sets.ITMSelectionViewModel
import com.fmsac.cotizadormodasa.presentation.viewmodels.generator_sets.OptionalGeneratorSetComponentsViewModel
import com.fmsac.cotizadormodasa.data.network.responses.generator_sets.GeneratorSetV2CombinationResponse
import kotlinx.coroutines.launch
@Composable
fun GeneratorSetModelCard(
    modifier: Modifier = Modifier,
    @Suppress("UNUSED_PARAMETER") controller: NavHostController,
    onAdd: (GeneratorSetModelItem) -> Unit = {},
    params: GeneratingSetsParameters?,
    model: GeneratorSetModel,
    generatorSetViewModel: GeneratorSetViewModel,
    optionalGeneratorSetComponentsViewModel: OptionalGeneratorSetComponentsViewModel,
    alternatorSelectionViewModel: AlternatorSelectionViewModel,
    itmSelectionViewModel: ITMSelectionViewModel
) {
    // Declarar variables antes de usarlas en callbacks
    var alternatorSelected by rememberSaveable {
        mutableStateOf(model.alternators.first())
    }

    var basePrice by rememberSaveable {
        mutableDoubleStateOf(alternatorSelected.modelPrice)
    }

    var discount by rememberSaveable {
        mutableStateOf(0 to "Sin Descuento")
    }

    var isNotifyDiscount by rememberSaveable {
        mutableStateOf(false)
    }

    // Modal states
    var showAlternatorsModal by rememberSaveable { mutableStateOf(false) }
    var showITMModal by rememberSaveable { mutableStateOf(false) }
    var showAccessoriesModal by rememberSaveable { mutableStateOf(false) }

    // External component selection
    var externalAlternatorId by rememberSaveable { mutableIntStateOf(0) }
    var externalAlternatorName by rememberSaveable { mutableStateOf<String?>(null) }
    var externalCombinationPrice by rememberSaveable { mutableDoubleStateOf(0.0) }

    var externalITMId by rememberSaveable { mutableIntStateOf(0) }
    var externalITMName by rememberSaveable { mutableStateOf<String?>(null) }

    // External power ratings (Prime and Standby)
    var externalPrimeKW by rememberSaveable { mutableDoubleStateOf(0.0) }
    var externalPrimeKVA by rememberSaveable { mutableDoubleStateOf(0.0) }
    var externalStandbyKW by rememberSaveable { mutableDoubleStateOf(0.0) }
    var externalStandbyKVA by rememberSaveable { mutableDoubleStateOf(0.0) }

    var selectedAccessoryIds by rememberSaveable { mutableStateOf<Set<Int>>(emptySet()) }

    // Establecer referencia compartida con los ViewModels de selección
    LaunchedEffect(Unit) {
        alternatorSelectionViewModel.setSharedViewModel(generatorSetViewModel)
        itmSelectionViewModel.setSharedViewModel(generatorSetViewModel)
    }

    // Escuchar eventos de actualización de combinación
    val combinationUpdateEvents by generatorSetViewModel.combinationUpdateEvents.collectAsStateWithLifecycle(initialValue = null)

    // Validación defensiva: No renderizar si no hay alternators
    if (model.alternators.isEmpty()) {
        Log.w("GeneratorSetModelCard", "Model '${model.name}' has no alternators, skipping render")
        return
    }

    val modelsSelected by generatorSetViewModel.modelsSelected.collectAsStateWithLifecycle()

    val isThisModelSelected = modelsSelected.any { it.modelId == model.id }

    val (alternatorNameSelected, setAlternatorNameSelected) = remember {
        mutableStateOf(
            alternatorSelected.name
        )
    }

    // Obtener detalles completos de los accesorios seleccionados
    val selectedAccessoriesDetails = remember(selectedAccessoryIds) {
        derivedStateOf {
            optionalGeneratorSetComponentsViewModel.getComponentsByIds(selectedAccessoryIds)
        }
    }

    // Calcular total de accesorios
    val accessoriesTotal by remember {
        derivedStateOf {
            selectedAccessoriesDetails.value.sumOf {
                it.price?.toDoubleOrNull() ?: 0.0
            }
        }
    }

    // Precio total antes de descuentos (base + componentes externos + accesorios)
    val totalPriceBeforeDiscount by remember {
        derivedStateOf {
            basePrice + externalCombinationPrice + accessoriesTotal
        }
    }

    // Precio final con descuento aplicado
    val finalPrice by remember {
        derivedStateOf {
            val discountFactor = discount.first / 100.0
            totalPriceBeforeDiscount * (1 - discountFactor)
        }
    }

    // Actualizar basePrice cuando cambia el alternador seleccionado
    LaunchedEffect(alternatorSelected) {
        basePrice = alternatorSelected.modelPrice
    }

    OutlinedCard(
        modifier = modifier.fillMaxWidth(),
        border = if (isThisModelSelected) BorderStroke(
            1.dp,
            if (isSystemInDarkTheme()) Color.White else Color.Black
        ) else CardDefaults.outlinedCardBorder()
    ) {


        Column(modifier = Modifier.padding(8.dp)) {
            Text(
                text = model.name,
                style = TextStyle(fontWeight = FontWeight.Bold, fontSize = 22.sp)
            )
            Text(
                "Motor: ${model.motor.name}",
                style = TextStyle(fontWeight = FontWeight.Medium, fontSize = 16.sp)
            )

            Spacer(modifier = Modifier.height(2.dp))

            // Usar potencias externas si están disponibles, de lo contrario usar las del alternador seleccionado
            val primePowerKW = if (externalPrimeKW > 0.0) externalPrimeKW else alternatorSelected.modelDerate.prime.kw
            val primePowerKVA = if (externalPrimeKVA > 0.0) externalPrimeKVA else alternatorSelected.modelDerate.prime.kva
            val standByPowerKW = if (externalStandbyKW > 0.0) externalStandbyKW else alternatorSelected.modelDerate.standby.kw
            val standByPowerKVA = if (externalStandbyKVA > 0.0) externalStandbyKVA else alternatorSelected.modelDerate.standby.kva

            Text(
                "Potencia Prime: $primePowerKW KW - $primePowerKVA KVA",
                style = TextStyle(fontWeight = FontWeight.Medium, fontSize = 14.sp)
            )

            Spacer(modifier = Modifier.height(1.dp))

            Text(
                "Potencia Stand By: $standByPowerKW KW - $standByPowerKVA KVA",
                style = TextStyle(fontWeight = FontWeight.Medium, fontSize = 14.sp)
            )

            Spacer(modifier = Modifier.height(8.dp))

            // Selector de Régimen Prime/Standby
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                OutlinedButton(
                    onClick = {
                        generatorSetViewModel.updateModelRegimen(model.id, "Prime")
                    },
                    modifier = Modifier.weight(1f),
                    enabled = !isThisModelSelected,
                    colors = ButtonDefaults.outlinedButtonColors(
                        containerColor = if (model.selectedRegimen == "Prime")
                            MaterialTheme.colorScheme.primary
                        else
                            MaterialTheme.colorScheme.surface,
                        contentColor = if (model.selectedRegimen == "Prime")
                            MaterialTheme.colorScheme.onPrimary
                        else
                            MaterialTheme.colorScheme.onSurface
                    )
                ) {
                    Text("Prime")
                }

                OutlinedButton(
                    onClick = {
                        generatorSetViewModel.updateModelRegimen(model.id, "Standby")
                    },
                    modifier = Modifier.weight(1f),
                    enabled = !isThisModelSelected,
                    colors = ButtonDefaults.outlinedButtonColors(
                        containerColor = if (model.selectedRegimen == "Standby")
                            MaterialTheme.colorScheme.primary
                        else
                            MaterialTheme.colorScheme.surface,
                        contentColor = if (model.selectedRegimen == "Standby")
                            MaterialTheme.colorScheme.onPrimary
                        else
                            MaterialTheme.colorScheme.onSurface
                    )
                ) {
                    Text("Standby")
                }
            }

            Spacer(modifier = Modifier.height(6.dp))

            Text(
                "Alternadores",
                style = TextStyle(fontWeight = FontWeight.Medium, fontSize = 16.sp)
            )

            val radioOptions = model.alternators.map { it.name }

            Column(Modifier.selectableGroup()) {
                radioOptions.forEach { text ->
                    Row(
                        Modifier
                            .fillMaxWidth()
                            .height(36.dp)
                            .selectable(
                                selected = (text == alternatorNameSelected),
                                onClick = {

                                    if (isThisModelSelected) return@selectable

                                    setAlternatorNameSelected(text)

                                    val alternator = model.alternators.find { it.name == text }

                                    if (alternator != null) {
                                        alternatorSelected = alternator
                                        // Asignar precio base del radio button seleccionado
                                        basePrice = alternator.modelPrice

                                        // Resetear estado externo (mutuamente excluyente con basePrice)
                                        externalCombinationPrice = 0.0
                                        externalAlternatorId = 0
                                        externalAlternatorName = null
                                        externalITMId = 0
                                        externalITMName = null
                                        externalPrimeKW = 0.0
                                        externalPrimeKVA = 0.0
                                        externalStandbyKW = 0.0
                                        externalStandbyKVA = 0.0
                                    }

                                },
                                role = Role.RadioButton
                            )
                            .padding(horizontal = 16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        RadioButton(
                            selected = (text == alternatorNameSelected) && externalAlternatorId == 0,
                            onClick = null,
                            enabled = !isThisModelSelected
                        )
                        Text(
                            text = text,
                            style = MaterialTheme.typography.bodyLarge,
                            modifier = Modifier.padding(start = 16.dp)
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Sección de otros componentes
            Text(
                "Otros Componentes",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold
            )

            Spacer(modifier = Modifier.height(8.dp))

            // Botones para modales de componentes
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                // Botón VER ALTERNADORES
                FilledTonalButton(
                    onClick = { showAlternatorsModal = true },
                    modifier = Modifier.weight(1f),
                    enabled = !isThisModelSelected
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.Power,
                            contentDescription = null
                        )
                        Text(
                            "ALTERNADORES",
                            fontSize = 10.sp,
                            maxLines = 1
                        )
                        if (externalAlternatorId != 0) {
                            Badge {
                                Text("1")
                            }
                        }
                    }
                }

                // Botón ITM
                FilledTonalButton(
                    onClick = { showITMModal = true },
                    modifier = Modifier.weight(1f),
                    enabled = !isThisModelSelected
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.OfflineBolt,
                            contentDescription = null
                        )
                        Text(
                            "ITM",
                            fontSize = 10.sp,
                            maxLines = 1
                        )
                        if (externalITMId != 0) {
                            Badge {
                                Text("1")
                            }
                        }
                    }
                }

                // Botón ACCESORIOS
                Column(
                    modifier = Modifier.weight(1f),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    FilledTonalButton(
                        onClick = { showAccessoriesModal = true },
                        modifier = Modifier.fillMaxWidth(),
                        enabled = !isThisModelSelected
                    ) {
                        Column(
                            horizontalAlignment = Alignment.CenterHorizontally,
                            verticalArrangement = Arrangement.Center
                        ) {
                            Icon(
                                imageVector = Icons.Default.AddCircleOutline,
                                contentDescription = null
                            )
                            Text(
                                "ACCESORIOS",
                                fontSize = 10.sp,
                                maxLines = 1
                            )
                            if (selectedAccessoryIds.isNotEmpty()) {
                                Badge {
                                    Text("${selectedAccessoryIds.size}")
                                }
                            }
                        }
                    }

                    // Botón para limpiar accesorios
                    if (selectedAccessoryIds.isNotEmpty() && !isThisModelSelected) {
                        IconButton(
                            onClick = { selectedAccessoryIds = emptySet() },
                            modifier = Modifier.padding(top = 2.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.Close,
                                contentDescription = "Limpiar accesorios",
                                tint = MaterialTheme.colorScheme.error,
                                modifier = Modifier.padding(4.dp)
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Resumen de componentes externos seleccionados (alternadores, ITMs)
            if (externalAlternatorId != 0 || externalITMId != 0) {
                OutlinedCard(
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(8.dp)) {
                        Text(
                            "Componentes Externos",
                            style = TextStyle(fontWeight = FontWeight.SemiBold)
                        )

                        Spacer(modifier = Modifier.height(6.dp))

                        // Mostrar alternador externo si está seleccionado
                        if (externalAlternatorId != 0) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Text(
                                    text = "Alternador: ${externalAlternatorName ?: ""}",
                                    maxLines = 2,
                                    modifier = Modifier.weight(1f),
                                    style = TextStyle(fontSize = MaterialTheme.typography.bodyMedium.fontSize),
                                    softWrap = true,
                                    overflow = TextOverflow.Ellipsis
                                )
                            }
                        }

                        // Mostrar ITM externo si está seleccionado
                        if (externalITMId != 0) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Text(
                                    text = "ITM: ${externalITMName ?: ""}",
                                    maxLines = 2,
                                    modifier = Modifier.weight(1f),
                                    style = TextStyle(fontSize = MaterialTheme.typography.bodyMedium.fontSize),
                                    softWrap = true,
                                    overflow = TextOverflow.Ellipsis
                                )
                            }
                        }

                        HorizontalDivider(
                            modifier = Modifier.padding(top = 8.dp),
                            thickness = 0.5.dp
                        )

                        Spacer(modifier = Modifier.height(6.dp))

                        // Mostrar precio total de la combinación con botón de eliminar
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                "TOTAL EXTERNOS",
                                style = TextStyle(fontWeight = FontWeight.SemiBold)
                            )
                            Row(
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    "$ $externalCombinationPrice",
                                    style = TextStyle(fontWeight = FontWeight.SemiBold)
                                )
                                IconButton(
                                    onClick = {
                                        externalCombinationPrice = 0.0
                                        externalAlternatorId = 0
                                        externalAlternatorName = null
                                        externalITMId = 0
                                        externalITMName = null
                                    },
                                    enabled = !isThisModelSelected
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.Close,
                                        contentDescription = "Eliminar combinación externa",
                                        tint = MaterialTheme.colorScheme.error
                                    )
                                }
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(6.dp))
            }

            // Sección de Accesorios Agregados
            if (selectedAccessoriesDetails.value.isNotEmpty()) {
                OutlinedCard(
                    modifier = Modifier.fillMaxWidth(),
                    border = BorderStroke(
                        width = 1.dp,
                        color = MaterialTheme.colorScheme.outline.copy(alpha = 0.5f)
                    )
                ) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Text(
                            "Accesorios agregados",
                            style = MaterialTheme.typography.titleSmall,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onSurface
                        )

                        Spacer(modifier = Modifier.height(8.dp))

                        // Lista de accesorios
                        selectedAccessoriesDetails.value.forEach { accessory ->
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(vertical = 4.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column(modifier = Modifier.weight(1f)) {
                                    Text(
                                        text = accessory.name ?: "Sin nombre",
                                        style = MaterialTheme.typography.bodySmall,
                                        maxLines = 2,
                                        overflow = TextOverflow.Ellipsis
                                    )
                                    if (!accessory.description.isNullOrBlank()) {
                                        Text(
                                            text = accessory.description,
                                            style = MaterialTheme.typography.bodySmall,
                                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                                            maxLines = 1,
                                            overflow = TextOverflow.Ellipsis
                                        )
                                    }
                                }

                                Spacer(modifier = Modifier.width(8.dp))

                                Text(
                                    text = "$ ${accessory.price ?: "0.00"}",
                                    style = MaterialTheme.typography.bodySmall,
                                    fontWeight = FontWeight.Medium,
                                    color = MaterialTheme.colorScheme.primary
                                )
                            }
                        }

                        HorizontalDivider(
                            modifier = Modifier.padding(vertical = 8.dp),
                            thickness = 0.5.dp
                        )

                        // Total de accesorios
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(
                                "Total",
                                style = MaterialTheme.typography.titleSmall,
                                fontWeight = FontWeight.Bold
                            )
                            Text(
                                "$ ${String.format(Locale.US, "%.2f", accessoriesTotal)}",
                                style = MaterialTheme.typography.titleSmall,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.primary
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(6.dp))
            }

            GeneratorSetModelCardDiscount(
                enabled = !isThisModelSelected,
                discount = discount,
                onDiscount = { discountValue, discountDescription ->

                    discount = discountValue to discountDescription

                }, onNotifyDiscount = {
                    isNotifyDiscount = it
                })

            Spacer(modifier = Modifier.height(6.dp))


            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Column {
                    if (discount.first != 0) {
                        Text("PRECIO ORIGINAL")
                        Text(
                            "$${String.format(Locale.US, "%.2f", totalPriceBeforeDiscount)}",
                            style = TextStyle(textDecoration = TextDecoration.LineThrough)
                        )
                    }
                }

                Column(horizontalAlignment = Alignment.End) {
                    Text("PRECIO FINAL" + if (discount.first != 0) " (${discount.second} dcto.)" else "")
                    Text(
                        "$${String.format(Locale.US, "%.2f", finalPrice)}",
                        fontWeight = FontWeight.Bold
                    )
                }

            }

            Button(
                modifier = Modifier.fillMaxWidth(),
                variant = if (isThisModelSelected) ButtonVariant.TERTIARY else ButtonVariant.PRIMARY,
                onClick = {
                    val generatorSetModelItemToSave = GeneratorSetModelItem(
                        motorId = model.motor.id,
                        motorName = model.motor.name,
                        modelId = model.id,
                        modelName = model.name,
                        modelPrice = basePrice,
                        alternatorId = alternatorSelected.id,
                        alternatorName = alternatorNameSelected,
                        discountValue = discount.first,
                        discountDescription = discount.second,
                        discountIncrement = isNotifyDiscount,
                        params = params!!,
                        originalPrice = totalPriceBeforeDiscount,
                        finalPrice = finalPrice
                    )
                    onAdd(generatorSetModelItemToSave)
                },
                text = {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.Center,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            if (isThisModelSelected) "AGREGADO" else "AGREGAR",
                            style = TextStyle(fontWeight = FontWeight.Bold, fontSize = 16.sp)
                        )

                        if (isThisModelSelected) {

                            Spacer(modifier = Modifier.width(4.dp))

                            Icon(
                                imageVector = Icons.Filled.Done,
                                contentDescription = "Added"
                            )
                        }
                    }
                }
            )
        }
    }

    // Observar eventos de actualización de combinación
    LaunchedEffect(combinationUpdateEvents) {
        combinationUpdateEvents?.let { updatedResult ->
            if (updatedResult.originalIntegradoraId == model.integradoraId) {
                // Esta actualización es para nuestra combinación
                val combination = updatedResult.updatedCombination

                Log.d("GeneratorSetModelCard", "🔄 Received update for combination ${model.integradoraId}")
                Log.d("GeneratorSetModelCard", "Component changed: ${updatedResult.componentChanged}")
                Log.d("GeneratorSetModelCard", "New alternator: ${updatedResult.newAlternatorId}")
                Log.d("GeneratorSetModelCard", "New ITM: ${updatedResult.newItmId}")

                // Lógica de precios: El totalPriceUSD ya incluye todo, así que desactivamos basePrice
                basePrice = 0.0

                // Deseleccionar radio button
                setAlternatorNameSelected("")

                // Asignar el precio total de la combinación
                externalCombinationPrice = combination.totalPriceUSD

                // Actualizar IDs y nombres de AMBOS componentes
                externalAlternatorId = combination.alternatorId
                externalAlternatorName = combination.alternatorModel

                externalITMId = combination.itmId
                externalITMName = combination.itmKitName ?: "ITM ${combination.itmId}"

                // Actualizar potencias Prime y Standby desde la respuesta de la API
                externalPrimeKW = combination.primeKW
                externalPrimeKVA = combination.primeKVA
                externalStandbyKW = combination.standbyKW
                externalStandbyKVA = combination.standbyKVA

                Log.d("GeneratorSetModelCard", "💰 Updated prices - Total USD: ${combination.totalPriceUSD}")
                Log.d("GeneratorSetModelCard", "💰 basePrice: $basePrice, externalCombinationPrice: $externalCombinationPrice")
                Log.d("GeneratorSetModelCard", "⚡ Updated power - Prime: ${combination.primeKW} KW / ${combination.primeKVA} KVA, Standby: ${combination.standbyKW} KW / ${combination.standbyKVA} KVA")
            }
        }
    }

    // Modales de selección de componentes
    // Modal de alternadores
    AlternatorsSelectionBottomSheet(
        isOpen = showAlternatorsModal,
        currentAlternatorId = externalAlternatorId.takeIf { it != 0 },
        integradoraId = model.integradoraId,
        onDismiss = { showAlternatorsModal = false },
        onApply = { selectedId ->
            if (params != null) {
                // Crear combinación temporal con los datos actuales del modelo
                val currentCombination = GeneratorSetV2CombinationResponse(
                    integradoraId = model.integradoraId,
                    intKey = "",
                    modelName = model.name,
                    motorModel = model.motor.name,
                    motorBrand = "",
                    motorBrandVisual = "",
                    alternatorModel = alternatorSelected.name,
                    alternatorBrand = "",
                    alternatorId = alternatorSelected.id,
                    itmId = alternatorSelected.itms.firstOrNull()?.id ?: 0,
                    itmKitName = alternatorSelected.itms.firstOrNull()?.kitName,
                    priceOpen = basePrice,
                    priceCabin = basePrice,
                    totalPriceUSD = basePrice,
                    primeKW = alternatorSelected.modelDerate.prime.kw,
                    primeKVA = alternatorSelected.modelDerate.prime.kva,
                    standbyKW = alternatorSelected.modelDerate.standby.kw,
                    standbyKVA = alternatorSelected.modelDerate.standby.kva,
                    isSoundproof = params.isSoundproof
                )
                
                // Recalcular combinación con nuevo alternador
                alternatorSelectionViewModel.recalculatePriceWithAlternator(
                    currentCombination = currentCombination,
                    originalParams = params,
                    newAlternatorId = selectedId,
                    currentItmId = externalITMId.takeIf { it != 0 }
                )
                
                Log.d("GeneratorSetModelCard", "🔄 Recalculating with new alternator: $selectedId")
            }
            showAlternatorsModal = false
        },
        viewModel = alternatorSelectionViewModel
    )

    // Modal de ITMs
    ITMSelectionBottomSheet(
        isOpen = showITMModal,
        currentITMId = externalITMId.takeIf { it != 0 },
        integradoraId = model.integradoraId,
        onDismiss = { showITMModal = false },
        onApply = { selectedId ->
            if (params != null) {
                // Crear combinación temporal con los datos actuales del modelo
                val currentCombination = GeneratorSetV2CombinationResponse(
                    integradoraId = model.integradoraId,
                    intKey = "",
                    modelName = model.name,
                    motorModel = model.motor.name,
                    motorBrand = "",
                    motorBrandVisual = "",
                    alternatorModel = alternatorSelected.name,
                    alternatorBrand = "",
                    alternatorId = alternatorSelected.id,
                    itmId = alternatorSelected.itms.firstOrNull()?.id ?: 0,
                    itmKitName = alternatorSelected.itms.firstOrNull()?.kitName,
                    priceOpen = basePrice,
                    priceCabin = basePrice,
                    totalPriceUSD = basePrice,
                    primeKW = alternatorSelected.modelDerate.prime.kw,
                    primeKVA = alternatorSelected.modelDerate.prime.kva,
                    standbyKW = alternatorSelected.modelDerate.standby.kw,
                    standbyKVA = alternatorSelected.modelDerate.standby.kva,
                    isSoundproof = params.isSoundproof
                )
                
                // Recalcular combinación con nuevo ITM
                itmSelectionViewModel.recalculatePriceWithITM(
                    currentCombination = currentCombination,
                    originalParams = params,
                    newITMId = selectedId,
                    currentAlternatorId = externalAlternatorId.takeIf { it != 0 }
                )
                
                Log.d("GeneratorSetModelCard", "🔄 Recalculating with new ITM: $selectedId")
            }
            showITMModal = false
        },
        viewModel = itmSelectionViewModel
    )

    // Modal de accesorios
    // Nota: Los accesorios ya están gestionados por el sistema legacy de componentsByCategory
    // Este modal es solo para mostrar todos los accesorios disponibles
    AccessoriesSelectionBottomSheet(
        isOpen = showAccessoriesModal,
        currentSelectedIds = selectedAccessoryIds,
        onDismiss = { showAccessoriesModal = false },
        onApply = { selectedIds ->
            selectedAccessoryIds = selectedIds
            // Los precios de accesorios se calculan automáticamente
            // a través del totalOptionalComponents existente
            Log.d("GeneratorSetModelCard", "Accesorios seleccionados: ${selectedIds.size} items")
            showAccessoriesModal = false
        },
        viewModel = optionalGeneratorSetComponentsViewModel
    )
}

@Preview
@Composable
private fun GeneratorSetModelCardPreview() {

    val params = GeneratingSetsParameters(
        heightAtSeaLevel = 0,
        temperature = 0,
        powerFactor = 0.0,
        frequency = 0,
        voltage = 0,
        phases = 0,
        isSoundproof = false
    )

    val controller = rememberNavController()

    val model = GeneratorSetModel(
        id = 1,
        name = "MP-60",
        motor = GeneratorSetMotor(1, "PERKINS 1103A-33TG2"),
        alternators = emptyList(),
    )

    val generatorSetViewModel = viewModel<GeneratorSetViewModel>()
    val optionalGeneratorSetComponentsViewModel =
        viewModel<OptionalGeneratorSetComponentsViewModel>()
    val alternatorSelectionViewModel = viewModel<AlternatorSelectionViewModel>()
    val itmSelectionViewModel = viewModel<ITMSelectionViewModel>()

    CotizadorModasaTheme {
        GeneratorSetModelCard(
            controller = controller,
            params = params,
            model = model,
            generatorSetViewModel = generatorSetViewModel,
            optionalGeneratorSetComponentsViewModel = optionalGeneratorSetComponentsViewModel,
            alternatorSelectionViewModel = alternatorSelectionViewModel,
            itmSelectionViewModel = itmSelectionViewModel
        )
    }
}