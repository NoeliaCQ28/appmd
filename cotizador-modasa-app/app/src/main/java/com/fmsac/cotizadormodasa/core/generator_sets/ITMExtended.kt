package com.fmsac.cotizadormodasa.core.generator_sets

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

/**
 * Modelo extendido de ITM (Interruptor Termomagnético)
 * con información completa para el modal de selección
 */
@Parcelize
data class ITMExtended(
    val id: Int,
    val kitName: String,
    val brand: String?,
    val amperage: Int,
    val poles: Int,
    val price: Double,
    val integradoraId: Int?
) : Parcelable
