package com.fmsac.cotizadormodasa.data.repositories.common

interface Repository<T> {

    suspend fun getAll(): List<T>
    suspend fun update(data: T)
    suspend fun delete(data: T)
}