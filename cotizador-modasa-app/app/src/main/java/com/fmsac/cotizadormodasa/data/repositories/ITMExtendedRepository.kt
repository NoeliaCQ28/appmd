package com.fmsac.cotizadormodasa.data.repositories

import android.content.Context
import android.util.Log
import com.fmsac.cotizadormodasa.core.generator_sets.ITMExtended
import com.fmsac.cotizadormodasa.data.mappers.generator_sets.ITMExtendedMapper
import com.fmsac.cotizadormodasa.data.network.ApiService

/**
 * Repositorio para gestionar ITMs extendidos
 * Encapsula la lógica de acceso a datos del API para ITMs
 */
class ITMExtendedRepository(
    private val mapper: ITMExtendedMapper,
    private val api: ApiService,
    private val ctx: Context
) {

    /**
     * Obtiene todos los ITMs disponibles para una integradora específica
     * @param integradoraId ID de la integradora
     * @return Lista de ITMs extendidos
     * @throws Exception si hay error en la respuesta del API
     */
    suspend fun getAllByIntegradora(integradoraId: Int): List<ITMExtended> {
        Log.d(TAG, "=== START getAllByIntegradora ===")
        Log.d(TAG, "Fetching ITMs for integradora ID: $integradoraId")

        val response = api.getITMsByCombination(integradoraId)

        Log.d(TAG, "Response success: ${response.success}")
        Log.d(TAG, "Response message: ${response.message}")

        if (!response.success) {
            Log.e(TAG, "Error fetching ITMs: ${response.message}")
            throw Exception(response.message ?: "Error al obtener ITMs")
        }

        if (response.data == null) {
            Log.e(TAG, "Response data is null")
            throw Exception("No se recibieron datos de ITMs")
        }

        val itms = mapper.fromDTOList(response.data)
        Log.d(TAG, "Mapped ${itms.size} ITMs successfully")
        Log.d(TAG, "=== END getAllByIntegradora ===")

        return itms
    }

    companion object {
        private const val TAG = "ITMRepository"
    }
}
