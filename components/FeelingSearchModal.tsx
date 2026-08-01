import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";

import { COLORS } from "@/assets/styles/constants";
import { modalStyles, styles } from "@/assets/styles/styles";
import {
  flattenFeelings,
  getFeelingPathByKey,
} from "@/assets/ts/indexFunctions";

type FeelingSearchModalProps = {
  visible: boolean;
  feelings: INestedFeelings;
  selection: IFeelingReference[];
  excluded?: IFeelingReference[];
  multiple?: boolean;
  onChange: (selection: IFeelingReference[]) => void;
  onClose: () => void;
};

export default function FeelingSearchModal({
  visible,
  feelings,
  selection,
  excluded = [],
  multiple = false,
  onChange,
  onClose,
}: FeelingSearchModalProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const leaves = useMemo(
    () => flattenFeelings(feelings, true),
    [feelings]
  );
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const excludedKeys = new Set(excluded.map((reference) => reference.key));
  const availableLeaves = leaves.filter(
    (feeling) => !excludedKeys.has(feeling.key)
  );
  const results = normalizedQuery
    ? availableLeaves
        .filter((feeling) =>
          feeling.name.toLocaleLowerCase().includes(normalizedQuery)
        )
        .slice(0, 18)
    : availableLeaves.slice(0, 18);
  const exactMatch = leaves.some(
    (feeling) => feeling.name.toLocaleLowerCase() === normalizedQuery
  );
  const excludedCustom = excluded.some(
    (reference) =>
      reference.customLabel?.toLocaleLowerCase() === normalizedQuery
  );

  const selectFeeling = (reference: IFeelingReference) => {
    if (!multiple) {
      onChange([reference]);
      setQuery("");
      onClose();
      return;
    }
    const exists = selection.some(
      (selected) =>
        selected.key === reference.key &&
        selected.customLabel === reference.customLabel
    );
    onChange(
      exists
        ? selection.filter(
            (selected) =>
              selected.key !== reference.key ||
              selected.customLabel !== reference.customLabel
          )
        : [...selection, reference]
    );
  };

  const useCustomFeeling = () => {
    const label = query.trim();
    if (!label) return;
    selectFeeling({
      key: `custom.${label.toLocaleLowerCase().replace(/\s+/g, "_")}`,
      customLabel: label,
    });
    if (multiple) setQuery("");
  };

  const close = () => {
    setQuery("");
    onClose();
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={close}
    >
      <View style={modalStyles.modalBackground}>
        <View style={[modalStyles.modalContainer, searchStyles.sheet]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t("close")}
            style={modalStyles.closeButton}
            onPress={close}
          >
            <Ionicons name="close" size={22} color={COLORS.text} />
          </Pressable>
          <Text style={modalStyles.modalTitle}>
            {multiple ? t("addAnotherFeeling") : t("searchFeeling")}
          </Text>

          <View style={searchStyles.searchField}>
            <Ionicons name="search" size={20} color={COLORS.textMuted} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder={t("searchPlaceholder")}
              placeholderTextColor={COLORS.textMuted}
              autoFocus
              style={searchStyles.input}
              accessibilityLabel={t("searchFeeling")}
            />
            {!!query && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t("clearSearch")}
                onPress={() => setQuery("")}
              >
                <Ionicons
                  name="close-circle"
                  size={20}
                  color={COLORS.textMuted}
                />
              </Pressable>
            )}
          </View>

          <ScrollView
            style={searchStyles.results}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {results.map((feeling) => {
              const path = getFeelingPathByKey(feeling.key, feelings) ?? [];
              const family =
                path.length > 1 ? path[path.length - 2]?.name : undefined;
              const active = selection.some(
                (selected) => selected.key === feeling.key
              );
              return (
                <Pressable
                  key={feeling.key}
                  accessibilityRole="button"
                  onPress={() => selectFeeling({ key: feeling.key })}
                  style={[
                    searchStyles.resultRow,
                    active && searchStyles.resultRowActive,
                  ]}
                >
                  <View style={searchStyles.resultText}>
                    <Text style={searchStyles.resultName}>{feeling.name}</Text>
                    {!!family && (
                      <Text style={searchStyles.resultFamily}>{family}</Text>
                    )}
                  </View>
                  <Ionicons
                    name={
                      active
                        ? "checkmark-circle"
                        : multiple
                          ? "add-circle-outline"
                          : "arrow-forward-circle-outline"
                    }
                    size={23}
                    color={COLORS.primary}
                  />
                </Pressable>
              );
            })}

            {!!normalizedQuery && !exactMatch && !excludedCustom && (
              <Pressable
                accessibilityRole="button"
                onPress={useCustomFeeling}
                style={searchStyles.customRow}
              >
                <View style={searchStyles.customIcon}>
                  <Ionicons
                    name="pencil"
                    size={18}
                    color={COLORS.primary}
                  />
                </View>
                <View style={searchStyles.resultText}>
                  <Text style={searchStyles.resultName}>
                    {t("useCustomFeeling", { feeling: query.trim() })}
                  </Text>
                  <Text style={searchStyles.resultFamily}>
                    {t("customFeelingHint")}
                  </Text>
                </View>
              </Pressable>
            )}
          </ScrollView>

          {multiple && (
            <Pressable
              accessibilityRole="button"
              onPress={close}
              style={[styles.saveFeelingButton, searchStyles.doneButton]}
            >
              <Text style={styles.saveFeelingButtonText}>
                {t("done")} · {selection.length}
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </Modal>
  );
}

const searchStyles = StyleSheet.create({
  sheet: {
    maxHeight: "86%",
  },
  searchField: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 16,
    backgroundColor: COLORS.background,
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  input: {
    flex: 1,
    color: COLORS.text,
    fontFamily: "Raleway",
    fontSize: 16,
    outlineStyle: "none",
  } as any,
  results: {
    flexGrow: 0,
  },
  resultRow: {
    minHeight: 62,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingHorizontal: 6,
    paddingVertical: 10,
  },
  resultRowActive: {
    backgroundColor: COLORS.primarySoft,
    borderRadius: 14,
    paddingHorizontal: 12,
  },
  resultText: {
    flex: 1,
  },
  resultName: {
    color: COLORS.text,
    fontFamily: "Raleway",
    fontSize: 15,
  },
  resultFamily: {
    color: COLORS.textMuted,
    fontFamily: "Raleway",
    fontSize: 12,
    marginTop: 3,
  },
  customRow: {
    minHeight: 70,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: COLORS.primarySoft,
    borderRadius: 16,
    padding: 12,
    marginTop: 12,
  },
  customIcon: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: COLORS.surfaceStrong,
  },
  doneButton: {
    marginTop: 16,
  },
});
