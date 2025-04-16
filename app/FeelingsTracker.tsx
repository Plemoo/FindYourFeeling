import { getStoredFeelingsAsync } from '@/assets/ts/helper';
import { getFeelingsBasedOnLanguage, getPathOfFeeling } from '@/assets/ts/indexFunctions';
import FeelingWordCloud from '@/components/FeelingWordCloud';
import i18next from 'i18next';
import _ from 'lodash';
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';

const RandomComponent: React.FC = () => {
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [storedFeelingArray, setStoredFeelingArray] = React.useState<ISingleStoreFeeling[]>([]);
    // Update Word Cloud when Feelings are changed
    i18next.on('languageChanged', () => {
        // Müssen noch die Feelings in der alten Sprache sein
        const allFeelings = getFeelingsBasedOnLanguage(i18next.language);
        let feelingNameKey: keyof ISingleStoreFeeling = "name";
        let storedFeelingsInOtherLanguage: ISingleStoreFeeling[] = storedFeelingArray//
            .map((feeling) => { return { ...feeling, [feelingNameKey]: getPathOfFeeling(feeling.name, allFeelings) } })// Speichere den Pfad zu dem Gefühl in dem name wert zwischen
            .filter((feeling) => feeling.name != null)//
            .map((feeling) => { return { ...feeling, [feelingNameKey]: _.get(allFeelings, feeling.name!) } })// hole basierend auf dem zwischengespeicherten Pfad das Gefühl in der anderen Sprache
        if (!_.isEmpty(storedFeelingsInOtherLanguage)) {
            setStoredFeelingArray(storedFeelingsInOtherLanguage)
            console.log(storedFeelingsInOtherLanguage)
        }
    });
    useEffect(() => {
        // Hier kannst du den Code einfügen, der beim Laden des Components ausgeführt werden soll
        getStoredFeelingsAsync().then((value) => {
            if (value != null) {
                setStoredFeelingArray(value.storedFeelings);
            }
        }).finally(() => {
            setIsLoaded(true); // Setze den Ladezustand auf true, wenn die Daten geladen sind
        });
    }, []);

    // TODO: Noch eine Art Kalender bauen um pro Tag das hauptgefühl anzuzeigen
    return (
        <>
            {!isLoaded ? (
                <ActivityIndicator size="large" />
            ) :
                <View >
                    <Text>Welcome to Random Component</Text>
                    <FeelingWordCloud selectedFeelings={storedFeelingArray} />
                </View>
            }
        </>

    );
};


export default RandomComponent;