import WordCloud from '@/components/WordCloud';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';

const RandomComponent: React.FC = () => {
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [storedFeelingArray, setStoredFeelingArray] = React.useState<ISingleStoreFeeling[]>([]);

    useEffect(() => {
        // Hier kannst du den Code einfügen, der beim Laden des Components ausgeführt werden soll
        let storedFeelingsKey: keyof IStoredFeelings = "storedFeelings";
        AsyncStorage.getItem(storedFeelingsKey).then((value) => {
            if (value != null) {
                let storedFeelings:IStoredFeelings = JSON.parse(value);
                setStoredFeelingArray(storedFeelings.storedFeelings);
            }
        }).finally(() => {
            setIsLoaded(true); // Setze den Ladezustand auf true, wenn die Daten geladen sind
        });
    }, []);

    // TODO: Noch ermöglichen, dass die einzelnen Gefühle gelöscht werden können (Idealerweise den Count reduzieren)
    return (
        <>
            {!isLoaded ? (
                <ActivityIndicator size="large" />
            ) :
                <View style={styles.container}>
                    <Text style={styles.title}>Welcome to Random Component</Text>
                    <WordCloud wordCloudFeelings={storedFeelingArray}/>
                </View>
            }
        </>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default RandomComponent;