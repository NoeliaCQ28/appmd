package com.fmsac.cotizadormodasa.data.network.responses.generating_sets_parameters_values

import com.google.gson.annotations.SerializedName

data class GeneratingSetsParametersValuesResponse(
    @SerializedName("voltajes")
    val voltages: List<Int>,

    @SerializedName("frecuencias")
    val frequencies: List<Int>,

    @SerializedName("fases")
    val phases: List<Int>,

    @SerializedName("factorPotencias")
    val powerFactors: List<Double>,

    @SerializedName("alturas")
    val heightAtSeaLevels: List<Int>,

    @SerializedName("temperaturas")
    val temperatures: List<Int>,
)