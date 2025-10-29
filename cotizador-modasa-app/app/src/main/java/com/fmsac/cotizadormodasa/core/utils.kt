package com.fmsac.cotizadormodasa.core

import android.content.Context
import com.fmsac.cotizadormodasa.data.network.responses.Response
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.TimeZone

fun formatDate(date: Date, complete: Boolean = false): String {

    val completeHours = if (complete) "HH:mm a" else ""

    val dateFormat = SimpleDateFormat("dd/MM/yyyy $completeHours", Locale.getDefault()).apply {
        timeZone = TimeZone.getTimeZone("America/Lima")
    }

    return dateFormat.format(date)
}

fun formatDate(date: String, complete: Boolean = false): String {
    val parser = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.getDefault()).apply {
        timeZone = TimeZone.getTimeZone("UTC") // La 'Z' indica que está en UTC
    }

    val parsedDate = try {
        parser.parse(date)
    } catch (e: Exception) {
        null
    }

    if (parsedDate == null) return ""

    val completeHours = if (complete) " HH:mm a" else ""
    val formatter = SimpleDateFormat("dd/MM/yyyy$completeHours", Locale.getDefault()).apply {
        timeZone = TimeZone.getTimeZone("America/Lima")
    }

    val timeZoneOffset = TimeZone.getTimeZone("America/Lima").rawOffset
    val correctedMillis = parsedDate.time - timeZoneOffset

    return formatter.format(correctedMillis)
}

fun loadJSONFromAsset(context: Context, fileName: String): String? {
    return try {
        context.assets.open(fileName).use { inputStream ->
            val size = inputStream.available()
            val buffer = ByteArray(size)
            inputStream.read(buffer)
            String(buffer, Charsets.UTF_8)
        }
    } catch (ex: Exception) {
        ex.printStackTrace()
        null
    }
}

fun <Response> fetchJSON(ctx: Context, fileName: String): Response {
    val jsonString = loadJSONFromAsset(ctx, fileName)
    val gson = Gson()
    val listType = object : TypeToken<Response>() {}.type
    val response =
        gson.fromJson<Response>(jsonString, listType)

    return response
}