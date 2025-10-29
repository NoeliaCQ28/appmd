package com.fmsac.cotizadormodasa.core.commercial_conditions

data class CommercialCondition(
    val commercialConditionsId: Int,
    val title: String,
    val description: String?,
    val htmlDescription: String?,
    val status: Int
)