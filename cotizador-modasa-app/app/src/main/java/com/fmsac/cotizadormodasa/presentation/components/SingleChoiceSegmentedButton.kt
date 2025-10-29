package com.fmsac.cotizadormodasa.presentation.components

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.wrapContentHeight
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.SegmentedButton
import androidx.compose.material3.SegmentedButtonColors
import androidx.compose.material3.SegmentedButtonDefaults
import androidx.compose.material3.SingleChoiceSegmentedButtonRow
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.navigation.compose.rememberNavController
import com.fmsac.cotizadormodasa.presentation.navigation.Screen
import com.fmsac.cotizadormodasa.presentation.theme.ui.CotizadorModasaTheme

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SingleChoiceSegmentedButton(
    modifier: Modifier = Modifier,
    options: List<String>,
    selectedIndex: Int = 0,
    onSelectionChanged: (Int) -> Unit = {},
    isDarkMode: Boolean = isSystemInDarkTheme()
) {

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .then(modifier),
        verticalAlignment = Alignment.CenterVertically
    ) {
        SingleChoiceSegmentedButtonRow {
            options.forEachIndexed { index, label ->
                SegmentedButton(
                    icon = { },
                    colors = SegmentedButtonColors(
                        activeBorderColor = Color.Transparent,
                        activeContentColor = if (isDarkMode) Color.White else Color.Black,
                        activeContainerColor = Color.Transparent,
                        inactiveContainerColor = Color.Transparent,
                        inactiveContentColor = if (isDarkMode) Color.White else Color.Black,
                        inactiveBorderColor = Color.Transparent,
                        disabledActiveContainerColor = Color.Transparent,
                        disabledActiveContentColor = Color.Transparent,
                        disabledActiveBorderColor = Color.Transparent,
                        disabledInactiveContainerColor = Color.Transparent,
                        disabledInactiveContentColor = Color.Transparent,
                        disabledInactiveBorderColor = Color.Transparent,
                    ),
                    shape = SegmentedButtonDefaults.itemShape(
                        index = index,
                        count = options.size
                    ),
                    onClick = { onSelectionChanged(index) },
                    selected = index == selectedIndex,
                    label = {
                        Text(
                            text = if(label.length > 8) label.substring(0, 5) + ".." else label,
                            modifier = Modifier.then(
                                if (index == selectedIndex) {
                                    Modifier.drawBehind {
                                        val strokeWidth = 2.dp.toPx()
                                        val y = size.height - strokeWidth / 2
                                        drawLine(
                                            color = if (isDarkMode) Color.White else Color.Black,
                                            start = Offset(0f, y),
                                            end = Offset(size.width, y),
                                            strokeWidth = strokeWidth
                                        )
                                    }
                                } else Modifier
                            )
                        )
                    }
                )
            }
        }
    }
}

@Preview
@Composable
private fun SingleChoiceSegmentedButtonPrev() {

    val controller = rememberNavController()

    val options = listOf("Todo", "Nuevos")

    CotizadorModasaTheme {
        Screen(route = "Clientes/Prospectos", controller = controller) {
            SingleChoiceSegmentedButton(options = options)
        }
    }
}
