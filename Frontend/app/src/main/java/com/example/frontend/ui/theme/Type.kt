package com.example.frontend.ui.theme

import androidx.compose.material3.Typography
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp
import com.example.frontend.R

// ------------------
// FONT FAMILIES
// ------------------
val SpaceGrotesk = FontFamily(Font(R.font.space_grotesk_bold, FontWeight.Bold))

val Urbanist = FontFamily(Font(R.font.urbanist_semibold, FontWeight.SemiBold))

val Lexend = FontFamily(Font(R.font.lexend_medium, FontWeight.Medium))

val Manrope = FontFamily(Font(R.font.manrope_semibold, FontWeight.SemiBold))

// ------------------
// TYPOGRAPHY STYLES
// ------------------
val Typography =
        Typography(

                // Big App / Screen Headings
                displayLarge =
                        TextStyle(
                                fontFamily = SpaceGrotesk,
                                fontWeight = FontWeight.Bold,
                                fontSize = 40.sp,
                                lineHeight = 48.sp,
                                letterSpacing = (-0.5).sp
                        ),

                // Section Headings
                headlineMedium =
                        TextStyle(
                                fontFamily = Urbanist,
                                fontWeight = FontWeight.SemiBold,
                                fontSize = 28.sp,
                                lineHeight = 34.sp,
                                letterSpacing = 0.sp
                        ),

                // Subheading
                headlineSmall =
                        TextStyle(
                                fontFamily = Urbanist,
                                fontWeight = FontWeight.SemiBold,
                                fontSize = 20.sp,
                                lineHeight = 26.sp,
                                letterSpacing = 0.sp
                        ),

                // Body Text
                bodyLarge =
                        TextStyle(
                                fontFamily = Lexend,
                                fontWeight = FontWeight.Medium,
                                fontSize = 16.sp,
                                lineHeight = 22.sp,
                                letterSpacing = 0.15.sp
                        ),

                // Label / Small Buttons
                labelLarge =
                        TextStyle(
                                fontFamily = Urbanist,
                                fontWeight = FontWeight.SemiBold,
                                fontSize = 14.sp,
                                lineHeight = 18.sp,
                                letterSpacing = 0.1.sp
                        ),

                // Caption / Notes
                bodySmall =
                        TextStyle(
                                fontFamily = Lexend,
                                fontWeight = FontWeight.Medium,
                                fontSize = 12.sp,
                                lineHeight = 16.sp,
                                letterSpacing = 0.1.sp
                        ),

                // Placeholder / Disabled Text
                labelMedium =
                        TextStyle(
                                fontFamily = Urbanist,
                                fontWeight = FontWeight.SemiBold,
                                fontSize = 14.sp,
                                lineHeight = 18.sp,
                                letterSpacing = 0.1.sp
                        ),

                // Buttons
                titleMedium =
                        TextStyle(
                                fontFamily = Manrope,
                                fontWeight = FontWeight.SemiBold,
                                fontSize = 16.sp,
                                lineHeight = 22.sp,
                                letterSpacing = 0.sp
                        )
        )
