import { Pressable, Text as ReactText, TouchableOpacity, View } from "react-native";
import DonutChart from "../components/DonutChart";
import { StrictMode, useEffect, useState } from "react";
import { styles } from "../assets/styles/styles"
import _ from "lodash"
import "../assets/ts/i18next"
import { useTranslation } from "react-i18next";
import i18next from "../assets/ts/i18next";
import { arraysEqual, getChildFeelingsBasedOnParent, getFeelingsBasedOnLanguage, getPathOfFeeling } from "@/assets/ts/indexFunctions";
import Sprichwort from "@/components/Sprichwort";
import { TouchableHighlight } from "react-native";
import { getStoredFeelingsAsync, storeFeelingInAsyncStorage } from "@/assets/ts/helper";


export default function Index() {
  let allFeelings: INestedFeelings = getFeelingsBasedOnLanguage(i18next.language);
  const [currentFeelings, setCurrentFeelings] = useState<string[]>(getChildFeelingsBasedOnParent(allFeelings.name, allFeelings));
  const [chosenFeeling, setChosenFeeling] = useState<string>(allFeelings.name);
  const [sprichwort, setSprichwort] = useState<ISprichwort>(allFeelings.sprichwort);
  const { t } = useTranslation();
  i18next.on('languageChanged', () => {
    // Müssen noch die Feelings in der alten Sprache sein
    let sameFeelingInOtherLanguage = getPathOfFeeling(chosenFeeling, allFeelings);
    allFeelings = getFeelingsBasedOnLanguage(i18next.language);
    if (sameFeelingInOtherLanguage) {
      let sprichwortKey: keyof INestedFeelings = "sprichwort";
      let sprichwortForCurrentFeeling = _.chain(sameFeelingInOtherLanguage).dropRight().push(sprichwortKey).value();
      setSprichwort(_.get(allFeelings, sprichwortForCurrentFeeling));
      setChosenFeeling(_.get(allFeelings, sameFeelingInOtherLanguage));
    }
  });
  // When new Feeling is chosen, we need to update the current feelings
  useEffect(() => {
    let newFeelings = getChildFeelingsBasedOnParent(chosenFeeling, allFeelings);
    if (!arraysEqual(newFeelings, currentFeelings)) {
      setCurrentFeelings(newFeelings)
    }
  }, [chosenFeeling])

  function calledByChild(clickedFeeling: string, previouslyChosenFeeling: string) {
    let sprichwortKey: keyof INestedFeelings = "sprichwort";
    let nameKey: keyof INestedFeelings = "name";
    const path = getPathOfFeeling(clickedFeeling, allFeelings);
    if (path == null) {
      return;
    }
    if (clickedFeeling != previouslyChosenFeeling) { // Auf eines der äußeren Segmente geklickt
      let pathToSprichwortOfCurrentFeeling = _.chain(path).dropRight().push(sprichwortKey).join(".").value();
      setSprichwort(_.get(allFeelings, pathToSprichwortOfCurrentFeeling));
      setChosenFeeling(clickedFeeling)
    } else { // Clicked Feeling == chosen Feeling (in die Mitte geklickt)
      let pathToParentFeeling = _.chain(path).slice(0, -3).push(nameKey).join(".").value();
      let pathToParentSprichwort = _.chain(path).slice(0, -3).push(sprichwortKey).join(".").value();
      let previousFeeling = _.get(allFeelings, pathToParentFeeling);
      setSprichwort(_.get(allFeelings, pathToParentSprichwort));
      setChosenFeeling(previousFeeling)

    }
  }

  const saveSelectionAndReset = () => {
    // chosenFeeling zwischenspeichern
    let storedFeelingsKey: keyof IStoredFeelings = "storedFeelings";
    getStoredFeelingsAsync().then((value) => {
      let storedFeelings: ISingleStoreFeeling[]=[];
      if (value == null) { // Wenn noch nichts gespeichert ist
        storedFeelings.push({ name: chosenFeeling, count: 1, });
      } else { // Wenn schon etwas gespeichert ist
        storedFeelings = value.storedFeelings;
        let feelingExists = storedFeelings.find((feeling) => feeling.name === chosenFeeling);
        if (feelingExists) {
          feelingExists.count++;
        } else {
          storedFeelings.push({ name: chosenFeeling, count: 1 });
        }
      }
      storeFeelingInAsyncStorage(storedFeelings);
      // AsyncStorage.setItem(storedFeelingsKey, JSON.stringify(storedFeelings));
    });
    resetSelection();
  }
  const resetSelection = () => {
    // Auswahl zurücksetzen
    setChosenFeeling(allFeelings.name);
  }

  const getFeelingSaveButtonText = () => {
    if (chosenFeeling == allFeelings.name) {
      return t("feelingsButton")
    } else {
      return t("selectableFeelingButton", { feeling: chosenFeeling });
    }
  }
  return (
    <StrictMode>
      <View style={styles.container}>
        <Sprichwort text={sprichwort.text} author={sprichwort.author} />
        <View style={styles.feelingContainer}>
          <DonutChart centerText={chosenFeeling} allFeelings={allFeelings} words={currentFeelings} randomizer={Math.round(Math.random() * 360)} clickedFeeling={(clickedFeeling) => calledByChild(clickedFeeling, chosenFeeling)} />
          <View style={styles.saveFeelingButtonContainer}>
            <TouchableHighlight
              disabled={!chosenFeeling || chosenFeeling === allFeelings.name}
              onPress={() => saveSelectionAndReset()}
              style={
                (!chosenFeeling || chosenFeeling === allFeelings.name)
                  ? styles.disabledSaveFeelingButton
                  : styles.saveFeelingButton
              }
            >
              <ReactText style={styles.saveFeelingButtonText}>{getFeelingSaveButtonText()}</ReactText>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    </StrictMode>
  );
}


