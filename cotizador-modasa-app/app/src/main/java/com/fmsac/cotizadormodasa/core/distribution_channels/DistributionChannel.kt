package com.fmsac.cotizadormodasa.core.distribution_channels

data class DistributionChannel(
    val id: Int,
    val code: String,
    val name: String,
    val areaCode: Int,
    val state: Int
)