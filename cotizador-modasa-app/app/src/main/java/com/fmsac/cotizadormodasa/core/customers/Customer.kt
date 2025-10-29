package com.fmsac.cotizadormodasa.core.customers

data class Customer(
    val clientId: Int,
    val clientCode: String?,
    val sap: String?,
    val taxId: String?,
    val clientName: String,
    val address: String?,
    val executiveId: Int,
    val origin: Int,
    val cliengoId: String?,
    val clientType: Int,
    val phone: String?,
    val email: String?,
    val country: String?,
    val department: String?,
    val province: String?,
    val district: String?,
    val status: Int
)