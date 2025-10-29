package com.fmsac.cotizadormodasa.data.network.responses

data class Response<T>(
    val data: T?,
    val message: String,
    val success: Boolean,
    val code: Int
)