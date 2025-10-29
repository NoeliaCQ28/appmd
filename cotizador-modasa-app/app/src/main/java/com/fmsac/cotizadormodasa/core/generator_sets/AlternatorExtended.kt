package com.fmsac.cotizadormodasa.core.generator_sets

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

/**
 * Modelo extendido de alternador con información completa
 * para el modal de selección de alternadores
 */
@Parcelize
data class AlternatorExtended(
    val id: Int,
    val name: String,
    val brand: String,
    val family: String?,
    val ipGrade: String?,
    val insulation: String?,
    val frame: String?,
    val disk: String?,
    val excitationSystem: String?,
    val avrCard: String?,
    val weight: Double?,
    val technicalNorms: String?,
    val price: Double,
    val integradoraId: Int?
) : Parcelable
