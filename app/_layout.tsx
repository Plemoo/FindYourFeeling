import { SplashScreen, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { useFonts } from 'expo-font';
import { TouchableOpacity } from "react-native";
import LanguageSelectionModal from "@/components/LanguageSelectionModal";
import { useTranslation } from "react-i18next";
import GermanFlag from "@/components/GermanFlag";
import UnionJackFlag from "@/components/UnionJackFlag";

// SplashScreen.preventAutoHideAsync(); // SplashScreen will be shown and not dismissed automatically (doesnt work on web)
export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        'Raleway': require('../assets/fonts/Raleway-VariableFont_wght.ttf'),
        'Raleway-Italic': require('../assets/fonts/Raleway-Italic-VariableFont_wght.ttf'),
    });
    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync(); // Hide the splash screen after everything was loaded 
        }
    }, [fontsLoaded])
    
    const { t, i18n } = useTranslation();
    const [modalVisible, setModalVisible] = useState(false);
    return (
        <>
            <Stack screenOptions={{
                headerTintColor: "red", headerTitleStyle: { fontFamily: "Raleway" }, headerRight: () => {
                    return <TouchableOpacity style={{ paddingRight: 10 }} onPressIn={() => setModalVisible(!modalVisible)}>{getFlagByLanguageCode(i18n.language)}</TouchableOpacity>
                }
            }}>
                <Stack.Screen name="index" options={{ title: t("IndexPage") }} />
                <Stack.Screen name="FeelingsTracker" options={{ title: t("FeelingsTrackerPage") }} />
            </Stack>
            <LanguageSelectionModal modalVisible={modalVisible} triggerSetModalVisible={setModalVisible} />
        </>
    );
}

function getFlagByLanguageCode(languageCode: string) {
    switch (languageCode) {
        case 'de':
            return <GermanFlag customHeight={20} customWidth={40} />; // German Flag
        case 'en':
            return <UnionJackFlag customHeight={20} customWidth={40} />; // Union Jack Flag
        default:
            return null;
    }
}