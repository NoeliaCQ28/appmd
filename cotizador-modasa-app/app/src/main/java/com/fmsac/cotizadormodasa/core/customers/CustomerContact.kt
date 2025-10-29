package com.fmsac.cotizadormodasa.core.customers

data class CustomerContact(
    val clientId: Int,
    val contactId: Int,
    val name: String,
    val position: String?,
    val email: String,
    val phone: String,
    val status: Int,
    val isDeleted: Int,
    val updatedAt: String,
    val userId: Int
)