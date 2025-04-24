import { COLORS, FONT_SIZES } from "@/assets/styles/constants";
import { modalStyles, styles } from "@/assets/styles/styles";
import { refactorFeelingIntoWord } from "@/assets/ts/feelingWordCloudFunctions";
import {  getIdByFeeling, getStoredFeelingsAsync, storeFeelingInAsyncStorage } from "@/assets/ts/helper";
import { getFeelingsBasedOnLanguage } from "@/assets/ts/indexFunctions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import _ from "lodash";
import React, { useState } from "react"
import { useTranslation } from "react-i18next";
import { Dimensions } from "react-native";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Modal, Text, TouchableHighlight } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import WordCloud, { Word } from "rn-wordcloud"

const { width, height } = Dimensions.get('window'); // Bildschirmgröße

type WordCloudProps = {
  selectedFeelings: ISingleStoreFeeling[]|undefined;
}

const FeelingWordCloud: React.FC<WordCloudProps> = ({ selectedFeelings }) => {
  const { t, i18n } = useTranslation();
  const [feelingModifyModalVisible, setFeelingModifyModalVisible] = useState(false) // Visibility of Modal to change Feeling value
  const [modalfeelingName, setModalfeelingName] = useState(""); // Displayed modal Feelign Name
  const [modalFeelingValue, setModalFeelingValue] = useState(0); // Displayed modal Feeling Value/Count (how often the user selected it)
  const [modalFeelingColor, setModalFeelingColor] = useState("")
  const [refreshKey, setRefreshKey] = useState(0); // Workaround, to force the Word Cloud to refresh, when it has changes
  const wordCloudColors = _.shuffle([COLORS.feelingCenter, COLORS.feelingOne, COLORS.feelingTwo, COLORS.feelingThree]); // Colors for the word cloud, shuffle to get random Color Assignment
  // Initialize the displayed words, just for the useState
  const shownFeelingsBasedOnInput: Word[] = selectedFeelings ? refactorFeelingIntoWord(selectedFeelings, wordCloudColors, getFeelingsBasedOnLanguage(i18n.language)):[];
  const [shownFeelings, setShownFeelings] = useState(shownFeelingsBasedOnInput)
  i18n.on('languageChanged', () => {
    const shownFeelingsBasedOnInput: Word[] = selectedFeelings ? refactorFeelingIntoWord(selectedFeelings, wordCloudColors, getFeelingsBasedOnLanguage(i18n.language)):[];
    setShownFeelings(shownFeelingsBasedOnInput)
    setRefreshKey(refreshKey+1)
  })
  /**
   * opens modal and shows clicked feeling to change its value
   * @param word clicked word in Wordcloud
   */
  const handleWordClick = (word: Word) => { // Farbe wird hier leider nicht übergeben
    let clickedWord = shownFeelings.filter(val => val.text === word.text);
    if (!_.isEmpty(clickedWord)) {
      setModalFeelingColor(clickedWord[0].color)
      setModalFeelingValue(clickedWord[0].value)
      setModalfeelingName(clickedWord[0].text)
      setFeelingModifyModalVisible(true)
    }
  };
  /**
   * Apply the new value the user has set for the feeling and store it in the Async Storage
   */
  const applyChangesOnModalClose = () => {
    let allFeelings = getFeelingsBasedOnLanguage(i18n.language);
    if (modalFeelingValue == 0) { // lösche Wort aus Liste und aktualisiere den Async Storage
      getStoredFeelingsAsync().then((value) => {
        if (value != null) {
          const filteredFeelingArray: ISingleStoreFeeling[] = value.storedFeelings.filter(feeling=>feeling.feelingId != getIdByFeeling(modalfeelingName,allFeelings)); // Behalte nur die Feelings, die nicht das aktuell zurückgesetze sind
          storeFeelingInAsyncStorage(filteredFeelingArray);
          setShownFeelings(refactorFeelingIntoWord(filteredFeelingArray,wordCloudColors, allFeelings))
          setRefreshKey(refreshKey+1); // Workaround to refresh the view with the new weights/value
        }
      })
    } else { // reduziere den Wert für das Wort in der Liste und aktualisiere den Async Storage
      getStoredFeelingsAsync().then((value) => {
        if (value != null) {
          const storedFeelingArray: ISingleStoreFeeling[] = value.storedFeelings.map((feeling)=>setNewFeelingValue(feeling,allFeelings));
          storeFeelingInAsyncStorage(storedFeelingArray);
          setShownFeelings(refactorFeelingIntoWord(storedFeelingArray,wordCloudColors,allFeelings))
          setRefreshKey(refreshKey+1); // Workaround to refresh the view with the new weights/value
        }
      })
    }
    setFeelingModifyModalVisible(false);
  }

  const setNewFeelingValue = (feeling:ISingleStoreFeeling, allFeelings:INestedFeelings)=>{
    if(feeling.feelingId == getIdByFeeling(modalfeelingName,allFeelings)){
      return {...feeling, count:modalFeelingValue}
    }else{
      return feeling;
    }
  }
  const incrementFeelingValue = () => {
    if (modalFeelingValue <= 5) {
      setModalFeelingValue(modalFeelingValue + 1)
    }
  }
  const decrementFeelingValue = () => {
    if (modalFeelingValue != 0) {
      setModalFeelingValue(modalFeelingValue - 1)
    }
  }
  const resetStoredFeelings = ()=>{
    let storedFeelingsKey: keyof IStoredFeelings = "storedFeelings";
    AsyncStorage.removeItem(storedFeelingsKey).finally(()=>{
      setShownFeelings([]);
    });
  }

  return (
    <View style={{height:"100%"}}>
      {_.isEmpty(shownFeelings) ?
        <Text>{t("noContent")}</Text>
        :
        <>
        <View style={{marginHorizontal:40, marginTop:20}}>
          <Text style={styles.regularFont}>{t("wordCloudClickHint")}</Text>
        </View>
          <WordCloud
          key={refreshKey}
            options={{
              words: shownFeelings,
              verticalEnabled: true,
              minFont: FONT_SIZES.small,
              maxFont: FONT_SIZES.huge,
              fontOffset: 1,
              width: width,
              height: height/2,
              fontFamily: "Raleway",
            }}
            onWordPress={(word) => setTimeout(() => handleWordClick(word), 100)}
          />
          <View style={{marginHorizontal:40,position:"absolute",bottom:20}}>
          <TouchableHighlight style={styles.saveFeelingButton} onPress={resetStoredFeelings}>
            <Text style={styles.saveFeelingButtonText}>{t("resetWordCloud")}</Text>
          </TouchableHighlight>
          </View>

          <Modal
            visible={feelingModifyModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setFeelingModifyModalVisible(false)}
          >
            <View style={modalStyles.modalBackground}>
              <View style={modalStyles.modalContainer}>
                <TouchableOpacity style={modalStyles.closeButton} onPress={() => setFeelingModifyModalVisible(false)}>
                  <Icon name="arrow-back-circle-outline" size={50} color="black" />
                </TouchableOpacity>
                <View>
                  <Text style={[modalStyles.modalTitle, { color: modalFeelingColor }]} >
                    {modalfeelingName}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <TouchableOpacity onPress={() => decrementFeelingValue()}>
                    <Icon name="remove-circle-outline" size={50} color="black" />
                  </TouchableOpacity>
                  <View style={{marginHorizontal:30}}>
                    <Text style={styles.heading1}>{modalFeelingValue}</Text>
                  </View>
                  <TouchableOpacity onPress={() => incrementFeelingValue()}>
                    <Icon name="add-circle-outline" size={50} color="black" />
                  </TouchableOpacity>
                </View>
                <View style={{ justifyContent: "center" }}>
                  <TouchableHighlight style={wordCloudStyles.applyWordCloudModalChangesButton} onPress={applyChangesOnModalClose}>
                    <View style={{flexDirection:"row", justifyContent:"space-between", alignContent:"center", alignItems:"center"}}>
                      <Icon name="save-outline" size={50} color={COLORS.primary}></Icon>
                    </View>
                  </TouchableHighlight>
                </View>
              </View>
            </View>
          </Modal>
        </>
      }
    </View>
  )
}
const wordCloudStyles = StyleSheet.create({
    applyWordCloudModalChangesButton: {
        justifyContent: 'center',
        alignItems: 'center',
        // borderRadius:5,
        // borderWidth:2,
        // borderColor:COLORS.primary,
        // backgroundColor:COLORS.primary,
        marginTop:20
    },
    applyWordCloudModalChangesButtonText:{
      textAlign: "center",
      fontSize: FONT_SIZES.medium
    }
});

export default FeelingWordCloud;