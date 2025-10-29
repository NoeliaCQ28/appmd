package com.fmsac.cotizadormodasa.presentation.navigation.home

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.navigation.NavHostController
import androidx.navigation.compose.rememberNavController
import com.fmsac.cotizadormodasa.R
import com.fmsac.cotizadormodasa.presentation.navigation.Screen
import com.fmsac.cotizadormodasa.presentation.theme.ui.CotizadorModasaTheme

@Composable
fun HomeScreen(
    modifier: Modifier = Modifier,
    controller: NavHostController
) = Screen(controller = controller, modifier = modifier, route = "Inicio") {

    Image(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp)),
        alignment = Alignment.TopCenter,
        contentScale = ContentScale.Crop,
        painter = painterResource(R.drawable.grupos_electrogenos),
        contentDescription = "grupos electrogenos"
    )
}

@Preview
@Composable
private fun HomeScreenPreview() {

    val controller = rememberNavController()

    CotizadorModasaTheme {

        HomeScreen(modifier = Modifier, controller = controller)
    }
}