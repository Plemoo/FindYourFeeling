import { StyleSheet } from "react-native";
import { COLORS, FONT_SIZES } from "./constants";


export const styles = StyleSheet.create({
    customButton:{
        backgroundColor: COLORS.primary,
        borderRadius:15
    },
    customButtonText:{
        color: COLORS.textLight,
        fontSize: FONT_SIZES.medium,
        textAlign: "center",
        padding: 10
    }
});
