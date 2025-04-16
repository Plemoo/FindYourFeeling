import { Image, Modal, Platform, Text, TouchableOpacity, View } from 'react-native'
import UnionJackFlag from './UnionJackFlag';
import GermanFlag from './GermanFlag';
import Icon from 'react-native-vector-icons/Ionicons';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { COLORS, FONT_SIZES, LANGUAGE } from '@/assets/styles/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { modalStyles } from '@/assets/styles/styles';

interface LanguageSelectionModalProps {
    modalVisible: boolean;
    triggerSetModalVisible: (value: boolean) => void;
}

const styles = StyleSheet.create({
    flagContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    flagButton: {
        paddingBottom: 20,
    }
});



const LanguageSelectionModal: React.FC<LanguageSelectionModalProps> = ({ modalVisible, triggerSetModalVisible }) => {
    const { t, i18n } = useTranslation();
    const changeLanguage = async (language: string) => {
        await i18n.changeLanguage(language);
        try {
            // Save the selected language to AsyncStorage
            if (Platform.OS === "web") {
                window.localStorage.setItem('language', language);
            } else if (Platform.OS === "android" || Platform.OS === "ios") {
                await AsyncStorage.setItem('language', language);
            }
        } catch (e) {
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
            <View style={modalStyles.modalBackground}>
                <View style={modalStyles.modalContainer}>
                    <TouchableOpacity style={modalStyles.closeButton} onPress={() => triggerSetModalVisible(!modalVisible)}>
                        <Icon  name="arrow-back-circle-outline" size={50} color="black" />
                    </TouchableOpacity>
                    <Text style={modalStyles.modalTitle}>{t("languageSelection")}</Text>

                    <View style={styles.flagContainer}>
                        <TouchableOpacity style={styles.flagButton} onPress={() => changeLanguage(LANGUAGE.english)}>
                            <UnionJackFlag square={true} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => changeLanguage(LANGUAGE.german)}>
                            <GermanFlag square={true} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}


export default LanguageSelectionModal;