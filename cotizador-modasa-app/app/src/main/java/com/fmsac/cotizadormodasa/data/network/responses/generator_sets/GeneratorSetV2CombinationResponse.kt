package com.fmsac.cotizadormodasa.data.network.responses.generator_sets

import com.google.gson.annotations.SerializedName

data class GeneratorSetV2CombinationResponse(
    @SerializedName("IntegradoraId")
    val integradoraId: Int?,

    @SerializedName("sIntKey")
    val intKey: String,

    @SerializedName("sModNombre")
    val modelName: String,

    @SerializedName("sMotModelo")
    val motorModel: String,

    @SerializedName("sMotMarca")
    val motorBrand: String,

    @SerializedName("sMotMarcaVisual")
    val motorBrandVisual: String,

    @SerializedName("sAltModelo")
    val alternatorModel: String,

    @SerializedName("sAltMarca")
    val alternatorBrand: String,

    @SerializedName("Alternador_Id")
    val alternatorId: Int?,

    @SerializedName("nIntITMA")
    val itmId: Int?,

    @SerializedName("sKitItm")
    val itmKitName: String?,

    // Campos de ITM que el backend envía como String
    @SerializedName("nITMCostoUSD")
    val nITMCostoUSD: String? = null,

    @SerializedName("nITMPrecioUSD")
    val nITMPrecioUSD: String? = null,

    @SerializedName("nIntPrecioGEAbierto")
    val priceOpen: Double?,

    @SerializedName("nIntPrecioGECabina")
    val priceCabin: Double?,

    @SerializedName("nIntPrecioTotalUSD")
    val totalPriceUSD: Double?,

    @SerializedName("PrimeKW")
    val primeKW: Double?,

    @SerializedName("PrimeKVA")
    val primeKVA: Double?,

    @SerializedName("StandByKW")
    val standbyKW: Double?,

    @SerializedName("StandByKVA")
    val standbyKVA: Double?,

    @SerializedName("nIntInsonoro")
    val isSoundproof: Boolean?
)
