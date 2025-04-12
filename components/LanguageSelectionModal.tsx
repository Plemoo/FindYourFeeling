import { Modal, Platform, Text, TouchableOpacity, View } from 'react-native'
import UnionJackFlag from './UnionJackFlag';
import GermanFlag from './GermanFlag';
import Icon from 'react-native-vector-icons/Ionicons';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { COLORS, FONT_SIZES, LANGUAGE } from '@/assets/styles/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LanguageSelectionModalProps {
    modalVisible: boolean;
    triggerSetModalVisible: (value: boolean) => void;
}

const styles = StyleSheet.create({
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
        fontSize: FONT_SIZES.medium,
        paddingBottom: 20,
        textAlign: 'center',
    },
    flagContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    flagButton: {
        paddingBottom: 20,
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
});



const LanguageSelectionModal: React.FC<LanguageSelectionModalProps> = ({modalVisible, triggerSetModalVisible}) => {
        const { t, i18n } = useTranslation();
        const changeLanguage = async (language: string) => {
            await i18n.changeLanguage(language);
            try{
                // Save the selected language to AsyncStorage
                if(Platform.OS === "web"){
                    window.localStorage.setItem('language', language);
                }else if(Platform.OS === "android" || Platform.OS === "ios"){
                    await AsyncStorage.setItem('language', language);
                }
            }catch(e){
                console.error("Error saving language to AsyncStorage:", e);
            }
            // Update the app's language based on the selected language
            triggerSetModalVisible(!modalVisible);
        };
    return (
        <Modal
            transparent={true}
            animationType="slide"
            visible={modalVisible}
            onRequestClose={() => triggerSetModalVisible(!modalVisible)}
        >
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>{t("languageSelection")}</Text>
                     {/* Back Icon Button */}
                    <TouchableOpacity style={styles.closeButton} onPress={() => triggerSetModalVisible(!modalVisible)}>
                        <Icon name="arrow-back" size={25} color="black" />
                    </TouchableOpacity>
                    <View style={styles.flagContainer}>
                        <TouchableOpacity style={styles.flagButton} onPress={() => changeLanguage(LANGUAGE.english)}>
                            <UnionJackFlag />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => changeLanguage(LANGUAGE.german)}>
                            <GermanFlag/>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}


export default LanguageSelectionModal;