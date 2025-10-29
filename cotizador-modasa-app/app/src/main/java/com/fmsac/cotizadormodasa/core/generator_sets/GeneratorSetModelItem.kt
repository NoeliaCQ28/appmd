package com.fmsac.cotizadormodasa.core.generator_sets

data class GeneratorSetModelItem(
    val motorId: Int,
    val motorName: String,
    val modelId: Int,
    val modelName: String,
    val modelPrice: Double,
    val alternatorId: Int,
    val alternatorName: String,
    val discountValue: Int,
    val discountDescription: String,
    val discountIncrement: Boolean,
    val params: GeneratingSetsParameters,
    val originalPrice: Double,
    val finalPrice: Double
)