package com.fmsac.cotizadormodasa.core.quotes

/*
  Object model for all quote fetching mechanism
 */
data class AllQuote(
    val id: Int,
    val code: String,
    val customerId: Int,
    val customerName: String,
    val executiveId: Int,
    val executiveName: String,
    val date: String,
    val type: String,
    val project: String,
    val total: Double,
    val statusId: Int,
    val status: String
)
