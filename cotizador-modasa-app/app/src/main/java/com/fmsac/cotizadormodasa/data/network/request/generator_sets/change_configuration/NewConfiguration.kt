package com.fmsac.cotizadormodasa.data.network.request.generator_sets.change_configuration

import com.google.gson.annotations.SerializedName

/**
 * Representa la nueva configuración de componentes a cambiar
 */
data class NewConfiguration(
    @SerializedName("alternatorId")
    val alternatorId: Int? = null,
    
    @SerializedName("itmId")
    val itmId: Int? = null
)