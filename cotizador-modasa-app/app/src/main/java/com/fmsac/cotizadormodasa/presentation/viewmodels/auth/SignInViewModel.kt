package com.fmsac.cotizadormodasa.presentation.viewmodels.auth

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.auth0.android.jwt.JWT
import com.fmsac.cotizadormodasa.data.local.DataStoreManager
import com.fmsac.cotizadormodasa.data.network.ApiService
import com.fmsac.cotizadormodasa.data.network.RetrofitInstance
import com.fmsac.cotizadormodasa.data.network.request.auth.AuthRequest
import com.fmsac.cotizadormodasa.data.network.responses.Response
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class SignInViewModel(application: Application) : AndroidViewModel(application) {

    private val ctx = application

    private val _authState = MutableStateFlow<AuthState>(AuthState.IDLE)
    val authState: StateFlow<AuthState> = _authState.asStateFlow()

    init {
        viewModelScope.launch {

            val dataStore = DataStoreManager.getInstance(ctx)

            if (dataStore.isTokenPresent()) {
                withContext(Dispatchers.Main) {
                    delay(2000)

                    if (dataStore.isTokenExpired()) {
                        _authState.value = AuthState.UNAUTHENTICATED
                        return@withContext
                    }

                    _authState.value = AuthState.AUTHENTICATED
                }
            } else {
                withContext(Dispatchers.Main) {
                    _authState.value = AuthState.UNAUTHENTICATED
                }
            }
        }
    }

    fun onAction(action: AuthActions) {

        when (action) {
            is AuthActions.SIGN_IN -> {

                viewModelScope.launch {

                    _authState.value = AuthState.AUTENTICATING

                    val request = AuthRequest(
                        email = action.credentials.email,
                        password = action.credentials.password
                    )

                    try {
                        val API: ApiService = RetrofitInstance.API(ctx)

                        val response: Response<String> = API.signIn(request)

                        if (!response.success) {
                            _authState.value = AuthState.ERROR_SIGN_IN(response.message)
                            throw Exception(response.message)
                        }

                        with(DataStoreManager.getInstance(ctx)) {

                            val token = response.data!!

                            val jwt = JWT(token)
                            val username = jwt.getClaim("name").asString()!!
                            val role = jwt.getClaim("role").asString()!!
                            val exp = jwt.expiresAt!!.time

                            saveToken(token)
                            saveUsername(username)
                            saveRole(role)
                            saveExp(exp)
                        }

                        _authState.value = AuthState.AUTHENTICATED

                    } catch (e: Throwable) {
                        when (e) {
                            is retrofit2.HttpException -> {
                                when (e.code()) {
                                    in 400..499 -> {
                                        _authState.value =
                                            AuthState.ERROR_SIGN_IN("Credenciales incorrectas")
                                    }

                                    in 500..599 -> {
                                        _authState.value =
                                            AuthState.ERROR_SIGN_IN("Error en el servidor")
                                    }

                                    else -> {
                                        _authState.value =
                                            AuthState.ERROR_SIGN_IN("Error desconocido")
                                    }
                                }

                            }

                            else -> {
                                _authState.value = AuthState.ERROR_SIGN_IN("Error desconocido")
                            }
                        }
                    }
                }
            }

            AuthActions.SIGN_OUT -> {
                viewModelScope.launch {
                    DataStoreManager.getInstance(ctx).clearToken()
                    _authState.value = AuthState.UNAUTHENTICATED
                }
            }
        }
    }
}