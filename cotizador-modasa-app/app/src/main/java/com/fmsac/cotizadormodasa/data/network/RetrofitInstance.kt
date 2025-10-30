package com.fmsac.cotizadormodasa.data.network

import android.content.Context
import com.fmsac.cotizadormodasa.data.local.DataStoreManager
import com.fmsac.cotizadormodasa.data.network.interceptors.AuthInterceptor
import com.fmsac.cotizadormodasa.data.network.interceptors.loggingInterceptor
import kotlinx.coroutines.flow.first
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import java.util.concurrent.TimeUnit
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

enum class ENVIRONMENT(val endpoint: String) {
    DEVELOPMENT("https://api-cotizador.georgegiosue.dev/"),
    DEVELOPMENT_FORWARD_PORT("https://n4r3trg0-3000.brs.devtunnels.ms/"),
    PRODUCTION("")
}

fun provideOkHttpClient(context: Context): OkHttpClient {
    // Configurar el nivel del logging interceptor según si la app es debuggable
    val isDebuggable = (context.applicationInfo.flags and android.content.pm.ApplicationInfo.FLAG_DEBUGGABLE) != 0
    loggingInterceptor.level = if (isDebuggable) {
        HttpLoggingInterceptor.Level.BODY
    } else {
        HttpLoggingInterceptor.Level.NONE
    }

    return OkHttpClient.Builder()
        .addInterceptor(AuthInterceptor(context))
        .addInterceptor(loggingInterceptor)
        .connectTimeout(60, TimeUnit.SECONDS)
        .readTimeout(60, TimeUnit.SECONDS)
        .writeTimeout(60, TimeUnit.SECONDS)
        .build()
}


object RetrofitInstance {

    suspend fun API(ctx: Context): ApiService {

        val dataStore = DataStoreManager.getInstance(ctx)
        val endpoint = dataStore.apiEndpoint.first() ?: ENVIRONMENT.DEVELOPMENT.endpoint

        return Retrofit.Builder()
            .baseUrl(endpoint)
            .client(provideOkHttpClient(ctx))
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(ApiService::class.java)
    }
}