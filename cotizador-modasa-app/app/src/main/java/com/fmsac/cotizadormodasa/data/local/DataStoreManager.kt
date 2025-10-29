package com.fmsac.cotizadormodasa.data.local

import android.annotation.SuppressLint
import android.content.Context
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.longPreferencesKey
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map

private const val DATASTORE_NAME = "app_settings"

private val Context.dataStore by preferencesDataStore(name = DATASTORE_NAME)

class DataStoreManager(private val context: Context) {

    companion object {

        val TOKEN_KEY = stringPreferencesKey("auth_token")
        val USERNAME_KEY = stringPreferencesKey("username")
        val ROLE_KEY = stringPreferencesKey("role")
        val EXP_KEY = longPreferencesKey("exp")
        val API_ENDPOINT = stringPreferencesKey("api_endpoint")

        @SuppressLint("StaticFieldLeak")
        @Volatile
        private var INSTANCE: DataStoreManager? = null

        fun getInstance(context: Context): DataStoreManager {
            return INSTANCE ?: synchronized(this) {
                INSTANCE ?: DataStoreManager(context.applicationContext).also { INSTANCE = it }
            }
        }
    }

    val token: Flow<String?> = context.dataStore.data.map { it[TOKEN_KEY] }
    val username: Flow<String?> = context.dataStore.data.map { it[USERNAME_KEY] }
    val role: Flow<String?> = context.dataStore.data.map { it[ROLE_KEY] }
    val exp: Flow<Long?> = context.dataStore.data.map { it[EXP_KEY] }
    val apiEndpoint: Flow<String?> = context.dataStore.data.map { it[API_ENDPOINT] }

    suspend fun saveToken(token: String) {
        context.dataStore.edit { it[TOKEN_KEY] = token }
    }

    suspend fun isTokenPresent(): Boolean {
        return context.dataStore.data.map { it[TOKEN_KEY] != null }.first()
    }

    suspend fun saveUsername(username: String) {
        context.dataStore.edit { it[USERNAME_KEY] = username }
    }

    suspend fun saveRole(role: String) {
        context.dataStore.edit { it[ROLE_KEY] = role }
    }

    suspend fun userIsAdmin(): Boolean {
        return context.dataStore.data
            .map { prefs -> prefs[ROLE_KEY] == "Administrador" }
            .first()
    }

    suspend fun saveExp(exp: Long) {
        context.dataStore.edit { it[EXP_KEY] = exp }
    }

    suspend fun isTokenExpired(): Boolean {
        return context.dataStore.data
            .map { prefs -> prefs[EXP_KEY]?.let { it < System.currentTimeMillis() } ?: true }
            .first()
    }

    suspend fun saveApiEndpoint(endpoint: String) {
        context.dataStore.edit { it[API_ENDPOINT] = endpoint }
    }

    suspend fun clearUsername() {
        context.dataStore.edit { it.remove(USERNAME_KEY) }
    }

    suspend fun clearExp() {
        context.dataStore.edit { it.remove(EXP_KEY) }
    }

    suspend fun clearToken() {
        context.dataStore.edit { it.remove(TOKEN_KEY) }
    }

    suspend fun clearApiEndpoint() {
        context.dataStore.edit { it.remove(API_ENDPOINT) }
    }

    suspend fun clearAll() {
        context.dataStore.edit { it.clear() }
    }
}
