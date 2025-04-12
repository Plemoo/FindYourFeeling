import { Pressable, Text as ReactText, TouchableOpacity, View } from "react-native";
import DonutChart from "../components/DonutChart";
import { StrictMode, useEffect, useState } from "react";
import {styles} from "../assets/styles/styles"
import _ from "lodash"
import "../assets/ts/i18next"
import { useTranslation } from "react-i18next";   
import i18next from "../assets/ts/i18next";
import { arraysEqual, findPathForNameInFeelings, getChildFeelingsBasedOnParent, getFeelingsBasedOnLanguage, getPathOfFeeling } from "@/assets/ts/indexFunctions";


export default function Index() {
  let allFeelings: INestedFeelings = getFeelingsBasedOnLanguage(i18next.language);
  const [currentFeelings, setCurrentFeelings] = useState<string[]>(getChildFeelingsBasedOnParent(allFeelings.name, allFeelings));
  const [chosenFeeling, setChosenFeeling] = useState<string>(allFeelings.name);
  const { t } = useTranslation();
  i18next.on('languageChanged', () => {
    // Müssen noch die Feelings inder alten Sprache sein
    let sameFeelingInOtherLanguage = getPathOfFeeling(chosenFeeling, allFeelings);
    allFeelings = getFeelingsBasedOnLanguage(i18next.language);
    if(sameFeelingInOtherLanguage){
      setChosenFeeling(_.get(allFeelings, sameFeelingInOtherLanguage));
    }
  });
  // When new Feeling is chosen, we need to update the current feelings
  useEffect(()=>{
    let newFeelings = getChildFeelingsBasedOnParent(chosenFeeling, allFeelings);
    if(!arraysEqual(newFeelings,currentFeelings)){
      setCurrentFeelings(newFeelings)
    }
  },[chosenFeeling])
  
  function calledByChild(clickedFeeling:string, previouslyChosenFeeling:string){
    if(clickedFeeling != previouslyChosenFeeling){
      setChosenFeeling(clickedFeeling)
    }else{ // Clicked Feeling == chosen Feeling (in die Mitte geklickt)

      
      // Beispiel: Suche den Pfad für den Wert "Berlin"
      const path = findPathForNameInFeelings(allFeelings, (searchVal) => searchVal === clickedFeeling);
      if(path){
        let newPath = path.slice(0,-3);
        newPath.push("name");
        let previousFeeling = _.get(allFeelings,newPath.join("."));
        setChosenFeeling(previousFeeling)
      }
    }
  }

  const saveSelectionAndReset = () => {
    // chosenFeeling zwischenspeichern
    resetSelection();
  }
  const resetSelection = () => {
    // Auswahl zurücksetzen
    setChosenFeeling(allFeelings.name);
  }

  return (
    <StrictMode>
    <View
      style={{
        flex: 1,
        justifyContent: "center"
      }}
    >
        <ReactText></ReactText>

        {/* Hier ist der WordCloud-Component */}
      {/* <WordCloud/> */}
        <DonutChart centerText={chosenFeeling} allFeelings={allFeelings} words={currentFeelings} randomizer={Math.round(Math.random() * 360)} clickedFeeling={(clickedFeeling)=>calledByChild(clickedFeeling,chosenFeeling)} />
        <Pressable style={styles.customButton} onPress={() => saveSelectionAndReset()}>
          <ReactText style={styles.customButtonText}>{t("feelingsButton")}</ReactText>
        </Pressable>
    </View>
    </StrictMode>
  );
}


