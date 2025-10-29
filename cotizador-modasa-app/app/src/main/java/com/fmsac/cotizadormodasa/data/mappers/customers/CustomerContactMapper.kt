package com.fmsac.cotizadormodasa.data.mappers.customers

import com.fmsac.cotizadormodasa.core.customers.CustomerContact
import com.fmsac.cotizadormodasa.data.mappers.Mapper
import com.fmsac.cotizadormodasa.data.network.responses.customer.CustomerContactResponse

class CustomerContactMapper : Mapper {
    fun fromDTO(dto: CustomerContactResponse): CustomerContact {
        return CustomerContact(
            clientId = dto.clientId,
            contactId = dto.contactId,
            name = dto.name,
            position = dto.position,
            email = dto.email,
            phone = dto.phone,
            status = dto.status,
            isDeleted = dto.isDeleted,
            updatedAt = dto.updatedAt,
            userId = dto.userId
        )
    }
}