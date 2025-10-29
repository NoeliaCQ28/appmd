package com.fmsac.cotizadormodasa.core.quotes

data class CreateQuoteGeneratorSet(
    val clientId: Int,
    val executiveId: Int,
    val date: String,
    val offerValidity: Int,
    val project: String,
    val address: String,
    val contact: String,
    val phone: String,
    val email: String,
    val shipping: Int,
    val installation: Int,
    val market: Int,
    val currencyId: Int,
    val commercialConditionId: Int,
    val status: Int = 1,
    val approverUserId: Int?,
    val approvalDate: String?,
    val deleted: Int = 0,
    val quoteType: Int,
    val distributionChannelId: Int,
    val incotermId: Int,
    val details: List<CreateQuoteGeneratorSetDetail> = emptyList()
)

data class CreateQuoteGeneratorSetDetail(
    val type: String,
    val quantity: Int,
    val unitPrice: Double,
    val productId: Int,
    val quoteExtraDetails: CreateQuoteGeneratorSetExtraDetails
)

data class CreateQuoteGeneratorSetExtraDetails(
    val params: CreateQuoteGeneratorSetParams,
    val model: String,
    val motor: String,
    val alternator: String,
    val discount: Double,
    val increaseDiscount: Double,
    val originalPrice: Double,
    val finalPrice: Double,
    val otherComponents: List<CreateQuoteGeneratorSetAdditionalComponent>
)

data class CreateQuoteGeneratorSetParams(
    val voltage: Int,
    val frequency: Int,
    val phases: Int,
    val powerFactor: Double,
    val height: Int,
    val temperature: Int,
    val isSoundproof: Boolean
)

data class CreateQuoteGeneratorSetAdditionalComponent(
    val id: Int,
    val name: String,
    val description: String,
    val price: Double
)
