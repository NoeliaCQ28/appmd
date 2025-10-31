package com.fmsac.cotizadormodasa.presentation.navigation

import androidx.compose.foundation.Image
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.outlined.ExitToApp
import androidx.compose.material.icons.automirrored.outlined.MenuBook
import androidx.compose.material.icons.filled.AccessTime
import androidx.compose.material.icons.outlined.GridView
import androidx.compose.material.icons.outlined.Home
import androidx.compose.material.icons.outlined.InsertChartOutlined
import androidx.compose.material.icons.outlined.Inventory
import androidx.compose.material.icons.outlined.Settings
import androidx.compose.material3.DrawerValue
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalDrawerSheet
import androidx.compose.material3.ModalNavigationDrawer
import androidx.compose.material3.NavigationDrawerItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.material3.pulltorefresh.PullToRefreshBox
import androidx.compose.material3.pulltorefresh.rememberPullToRefreshState
import androidx.compose.material3.rememberDrawerState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.tooling.preview.Devices
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavHostController
import androidx.navigation.compose.rememberNavController
import com.fmsac.cotizadormodasa.R
import com.fmsac.cotizadormodasa.core.formatDate
import com.fmsac.cotizadormodasa.data.local.DataStoreManager
import com.fmsac.cotizadormodasa.presentation.components.Header
import com.fmsac.cotizadormodasa.presentation.navigation.customers.Customer
import com.fmsac.cotizadormodasa.presentation.navigation.home.Home
import com.fmsac.cotizadormodasa.presentation.navigation.quote.Quote
import com.fmsac.cotizadormodasa.presentation.navigation.settings.Settings
import com.fmsac.cotizadormodasa.presentation.navigation.signin.SignIn
import com.fmsac.cotizadormodasa.presentation.theme.ui.CotizadorModasaTheme
import com.fmsac.cotizadormodasa.presentation.theme.ui.buttonDestructive
import com.fmsac.cotizadormodasa.presentation.viewmodels.auth.AuthActions
import com.fmsac.cotizadormodasa.presentation.viewmodels.auth.AuthState
import com.fmsac.cotizadormodasa.presentation.viewmodels.auth.SignInViewModel
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch
import java.util.Date

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun Screen(
    modifier: Modifier = Modifier,
    route: String,
    controller: NavHostController,
    onRefresh: () -> Unit = {},
    disableScroll: Boolean = false,
    content: @Composable (SnackbarHostState) -> Unit,
) {

    val drawerState = rememberDrawerState(initialValue = DrawerValue.Closed)
    val scope = rememberCoroutineScope()
    val snackbarHostState = remember { SnackbarHostState() }
    val pullToRefreshState = rememberPullToRefreshState()
    var isRefreshing by remember {
        mutableStateOf(false)
    }

    val signInViewModel: SignInViewModel = viewModel()
    val authState by signInViewModel.authState.collectAsStateWithLifecycle()

    val ctx = LocalContext.current

    var username by remember {
        mutableStateOf("")
    }
    var role by remember {
        mutableStateOf("")
    }
    var expireTokenDate by remember {
        mutableStateOf("")
    }

    LaunchedEffect(Unit) {
        scope.launch {
            val dataStoreManager = DataStoreManager(ctx)

            username = dataStoreManager.username.first() ?: ""
            role = dataStoreManager.role.first() ?: ""

            val expToken = dataStoreManager.exp.first() ?: 0
            expireTokenDate = formatDate(Date(expToken), complete = true)
        }
    }

    LaunchedEffect(authState) {
        if (authState is AuthState.UNAUTHENTICATED) {
            controller.navigate(SignIn) {
                popUpTo(route) { inclusive = true }
            }
        }
    }

    ModalNavigationDrawer(
        drawerContent = {
            ModalDrawerSheet {
                Column(
                    modifier = Modifier
                        .padding(horizontal = 16.dp)
                        .fillMaxHeight()
                        .verticalScroll(rememberScrollState())
                ) {
                    Spacer(Modifier.height(12.dp))
                    Image(
                        painter = painterResource(id = R.drawable.modasa_logo2),
                        contentDescription = "Logo Modasa",
                        modifier = Modifier
                            .padding(vertical = 12.dp)
                    )

                    HorizontalDivider()

                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(MaterialTheme.shapes.medium)
                            .clickable {
                                controller.navigate(Home)
                            }
                    ) {
                        Icon(
                            imageVector = Icons.Outlined.Home,
                            contentDescription = "Inicio"
                        )
                        Spacer(Modifier.width(8.dp))
                        Text(
                            "Inicio",
                            modifier = Modifier.padding(16.dp),
                            style = MaterialTheme.typography.titleMedium
                        )
                    }

                    HorizontalDivider()

                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Outlined.Inventory,
                            contentDescription = "Operaciones"
                        )
                        Spacer(Modifier.width(8.dp))
                        Text(
                            "Operaciones",
                            modifier = Modifier.padding(16.dp),
                            style = MaterialTheme.typography.titleMedium
                        )
                    }
                    NavigationDrawerItem(
                        label = { Text("Cotizaciones") },
                        selected = false,
                        onClick = {
                            controller.navigate(Quote)
                        }
                    )

                    HorizontalDivider(modifier = Modifier.padding(vertical = 8.dp))

                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Outlined.GridView,
                            contentDescription = "Operaciones"
                        )
                        Spacer(Modifier.width(8.dp))
                        Text(
                            "Catalogos",
                            modifier = Modifier.padding(16.dp),
                            style = MaterialTheme.typography.titleMedium
                        )
                    }
                    NavigationDrawerItem(
                        label = { Text("Clientes/Prospectos") },
                        selected = false,
                        onClick = {
                            controller.navigate(Customer)
                        }
                    )

                    HorizontalDivider(modifier = Modifier.padding(vertical = 8.dp))

                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(MaterialTheme.shapes.medium)
                            .clickable { }
                    ) {
                        Icon(
                            imageVector = Icons.Outlined.InsertChartOutlined,
                            contentDescription = "Reportes"
                        )
                        Spacer(Modifier.width(8.dp))
                        Text(
                            "Reportes",
                            modifier = Modifier.padding(16.dp),
                            style = MaterialTheme.typography.titleMedium
                        )
                    }

                    Spacer(Modifier.height(12.dp))

                    Row(verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(MaterialTheme.shapes.medium)
                            .clickable { }) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Outlined.MenuBook,
                            contentDescription = "Manual de Usuario"
                        )
                        Spacer(Modifier.width(8.dp))
                        Text(
                            "Manual de Usuario",
                            modifier = Modifier.padding(16.dp),
                            style = MaterialTheme.typography.titleMedium
                        )
                    }

                    Spacer(Modifier.height(12.dp))

                    Row(verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(MaterialTheme.shapes.medium)
                            .clickable {
                                controller.navigate(Settings)
                            }) {
                        Icon(
                            imageVector = Icons.Outlined.Settings,
                            contentDescription = "Configuracion"
                        )
                        Spacer(Modifier.width(8.dp))
                        Text(
                            "Configuración",
                            modifier = Modifier.padding(16.dp),
                            style = MaterialTheme.typography.titleMedium
                        )
                    }

                    HorizontalDivider(modifier = Modifier.padding(vertical = 8.dp))

                    Row(verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(MaterialTheme.shapes.medium)
                            .clickable {
                                signInViewModel.onAction(AuthActions.SIGN_OUT)
                            }) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Outlined.ExitToApp,
                            contentDescription = "Cerrar Session",
                            tint = buttonDestructive
                        )
                        Spacer(Modifier.width(8.dp))
                        Text(
                            "Cerrar Session",
                            modifier = Modifier.padding(16.dp),
                            style = MaterialTheme.typography.titleMedium,
                            color = buttonDestructive
                        )
                    }

                    Spacer(modifier = Modifier.weight(1f))

                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.Center,
                    ) {

                        Icon(
                            imageVector = Icons.Filled.AccessTime,
                            contentDescription = "Reloj",
                            modifier = Modifier.size(14.dp)
                        )

                        Spacer(modifier = Modifier.padding(horizontal = 8.dp))

                        Text(
                            text = "La sessión expira el $expireTokenDate",
                            fontSize = 12.sp,
                        )
                    }
                }
            }
        },
        drawerState = drawerState
    ) {
        Scaffold(
            snackbarHost = {
                SnackbarHost(hostState = snackbarHostState)
            },
            topBar = {
                Header(
                    title = route,
                    userName = username,
                    userRole = role,
                    navigationAction = {
                        scope.launch {
                            if (drawerState.isClosed) {
                                drawerState.open()
                            } else {
                                drawerState.close()
                            }
                        }
                    }
                )
            }
        ) { innerPadding ->

            PullToRefreshBox(
                isRefreshing = isRefreshing,
                onRefresh = {
                    scope.launch {
                        isRefreshing = true
                        onRefresh()
                        delay(2000)
                        isRefreshing = false

                    }
                },
                modifier = Modifier
                    .fillMaxSize()
                    .padding(innerPadding)
                    .padding(16.dp)
                    .then(
                        if (disableScroll) Modifier
                        else Modifier.verticalScroll(rememberScrollState())
                    ),
                state = pullToRefreshState
            ) {
                Column() {

                    content(snackbarHostState)
                }
            }
        }
    }
}

@Preview(device = Devices.PIXEL_7A)
@Composable
private fun ScreenPreview() {

    val controller = rememberNavController()

    CotizadorModasaTheme {
        Screen(controller = controller, modifier = Modifier, route = "Inicio") {
            Text("Hello Screen")
        }
    }
}