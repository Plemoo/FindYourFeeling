import { View, Text } from 'react-native'
import React from 'react'
import { styles } from '@/assets/styles/styles'

const Sprichwort = (feelingSprichwort:ISprichwort) => {
  return (
    <View style={styles.sprichwortContainer}>
      <Text style={styles.sprichwortText}>{feelingSprichwort.text}</Text>
      <Text style={styles.sprichwortAutorText}>({feelingSprichwort.author})</Text>
    </View>
  )
}

export default Sprichwort