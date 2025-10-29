package com.fmsac.cotizadormodasa.data.mappers.customers

import com.fmsac.cotizadormodasa.core.customers.Customer
import com.fmsac.cotizadormodasa.data.mappers.Mapper
import com.fmsac.cotizadormodasa.data.network.responses.customer.CustomersResponse

class CustomerMapper : Mapper {

    fun fromDTO(dto: CustomersResponse): Customer {
        return Customer(
            clientId = dto.clientId,
            clientCode = dto.clientCode,
            sap = dto.sap,
            taxId = dto.taxId,
            clientName = dto.clientName ?: "",
            address = dto.address,
            executiveId = dto.executiveId,
            origin = dto.origin,
            cliengoId = dto.cliengoId,
            clientType = dto.clientType,
            phone = dto.phone,
            email = dto.email,
            country = dto.country,
            department = dto.department,
            province = dto.province,
            district = dto.district,
            status = dto.status
        )
    }
}