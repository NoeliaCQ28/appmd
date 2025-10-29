package com.fmsac.cotizadormodasa.presentation.components

import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.FilledTonalButton
import androidx.compose.material3.ShapeDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.fmsac.cotizadormodasa.presentation.theme.ui.CotizadorModasaTheme
import com.fmsac.cotizadormodasa.presentation.theme.ui.buttonDestructive
import com.fmsac.cotizadormodasa.presentation.theme.ui.buttonPrimary
import com.fmsac.cotizadormodasa.presentation.theme.ui.buttonSecondary
import com.fmsac.cotizadormodasa.presentation.theme.ui.buttonTertiary

enum class ButtonVariant {
    PRIMARY,
    SECONDARY,
    DESTRUCTIVE,
    TERTIARY
}

@Composable
fun Button(
    modifier: Modifier = Modifier,
    onClick: () -> Unit,
    text: String,
    variant: ButtonVariant = ButtonVariant.PRIMARY,
    fontSize: TextUnit = 20.sp,
    isLoading: Boolean = false
) {

    val backgroundColor = when (variant) {
        ButtonVariant.PRIMARY -> buttonPrimary
        ButtonVariant.SECONDARY -> buttonSecondary
        ButtonVariant.DESTRUCTIVE -> buttonDestructive
        ButtonVariant.TERTIARY -> buttonTertiary
    }

    val border = if (variant == ButtonVariant.SECONDARY) {
        BorderStroke(2.dp, buttonPrimary)
    } else {
        BorderStroke(0.dp, backgroundColor)
    }

    val textColor = when (variant) {
        ButtonVariant.SECONDARY -> buttonPrimary
        else -> Color.White
    }

    FilledTonalButton(
        modifier = modifier,
        onClick = onClick,
        shape = ShapeDefaults.Medium,
        border = border,
        contentPadding = PaddingValues(16.dp),
        colors = ButtonDefaults.buttonColors(containerColor = backgroundColor)
    ) {

        AnimatedContent(
            targetState = isLoading,
            transitionSpec = {
                // Aquí se define una animación de fadeIn y fadeOut con una duración de 300 ms.
                fadeIn(animationSpec = tween(durationMillis = 300)) togetherWith
                        fadeOut(animationSpec = tween(durationMillis = 300))
            }
        ) { targetIsLoading ->
            if (targetIsLoading) {
                CircularProgressIndicator(
                    strokeWidth = 2.dp,
                    modifier = Modifier.size(24.dp)
                )
            } else {
                Text(
                    text = text,
                    style = TextStyle(
                        fontSize = fontSize,
                        color = textColor,
                        fontWeight = FontWeight.SemiBold
                    )
                )
            }
        }
    }
}

@Composable
fun Button(
    modifier: Modifier = Modifier,
    onClick: () -> Unit,
    text: @Composable () -> Unit,
    variant: ButtonVariant = ButtonVariant.PRIMARY,
    isLoading: Boolean = false
) {

    val backgroundColor = when (variant) {
        ButtonVariant.PRIMARY -> buttonPrimary
        ButtonVariant.SECONDARY -> buttonSecondary
        ButtonVariant.DESTRUCTIVE -> buttonDestructive
        ButtonVariant.TERTIARY -> buttonTertiary
    }

    val border = if (variant == ButtonVariant.SECONDARY) {
        BorderStroke(2.dp, buttonPrimary)
    } else {
        BorderStroke(0.dp, backgroundColor)
    }

    val textColor = when (variant) {
        ButtonVariant.SECONDARY -> buttonPrimary
        else -> Color.White
    }

    FilledTonalButton(
        modifier = modifier,
        onClick = onClick,
        shape = ShapeDefaults.Medium,
        border = border,
        contentPadding = PaddingValues(16.dp),
        colors = ButtonDefaults.buttonColors(containerColor = backgroundColor)
    ) {

        AnimatedContent(
            targetState = isLoading,
            transitionSpec = {
                // Aquí se define una animación de fadeIn y fadeOut con una duración de 300 ms.
                fadeIn(animationSpec = tween(durationMillis = 300)) togetherWith
                        fadeOut(animationSpec = tween(durationMillis = 300))
            }
        ) { targetIsLoading ->
            if (targetIsLoading) {
                CircularProgressIndicator(
                    strokeWidth = 2.dp,
                    modifier = Modifier.size(24.dp)
                )
            } else {
                text()
            }
        }
    }
}

@Preview(
    showBackground = true,
    backgroundColor = 0xFFFFFFFF,
    showSystemUi = true
)
@Composable
private fun ButtonPreview() {
    CotizadorModasaTheme {

        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp, Alignment.CenterVertically)
        ) {
            Button(
                variant = ButtonVariant.PRIMARY,
                onClick = {},
                text = "INICIAR SESSION",
            )
            Button(
                variant = ButtonVariant.SECONDARY,
                onClick = {},
                text = "INICIAR SESSION"
            )
            Button(
                variant = ButtonVariant.DESTRUCTIVE,
                onClick = {},
                text = "INICIAR SESSION"
            )
            Button(
                variant = ButtonVariant.TERTIARY,
                onClick = {},
                text = "INICIAR SESSION"
            )
        }
    }
}