package com.fmsac.cotizadormodasa.presentation.state.ui.form.mappers

import com.fmsac.cotizadormodasa.core.quotes.CreateQuoteGeneratorSet
import java.time.LocalDate
import java.time.format.DateTimeFormatter

class CreateQuoteFormMapper : FormMapper {

    fun toModel(headerForm: Map<String, String>): CreateQuoteGeneratorSet {

        val inputDate = headerForm["fecha"]!!

        val inputFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy")

        val date = LocalDate.parse(inputDate, inputFormatter)

        val outputFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd")

        val formattedDate = date.format(outputFormatter)

        return CreateQuoteGeneratorSet(
            clientId = headerForm["cliente_id"]!!.toInt(),
            executiveId = headerForm["ejecutivo_id"]!!.toInt(),
            date = formattedDate,
            offerValidity = headerForm["validez_oferta"]!!.toInt(),
            project = headerForm["proyecto"]!!,
            address = headerForm["direccion"]!!,
            contact = headerForm["contacto"]!!,
            phone = headerForm["telefono"]!!,
            email = headerForm["email"]!!,
            shipping = headerForm["envio"]!!.toInt(),
            installation = headerForm["instalacion"]!!.toInt(),
            market = headerForm["mercado"]!!.toInt(),
            currencyId = headerForm["moneda_id"]!!.toInt(),
            commercialConditionId = headerForm["condicion_comercial_id"]!!.toInt(),
            deleted = 0,
            quoteType = headerForm["cotizador_tipo"]!!.toInt(),
            distributionChannelId = headerForm["canal_distribucion_id"]!!.toInt(),
            incotermId = headerForm["incoterm_id"]!!.toInt(),
            details = emptyList(),
            status = 3,
            approverUserId = null,
            approvalDate = null
        )
    }
}