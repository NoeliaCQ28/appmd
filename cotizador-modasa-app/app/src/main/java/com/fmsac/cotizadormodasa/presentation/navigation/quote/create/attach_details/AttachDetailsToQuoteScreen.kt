package com.fmsac.cotizadormodasa.presentation.navigation.quote.create.attach_details

import android.content.res.Configuration
import android.util.Log
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.navigation.NavHostController
import com.fmsac.cotizadormodasa.core.generator_sets.GeneratingSetsParameters
import com.fmsac.cotizadormodasa.data.mockup.cabinOptionsMockup
import com.fmsac.cotizadormodasa.presentation.components.Button
import com.fmsac.cotizadormodasa.presentation.components.ButtonVariant
import com.fmsac.cotizadormodasa.presentation.components.Search
import com.fmsac.cotizadormodasa.presentation.components.generator_sets.GeneratorSetModelCard
import com.fmsac.cotizadormodasa.presentation.components.inputs.PowerInput
import com.fmsac.cotizadormodasa.presentation.components.inputs.SelectInput
import com.fmsac.cotizadormodasa.presentation.navigation.Screen
import com.fmsac.cotizadormodasa.presentation.state.FetchState
import com.fmsac.cotizadormodasa.presentation.state.ui.form.rememberMapFormState
import com.fmsac.cotizadormodasa.presentation.viewmodels.generator_sets.AlternatorSelectionViewModel
import com.fmsac.cotizadormodasa.presentation.viewmodels.generator_sets.GeneratorSetViewModel
import com.fmsac.cotizadormodasa.presentation.viewmodels.generator_sets.ITMSelectionViewModel
import com.fmsac.cotizadormodasa.presentation.viewmodels.generator_sets.OptionalGeneratorSetComponentsViewModel
import com.fmsac.cotizadormodasa.presentation.viewmodels.quotes.QuoteViewModel

