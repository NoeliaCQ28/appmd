package com.fmsac.cotizadormodasa.presentation.viewmodels.auth

sealed class AuthActions {
    data class SIGN_IN(val credentials: Credentials) : AuthActions()
    data object SIGN_OUT : AuthActions()
}