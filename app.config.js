import 'dotenv/config';

export default {
    expo: {
        name: "T-mate",
        slug: "T-mate",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/icon.png",
        userInterfaceStyle: "light",
        newArchEnabled: true,
        extra: {
            // For production builds, you MUST hardcode these values or use EAS Secrets
            // .env files are NOT included in production builds
            supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL || "https://jdirkfwwgsiktmluutxr.supabase.co",
            supabasePublishableKey: process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_oLpjcNrAQ35o4XmBgeuGMw_zV341rcT",
            eas: {
                projectId: "633faad7-2730-404f-aa71-f107da01c067"
            }
        },
        splash: {
            image: "./assets/splash-icon.png",
            resizeMode: "contain",
            backgroundColor: "#ffffff"
        },
        ios: {
            supportsTablet: true,
            bundleIdentifier: "com.johnplonteras.tmate"
        },
        android: {
            adaptiveIcon: {
                foregroundImage: "./assets/adaptive-icon.png",
                backgroundColor: "#ffffff"
            },
            edgeToEdgeEnabled: true,
            predictiveBackGestureEnabled: false,
            package: "com.johnplonteras.tmate"
        },
        web: {
            favicon: "./assets/favicon.png"
        },
        plugins: [
            "expo-secure-store",
            "@react-native-community/datetimepicker",
            "expo-font"
        ],
        owner: "johnplonteras"
    }
};
