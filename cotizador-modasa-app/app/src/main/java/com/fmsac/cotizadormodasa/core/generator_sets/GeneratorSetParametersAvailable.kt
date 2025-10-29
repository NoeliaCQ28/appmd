package com.fmsac.cotizadormodasa.core.generator_sets

data class GeneratorSetParametersAvailable(
    val voltages: List<Int>,
    val frequencies: List<Int>,
    val phases: List<Int>,
    val powerFactors: List<Double>,
    val heightAtSeaLevels: List<Int>,
    val temperatures: List<Int>,
)