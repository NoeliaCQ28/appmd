package com.fmsac.cotizadormodasa.data.mappers.quotes

import com.fmsac.cotizadormodasa.core.quotes.AllQuote
import com.fmsac.cotizadormodasa.core.quotes.CreateQuoteGeneratorSet
import com.fmsac.cotizadormodasa.core.quotes.CreateQuoteGeneratorSetAdditionalComponent
import com.fmsac.cotizadormodasa.core.quotes.CreateQuoteGeneratorSetDetail
import com.fmsac.cotizadormodasa.core.quotes.CreateQuoteGeneratorSetExtraDetails
import com.fmsac.cotizadormodasa.core.quotes.CreateQuoteGeneratorSetParams
import com.fmsac.cotizadormodasa.data.mappers.Mapper
import com.fmsac.cotizadormodasa.data.network.request.quote.AdditionalComponentGeneratorSetRequest
import com.fmsac.cotizadormodasa.data.network.request.quote.CreateQuoteGeneratorSetRequest
import com.fmsac.cotizadormodasa.data.network.request.quote.ParamsGeneratorSetRequest
import com.fmsac.cotizadormodasa.data.network.request.quote.QuoteGeneratorSetDetailsRequest
import com.fmsac.cotizadormodasa.data.network.request.quote.QuoteGeneratorSetExtraDetailsRequest
import com.fmsac.cotizadormodasa.data.network.responses.quote.AllQuoteResponse

class QuoteGeneratorSetMapper : Mapper {
    fun fromDTO(dto: AllQuoteResponse): AllQuote {
        return AllQuote(
            id = dto.id,
            code = dto.code,
            customerId = dto.customerId,
            customerName = dto.customerName,
            executiveId = dto.executiveId,
            executiveName = dto.executiveName,
            date = dto.date,
            type = dto.type,
            project = dto.project,
            total = dto.total,
            statusId = dto.statusId,
            status = dto.status
        )
    }

    fun toDTO(model: CreateQuoteGeneratorSet): CreateQuoteGeneratorSetRequest {
        return CreateQuoteGeneratorSetRequest(
            clientId = model.clientId,
            executiveId = model.executiveId,
            date = model.date,
            offerValidity = model.offerValidity,
            project = model.project,
            address = model.address,
            contact = model.contact,
            phone = model.phone,
            email = model.email,
            shipping = model.shipping,
            installation = model.installation,
            market = model.market,
            currencyId = model.currencyId,
            commercialConditionId = model.commercialConditionId,
            status = model.status,
            approverUserId = model.approverUserId,
            approvalDate = model.approvalDate,
            deleted = model.deleted,
            quoteType = model.quoteType,
            distributionChannelId = model.distributionChannelId,
            incotermId = model.incotermId,
            details = model.details.map { toDTOQuoteDetails(it) }
        )
    }

    private fun toDTOQuoteDetails(model: CreateQuoteGeneratorSetDetail): QuoteGeneratorSetDetailsRequest {
        return QuoteGeneratorSetDetailsRequest(
            type = model.type,
            quantity = model.quantity,
            unitPrice = model.unitPrice,
            productId = model.productId,
            quoteExtraDetails = toDTOQuoteExtraDetails(model.quoteExtraDetails)
        )
    }

    private fun toDTOQuoteExtraDetails(model: CreateQuoteGeneratorSetExtraDetails): QuoteGeneratorSetExtraDetailsRequest {
        return QuoteGeneratorSetExtraDetailsRequest(
            params = toDTOQuoteParams(model.params),
            model = model.model,
            motor = model.motor,
            alternator = model.alternator,
            discount = model.discount,
            increaseDiscount = model.increaseDiscount,
            originalPrice = model.originalPrice,
            finalPrice = model.finalPrice,
            otherComponents = model.otherComponents.map { toDTOAdditionalComponents(it) }
        )
    }

    private fun toDTOQuoteParams(model: CreateQuoteGeneratorSetParams): ParamsGeneratorSetRequest {
        return ParamsGeneratorSetRequest(
            voltage = model.voltage,
            frequency = model.frequency,
            phases = model.phases,
            powerFactor = model.powerFactor,
            height = model.height,
            temperature = model.temperature,
            isSoundproof = model.isSoundproof
        )
    }

    private fun toDTOAdditionalComponents(model: CreateQuoteGeneratorSetAdditionalComponent): AdditionalComponentGeneratorSetRequest {
        return AdditionalComponentGeneratorSetRequest(
            id = model.id,
            name = model.name,
            description = model.description,
            price = model.price
        )
    }
}