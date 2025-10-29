package com.fmsac.cotizadormodasa.presentation.components

import androidx.compose.animation.animateContentSize
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.role
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp

@Composable
fun StatusBadge(
    status: String,
    modifier: Modifier = Modifier
) {

    val badgeColor = when (status.uppercase()) {
        "BORRADOR" -> Pair(Color(0xFFe6e6e6), Color(0xFF848484))
        "APROBACIÓN DE DESCUENTO" -> Pair(Color(0xFFeab308), Color(0xFFFFFFFF))
        "REGISTRADA" -> Pair(Color(0xFFffeccc), Color(0xFFaa7826))
        "POR APROBAR" -> Pair(Color(0xFFffe0e0), Color(0xFFff1f31))
        "RECHAZADA" -> Pair(Color(0xFFff1f31), Color(0xFFFFFFFF))
        "EN PEDIDO" -> Pair(Color(0xFFe1e0ff), Color(0xFF2a6fca))
        "EN PROCESO" -> Pair(Color(0xFFffeccc), Color(0xFFaa7826))
        "PROCESADO" -> Pair(Color(0xFFe9ffe0), Color(0xFF289900))
        "ENTREGADO" -> Pair(Color(0xFFe1e0ff), Color(0xFF2a6fca))
        else -> Pair(Color(0xFFe6e6e6), Color(0xFF848484))
    }

    var expanded by remember { mutableStateOf(false) }

    val fullText = "• $status"
    val truncatedText = "• ${status.take(10)}..."
    val displayText = if (expanded || status.length <= 10) fullText else truncatedText

    Box(
        modifier = modifier
            .clip(RoundedCornerShape(8.dp))
            .background(badgeColor.first)
            .padding(horizontal = 8.dp, vertical = 4.dp)
            .animateContentSize(
                animationSpec = tween(
                    durationMillis = 300,
                    easing = FastOutSlowInEasing
                )
            )
            .clickable(
                onClick = { expanded = !expanded },
                indication = null,
                interactionSource = remember { MutableInteractionSource() }
            )
            .semantics {
                role = Role.Button
                contentDescription =
                    "Estado: $status. ${if (expanded) "Expandido" else "Contraído"}"
            },
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = displayText,
            color = badgeColor.second,
            style = MaterialTheme.typography.bodyMedium,
            maxLines = if (expanded) Int.MAX_VALUE else 1,
            overflow = TextOverflow.Ellipsis
        )
    }
}