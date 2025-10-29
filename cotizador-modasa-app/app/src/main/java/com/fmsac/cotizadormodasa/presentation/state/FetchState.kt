package com.fmsac.cotizadormodasa.presentation.state

sealed class FetchState {
    data object  Idle : FetchState()
    data object Loading : FetchState()
    data class Error(val error: String) : FetchState()
    data object Success : FetchState()
}