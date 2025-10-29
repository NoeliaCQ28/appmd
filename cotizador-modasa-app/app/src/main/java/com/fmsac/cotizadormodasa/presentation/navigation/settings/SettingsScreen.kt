package com.fmsac.cotizadormodasa.presentation.navigation.settings

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavHostController
import androidx.navigation.compose.rememberNavController
import com.fmsac.cotizadormodasa.data.local.DataStoreManager
import com.fmsac.cotizadormodasa.presentation.components.Button
import com.fmsac.cotizadormodasa.presentation.components.inputs.TextInput
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch

@Composable
fun SettingsScreen(
    modifier: Modifier = Modifier,
    controller: NavHostController
) {

    val ctx = LocalContext.current
    val scope = rememberCoroutineScope()
    val snackbarHostState = remember { SnackbarHostState() }

    var currentServer by remember {
        mutableStateOf("")
    }

    LaunchedEffect(Unit) {
        scope.launch {

            val dataStore = DataStoreManager.getInstance(ctx)
            val server = dataStore.apiEndpoint.first()
            currentServer = server ?: ""
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .padding(16.dp).padding(top = 24.dp)
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        SettingsHeader(controller = controller)

        TextInput(
            value = currentServer,
            label = "Servidor",
            onValueChange = {
                currentServer = it
            },
            placeholder = "Ingrese la URL del servidor",
        )

        Spacer(modifier = Modifier.height(8.dp))

        Button(
            text = "Guardar",
            onClick = {
                scope.launch {
                    val dataStore = DataStoreManager.getInstance(ctx)
                    dataStore.saveApiEndpoint(currentServer)

                    snackbarHostState.showSnackbar("Servidor actualizado")
                }
            }
        )

        Spacer(modifier = Modifier.weight(1f))

        SnackbarHost(hostState = snackbarHostState)
    }
}

@Composable
fun SettingsHeader(modifier: Modifier = Modifier, controller: NavHostController) {

    Row(
        verticalAlignment = Alignment.CenterVertically,
        modifier = modifier.fillMaxWidth()
    ) {
        IconButton(onClick = {
            controller.popBackStack()
        }) {
            Icon(
                imageVector = Icons.Default.ArrowBack,
                contentDescription = "Back",
                tint = MaterialTheme.colorScheme.onSurface,
            )
        }

        Text(
            text = "Configuración",
            fontSize = 20.sp,
            color = MaterialTheme.colorScheme.onSurface,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(start = 8.dp)
        )
    }
}