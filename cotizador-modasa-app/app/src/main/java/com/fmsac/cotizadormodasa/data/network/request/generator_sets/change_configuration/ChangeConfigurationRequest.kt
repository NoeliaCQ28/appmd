package com.fmsac.cotizadormodasa.data.network.request.generator_sets.change_configuration

import com.fmsac.cotizadormodasa.data.network.request.generator_sets.GeneratingSetsParametersRequest
import com.google.gson.annotations.SerializedName

/**
 * Request para recalcular precios con nueva configuración de componentes
 * COINCIDE EXACTAMENTE CON EL JSON DE LA WEB
 */
data class ChangeConfigurationRequest(
    @SerializedName("configuration")
    val configuration: NewConfiguration,
    
    @SerializedName("integradoraId")
    val integradoraId: Int,
    
    @SerializedName("params")
    val params: GeneratingSetsParametersRequest
)