@Composable
fun AttachDetailsToQuoteScreen(
    modifier: Modifier = Modifier,
    controller: NavHostController,
    quoteViewModel: QuoteViewModel,
    generatorSetViewModel: GeneratorSetViewModel,
    optionalGeneratorSetComponentsViewModel: OptionalGeneratorSetComponentsViewModel,
    alternatorSelectionViewModel: AlternatorSelectionViewModel,
    itmSelectionViewModel: ITMSelectionViewModel
) = Screen(
    controller = controller,
    modifier = modifier,
    route = "Cotizaciones"
) { snackbarHostState ->

    val configuration = LocalConfiguration.current
    val screenWidthDp = configuration.screenWidthDp
    val orientation = configuration.orientation

    val columns = if (screenWidthDp >= 600) {
        // Es una tablet
        if (orientation == Configuration.ORIENTATION_LANDSCAPE) 3 else 2
    } else {
        // Es un celular
        1
    }

    val paramsValues by generatorSetViewModel.paramsValues.collectAsStateWithLifecycle()
    val params by generatorSetViewModel.params.collectAsStateWithLifecycle()
    val models by generatorSetViewModel.models.collectAsStateWithLifecycle()
    val availableModels by generatorSetViewModel.availableModels.collectAsStateWithLifecycle()
    val availableMotorBrands by generatorSetViewModel.availableMotorBrands.collectAsStateWithLifecycle()
    val fetchStateModelSearch: FetchState by generatorSetViewModel.fetchStateModelSearch.collectAsStateWithLifecycle(
        initialValue = FetchState.Idle
    )

    // Estado para la búsqueda
    var searchQuery by remember { mutableStateOf("") }

    // Filtrar modelos basado en la búsqueda
    val filteredModels = remember(models, searchQuery) {
        if (searchQuery.isBlank()) {
            models
        } else {
            models.filter { model ->
                model.name.contains(searchQuery, ignoreCase = true) ||
                        model.motor.name.contains(searchQuery, ignoreCase = true)
            }
        }
    }

    // Logs de debugging para diagnosticar problemas de visualización
    LaunchedEffect(filteredModels) {
        Log.d("AttachDetailsScreen", "=== Filtered Models Debug ===")
        Log.d("AttachDetailsScreen", "Total filtered models: ${filteredModels.size}")
        filteredModels.forEachIndexed { index, model ->
            Log.d("AttachDetailsScreen", "Model $index: id=${model.id}, name='${model.name}', alternators.size=${model.alternators.size}")
            if (model.alternators.isEmpty()) {
                Log.e("AttachDetailsScreen", "⚠️ Model '${model.name}' has EMPTY alternators list!")
            }
        }
    }

    LaunchedEffect(Unit) {
        generatorSetViewModel.getParams()
        generatorSetViewModel.loadAvailableModels()
        generatorSetViewModel.loadAvailableMotorBrands()
    }

    LaunchedEffect(Unit) {
        generatorSetViewModel.fetchStateModelSearch.collect {
            when (it) {
                is FetchState.Loading -> {
                    println("Loading")
                }

                is FetchState.Error -> {
                    snackbarHostState.showSnackbar(message = it.error)
                }

                is FetchState.Success -> {
                    snackbarHostState.showSnackbar(message = "Modelos cargados")
                }

                FetchState.Idle -> Unit
            }
        }
    }

    val formParams = rememberMapFormState(
        mapOf(
            "voltage" to if (paramsValues.voltages.isNotEmpty()) paramsValues.voltages.first().toString() else "220",
            "elevation" to if (paramsValues.heightAtSeaLevels.isNotEmpty()) paramsValues.heightAtSeaLevels.first().toString() else "1000",
            "temperature" to if (paramsValues.temperatures.isNotEmpty()) paramsValues.temperatures.first().toString() else "0",
            "powerFactor" to if (paramsValues.powerFactors.isNotEmpty()) paramsValues.powerFactors.first().toString() else "0.8",
            "frequency" to if (paramsValues.frequencies.isNotEmpty()) paramsValues.frequencies.first().toString() else "60",
            "fases" to if (paramsValues.phases.isNotEmpty()) paramsValues.phases.first().toString() else "3",
            "cabin" to "Cabina insonorizada",
            "modelo" to "Todos",
            "motorMarca" to "Todos",
            "primePowerValue" to "",
            "primePowerTodos" to "true",
            "standbyPowerValue" to "",
            "standbyPowerTodos" to "true",
            "powerUnit" to "kW",
            "powerThreshold" to "20"
        )
    )

    Column(
        modifier = Modifier
            .fillMaxSize(),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Text("Parametros", fontSize = 16.sp, fontWeight = FontWeight.Bold)

        SelectInput(
            options = availableModels,
            selectedOption = formParams.getValue("modelo"),
            onOptionSelected = { formParams.onValueChange("modelo", it) },
            enabled = availableModels.isNotEmpty(),
            label = "MODELO"
        )

        SelectInput(
            options = availableMotorBrands,
            selectedOption = formParams.getValue("motorMarca"),
            onOptionSelected = { formParams.onValueChange("motorMarca", it) },
            enabled = availableMotorBrands.isNotEmpty(),
            label = "MARCA DEL MOTOR"
        )

        SelectInput(
            options = paramsValues.voltages.map { it.toString() },
            selectedOption = formParams.getValue("voltage"),
            onOptionSelected = { formParams.onValueChange("voltage", it) },
            enabled = paramsValues.voltages.isNotEmpty(),
            label = "TENSIÓN"
        )

        SelectInput(
            options = paramsValues.heightAtSeaLevels.map { it.toString() },
            selectedOption = formParams.getValue("elevation"),
            onOptionSelected = { formParams.onValueChange("elevation", it) },
            enabled = paramsValues.heightAtSeaLevels.isNotEmpty(),
            label = "ALTURA DE TRABAJO (msnm)"
        )

        SelectInput(
            options = paramsValues.temperatures.map { it.toString() },
            selectedOption = formParams.getValue("temperature"),
            onOptionSelected = { formParams.onValueChange("temperature", it) },
            enabled = paramsValues.temperatures.isNotEmpty(),
            label = "TEMPERATURA (°C)"
        )

        SelectInput(
            options = paramsValues.powerFactors.map { it.toString() },
            selectedOption = formParams.getValue("powerFactor"),
            onOptionSelected = { formParams.onValueChange("powerFactor", it) },
            enabled = paramsValues.powerFactors.isNotEmpty(),
            label = "FACTOR DE POTENCIA"
        )

        SelectInput(
            options = paramsValues.frequencies.map { it.toString() },
            selectedOption = formParams.getValue("frequency"),
            onOptionSelected = { formParams.onValueChange("frequency", it) },
            enabled = paramsValues.frequencies.isNotEmpty(),
            label = "FRECUENCIA (Hz)"
        )

        SelectInput(
            options = paramsValues.phases.map { it.toString() },
            selectedOption = formParams.getValue("fases"),
            onOptionSelected = { formParams.onValueChange("fases", it) },
            enabled = paramsValues.phases.isNotEmpty(),
            label = "FASES"
        )

        SelectInput(
            options = cabinOptionsMockup.map { it.key },
            selectedOption = formParams.getValue("cabin"),
            onOptionSelected = { formParams.onValueChange("cabin", it) },
            label = "OPCIONES DE CABINA"
        )

        PowerInput(
            label = "P. PRIME",
            value = formParams.getValue("primePowerValue"),
            onValueChange = { formParams.onValueChange("primePowerValue", it) },
            isTodos = formParams.getValue("primePowerTodos") == "true",
            onTodosChange = { formParams.onValueChange("primePowerTodos", it.toString()) },
            unit = formParams.getValue("powerUnit"),
            onUnitChange = { formParams.onValueChange("powerUnit", it) },
            threshold = formParams.getValue("powerThreshold").toIntOrNull() ?: 20,
            modifier = Modifier.fillMaxWidth()
        )

        PowerInput(
            label = "P. STANDBY",
            value = formParams.getValue("standbyPowerValue"),
            onValueChange = { formParams.onValueChange("standbyPowerValue", it) },
            isTodos = formParams.getValue("standbyPowerTodos") == "true",
            onTodosChange = { formParams.onValueChange("standbyPowerTodos", it.toString()) },
            unit = formParams.getValue("powerUnit"),
            onUnitChange = { formParams.onValueChange("powerUnit", it) },
            threshold = formParams.getValue("powerThreshold").toIntOrNull() ?: 20,
            modifier = Modifier.fillMaxWidth()
        )

        Button(
            modifier = Modifier.fillMaxWidth(),
            text = "CONSULTAR COMPONENTES",
            isLoading = fetchStateModelSearch is FetchState.Loading,
            onClick = {
                val primePowerParam = if (formParams.getValue("primePowerTodos") == "true")
                    "Todos"
                else
                    formParams.getValue("primePowerValue")

                val standbyPowerParam = if (formParams.getValue("standbyPowerTodos") == "true")
                    "Todos"
                else
                    formParams.getValue("standbyPowerValue")

                val generatorSetModelParams = GeneratingSetsParameters(
                    voltage = formParams.getValue("voltage").toInt(),
                    frequency = formParams.getValue("frequency").toInt(),
                    phases = formParams.getValue("fases").toInt(),
                    powerFactor = formParams.getValue("powerFactor").toDouble(),
                    heightAtSeaLevel = formParams.getValue("elevation").toInt(),
                    temperature = formParams.getValue("temperature").toInt(),
                    isSoundproof = cabinOptionsMockup[formParams.getValue("cabin")] == 1,
                    modelo = formParams.getValue("modelo"),
                    motorMarca = formParams.getValue("motorMarca"),
                    primePower = primePowerParam,
                    standbyPower = standbyPowerParam,
                    powerThreshold = formParams.getValue("powerThreshold").toIntOrNull() ?: 20,
                    marketId = 1,
                    powerUnit = formParams.getValue("powerUnit")
                )

                generatorSetViewModel.setParams(generatorSetModelParams)
                generatorSetViewModel.searchModels(generatorSetModelParams)
            },
            variant = ButtonVariant.SECONDARY
        )

        Text("Modelos Disponibles", fontSize = 16.sp, fontWeight = FontWeight.Bold)

        Search(
            query = searchQuery,
            onQueryChanged = { searchQuery = it },
            onSearch = { /* La búsqueda se hace automáticamente al cambiar el texto */ }
        )

        val cardHeight = 180.dp
        val spacing = 8.dp

        // Hacer el cálculo reactivo - se recalculará cuando filteredModels o columns cambien
        val gridHeight = remember(filteredModels, columns) {
            val rowCount = if (filteredModels.isNotEmpty()) {
                (filteredModels.size + columns - 1) / columns
            } else {
                0
            }
            if (rowCount > 0) cardHeight * rowCount + spacing * (rowCount - 1) else 0.dp
        }

        LazyVerticalGrid(
            columns = GridCells.Fixed(columns),
            verticalArrangement = Arrangement.spacedBy(spacing),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            userScrollEnabled = false, // Desactivar scroll interno para usar el scroll del Screen padre
            modifier = Modifier
                .fillMaxWidth()
                .height(gridHeight)
        ) {
            items(filteredModels, key = { model -> model.id }) { model ->
                GeneratorSetModelCard(
                    model = model,
                    params = params,
                    controller = controller,
                    generatorSetViewModel = generatorSetViewModel,
                    optionalGeneratorSetComponentsViewModel = optionalGeneratorSetComponentsViewModel,
                    alternatorSelectionViewModel = alternatorSelectionViewModel,
                    itmSelectionViewModel = itmSelectionViewModel,
                    onAdd = { modelSelected ->
                        generatorSetViewModel.addModelSelected(modelSelected)
                    }
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        Row(verticalAlignment = Alignment.CenterVertically) {
            Button(
                onClick = { controller.popBackStack() },
                modifier = Modifier.weight(1f),
                text = "GUARDAR"
            )

            Spacer(modifier = Modifier.width(16.dp))

            Button(
                onClick = { controller.popBackStack() },
                modifier = Modifier.weight(1f),
                text = "CANCELAR",
                variant = ButtonVariant.DESTRUCTIVE
            )
        }
    }
}
