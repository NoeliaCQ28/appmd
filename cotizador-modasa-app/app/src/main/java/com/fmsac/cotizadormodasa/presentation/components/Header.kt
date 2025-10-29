package com.fmsac.cotizadormodasa.presentation.components

import androidx.compose.foundation.Image
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.Sort
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.fmsac.cotizadormodasa.R

@Composable
@OptIn(ExperimentalMaterial3Api::class)
fun Header(
    title: String,
    userName: String,
    userRole: String,
    isDarkMode: Boolean = isSystemInDarkTheme(),
    navigationAction: () -> Unit
) {
    TopAppBar(
        title = {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Texto de la izquierda (Inicio)
                Text(
                    text = title,
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.weight(1f)
                )

                // Foto de perfil y nombre de usuario
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Image(
                        painter = painterResource(id = R.drawable.fmsac_logo),
                        contentDescription = "Foto de perfil",
                        modifier = Modifier
                            .clip(MaterialTheme.shapes.large)
                            .size(38.dp)
                    )



                    Column {
                        Text(
                            text = userName,
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = userRole,
                            fontSize = 14.sp
                        )
                    }
                }
            }
        },
        navigationIcon = {
            IconButton(onClick = navigationAction) {
                Icon(
                    Icons.AutoMirrored.Filled.Sort,
                    contentDescription = "Menu",
                    modifier = Modifier.size(30.dp)
                )
            }
        }
    )
}

@Preview(
    showBackground = true,
    backgroundColor = 0xFFFFFFFF,
    showSystemUi = true
)
@Composable
private fun HeaderPreview() {
    Scaffold(
        topBar = {
            Header(
                title = "Inicio",
                userName = "Ramiro López",
                userRole = "Administrador",
                navigationAction = {}
            )
        }
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(text = "Hello", modifier = Modifier.padding(16.dp))
        }
    }
}