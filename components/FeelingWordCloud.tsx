import { COLORS, FONT_SIZES } from "@/assets/styles/constants";
import { modalStyles, styles } from "@/assets/styles/styles";
import { refactorFeelingIntoWord } from "@/assets/ts/feelingWordCloudFunctions";
import { getStoredFeelingsAsync, storeFeelingInAsyncStorage } from "@/assets/ts/helper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import _ from "lodash";
import React, { useState } from "react"
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Modal, Text, TouchableHighlight } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import WordCloud, { Word } from "rn-wordcloud"


type WordCloudProps = {
  selectedFeelings: ISingleStoreFeeling[]|undefined;
}

const FeelingWordCloud: React.FC<WordCloudProps> = ({ selectedFeelings }) => {
  const { t, i18n } = useTranslation();
  const [feelingModifyModalVisible, setFeelingModifyModalVisible] = useState(false)
  const [modalfeelingName, setModalfeelingName] = useState("");
  const [modalFeelingValue, setModalFeelingValue] = useState(0)
  const [modalFeelingColor, setModalFeelingColor] = useState("")
  const [refreshKey, setRefreshKey] = useState(0)
  const wordCloudColors = _.shuffle([COLORS.feelingCenter, COLORS.feelingOne, COLORS.feelingTwo, COLORS.feelingThree]);

  const shownFeelingsBasedOnInput: Word[] = selectedFeelings ? refactorFeelingIntoWord(selectedFeelings, wordCloudColors):[];
  const [shownFeelings, setShownFeelings] = useState(shownFeelingsBasedOnInput)
  const handleWordClick = (word: Word) => { // Farbe wird hier leider nicht übergeben
    let clickedWord = shownFeelings.filter(val => val.text === word.text);
    if (!_.isEmpty(clickedWord)) {
      setModalFeelingColor(clickedWord[0].color)
      setModalFeelingValue(clickedWord[0].value)
      setModalfeelingName(clickedWord[0].text)

      setFeelingModifyModalVisible(true)
    }
  };
  const applyChangesOnModalClose = () => {
    if (modalFeelingValue == 0) { // lösche Wort aus Liste und aktualisiere den Async Storage
      getStoredFeelingsAsync().then((value) => {
        if (value != null) {
          const filteredFeelingArray: ISingleStoreFeeling[] = value.storedFeelings.filter(feeling=>feeling.name != modalfeelingName); // Behalte nur die Feelings, die nicht das aktuell zurückgesetze sind
          storeFeelingInAsyncStorage(filteredFeelingArray);
          setShownFeelings(refactorFeelingIntoWord(filteredFeelingArray,wordCloudColors))
          setRefreshKey(refreshKey+1)
        }
      })
    } else { // reduziere den Wert für das Wort in der Liste und aktualisiere den Async Storage
      getStoredFeelingsAsync().then((value) => {
        if (value != null) {
          const storedFeelingArray: ISingleStoreFeeling[] = value.storedFeelings.map((feeling)=>setNewFeelingValue(feeling));
          storeFeelingInAsyncStorage(storedFeelingArray);
          setShownFeelings(refactorFeelingIntoWord(storedFeelingArray,wordCloudColors))
          setRefreshKey(refreshKey+1)
        }
      })
    }
    setFeelingModifyModalVisible(false);
  }

  const setNewFeelingValue = (feeling:ISingleStoreFeeling)=>{
    if(feeling.name == modalfeelingName){
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
    <View>
      {_.isEmpty(shownFeelings) ?
        <Text>No Content</Text>
        :
        <>
          <WordCloud
          key={refreshKey}
            options={{
              words: shownFeelings,
              verticalEnabled: true,
              minFont: FONT_SIZES.small,
              maxFont: FONT_SIZES.huge,
              fontOffset: 1,
              width: 390,
              height: 250,
              fontFamily: "Raleway",
            }}
            onWordPress={(word) => setTimeout(() => handleWordClick(word), 100)}
          />
          <Button title="Reset all" onPress={resetStoredFeelings}></Button>
          <Modal
            visible={feelingModifyModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setFeelingModifyModalVisible(false)}
          >
            <View style={modalStyles.modalBackground}>
              <View style={modalStyles.modalContainer}>
                <TouchableOpacity style={modalStyles.closeButton} onPress={() => setFeelingModifyModalVisible(false)}>
                  <Icon name="arrow-back" size={25} color="black" />
                </TouchableOpacity>
                <View style={{ flexDirection: "row" }}>
                  <Text style={[modalStyles.modalTitle, { color: modalFeelingColor }]} >
                    {modalfeelingName}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <TouchableOpacity onPress={() => decrementFeelingValue()} disabled={modalFeelingValue > 5}>
                    <Icon name="remove-circle-outline" size={35} color="black" />
                  </TouchableOpacity>
                  <Text>{modalFeelingValue}</Text>
                  <TouchableOpacity onPress={() => incrementFeelingValue()} disabled={modalFeelingValue == 0}>
                    <Icon name="add-circle-outline" size={35} color="black" />
                  </TouchableOpacity>
                </View>
                <View style={{ justifyContent: "center" }}>
                  <TouchableHighlight style={wordCloudStyles.applyWordCloudModalChangesButton} onPress={applyChangesOnModalClose}>
                    <Text style={wordCloudStyles.applyWordCloudModalChangesButtonText}>APPLY</Text>
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
        borderRadius:5,
        borderWidth:2,
        borderColor:COLORS.primary,
        backgroundColor:COLORS.primary,
        marginTop:20
    },
    applyWordCloudModalChangesButtonText:{
      textAlign: "center",
      fontSize: FONT_SIZES.large
    }
});

export default FeelingWordCloud;