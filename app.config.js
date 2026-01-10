import 'dotenv/config';

export default {
    expo: {
        name: "T-mate",
        slug: "T-mate",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/Ticon.png",
        userInterfaceStyle: "light",
        newArchEnabled: true,
        extra: {
            // .env files are NOT included in production builds
            supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL || "https://jdirkfwwgsiktmluutxr.supabase.co",
            supabasePublishableKey: process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_oLpjcNrAQ35o4XmBgeuGMw_zV341rcT",
            eas: {
                projectId: "633faad7-2730-404f-aa71-f107da01c067"
            }
        },
        splash: {
            image: "./assets/Ticon.png",
            resizeMode: "contain",
            backgroundColor: "none"
        },
        ios: {
            supportsTablet: true,
            bundleIdentifier: "com.johnplonteras.tmate"
        },
        android: {
            adaptiveIcon: {
                foregroundImage: "./assets/Ticon.png",
                backgroundColor: "none"
            },
            edgeToEdgeEnabled: true,
            predictiveBackGestureEnabled: false,
            package: "com.johnplonteras.tmate"
        },
        web: {
            favicon: "./assets/Ticon.png"
        },
        plugins: [
            "expo-system-ui",
            "expo-secure-store",
            "@react-native-community/datetimepicker",
            [
                "expo-build-properties",
                {
                    android: {
                        enablePngCrunchInReleaseBuilds: false
                    }
                }
            ],
            "expo-font"
        ],
        owner: "johnplonteras"
    }
};
