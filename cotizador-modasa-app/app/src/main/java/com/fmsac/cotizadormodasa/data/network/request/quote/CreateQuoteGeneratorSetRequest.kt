package com.fmsac.cotizadormodasa.data.network.request.quote

import com.google.gson.annotations.SerializedName

data class CreateQuoteGeneratorSetRequest(
    @SerializedName("cliente_id")
    val clientId: Int,

    @SerializedName("ejecutivo_id")
    val executiveId: Int,

    @SerializedName("fecha")
    val date: String,

    @SerializedName("validez_oferta")
    val offerValidity: Int,

    @SerializedName("proyecto")
    val project: String,

    @SerializedName("direccion")
    val address: String,

    @SerializedName("contacto")
    val contact: String,

    @SerializedName("telefono")
    val phone: String,

    @SerializedName("email")
    val email: String,

    @SerializedName("envio")
    val shipping: Int,

    @SerializedName("instalacion")
    val installation: Int,

    @SerializedName("mercado")
    val market: Int,

    @SerializedName("moneda_id")
    val currencyId: Int,

    @SerializedName("condicion_comercial_id")
    val commercialConditionId: Int,

    @SerializedName("estado")
    val status: Int = 3,

    @SerializedName("usuario_aprobador_id")
    val approverUserId: Int?,

    @SerializedName("aprobacion_fecha")
    val approvalDate: String?,

    @SerializedName("eliminado")
    val deleted: Int = 0,

    @SerializedName("cotizador_tipo")
    val quoteType: Int,

    @SerializedName("canal_distribucion_id")
    val distributionChannelId: Int,

    @SerializedName("incoterm_id")
    val incotermId: Int,

    @SerializedName("details")
    val details: List<QuoteGeneratorSetDetailsRequest> = emptyList()
)

data class QuoteGeneratorSetDetailsRequest(
    @SerializedName("tipo")
    val type: String,

    @SerializedName("cantidad")
    val quantity: Int,

    @SerializedName("precio_unitario")
    val unitPrice: Double,

    @SerializedName("producto_id")
    val productId: Int,

    @SerializedName("quote_extra_details")
    val quoteExtraDetails: QuoteGeneratorSetExtraDetailsRequest
)

data class QuoteGeneratorSetExtraDetailsRequest(
    @SerializedName("params")
    val params: ParamsGeneratorSetRequest,

    @SerializedName("model")
    val model: String,

    @SerializedName("motor")
    val motor: String,

    @SerializedName("alternador")
    val alternator: String,

    @SerializedName("discount")
    val discount: Double,

    @SerializedName("increaseDiscount")
    val increaseDiscount: Double,

    @SerializedName("originalPrice")
    val originalPrice: Double,

    @SerializedName("finalPrice")
    val finalPrice: Double,

    @SerializedName("otherComponents")
    val otherComponents: List<AdditionalComponentGeneratorSetRequest>
)

data class ParamsGeneratorSetRequest(
    @SerializedName("voltaje")
    val voltage: Int,

    @SerializedName("frecuencia")
    val frequency: Int,

    @SerializedName("fases")
    val phases: Int,

    @SerializedName("factorPotencia")
    val powerFactor: Double,

    @SerializedName("altura")
    val height: Int,

    @SerializedName("temperatura")
    val temperature: Int,

    @SerializedName("insonoro")
    val isSoundproof: Boolean
)

data class AdditionalComponentGeneratorSetRequest(
    @SerializedName("id")
    val id: Int,

    @SerializedName("name")
    val name: String,

    @SerializedName("description")
    val description: String,

    @SerializedName("price")
    val price: Double
)
