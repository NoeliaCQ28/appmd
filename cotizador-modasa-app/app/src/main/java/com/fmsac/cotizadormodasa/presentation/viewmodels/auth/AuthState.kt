package com.fmsac.cotizadormodasa.presentation.viewmodels.auth

sealed class AuthState {
    data object IDLE : AuthState()
    data object UNAUTHENTICATED : AuthState()
    data object AUTENTICATING : AuthState()
    data object AUTHENTICATED : AuthState()
    data class ERROR_SIGN_IN(val error: String) : AuthState()
}