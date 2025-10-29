package com.fmsac.cotizadormodasa.core.seller

data class Seller(
    val executiveId: Int,
    val executiveCode: String?,
    val sapCode: String?,
    val executiveName: String,
    val phoneNumber: String?,
    val executiveEmail: String?,
    val status: Int,
    val country: String?,
    val department: String?,
    val province: String?
)