package com.fmsac.cotizadormodasa.core.incoterms

data class Incoterm(
    val id: Int,
    val code: String,
    val requireLocation: Int,
    val transportType: String?,
    val SMC: String?,
    val description: String
)