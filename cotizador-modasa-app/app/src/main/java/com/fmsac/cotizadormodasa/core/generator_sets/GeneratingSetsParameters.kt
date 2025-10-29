package com.fmsac.cotizadormodasa.core.generator_sets

data class GeneratingSetsParameters(
    val voltage: Int,
    val frequency: Int,
    val phases: Int,
    val powerFactor: Double,
    val heightAtSeaLevel: Int,
    val temperature: Int,
    val isSoundproof: Boolean,
    val modelo: String = "Todos",
    val motorMarca: String = "Todos",
    val primePower: String = "Todos",
    val standbyPower: String = "Todos",
    val powerThreshold: Int = 20,
    val marketId: Int = 1,
    val powerUnit: String = "kW"
)