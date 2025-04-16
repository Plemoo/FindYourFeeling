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
                    <FeelingWordCloud selectedFeelings={storedFeelingArray} />
                </View>
            }
        </>

    );
};


export default RandomComponent;