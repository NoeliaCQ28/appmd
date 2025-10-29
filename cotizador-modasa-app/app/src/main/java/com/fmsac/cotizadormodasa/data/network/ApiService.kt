package com.fmsac.cotizadormodasa.data.network

import com.fmsac.cotizadormodasa.data.network.request.auth.AuthRequest
import com.fmsac.cotizadormodasa.data.network.request.generator_sets.GeneratingSetsParametersRequest
import com.fmsac.cotizadormodasa.data.network.request.quote.CreateQuoteGeneratorSetRequest
import com.fmsac.cotizadormodasa.data.network.responses.Response
import com.fmsac.cotizadormodasa.data.network.responses.comercial_condition.CommercialConditionResponse
import com.fmsac.cotizadormodasa.data.network.responses.customer.CustomerContactResponse
import com.fmsac.cotizadormodasa.data.network.responses.customer.CustomersResponse
import com.fmsac.cotizadormodasa.data.network.responses.distribution_channels.DistributionChannelResponse
import com.fmsac.cotizadormodasa.data.network.responses.generating_sets_parameters_values.GeneratingSetsParametersValuesResponse
import com.fmsac.cotizadormodasa.data.network.responses.generator_sets.AlternatorExtendedResponse
import com.fmsac.cotizadormodasa.data.network.responses.generator_sets.GeneratorSetModelResponse
import com.fmsac.cotizadormodasa.data.network.responses.generator_sets.GeneratorSetV2WrapperResponse
import com.fmsac.cotizadormodasa.data.network.responses.generator_sets.ITMExtendedResponse
import com.fmsac.cotizadormodasa.data.network.responses.incoterm.IncotermResponse
import com.fmsac.cotizadormodasa.data.network.responses.quote.AllQuoteResponse
import com.fmsac.cotizadormodasa.data.network.responses.quote.CreateQuoteResponse
import com.fmsac.cotizadormodasa.data.network.responses.quote.OptionalComponentResponse
import com.fmsac.cotizadormodasa.data.network.responses.sellers.SellerResponse
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path


interface ApiService {

    @POST("/api/auth/login")
    suspend fun signIn(@Body request: AuthRequest): Response<String>

    @GET("/api/v1/cotizaciones")
    suspend fun getAllQuotes(): Response<List<AllQuoteResponse>>

    @POST("/api/v1/cotizaciones")
    suspend fun createQuote(@Body quote: CreateQuoteGeneratorSetRequest): Response<CreateQuoteResponse>

    @GET("/api/v1/clientes")
    suspend fun getAllCustomers(): Response<List<CustomersResponse>>

    @GET("/api/v1/clientes/{customerId}/contacts")
    suspend fun getContactsByCustomerId(
        @Path("customerId") customerId: Int
    ): Response<List<CustomerContactResponse>>

    @GET("/api/vendedores/listar")
    suspend fun getAllSellers(): Response<List<SellerResponse>>

    @GET("/api/v1/condiciones-comerciales")
    suspend fun getAllCommercialConditions(): Response<List<CommercialConditionResponse>>

    @GET("/api/v1/canales-distribucion")
    suspend fun getAllDistributionChannels(): Response<List<DistributionChannelResponse>>

    @GET("/api/v1/incoterms")
    suspend fun getAllIncoterms(): Response<List<IncotermResponse>>

    @GET("/api/v1/grupos-electrogenos/parametros")
    suspend fun getGeneratorSetModelsParamsAvailable(): Response<GeneratingSetsParametersValuesResponse>

    @GET("/api/v1/grupos-electrogenos/search-params/models")
    suspend fun getAvailableGeneratorModels(): Response<List<String>>

    @GET("/api/v1/grupos-electrogenos/search-params/motor-brands")
    suspend fun getAvailableMotorBrands(): Response<List<String>>

    @POST("/api/v2/generator-sets/get-all-combinations")
    suspend fun getGeneratorSetModelsByParams(@Body params: GeneratingSetsParametersRequest): Response<GeneratorSetV2WrapperResponse>

    // Nuevos endpoints para modales de selección de componentes (v2)
    @GET("/api/v2/generator-sets/alternators/by-combination/{integradoraId}")
    suspend fun getAlternatorsByCombination(
        @Path("integradoraId") integradoraId: Int
    ): Response<List<AlternatorExtendedResponse>>

    @GET("/api/v2/generator-sets/itms/by-combination/{integradoraId}")
    suspend fun getITMsByCombination(
        @Path("integradoraId") integradoraId: Int
    ): Response<List<ITMExtendedResponse>>

    @GET("/api/v1/opcionales")
    suspend fun getAllOptionalComponents(): Response<List<OptionalComponentResponse>>

    @GET("/api/v1/opcionales/{modelName}")
    suspend fun getOptionalComponentsOfGeneratorSetModel(
        @Path("modelName") modelName: String
    ): Response<List<OptionalComponentResponse>>
}