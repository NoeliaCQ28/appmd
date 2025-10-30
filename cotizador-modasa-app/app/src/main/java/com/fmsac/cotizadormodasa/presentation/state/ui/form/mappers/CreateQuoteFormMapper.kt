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
            clientId = headerForm["cliente_id"]?.toIntOrNull() ?: 0,
            executiveId = headerForm["ejecutivo_id"]?.toIntOrNull() ?: 0,
            date = formattedDate,
            offerValidity = headerForm["validez_oferta"]?.toIntOrNull() ?: 0,
            project = headerForm["proyecto"]!!,
            address = headerForm["direccion"]!!,
            contact = headerForm["contacto"]!!,
            phone = headerForm["telefono"]!!,
            email = headerForm["email"]!!,
            shipping = headerForm["envio"]?.toIntOrNull() ?: 0,
            installation = headerForm["instalacion"]?.toIntOrNull() ?: 0,
            market = headerForm["mercado"]?.toIntOrNull() ?: 0,
            currencyId = headerForm["moneda_id"]?.toIntOrNull() ?: 0,
            commercialConditionId = headerForm["condicion_comercial_id"]?.toIntOrNull() ?: 0,
            deleted = 0,
            quoteType = headerForm["cotizador_tipo"]?.toIntOrNull() ?: 0,
            distributionChannelId = headerForm["canal_distribucion_id"]?.toIntOrNull() ?: 0,
            incotermId = headerForm["incoterm_id"]?.toIntOrNull() ?: 0,
            details = emptyList(),
            status = 3,
            approverUserId = null,
            approvalDate = null
        )
    }
}