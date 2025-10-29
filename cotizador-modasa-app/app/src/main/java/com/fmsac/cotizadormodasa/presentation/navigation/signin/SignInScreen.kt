package com.fmsac.cotizadormodasa.presentation.navigation.signin

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Settings
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Checkbox
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
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
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavHostController
import androidx.navigation.compose.rememberNavController
import com.fmsac.cotizadormodasa.R
import com.fmsac.cotizadormodasa.presentation.components.Button
import com.fmsac.cotizadormodasa.presentation.components.LogoAnimation
import com.fmsac.cotizadormodasa.presentation.navigation.home.Home
import com.fmsac.cotizadormodasa.presentation.navigation.settings.Settings
import com.fmsac.cotizadormodasa.presentation.state.ui.form.rememberMapFormState
import com.fmsac.cotizadormodasa.presentation.viewmodels.auth.AuthActions
import com.fmsac.cotizadormodasa.presentation.viewmodels.auth.AuthState
import com.fmsac.cotizadormodasa.presentation.viewmodels.auth.Credentials
import com.fmsac.cotizadormodasa.presentation.viewmodels.auth.SignInViewModel
import kotlinx.coroutines.launch

@Composable
fun SignInScreen(
    modifier: Modifier = Modifier,
    controller: NavHostController,
    isDarkMode: Boolean = isSystemInDarkTheme()
) {

    val signInViewModel: SignInViewModel = viewModel()

    val form = rememberMapFormState(mapOf("email" to "", "password" to ""))

    val snackbarHostState: SnackbarHostState = remember { SnackbarHostState() }
    val scope = rememberCoroutineScope()
    val authState by signInViewModel.authState.collectAsStateWithLifecycle()

    val ctx = LocalContext.current

    val appVersion = ctx.packageManager.getPackageInfo(ctx.packageName, 0).versionName

    var checked by remember { mutableStateOf(false) }

    LaunchedEffect(authState) {
        if (authState is AuthState.AUTHENTICATED) {
            controller.navigate(Home) {
                popUpTo(SignIn) { inclusive = true }
            }
        }

        if (authState is AuthState.ERROR_SIGN_IN) {
            scope.launch {
                snackbarHostState.showSnackbar((authState as AuthState.ERROR_SIGN_IN).error)
            }
        }
    }

    if (authState != AuthState.UNAUTHENTICATED && authState !is AuthState.ERROR_SIGN_IN) {
        LogoAnimation()
    } else {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(MaterialTheme.colorScheme.background),
            contentAlignment = Alignment.Center
        ) {
            SnackbarHost(
                hostState = snackbarHostState,
                modifier = Modifier
                    .align(Alignment.BottomCenter)
                    .padding(16.dp)
            )

            IconButton(
                modifier = Modifier
                    .align(Alignment.TopEnd)
                    .padding(16.dp)
                    .padding(top = 32.dp),
                onClick = {
                    controller.navigate(Settings)
                }) {

                Icon(
                    imageVector = Icons.Outlined.Settings,
                    contentDescription = "Configuración",
                    tint = MaterialTheme.colorScheme.onSurface,
                    modifier = Modifier.size(24.dp)
                )
            }

            Image(
                painter = painterResource(R.drawable.modasa_logo),
                contentDescription = "Modasa Logo",
                modifier = Modifier
                    .align(Alignment.TopStart)
                    .size(270.dp)
                    .padding(16.dp)
            )

            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {

                OutlinedTextField(
                    value = form.getValue("email"),
                    onValueChange = {
                        form.onValueChange("email", it)
                    },
                    shape = CardDefaults.outlinedShape,
                    colors = OutlinedTextFieldDefaults.colors(
                        unfocusedBorderColor = Color(0xFFc6cfd1),
                    ),
                    label = { Text("Correo Electrónico") },
                    singleLine = true,
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
                    modifier = Modifier.fillMaxWidth()
                )

                Spacer(modifier = Modifier.height(16.dp))

                OutlinedTextField(
                    value = form.getValue("password"),
                    onValueChange = {
                        form.onValueChange("password", it)
                    },
                    shape = CardDefaults.outlinedShape,
                    colors = OutlinedTextFieldDefaults.colors(
                        unfocusedBorderColor = Color(0xFFc6cfd1),
                    ),
                    label = { Text("Contraseña") },
                    singleLine = true,
                    visualTransformation = PasswordVisualTransformation(),
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                    modifier = Modifier.fillMaxWidth()
                )

                Spacer(modifier = Modifier.height(8.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically
                ) {

                    Checkbox(checked = checked, onCheckedChange = { checked = it })
                    Text(
                        text = "Recordar",
                        fontSize = 16.sp,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                }

                Spacer(modifier = Modifier.height(24.dp))

                Button(
                    onClick = {
                        scope.launch {
                            val credentials = Credentials(
                                email = form.getValue("email"),
                                password = form.getValue("password")
                            )

                            signInViewModel.onAction(AuthActions.SIGN_IN(credentials))
                        }
                    },
                    isLoading = authState is AuthState.AUTENTICATING,
                    modifier = Modifier.fillMaxWidth(),
                    text = "INICIAR SESIÓN"
                )
            }

            Column(modifier = Modifier.align(Alignment.BottomCenter)) {
                Text(
                    text = "v$appVersion",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Light,
                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f),
                    modifier = Modifier
                        .clip(RoundedCornerShape(8.dp))
                        .background(MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.1f))
                        .padding(horizontal = 3.dp, vertical = 1.dp)
                )

                Spacer(modifier = Modifier.height(16.dp))
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
private fun SignInScreenPreview() {
    val navController = rememberNavController()
    SignInScreen(controller = navController)
}