package com.fmsac.cotizadormodasa.data.network.responses.customer

import com.google.gson.annotations.SerializedName

data class CustomersResponse(
    @SerializedName("Cliente_Id")
    val clientId: Int,

    @SerializedName("sCliCodigo")
    val clientCode: String?,

    @SerializedName("sCliSAP")
    val sap: String?,

    @SerializedName("sCliRucDni")
    val taxId: String?,

    @SerializedName("sCliNombre")
    val clientName: String?,

    @SerializedName("sCliDirección")
    val address: String?,

    @SerializedName("Ejecutivo_Id")
    val executiveId: Int,

    @SerializedName("nCliProcedencia")
    val origin: Int,

    @SerializedName("sCliIdCliengo")
    val cliengoId: String?,

    @SerializedName("nCliTcliente")
    val clientType: Int,

    @SerializedName("sCliTelefono")
    val phone: String?,

    @SerializedName("sCliCelectronico")
    val email: String?,

    @SerializedName("sCliPais")
    val country: String?,

    @SerializedName("sCliDepartamento")
    val department: String?,

    @SerializedName("sCliProvincia")
    val province: String?,

    @SerializedName("sCliDistrito")
    val district: String?,

    @SerializedName("nCliEstado")
    val status: Int
)