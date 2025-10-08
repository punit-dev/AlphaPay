package com.example.frontend.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.graphics.Color

// ------------------
// EXTENDED COLOR DATA
// ------------------
data class ExtendedColors(
        val textPrimary: Color,
        val textSecondary: Color,
        val textTertiary: Color,
        val divider: Color,
        val success: Color,
        val warning: Color,
        val error: Color,
)

val LocalExtendedColors = staticCompositionLocalOf {
    ExtendedColors(
            textPrimary = Color.Unspecified,
            textSecondary = Color.Unspecified,
            textTertiary = Color.Unspecified,
            divider = Color.Unspecified,
            success = Color.Unspecified,
            warning = Color.Unspecified,
            error = Color.Unspecified
    )
}

// ------------------
// DARK THEME COLORS
// ------------------
private val DarkColorScheme =
        darkColorScheme(
                primary = BlueBolt,
                onPrimary = White,
                primaryContainer = TrueBlue,
                onPrimaryContainer = White,
                secondary = Lavender,
                onSecondary = White,
                secondaryContainer = CyberGrape,
                onSecondaryContainer = White,
                background = DarkJungleGreen,
                onBackground = White,
                surface = CharlestonGreen,
                onSurface = White,
                surfaceVariant = DarkGunmetal,
                onSurfaceVariant = CadetBlue,
                error = TartOrange,
                onError = White,
                outline = Crayola,
        )

private val DarkExtendedColors =
        ExtendedColors(
                textPrimary = White,
                textSecondary = CadetBlue,
                textTertiary = SlateGray,
                divider = DarkGunmetal,
                success = MediumSpringGreen,
                warning = ChineseYellow,
                error = TartOrange
        )

// ------------------
// LIGHT THEME COLORS
// ------------------
private val LightColorScheme =
        lightColorScheme(
                primary = TrueBlue,
                onPrimary = White,
                primaryContainer = MayaBlue,
                onPrimaryContainer = ChineseBlack,
                secondary = PaleViolet,
                onSecondary = ChineseBlack,
                secondaryContainer = Lavender,
                onSecondaryContainer = ChineseBlack,
                background = White,
                onBackground = ChineseBlack,
                surface = Color(0xFFF5F7FA), // soft neutral light surface
                onSurface = ChineseBlack,
                surfaceVariant = Color(0xFFE7EAF0),
                onSurfaceVariant = SlateGray,
                error = TartOrange,
                onError = White,
                outline = Crayola
        )

private val LightExtendedColors =
        ExtendedColors(
                textPrimary = ChineseBlack,
                textSecondary = SlateGray,
                textTertiary = CadetBlue,
                divider = Color(0xFFE7EAF0),
                success = MediumSpringGreen,
                warning = ChineseYellow,
                error = TartOrange
        )

// ------------------
// THEME WRAPPER
// ------------------
@Composable
fun AlphaPayTheme(darkTheme: Boolean = isSystemInDarkTheme(), content: @Composable () -> Unit) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme
    val extendedColors = if (darkTheme) DarkExtendedColors else LightExtendedColors

    CompositionLocalProvider(LocalExtendedColors provides extendedColors) {
        MaterialTheme(colorScheme = colorScheme, typography = Typography, content = content)
    }
}

// ------------------
// ACCESS EXTENDED COLORS
// ------------------
object AlphaPayColors {
    val textPrimary: Color
        @Composable get() = LocalExtendedColors.current.textPrimary
    val textSecondary: Color
        @Composable get() = LocalExtendedColors.current.textSecondary
    val textTertiary: Color
        @Composable get() = LocalExtendedColors.current.textTertiary
    val divider: Color
        @Composable get() = LocalExtendedColors.current.divider
    val success: Color
        @Composable get() = LocalExtendedColors.current.success
    val warning: Color
        @Composable get() = LocalExtendedColors.current.warning
    val error: Color
        @Composable get() = LocalExtendedColors.current.error
}
