package com.fmsac.cotizadormodasa.presentation.activities

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.ui.Modifier
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.toRoute
import com.fmsac.cotizadormodasa.presentation.navigation.customers.Customer
import com.fmsac.cotizadormodasa.presentation.navigation.customers.CustomerScreen
import com.fmsac.cotizadormodasa.presentation.navigation.customers.create.CreateCustomer
import com.fmsac.cotizadormodasa.presentation.navigation.customers.create.CreateCustomerScreen
import com.fmsac.cotizadormodasa.presentation.navigation.home.Home
import com.fmsac.cotizadormodasa.presentation.navigation.home.HomeScreen
import com.fmsac.cotizadormodasa.presentation.navigation.quote.Quote
import com.fmsac.cotizadormodasa.presentation.navigation.quote.QuoteScreen
import com.fmsac.cotizadormodasa.presentation.navigation.quote.create.CreateQuote
import com.fmsac.cotizadormodasa.presentation.navigation.quote.create.CreateQuoteScreen
import com.fmsac.cotizadormodasa.presentation.navigation.quote.create.attach_details.AttachDetailsToQuote
import com.fmsac.cotizadormodasa.presentation.navigation.quote.create.attach_details.AttachDetailsToQuoteScreen
import com.fmsac.cotizadormodasa.presentation.navigation.settings.Settings
import com.fmsac.cotizadormodasa.presentation.navigation.settings.SettingsScreen
import com.fmsac.cotizadormodasa.presentation.navigation.signin.SignIn
import com.fmsac.cotizadormodasa.presentation.navigation.signin.SignInScreen
import com.fmsac.cotizadormodasa.presentation.theme.ui.CotizadorModasaTheme
import com.fmsac.cotizadormodasa.presentation.viewmodels.commercial_conditions.CommercialConditionViewModel
import com.fmsac.cotizadormodasa.presentation.viewmodels.customers.CustomerViewModel
import com.fmsac.cotizadormodasa.presentation.viewmodels.distribution_channels.DistributionChannelsViewModel
import com.fmsac.cotizadormodasa.presentation.viewmodels.generator_sets.AlternatorSelectionViewModel
import com.fmsac.cotizadormodasa.presentation.viewmodels.generator_sets.GeneratorSetViewModel
import com.fmsac.cotizadormodasa.presentation.viewmodels.generator_sets.ITMSelectionViewModel
import com.fmsac.cotizadormodasa.presentation.viewmodels.generator_sets.OptionalGeneratorSetComponentsViewModel
import com.fmsac.cotizadormodasa.presentation.viewmodels.incoterms.IncotermsViewModel
import com.fmsac.cotizadormodasa.presentation.viewmodels.quotes.QuoteViewModel
import com.fmsac.cotizadormodasa.presentation.viewmodels.sellers.SellerViewModel

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {

            val navController = rememberNavController()

            val customerViewModel = viewModel<CustomerViewModel>()
            val quoteViewModel = viewModel<QuoteViewModel>()

            val generatorSetViewModel = viewModel<GeneratorSetViewModel>()
            val optionalGeneratorSetComponentsViewModel =
                viewModel<OptionalGeneratorSetComponentsViewModel>()
            val alternatorSelectionViewModel = viewModel<AlternatorSelectionViewModel>()
            val itmSelectionViewModel = viewModel<ITMSelectionViewModel>()

            val sellerViewModel = viewModel<SellerViewModel>()
            val commercialConditionViewModel = viewModel<CommercialConditionViewModel>()
            val distributionChannelsViewModel = viewModel<DistributionChannelsViewModel>()
            val incotermsViewModel = viewModel<IncotermsViewModel>()

            CotizadorModasaTheme {
                NavHost(
                    modifier = Modifier.fillMaxSize(),
                    navController = navController,
                    startDestination = SignIn
                ) {
                    composable<SignIn> {
                        SignInScreen(controller = navController)
                    }
                    composable<Home> {
                        HomeScreen(controller = navController)
                    }
                    composable<Customer> {
                        CustomerScreen(
                            controller = navController,
                            customerViewModel = customerViewModel
                        )
                    }
                    composable<CreateCustomer> {
                        CreateCustomerScreen(controller = navController)
                    }
                    composable<Quote> {
                        QuoteScreen(controller = navController, quoteViewModel = quoteViewModel)
                    }
                    composable<CreateQuote> {
                        CreateQuoteScreen(
                            controller = navController,
                            quoteViewModel = quoteViewModel,
                            customerViewModel = customerViewModel,
                            generatorSetViewModel = generatorSetViewModel,
                            sellerViewModel = sellerViewModel,
                            commercialConditionViewModel = commercialConditionViewModel,
                            distributionChannelsViewModel = distributionChannelsViewModel,
                            incotermsViewModel = incotermsViewModel
                        )
                    }
                    composable<AttachDetailsToQuote> {
                        AttachDetailsToQuoteScreen(
                            controller = navController,
                            quoteViewModel = quoteViewModel,
                            generatorSetViewModel = generatorSetViewModel,
                            optionalGeneratorSetComponentsViewModel = optionalGeneratorSetComponentsViewModel,
                            alternatorSelectionViewModel = alternatorSelectionViewModel,
                            itmSelectionViewModel = itmSelectionViewModel
                        )
                    }
                    composable<Settings> {
                        SettingsScreen(controller = navController)
                    }
                }
            }
        }
    }
}


