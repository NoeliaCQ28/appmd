package com.fmsac.cotizadormodasa.data.mappers.sellers

import com.fmsac.cotizadormodasa.core.seller.Seller
import com.fmsac.cotizadormodasa.data.mappers.Mapper
import com.fmsac.cotizadormodasa.data.network.responses.sellers.SellerResponse

class SellerMapper : Mapper {
    fun fromDTO(dto: SellerResponse): Seller {
        return Seller(
            executiveId = dto.executiveId,
            executiveCode = dto.executiveCode,
            sapCode = dto.sapCode,
            executiveName = dto.executiveName ?: "",
            phoneNumber = dto.phoneNumber,
            executiveEmail = dto.executiveEmail,
            status = dto.status,
            country = dto.country,
            department = dto.department,
            province = dto.province
        )
    }
}