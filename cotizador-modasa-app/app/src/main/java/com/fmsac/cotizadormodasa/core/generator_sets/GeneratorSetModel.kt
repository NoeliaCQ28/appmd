package com.fmsac.cotizadormodasa.core.generator_sets

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

data class GeneratorSetModel(
    val id: Int,
    val name: String,
    val motor: GeneratorSetMotor,
    val alternators: List<GeneratorSetAlternator>,
    val integradoraId: Int = 0  // ID de la integradora para búsqueda de componentes externos
)

data class GeneratorSetMotor(
    val id: Int,
    val name: String
)

@Parcelize
data class GeneratorSetAlternator(
    val id: Int,
    val name: String,
    val modelPrice: Double,
    val modelDerate: GeneratorSetDerateModel,
    val itms: List<GeneratorSetItm>
) : Parcelable

@Parcelize
data class GeneratorSetDerateModel(
    val prime: GeneratorSetPower,
    val standby: GeneratorSetPower
) : Parcelable

@Parcelize
data class GeneratorSetPower(
    val kw: Double,
    val kva: Double
) : Parcelable

@Parcelize
data class GeneratorSetItm(
    val id: Int,
    val kitName: String?
) : Parcelable