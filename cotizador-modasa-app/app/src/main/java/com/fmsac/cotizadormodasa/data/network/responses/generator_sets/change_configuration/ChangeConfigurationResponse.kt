package com.fmsac.cotizadormodasa.data.network.responses.generator_sets.change_configuration

import com.fmsac.cotizadormodasa.data.network.responses.Response
import com.google.gson.annotations.SerializedName

/**
 * Response para recalcular precios con nueva configuración de componentes
 */
data class ChangeConfigurationResponse(
    @SerializedName("data")
    val data: CombinationData? = null,
    
    @SerializedName("message")
    val message: String = "",
    
    @SerializedName("success")
    val success: Boolean = false,
    
    @SerializedName("code")
    val code: Int = 0
)