import { Ionicons } from "@expo/vector-icons";
import { SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { useFonts } from "expo-font";
import { useTranslation } from "react-i18next";

import "../assets/ts/i18next";
import LanguageSelectionModal from "@/components/LanguageSelectionModal";
import { COLORS } from "@/assets/styles/constants";

void SplashScreen.preventAutoHideAsync();

const PRIVACY_POLICY_URL =
  "https://plemoo.github.io/FindYourFeeling/privacyPolicy.html";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Raleway: require("../assets/fonts/Raleway-SemiBold.ttf"),
    DancingScript: require("../assets/fonts/DancingScript-VariableFont_wght.ttf"),
  });
  const [modalVisible, setModalVisible] = useState(false);
  const segments = useSegments();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const onTracker = segments[0] === "FeelingsTracker";

  useEffect(() => {
    if (fontsLoaded) {
      void SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: COLORS.background },
          headerStyle: { backgroundColor: COLORS.background },
          headerShadowVisible: false,
          headerTitleAlign: "center",
          headerTitleStyle: {
            color: COLORS.text,
            fontFamily: "Raleway",
            fontSize: 16,
          },
          headerLeft: () => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={
                onTracker ? t("feelingPage") : t("overviewPage")
              }
              onPress={() =>
                onTracker ? router.replace("/") : router.push("/FeelingsTracker")
              }
              style={({ pressed }) => [
                layoutStyles.headerButton,
                pressed && layoutStyles.headerButtonPressed,
              ]}
            >
              <Ionicons
                name={onTracker ? "heart-outline" : "stats-chart-outline"}
                size={20}
                color={COLORS.primary}
              />
            </Pressable>
          ),
          headerRight: () => (
            <View style={layoutStyles.headerActions}>
              <Pressable
                accessibilityRole="link"
                accessibilityLabel={t("privacyPolicy")}
                onPress={() => void Linking.openURL(PRIVACY_POLICY_URL)}
                style={({ pressed }) => [
                  layoutStyles.headerButton,
                  pressed && layoutStyles.headerButtonPressed,
                ]}
              >
                <Ionicons
                  name="shield-checkmark-outline"
                  size={20}
                  color={COLORS.primary}
                />
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t("language")}
                onPress={() => setModalVisible(true)}
                style={({ pressed }) => [
                  layoutStyles.languageButton,
                  pressed && layoutStyles.headerButtonPressed,
                ]}
              >
                <Text style={layoutStyles.languageText}>
                  {i18n.language.toUpperCase()}
                </Text>
                <Ionicons
                  name="chevron-down"
                  size={14}
                  color={COLORS.primary}
                />
              </Pressable>
            </View>
          ),
        }}
      >
        <Stack.Screen name="index" options={{ title: t("IndexPage") }} />
        <Stack.Screen
          name="FeelingsTracker"
          options={{ title: t("FeelingsTrackerPage") }}
        />
      </Stack>
      <LanguageSelectionModal
        modalVisible={modalVisible}
        triggerSetModalVisible={setModalVisible}
      />
    </>
  );
}

const layoutStyles = StyleSheet.create({
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: COLORS.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  languageButton: {
    minWidth: 60,
    height: 42,
    borderRadius: 14,
    paddingHorizontal: 11,
    backgroundColor: COLORS.primarySoft,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  languageText: {
    color: COLORS.primary,
    fontFamily: "Raleway",
    fontSize: 13,
  },
  headerButtonPressed: {
    opacity: 0.7,
  },
});
