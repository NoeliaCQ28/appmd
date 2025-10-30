package com.fmsac.cotizadormodasa.data.repositories

import android.content.Context
import android.util.Log
import com.fmsac.cotizadormodasa.core.generator_sets.AlternatorExtended
import com.fmsac.cotizadormodasa.data.mappers.generator_sets.AlternatorExtendedMapper
import com.fmsac.cotizadormodasa.data.network.ApiService
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

/**
 * Repositorio para gestionar alternadores extendidos
 * Encapsula la lógica de acceso a datos del API para alternadores
 */
class AlternatorExtendedRepository(
    private val mapper: AlternatorExtendedMapper,
    private val api: ApiService,
    private val ctx: Context
) {

    /**
     * Obtiene todos los alternadores disponibles para una integradora específica
     * @param integradoraId ID de la integradora
     * @return Lista de alternadores extendidos
     * @throws Exception si hay error en la respuesta del API
     */
    suspend fun getAllByIntegradora(integradoraId: Int): List<AlternatorExtended> {
        Log.d(TAG, "=== START getAllByIntegradora ===")
        Log.d(TAG, "Fetching alternators for integradora ID: $integradoraId")

        val response = api.getAlternatorsByCombination(integradoraId)

        Log.d(TAG, "Response success: ${response.success}")
        Log.d(TAG, "Response message: ${response.message}")

        if (!response.success) {
            Log.e(TAG, "Error fetching alternators: ${response.message}")
            throw Exception(response.message ?: "Error al obtener alternadores")
        }

        if (response.data == null) {
            Log.e(TAG, "Response data is null")
            throw Exception("No se recibieron datos de alternadores")
        }

        // Ejecutar el mapeo en un hilo de fondo para evitar bloquear el hilo principal
        val alternators = withContext(Dispatchers.Default) {
            mapper.fromDTOList(response.data)
        }
        Log.d(TAG, "Mapped ${alternators.size} alternators successfully")
        Log.d(TAG, "=== END getAllByIntegradora ===")

        return alternators
    }

    companion object {
        private const val TAG = "AlternatorRepository"
    }
}
