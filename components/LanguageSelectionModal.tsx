import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import {
  Linking,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";

import { COLORS, LANGUAGE } from "@/assets/styles/constants";
import { modalStyles, styles } from "@/assets/styles/styles";

interface LanguageSelectionModalProps {
  modalVisible: boolean;
  triggerSetModalVisible: (value: boolean) => void;
}

const languages = [
  { code: LANGUAGE.german, short: "DE", label: "Deutsch" },
  { code: LANGUAGE.english, short: "EN", label: "English" },
];

const PRIVACY_POLICY_URL =
  "https://plemoo.github.io/FindYourFeeling/privacyPolicy.html";

const LanguageSelectionModal: React.FC<LanguageSelectionModalProps> = ({
  modalVisible,
  triggerSetModalVisible,
}) => {
  const { t, i18n } = useTranslation();

  const changeLanguage = async (language: string) => {
    await i18n.changeLanguage(language);
    if (Platform.OS === "web") {
      window.localStorage.setItem("language", language);
    } else {
      await AsyncStorage.setItem("language", language);
    }
    triggerSetModalVisible(false);
  };

  return (
    <Modal
      transparent
      animationType="slide"
      visible={modalVisible}
      onRequestClose={() => triggerSetModalVisible(false)}
    >
      <View style={modalStyles.modalBackground}>
        <View style={modalStyles.modalContainer}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t("cancel")}
            style={modalStyles.closeButton}
            onPress={() => triggerSetModalVisible(false)}
          >
            <Ionicons name="close" size={22} color={COLORS.text} />
          </Pressable>
          <Text style={modalStyles.modalTitle}>{t("languageSelection")}</Text>
          <Text style={[styles.mutedText, languageStyles.hint]}>
            {t("languageSelectionHint")}
          </Text>
          <View style={languageStyles.list}>
            {languages.map((language) => {
              const active = i18n.language === language.code;
              return (
                <Pressable
                  key={language.code}
                  accessibilityRole="button"
                  onPress={() => changeLanguage(language.code)}
                  style={[
                    languageStyles.languageRow,
                    active && languageStyles.languageRowActive,
                  ]}
                >
                  <View style={languageStyles.codeBadge}>
                    <Text style={languageStyles.codeText}>{language.short}</Text>
                  </View>
                  <Text style={languageStyles.languageLabel}>
                    {language.label}
                  </Text>
                  {active && (
                    <Ionicons
                      name="checkmark-circle"
                      size={23}
                      color={COLORS.primary}
                    />
                  )}
                </Pressable>
              );
            })}
          </View>
          <View style={languageStyles.divider} />
          <Pressable
            accessibilityRole="link"
            accessibilityLabel={t("privacyPolicy")}
            onPress={() => void Linking.openURL(PRIVACY_POLICY_URL)}
            style={({ pressed }) => [
              languageStyles.privacyLink,
              pressed && languageStyles.privacyLinkPressed,
            ]}
          >
            <Ionicons
              name="shield-checkmark-outline"
              size={21}
              color={COLORS.primary}
            />
            <View style={languageStyles.privacyCopy}>
              <Text style={languageStyles.privacyTitle}>
                {t("privacyPolicy")}
              </Text>
              <Text style={styles.mutedText}>{t("privacyPolicyHint")}</Text>
            </View>
            <Ionicons
              name="open-outline"
              size={18}
              color={COLORS.textMuted}
            />
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const languageStyles = StyleSheet.create({
  hint: {
    marginTop: -10,
    marginBottom: 20,
    paddingRight: 42,
  },
  list: {
    gap: 10,
  },
  languageRow: {
    minHeight: 64,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
  },
  languageRowActive: {
    backgroundColor: COLORS.primarySoft,
    borderColor: COLORS.primarySoft,
  },
  codeBadge: {
    width: 42,
    height: 34,
    borderRadius: 11,
    backgroundColor: COLORS.surfaceStrong,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  codeText: {
    color: COLORS.primaryDark,
    fontFamily: "Raleway",
    fontSize: 12,
  },
  languageLabel: {
    flex: 1,
    color: COLORS.text,
    fontFamily: "Raleway",
    fontSize: 16,
  },
  divider: {
    height: 1,
    marginVertical: 20,
    backgroundColor: COLORS.border,
  },
  privacyLink: {
    minHeight: 64,
    borderRadius: 18,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  privacyLinkPressed: {
    backgroundColor: COLORS.primarySoft,
  },
  privacyCopy: {
    flex: 1,
  },
  privacyTitle: {
    color: COLORS.text,
    fontFamily: "Raleway",
    fontSize: 15,
    marginBottom: 2,
  },
});

export default LanguageSelectionModal;
