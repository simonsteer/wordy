import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import letters from '../config/letters'
import customStyles from '../utils/customStyles'

const Score = ({ score }) => 
  <View style={[styles.container, customStyles.flatShadow]}>
    <Text style={styles.score}>
      {'SCORE: ' + score}
    </Text>
  </View>

export default Score

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: '3%',
    borderRadius: 5,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: '#cccccc',
    backgroundColor: 'white',
    height: 50,
    flex: 3,
  },
  score: {
    fontWeight: 'bold',
    fontSize: 18,
    paddingLeft: 15,
    textAlign: 'center',
  },
})
