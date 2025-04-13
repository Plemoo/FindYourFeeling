import { SplashScreen, Stack, useNavigation, useRootNavigationState, useRouter, useSegments } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import { useFonts } from 'expo-font';
import { Button, Text, TouchableHighlight, TouchableOpacity } from "react-native";
import LanguageSelectionModal from "@/components/LanguageSelectionModal";
import { useTranslation } from "react-i18next";
import GermanFlag from "@/components/GermanFlag";
import UnionJackFlag from "@/components/UnionJackFlag";
import _ from "lodash";
import SwitchScreenIcon from "@/components/SwitchScreenIcon";

SplashScreen.preventAutoHideAsync(); // SplashScreen will be shown and not dismissed automatically (doesnt work on web)
const RootLayout = () => {
    const [fontsLoaded] = useFonts({
        'Raleway': require('../assets/fonts/Raleway-SemiBold.ttf'),
        "DancingScript": require('../assets/fonts/DancingScript-VariableFont_wght.ttf'),
    });
    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync(); // Hide the splash screen after everything was loaded 
        }
    }, [fontsLoaded])

    // Routing Hooks
    const segment = useSegments();// String[] - Array of segments in the current route (e.g. ["FeelingsTracker"] or [])
    const navigation = useRouter();

    const switchScreens = () => {
        if(_.isEmpty(segment)){ // Check if the segment is empty (i.e. the root screen)
            navigation.navigate("/FeelingsTracker")
        }else if(segment[0] == "FeelingsTracker"){ // Check if the first segment is "FeelingsTracker"
            navigation.navigate("/")
        }
    }
    const { t, i18n } = useTranslation();
    const [modalVisible, setModalVisible] = useState(false);
    return (
        <>
            <Stack screenOptions={{
                headerTitleStyle: { fontFamily: "Raleway" },
                headerTitleAlign: "center",
                headerRight: () => {
                    return <TouchableOpacity style={{ paddingRight: 10 }} onPressIn={() => setModalVisible(!modalVisible)}>{getFlagByLanguageCode(i18n.language)}</TouchableOpacity>
                },
                headerLeft: () => {
                    return <TouchableHighlight onPressIn={switchScreens}><SwitchScreenIcon/></TouchableHighlight>
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

export default RootLayout;