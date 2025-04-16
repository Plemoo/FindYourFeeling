import { StyleSheet } from "react-native";
import { COLORS, FONT_SIZES } from "./constants";


export const styles = StyleSheet.create({
    container:{
        flexDirection:"column",
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    feelingContainer:{
        flex: 6,
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingBottom: 5,
    },
    svgFeelingsContainer:{
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveFeelingButtonContainer:{
        width: 300,
        alignSelf: 'center',
    },
    saveFeelingButton:{
        backgroundColor: COLORS.feelingCenter,
        borderRadius:15,
    },
    disabledSaveFeelingButton:{
        backgroundColor: '#a9a9a9',  // Grauer Hintergrund
        borderRadius: 8,
        borderWidth:5,
        borderColor: '#ccc',
        alignItems: 'center',
        opacity: 0.7
    },
    saveFeelingButtonText:{
        color: COLORS.textLight,
        fontSize: FONT_SIZES.medium,
        textAlign: "center",
        fontFamily:"Raleway",
        padding: 10
    },
    sprichwortContainer:{
        flex: 4,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal:30,
    },
    sprichwortText:{
        fontSize: FONT_SIZES.large,
        color: COLORS.text,
        fontFamily:"DancingScript",
        textAlign: 'center'
    },
    sprichwortAutorText:{
        fontSize: FONT_SIZES.small,
        color: COLORS.text,
        fontFamily:"DancingScript",
        textAlign: 'center',
        marginTop: 10
    }
});

export const modalStyles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContainer: {
        backgroundColor: COLORS.background,
        padding: 20,
        borderRadius: 10,
        paddingTop: 40,
    },
    modalTitle: {
        fontFamily: "Raleway",
        fontSize: FONT_SIZES.large,
        paddingBottom: 20,
        textAlign: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 5,
        borderColor: COLORS.black,
        backgroundColor: COLORS.background,
        borderWidth: 2,
        right: 5,
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
      },
})
