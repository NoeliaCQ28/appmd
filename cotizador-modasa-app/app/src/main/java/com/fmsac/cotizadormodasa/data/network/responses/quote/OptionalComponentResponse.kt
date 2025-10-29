package com.fmsac.cotizadormodasa.data.network.responses.quote

import com.google.gson.annotations.SerializedName

data class OptionalComponentResponse(

    @SerializedName("Opcionales_Id") var id: Int? = null,
    @SerializedName("Tipo") var type: String? = null,
    @SerializedName("sOpcCodigo") var code: String? = null,
    @SerializedName("sOpcNombre") var name: String? = null,
    @SerializedName("Nombre") var name_: String? = null,
    @SerializedName("sOpcDescripcion") var description: String? = null,
    @SerializedName("sOpcMarca") var brand: String? = null,
    @SerializedName("Aplicación") var application: String? = null,
    @SerializedName("nOpcPrecio") var price: String? = null

)