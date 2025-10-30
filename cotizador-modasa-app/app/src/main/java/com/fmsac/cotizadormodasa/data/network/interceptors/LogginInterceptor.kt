package com.fmsac.cotizadormodasa.data.network.interceptors

import okhttp3.logging.HttpLoggingInterceptor

// El nivel se configurará dinámicamente en RetrofitInstance.provideOkHttpClient()
val loggingInterceptor = HttpLoggingInterceptor()