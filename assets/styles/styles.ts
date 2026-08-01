import { Platform, StyleSheet } from "react-native";
import { COLORS, FONT_SIZES } from "./constants";

export const cardShadow = Platform.select({
  web: { boxShadow: "0 12px 36px rgba(62, 60, 101, 0.08)" } as any,
  default: {
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 18,
    elevation: 4,
  },
});

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    width: "100%",
    maxWidth: 680,
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 36,
  },
  eyebrow: {
    color: COLORS.primary,
    fontFamily: "Raleway",
    fontSize: FONT_SIZES.tiny,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  heading1: {
    color: COLORS.text,
    fontFamily: "Raleway",
    fontSize: FONT_SIZES.large,
    lineHeight: 39,
  },
  regularFont: {
    color: COLORS.text,
    fontFamily: "Raleway",
    fontSize: FONT_SIZES.small,
    lineHeight: 24,
  },
  mutedText: {
    color: COLORS.textMuted,
    fontFamily: "Raleway",
    fontSize: FONT_SIZES.small,
    lineHeight: 23,
  },
  saveFeelingButton: {
    minHeight: 56,
    width: "100%",
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 20,
    ...cardShadow,
  },
  saveFeelingButtonText: {
    color: COLORS.textLight,
    fontSize: FONT_SIZES.small,
    textAlign: "center",
    fontFamily: "Raleway",
  },
  sprichwortContainer: {
    borderLeftWidth: 3,
    borderLeftColor: COLORS.accent,
    paddingLeft: 16,
    marginTop: 24,
    marginBottom: 8,
  },
  sprichwortText: {
    fontSize: 21,
    lineHeight: 29,
    color: COLORS.text,
    fontFamily: "DancingScript",
  },
  sprichwortAutorText: {
    fontSize: 14,
    color: COLORS.textMuted,
    fontFamily: "Raleway",
    marginTop: 8,
  },
});

export const modalStyles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(41, 39, 51, 0.38)",
    padding: 14,
  },
  modalContainer: {
    width: "100%",
    maxWidth: 560,
    backgroundColor: COLORS.surfaceStrong,
    padding: 24,
    paddingTop: 28,
    paddingBottom: 32,
    borderRadius: 28,
    ...cardShadow,
  },
  modalTitle: {
    color: COLORS.text,
    fontFamily: "Raleway",
    fontSize: FONT_SIZES.medium,
    paddingBottom: 20,
  },
  closeButton: {
    position: "absolute",
    top: 18,
    right: 18,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
    zIndex: 2,
  },
});
