package com.fmsac.cotizadormodasa.data.network.responses.quote

import com.google.gson.annotations.SerializedName

data class CreateQuoteResponse(
    @SerializedName("Cotizacon_Id") val quoteId: Int,
)