package com.fmsac.cotizadormodasa.presentation.state.ui.form

import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember

class MapFormState(initialValues: Map<String, String> = emptyMap()) {

    private var _values = mutableStateOf(initialValues)
    val values: Map<String, String> get() = _values.value

    fun onValueChange(field: String, value: String) {
        _values.value = _values.value.toMutableMap().apply { put(field, value) }
    }

    fun getValue(field: String): String = values[field] ?: ""
}

@Composable
fun rememberMapFormState(initialValues: Map<String, String> = emptyMap()): MapFormState {
    return remember { MapFormState(initialValues) }
}