import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const RandomComponent: React.FC = () => {
    const handlePress = () => {
        alert('Button Pressed!');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to Random Component</Text>
            <TouchableOpacity style={styles.button} onPress={handlePress}>
                <Text style={styles.buttonText}>Press Me</Text>
            </TouchableOpacity>
        </View>
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