package com.fmsac.cotizadormodasa.data

val quoteTypes = mapOf(
    1 to "Grupos Electrógenos",
    2 to "Cables",
    3 to "Celdas",
    4 to "Transformadores"
)

val markets = mapOf(
    1 to "NACIONAL",
    2 to "EXPORTACIÓN",
)

val customerOrigin = listOf(
    "CLIENGO",
    "CORREO",
    "LLAMADA",
    "VISITA EN OFICINA",
    "REFERIDO",
    "OTROS"
)

val customerTypes = listOf(
    "REVENDEDOR",
    "FINAL",
    "EJECUTOR",
    "LICITACIÓN PUBLICA",
    "PROYECTISTA",
    "SUPERVISIÓN",
    "RENTING"
)