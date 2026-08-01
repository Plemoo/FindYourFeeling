import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";

import { COLORS, FEELING_COLORS, FONT_SIZES } from "@/assets/styles/constants";
import { cardShadow, modalStyles, styles } from "@/assets/styles/styles";
import {
  removeFeelingCheckInAsync,
  resetFeelingCheckInsAsync,
} from "@/assets/ts/helper";
import {
  getFeelingLabel,
  getFeelingsBasedOnLanguage,
} from "@/assets/ts/indexFunctions";

type FeelingOverviewProps = {
  checkIns: IFeelingCheckIn[];
};

type FeelingAggregate = {
  reference: IFeelingReference;
  count: number;
  intensityTotal: number;
};

const FeelingWordCloud: React.FC<FeelingOverviewProps> = ({
  checkIns: initialCheckIns,
}) => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [checkIns, setCheckIns] = useState(initialCheckIns);
  const [resetVisible, setResetVisible] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<IFeelingCheckIn | null>(null);
  const allFeelings = useMemo(
    () => getFeelingsBasedOnLanguage(i18n.language),
    [i18n.language]
  );

  const aggregates = useMemo(() => {
    const values = new Map<string, FeelingAggregate>();
    checkIns.forEach((checkIn) => {
      const reference = checkIn.feeling;
      const aggregateKey = `${reference.key}:${reference.customLabel ?? ""}`;
      const existing = values.get(aggregateKey);
      if (existing) {
        existing.count += 1;
        existing.intensityTotal += checkIn.intensity;
      } else {
        values.set(aggregateKey, {
          reference,
          count: 1,
          intensityTotal: checkIn.intensity,
        });
      }
    });
    return [...values.values()].sort((a, b) => b.count - a.count);
  }, [checkIns]);

  const averageIntensity =
    checkIns.length > 0
      ? checkIns.reduce((sum, checkIn) => sum + checkIn.intensity, 0) /
        checkIns.length
      : 0;
  const maxCount = Math.max(...aggregates.map((value) => value.count), 1);
  const topFeeling = aggregates[0]
    ? getFeelingLabel(aggregates[0].reference, allFeelings)
    : "—";

  const deleteCheckIn = async () => {
    if (!deleteTarget) return;
    await removeFeelingCheckInAsync(deleteTarget.id);
    setCheckIns((current) =>
      current.filter((checkIn) => checkIn.id !== deleteTarget.id)
    );
    setDeleteTarget(null);
  };

  const resetAll = async () => {
    await resetFeelingCheckInsAsync();
    setCheckIns([]);
    setResetVisible(false);
  };

  const formatDate = (checkIn: IFeelingCheckIn) => {
    if (checkIn.migrated) return t("migratedEntry");
    return new Intl.DateTimeFormat(i18n.language, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(checkIn.createdAt));
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.eyebrow}>{t("overviewPage")}</Text>
        <Text style={styles.heading1}>{t("yourOverview")}</Text>
        <Text style={[styles.mutedText, trackerStyles.intro]}>
          {t("overviewIntro")}
        </Text>

        {checkIns.length === 0 ? (
          <View style={trackerStyles.emptyCard}>
            <View style={trackerStyles.emptyIcon}>
              <Ionicons
                name="sparkles-outline"
                size={34}
                color={COLORS.primary}
              />
            </View>
            <Text style={trackerStyles.emptyTitle}>{t("noContent")}</Text>
            <Text style={[styles.mutedText, trackerStyles.emptyCopy]}>
              {t("noContentHint")}
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.replace("/")}
              style={styles.saveFeelingButton}
            >
              <Ionicons
                name="add-circle-outline"
                size={22}
                color={COLORS.textLight}
              />
              <Text style={styles.saveFeelingButtonText}>
                {t("startCheckIn")}
              </Text>
            </Pressable>
          </View>
        ) : (
          <>
            <View style={trackerStyles.statsRow}>
              <StatCard
                value={String(checkIns.length)}
                label={t("totalCheckIns")}
              />
              <StatCard
                value={String(aggregates.length)}
                label={t("differentFeelings")}
              />
              <StatCard
                value={averageIntensity.toFixed(1)}
                label={t("averageIntensity")}
              />
            </View>

            <View style={trackerStyles.highlightCard}>
              <View style={trackerStyles.highlightIcon}>
                <Ionicons name="heart" size={26} color={COLORS.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={trackerStyles.highlightLabel}>
                  {t("mostFrequent")}
                </Text>
                <Text style={trackerStyles.highlightName}>{topFeeling}</Text>
              </View>
            </View>

            <Text style={trackerStyles.sectionTitle}>{t("yourFeelings")}</Text>
            <View style={trackerStyles.listCard}>
              {aggregates.map((aggregate, index) => {
                const name = getFeelingLabel(
                  aggregate.reference,
                  allFeelings
                );
                const color =
                  FEELING_COLORS[index % FEELING_COLORS.length];
                return (
                  <View
                    key={`${aggregate.reference.key}-${aggregate.reference.customLabel ?? ""}`}
                    style={[
                      trackerStyles.feelingRow,
                      index < aggregates.length - 1 &&
                        trackerStyles.rowDivider,
                    ]}
                  >
                    <View
                      style={[
                        trackerStyles.initial,
                        { backgroundColor: color.background },
                      ]}
                    >
                      <Text
                        style={[
                          trackerStyles.initialText,
                          { color: color.accent },
                        ]}
                      >
                        {name.slice(0, 1).toUpperCase()}
                      </Text>
                    </View>
                    <View style={trackerStyles.feelingMain}>
                      <View style={trackerStyles.feelingLabelRow}>
                        <Text style={trackerStyles.feelingName}>{name}</Text>
                        <Text style={trackerStyles.feelingCount}>
                          {aggregate.count}× · Ø{" "}
                          {(aggregate.intensityTotal / aggregate.count).toFixed(
                            1
                          )}
                        </Text>
                      </View>
                      <View style={trackerStyles.track}>
                        <View
                          style={[
                            trackerStyles.bar,
                            {
                              width: `${(aggregate.count / maxCount) * 100}%`,
                              backgroundColor: color.accent,
                            },
                          ]}
                        />
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>

            <Text
              style={[trackerStyles.sectionTitle, trackerStyles.recentTitle]}
            >
              {t("recentCheckIns")}
            </Text>
            <View style={trackerStyles.timeline}>
              {checkIns.slice(0, 12).map((checkIn) => (
                <View key={checkIn.id} style={trackerStyles.checkInCard}>
                  <View style={trackerStyles.checkInHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={trackerStyles.checkInName}>
                        {getFeelingLabel(checkIn.feeling, allFeelings)}
                      </Text>
                      <Text style={trackerStyles.checkInDate}>
                        {formatDate(checkIn)}
                      </Text>
                    </View>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={t("deleteCheckIn")}
                      onPress={() => setDeleteTarget(checkIn)}
                      style={trackerStyles.deleteIcon}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={18}
                        color={COLORS.negative}
                      />
                    </Pressable>
                  </View>

                  <View style={trackerStyles.intensityLine}>
                    <Text style={trackerStyles.metaLabel}>
                      {t("intensityShort", { value: checkIn.intensity })}
                    </Text>
                    <View style={trackerStyles.intensityDots}>
                      {[1, 2, 3, 4, 5].map((value) => (
                        <View
                          key={value}
                          style={[
                            trackerStyles.intensityDot,
                            value <= checkIn.intensity &&
                              trackerStyles.intensityDotActive,
                          ]}
                        />
                      ))}
                    </View>
                  </View>

                  {checkIn.additionalFeelings.length > 0 && (
                    <MetaChips
                      label={t("also")}
                      values={checkIn.additionalFeelings.map((reference) =>
                        getFeelingLabel(reference, allFeelings)
                      )}
                    />
                  )}
                  {checkIn.needs.length > 0 && (
                    <MetaChips
                      label={t("needed")}
                      values={checkIn.needs.map((need) =>
                        t(`needs.${need}`)
                      )}
                    />
                  )}
                </View>
              ))}
            </View>

            <Pressable
              accessibilityRole="button"
              onPress={() => setResetVisible(true)}
              style={trackerStyles.resetButton}
            >
              <Ionicons
                name="trash-outline"
                size={18}
                color={COLORS.negative}
              />
              <Text style={trackerStyles.resetText}>
                {t("resetWordCloud")}
              </Text>
            </Pressable>
          </>
        )}
      </ScrollView>

      <ConfirmModal
        visible={deleteTarget !== null}
        title={t("deleteCheckInTitle")}
        text={t("deleteCheckInText")}
        confirmLabel={t("delete")}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={deleteCheckIn}
      />
      <ConfirmModal
        visible={resetVisible}
        title={t("resetConfirmTitle")}
        text={t("resetConfirmText")}
        confirmLabel={t("reset")}
        onCancel={() => setResetVisible(false)}
        onConfirm={resetAll}
      />
    </View>
  );
};

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <View style={trackerStyles.statCard}>
      <Text style={trackerStyles.statValue}>{value}</Text>
      <Text style={trackerStyles.statLabel}>{label}</Text>
    </View>
  );
}

function MetaChips({ label, values }: { label: string; values: string[] }) {
  return (
    <View style={trackerStyles.metaRow}>
      <Text style={trackerStyles.metaLabel}>{label}</Text>
      <View style={trackerStyles.metaChips}>
        {values.map((value) => (
          <View key={value} style={trackerStyles.metaChip}>
            <Text style={trackerStyles.metaChipText}>{value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function ConfirmModal({
  visible,
  title,
  text,
  confirmLabel,
  onCancel,
  onConfirm,
}: {
  visible: boolean;
  title: string;
  text: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const { t } = useTranslation();
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={modalStyles.modalBackground}>
        <View style={modalStyles.modalContainer}>
          <Text style={modalStyles.modalTitle}>{title}</Text>
          <Text style={[styles.mutedText, { marginBottom: 24 }]}>{text}</Text>
          <View style={trackerStyles.modalActions}>
            <Pressable
              accessibilityRole="button"
              onPress={onCancel}
              style={trackerStyles.secondaryButton}
            >
              <Text style={trackerStyles.secondaryButtonText}>
                {t("cancel")}
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={onConfirm}
              style={trackerStyles.dangerButton}
            >
              <Text style={trackerStyles.dangerButtonText}>
                {confirmLabel}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const trackerStyles = StyleSheet.create({
  intro: { marginTop: 8, marginBottom: 22 },
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 12,
  },
  statCard: {
    flexGrow: 1,
    flexBasis: 125,
    backgroundColor: COLORS.surfaceStrong,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    padding: 16,
    ...cardShadow,
  },
  statValue: {
    color: COLORS.primaryDark,
    fontFamily: "Raleway",
    fontSize: 27,
  },
  statLabel: {
    color: COLORS.textMuted,
    fontFamily: "Raleway",
    fontSize: FONT_SIZES.tiny,
    marginTop: 4,
  },
  highlightCard: {
    backgroundColor: COLORS.primarySoft,
    borderRadius: 22,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 26,
  },
  highlightIcon: {
    width: 50,
    height: 50,
    borderRadius: 17,
    backgroundColor: COLORS.surfaceStrong,
    alignItems: "center",
    justifyContent: "center",
  },
  highlightLabel: {
    color: COLORS.textMuted,
    fontFamily: "Raleway",
    fontSize: FONT_SIZES.tiny,
  },
  highlightName: {
    color: COLORS.primaryDark,
    fontFamily: "Raleway",
    fontSize: FONT_SIZES.medium,
    marginTop: 3,
  },
  sectionTitle: {
    color: COLORS.text,
    fontFamily: "Raleway",
    fontSize: 19,
    marginBottom: 10,
  },
  recentTitle: { marginTop: 28 },
  listCard: {
    backgroundColor: COLORS.surfaceStrong,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    ...cardShadow,
  },
  feelingRow: {
    minHeight: 78,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 13,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  initial: {
    width: 42,
    height: 42,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  initialText: { fontFamily: "Raleway", fontSize: 18 },
  feelingMain: { flex: 1 },
  feelingLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 9,
  },
  feelingName: {
    flex: 1,
    color: COLORS.text,
    fontFamily: "Raleway",
    fontSize: 15,
  },
  feelingCount: {
    color: COLORS.textMuted,
    fontFamily: "Raleway",
    fontSize: 12,
  },
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.background,
    overflow: "hidden",
  },
  bar: { height: "100%", borderRadius: 3 },
  timeline: { gap: 10 },
  checkInCard: {
    backgroundColor: COLORS.surfaceStrong,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    ...cardShadow,
  },
  checkInHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  checkInName: {
    color: COLORS.text,
    fontFamily: "Raleway",
    fontSize: 18,
  },
  checkInDate: {
    color: COLORS.textMuted,
    fontFamily: "Raleway",
    fontSize: 11,
    marginTop: 4,
  },
  deleteIcon: {
    width: 38,
    height: 38,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8ECEA",
  },
  intensityLine: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
  },
  intensityDots: { flexDirection: "row", gap: 5 },
  intensityDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: COLORS.border,
  },
  intensityDotActive: { backgroundColor: COLORS.primary },
  metaRow: { marginTop: 14 },
  metaLabel: {
    color: COLORS.textMuted,
    fontFamily: "Raleway",
    fontSize: 11,
  },
  metaChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 7,
  },
  metaChip: {
    borderRadius: 10,
    backgroundColor: COLORS.background,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },
  metaChipText: {
    color: COLORS.text,
    fontFamily: "Raleway",
    fontSize: 11,
  },
  resetButton: {
    minHeight: 52,
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 20,
    paddingHorizontal: 16,
  },
  resetText: {
    color: COLORS.negative,
    fontFamily: "Raleway",
    fontSize: 14,
  },
  emptyCard: {
    backgroundColor: COLORS.surfaceStrong,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 26,
    alignItems: "center",
    marginTop: 10,
    ...cardShadow,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 25,
    backgroundColor: COLORS.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  emptyTitle: {
    color: COLORS.text,
    fontFamily: "Raleway",
    fontSize: FONT_SIZES.medium,
    textAlign: "center",
  },
  emptyCopy: {
    textAlign: "center",
    marginTop: 9,
    marginBottom: 24,
  },
  modalActions: { flexDirection: "row", gap: 10 },
  secondaryButton: {
    flex: 1,
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: COLORS.background,
  },
  secondaryButtonText: {
    color: COLORS.text,
    fontFamily: "Raleway",
    fontSize: 15,
  },
  dangerButton: {
    flex: 1,
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: COLORS.negative,
  },
  dangerButtonText: {
    color: COLORS.textLight,
    fontFamily: "Raleway",
    fontSize: 15,
  },
});

export default FeelingWordCloud;
