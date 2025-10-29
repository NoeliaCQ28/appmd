package com.fmsac.cotizadormodasa.data.network.responses.customer

import com.google.gson.annotations.SerializedName

data class CustomerContactResponse(
    @SerializedName("Cliente_Id")
    val clientId: Int,

    @SerializedName("Contacto_Id")
    val contactId: Int,

    @SerializedName("sCliConNombre")
    val name: String,

    @SerializedName("sCliConCargo")
    val position: String?,

    @SerializedName("sCliConCorreo")
    val email: String,

    @SerializedName("sCliConTelefono")
    val phone: String,

    @SerializedName("nCliEstado")
    val status: Int,

    @SerializedName("nCliEliminado")
    val isDeleted: Int,

    @SerializedName("dCliFecha_Act")
    val updatedAt: String,

    @SerializedName("Usuario_Id")
    val userId: Int
)