import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";

import FeelingSearchModal from "@/components/FeelingSearchModal";
import { COLORS, FEELING_COLORS, FONT_SIZES } from "@/assets/styles/constants";
import { cardShadow, styles } from "@/assets/styles/styles";
import {
  getFeelingLabel,
  getFeelingNodeByKey,
  getFeelingPathByKey,
  getFeelingsBasedOnLanguage,
} from "@/assets/ts/indexFunctions";
import { addFeelingCheckInAsync } from "@/assets/ts/helper";

const optionIcons = [
  "sunny-outline",
  "rainy-outline",
  "git-compare-outline",
  "help-circle-outline",
] as const;

const needKeys = [
  "rest",
  "connection",
  "space",
  "movement",
  "clarity",
  "safety",
  "expression",
  "support",
] as const;

export default function Index() {
  const { t, i18n } = useTranslation();
  const feelings = useMemo(
    () => getFeelingsBasedOnLanguage(i18n.language),
    [i18n.language]
  );
  const [selectedKey, setSelectedKey] = useState("root");
  const [primaryFeeling, setPrimaryFeeling] =
    useState<IFeelingReference | null>(null);
  const [intensity, setIntensity] = useState(3);
  const [additionalFeelings, setAdditionalFeelings] = useState<
    IFeelingReference[]
  >([]);
  const [needs, setNeeds] = useState<string[]>([]);
  const [searchVisible, setSearchVisible] = useState(false);
  const [additionalSearchVisible, setAdditionalSearchVisible] = useState(false);
  const [saved, setSaved] = useState(false);

  const selected =
    getFeelingNodeByKey(selectedKey, feelings) ?? feelings;
  const path =
    getFeelingPathByKey(selected.key, feelings) ?? [feelings];
  const options = primaryFeeling ? [] : selected.children ?? [];
  const selectedName = primaryFeeling
    ? getFeelingLabel(primaryFeeling, feelings)
    : selected.name;

  const resetDetails = () => {
    setIntensity(3);
    setAdditionalFeelings([]);
    setNeeds([]);
    setSaved(false);
  };

  const chooseFeeling = (feeling: INestedFeelings) => {
    setSelectedKey(feeling.key);
    setPrimaryFeeling(feeling.children?.length ? null : { key: feeling.key });
    resetDetails();
    if (Platform.OS !== "web") void Haptics.selectionAsync();
  };

  const choosePrimaryFromSearch = (selection: IFeelingReference[]) => {
    const reference = selection[0];
    if (!reference) return;
    setPrimaryFeeling(reference);
    setSelectedKey(
      getFeelingNodeByKey(reference.key, feelings)?.key ?? "root"
    );
    resetDetails();
  };

  const navigateTo = (feeling: INestedFeelings) => {
    setSelectedKey(feeling.key);
    setPrimaryFeeling(null);
    resetDetails();
  };

  const goBack = () => {
    if (primaryFeeling?.customLabel) {
      navigateTo(feelings);
      return;
    }
    if (path.length > 1) navigateTo(path[path.length - 2]);
  };

  const toggleNeed = (need: string) => {
    setNeeds((current) =>
      current.includes(need)
        ? current.filter((value) => value !== need)
        : [...current, need]
    );
  };

  const removeAdditionalFeeling = (reference: IFeelingReference) => {
    setAdditionalFeelings((current) =>
      current.filter(
        (value) =>
          value.key !== reference.key ||
          value.customLabel !== reference.customLabel
      )
    );
  };

  const saveSelection = async () => {
    if (!primaryFeeling) return;
    await addFeelingCheckInAsync({
      feeling: primaryFeeling,
      intensity,
      additionalFeelings,
      needs,
    });
    if (Platform.OS !== "web") {
      void Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success
      );
    }
    setSaved(true);
    setTimeout(() => {
      setSelectedKey("root");
      setPrimaryFeeling(null);
      resetDetails();
    }, 1200);
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={screenStyles.intro}>
          <View style={screenStyles.introTop}>
            <View style={{ flex: 1 }}>
              <Text style={styles.eyebrow}>{t("checkIn")}</Text>
              <Text style={styles.heading1}>{t("howAreYou")}</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t("searchFeeling")}
              onPress={() => setSearchVisible(true)}
              style={screenStyles.searchButton}
            >
              <Ionicons name="search" size={21} color={COLORS.primary} />
            </Pressable>
          </View>
          <Text style={[styles.mutedText, screenStyles.introCopy]}>
            {t("chooseWhatFits")}
          </Text>
        </View>

        <View style={screenStyles.pathRow}>
          {path.slice(1).map((item, index) => (
            <React.Fragment key={item.key}>
              {index > 0 && (
                <Ionicons
                  name="chevron-forward"
                  size={14}
                  color={COLORS.textMuted}
                />
              )}
              <Pressable
                accessibilityRole="button"
                onPress={() => navigateTo(item)}
                style={[
                  screenStyles.pathPill,
                  item.key === selected.key && screenStyles.pathPillActive,
                ]}
              >
                <Text
                  style={[
                    screenStyles.pathText,
                    item.key === selected.key && screenStyles.pathTextActive,
                  ]}
                  numberOfLines={1}
                >
                  {item.name}
                </Text>
              </Pressable>
            </React.Fragment>
          ))}
          {!!primaryFeeling?.customLabel && (
            <View style={[screenStyles.pathPill, screenStyles.pathPillActive]}>
              <Text style={[screenStyles.pathText, screenStyles.pathTextActive]}>
                {primaryFeeling.customLabel}
              </Text>
            </View>
          )}
        </View>

        {(selected.key !== "root" || primaryFeeling?.customLabel) && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t("back")}
            onPress={goBack}
            style={screenStyles.backButton}
          >
            <Ionicons name="arrow-back" size={18} color={COLORS.primary} />
            <Text style={screenStyles.backText}>{t("oneStepBack")}</Text>
          </Pressable>
        )}

        <View style={screenStyles.selectionCard}>
          <View style={screenStyles.selectionHeader}>
            <View style={{ flex: 1 }}>
              <Text style={screenStyles.stepLabel}>
                {primaryFeeling
                  ? t("yourFeeling")
                  : selected.key === "root"
                    ? t("firstDirection")
                    : t("refineFeeling")}
              </Text>
              <Text style={screenStyles.selectionTitle}>
                {primaryFeeling ? t("thisFits") : t("whatFitsBest")}
              </Text>
              {!primaryFeeling && !!selected.description && (
                <Text style={screenStyles.selectionDescription}>
                  {selected.description}
                </Text>
              )}
            </View>
            <View style={screenStyles.stepBadge}>
              <Text style={screenStyles.stepBadgeText}>
                {Math.min(path.length, 3)}
              </Text>
            </View>
          </View>

          {options.length > 0 ? (
            <View style={screenStyles.optionsGrid}>
              {options.map((option, index) => {
                const color = FEELING_COLORS[index % FEELING_COLORS.length];
                return (
                  <Pressable
                    key={option.key}
                    accessibilityRole="button"
                    accessibilityLabel={option.name}
                    onPress={() => chooseFeeling(option)}
                    style={({ pressed, hovered }: any) => [
                      screenStyles.optionCard,
                      { backgroundColor: color.background },
                      (pressed || hovered) && screenStyles.optionCardPressed,
                    ]}
                  >
                    <View
                      style={[
                        screenStyles.optionIcon,
                        { backgroundColor: `${color.accent}18` },
                      ]}
                    >
                      <Ionicons
                        name={optionIcons[index % optionIcons.length]}
                        size={25}
                        color={color.accent}
                      />
                    </View>
                    <Text style={screenStyles.optionText}>{option.name}</Text>
                    {!!option.description && (
                      <Text style={screenStyles.optionDescription}>
                        {option.description}
                      </Text>
                    )}
                    <Ionicons
                      name="arrow-forward-circle"
                      size={23}
                      color={color.accent}
                    />
                  </Pressable>
                );
              })}
            </View>
          ) : (
            <View style={screenStyles.result}>
              <View style={screenStyles.resultIcon}>
                <Ionicons name="heart" size={32} color={COLORS.primary} />
              </View>
              <Text style={screenStyles.resultName}>{selectedName}</Text>
              <Text style={[styles.mutedText, { textAlign: "center" }]}>
                {t("nameItToTameIt")}
              </Text>
            </View>
          )}

          {!primaryFeeling && (
            <Pressable
              accessibilityRole="button"
              onPress={() => setSearchVisible(true)}
              style={screenStyles.searchLink}
            >
              <Ionicons name="search" size={18} color={COLORS.primary} />
              <Text style={screenStyles.searchLinkText}>
                {t("searchOrAddFeeling")}
              </Text>
            </Pressable>
          )}
        </View>

        {primaryFeeling && (
          <View style={screenStyles.detailsCard}>
            <DetailHeader number="1" title={t("howStrong")} />
            <View style={screenStyles.intensityRow}>
              {[1, 2, 3, 4, 5].map((value) => (
                <Pressable
                  key={value}
                  accessibilityRole="button"
                  accessibilityLabel={t("intensityValue", { value })}
                  accessibilityState={{ selected: intensity === value }}
                  onPress={() => setIntensity(value)}
                  style={[
                    screenStyles.intensityButton,
                    intensity === value && screenStyles.intensityButtonActive,
                  ]}
                >
                  <Text
                    style={[
                      screenStyles.intensityValue,
                      intensity === value && screenStyles.intensityValueActive,
                    ]}
                  >
                    {value}
                  </Text>
                </Pressable>
              ))}
            </View>
            <View style={screenStyles.intensityLabels}>
              <Text style={screenStyles.scaleLabel}>{t("gentle")}</Text>
              <Text style={screenStyles.scaleLabel}>{t("strong")}</Text>
            </View>

            <View style={screenStyles.detailDivider} />
            <DetailHeader number="2" title={t("anythingElse")} optional />
            <View style={screenStyles.chipWrap}>
              {additionalFeelings.map((reference) => (
                <Pressable
                  key={`${reference.key}-${reference.customLabel ?? ""}`}
                  accessibilityRole="button"
                  accessibilityLabel={t("removeFeeling", {
                    feeling: getFeelingLabel(reference, feelings),
                  })}
                  onPress={() => removeAdditionalFeeling(reference)}
                  style={screenStyles.selectedChip}
                >
                  <Text style={screenStyles.selectedChipText}>
                    {getFeelingLabel(reference, feelings)}
                  </Text>
                  <Ionicons name="close" size={14} color={COLORS.primary} />
                </Pressable>
              ))}
              <Pressable
                accessibilityRole="button"
                onPress={() => setAdditionalSearchVisible(true)}
                style={screenStyles.addChip}
              >
                <Ionicons name="add" size={17} color={COLORS.primary} />
                <Text style={screenStyles.addChipText}>
                  {t("addFeeling")}
                </Text>
              </Pressable>
            </View>

            <View style={screenStyles.detailDivider} />
            <DetailHeader number="3" title={t("whatDoYouNeed")} optional />
            <View style={screenStyles.chipWrap}>
              {needKeys.map((need) => {
                const active = needs.includes(need);
                return (
                  <Pressable
                    key={need}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                    onPress={() => toggleNeed(need)}
                    style={[
                      screenStyles.needChip,
                      active && screenStyles.needChipActive,
                    ]}
                  >
                    {active && (
                      <Ionicons
                        name="checkmark"
                        size={15}
                        color={COLORS.textLight}
                      />
                    )}
                    <Text
                      style={[
                        screenStyles.needChipText,
                        active && screenStyles.needChipTextActive,
                      ]}
                    >
                      {t(`needs.${need}`)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {primaryFeeling && (
          <Pressable
            accessibilityRole="button"
            onPress={saveSelection}
            disabled={saved}
            style={[
              styles.saveFeelingButton,
              saved && screenStyles.savedButton,
            ]}
          >
            <Ionicons
              name={saved ? "checkmark-circle" : "bookmark-outline"}
              size={22}
              color={COLORS.textLight}
            />
            <Text style={styles.saveFeelingButtonText}>
              {saved ? t("saved") : t("saveCheckIn")}
            </Text>
          </Pressable>
        )}

        <View style={screenStyles.reflectionHint}>
          <Ionicons
            name="leaf-outline"
            size={20}
            color={COLORS.positive}
          />
          <Text style={screenStyles.reflectionText}>
            {t("reflectionHint")}
          </Text>
        </View>
      </ScrollView>

      <FeelingSearchModal
        visible={searchVisible}
        feelings={feelings}
        selection={primaryFeeling ? [primaryFeeling] : []}
        onChange={choosePrimaryFromSearch}
        onClose={() => setSearchVisible(false)}
      />
      <FeelingSearchModal
        visible={additionalSearchVisible}
        feelings={feelings}
        selection={additionalFeelings}
        excluded={primaryFeeling ? [primaryFeeling] : []}
        multiple
        onChange={(selection) =>
          setAdditionalFeelings(
            selection.filter(
              (reference) =>
                reference.key !== primaryFeeling?.key ||
                reference.customLabel !== primaryFeeling?.customLabel
            )
          )
        }
        onClose={() => setAdditionalSearchVisible(false)}
      />
    </View>
  );
}

function DetailHeader({
  number,
  title,
  optional,
}: {
  number: string;
  title: string;
  optional?: boolean;
}) {
  const { t } = useTranslation();
  return (
    <View style={screenStyles.detailHeader}>
      <View style={screenStyles.detailNumber}>
        <Text style={screenStyles.detailNumberText}>{number}</Text>
      </View>
      <Text style={screenStyles.detailTitle}>{title}</Text>
      {optional && (
        <Text style={screenStyles.optionalLabel}>{t("optional")}</Text>
      )}
    </View>
  );
}

const screenStyles = StyleSheet.create({
  intro: { marginBottom: 20 },
  introTop: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  introCopy: { marginTop: 8, maxWidth: 520 },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primarySoft,
  },
  pathRow: {
    minHeight: 34,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 5,
    marginBottom: 10,
  },
  pathPill: {
    maxWidth: 180,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: COLORS.surfaceStrong,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  pathPillActive: {
    backgroundColor: COLORS.primarySoft,
    borderColor: COLORS.primarySoft,
  },
  pathText: {
    fontFamily: "Raleway",
    fontSize: FONT_SIZES.tiny,
    color: COLORS.textMuted,
  },
  pathTextActive: { color: COLORS.primaryDark },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    minHeight: 38,
    marginBottom: 8,
    paddingRight: 10,
  },
  backText: {
    color: COLORS.primary,
    fontFamily: "Raleway",
    fontSize: 14,
  },
  selectionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 18,
    marginBottom: 18,
    ...cardShadow,
  },
  selectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 14,
    marginBottom: 18,
  },
  stepLabel: {
    color: COLORS.textMuted,
    fontFamily: "Raleway",
    fontSize: FONT_SIZES.tiny,
    marginBottom: 5,
  },
  selectionTitle: {
    color: COLORS.text,
    fontFamily: "Raleway",
    fontSize: FONT_SIZES.medium,
  },
  selectionDescription: {
    color: COLORS.textMuted,
    fontFamily: "Raleway",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 7,
    maxWidth: 450,
  },
  stepBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primarySoft,
  },
  stepBadgeText: {
    color: COLORS.primary,
    fontFamily: "Raleway",
    fontSize: 14,
  },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  optionCard: {
    flexGrow: 1,
    flexBasis: 145,
    minHeight: 130,
    borderRadius: 20,
    padding: 15,
    alignItems: "flex-start",
    transform: [{ scale: 1 }],
  },
  optionCardPressed: {
    opacity: 0.84,
    transform: [{ scale: 0.98 }],
  },
  optionIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  optionText: {
    color: COLORS.text,
    fontFamily: "Raleway",
    fontSize: 17,
    marginTop: 14,
    marginBottom: 5,
  },
  optionDescription: {
    color: COLORS.textMuted,
    fontFamily: "Raleway",
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 10,
    flexGrow: 1,
  },
  result: { alignItems: "center", paddingVertical: 16 },
  resultIcon: {
    width: 66,
    height: 66,
    borderRadius: 24,
    backgroundColor: COLORS.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  resultName: {
    color: COLORS.text,
    fontFamily: "Raleway",
    fontSize: FONT_SIZES.large,
    textAlign: "center",
    marginBottom: 8,
  },
  searchLink: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginTop: 16,
    paddingTop: 14,
  },
  searchLinkText: {
    color: COLORS.primary,
    fontFamily: "Raleway",
    fontSize: 14,
  },
  detailsCard: {
    backgroundColor: COLORS.surfaceStrong,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 18,
    marginBottom: 16,
    ...cardShadow,
  },
  detailHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 15,
  },
  detailNumber: {
    width: 28,
    height: 28,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primarySoft,
  },
  detailNumberText: {
    color: COLORS.primary,
    fontFamily: "Raleway",
    fontSize: 12,
  },
  detailTitle: {
    flex: 1,
    color: COLORS.text,
    fontFamily: "Raleway",
    fontSize: 17,
  },
  optionalLabel: {
    color: COLORS.textMuted,
    fontFamily: "Raleway",
    fontSize: 11,
  },
  intensityRow: { flexDirection: "row", gap: 8 },
  intensityButton: {
    flex: 1,
    aspectRatio: 1,
    maxHeight: 54,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
  },
  intensityButtonActive: { backgroundColor: COLORS.primary },
  intensityValue: {
    color: COLORS.textMuted,
    fontFamily: "Raleway",
    fontSize: 17,
  },
  intensityValueActive: { color: COLORS.textLight },
  intensityLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 7,
  },
  scaleLabel: {
    color: COLORS.textMuted,
    fontFamily: "Raleway",
    fontSize: 11,
  },
  detailDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 20,
  },
  chipWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  selectedChip: {
    minHeight: 38,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 14,
    backgroundColor: COLORS.primarySoft,
    paddingHorizontal: 12,
  },
  selectedChipText: {
    color: COLORS.primaryDark,
    fontFamily: "Raleway",
    fontSize: 13,
  },
  addChip: {
    minHeight: 38,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.primarySoft,
    paddingHorizontal: 12,
  },
  addChipText: {
    color: COLORS.primary,
    fontFamily: "Raleway",
    fontSize: 13,
  },
  needChip: {
    minHeight: 38,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: 14,
    backgroundColor: COLORS.background,
    paddingHorizontal: 12,
  },
  needChipActive: { backgroundColor: COLORS.positive },
  needChipText: {
    color: COLORS.text,
    fontFamily: "Raleway",
    fontSize: 13,
  },
  needChipTextActive: { color: COLORS.textLight },
  savedButton: { backgroundColor: COLORS.positive },
  reflectionHint: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    paddingHorizontal: 8,
    marginTop: 22,
  },
  reflectionText: {
    flex: 1,
    color: COLORS.textMuted,
    fontFamily: "Raleway",
    fontSize: 13,
    lineHeight: 20,
  },
});
