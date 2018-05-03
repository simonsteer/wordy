import React from 'react'
import { View, Text, StyleSheet, Dimensions, Button } from 'react-native'
import letters from '../config/letters'
import customStyles from '../utils/customStyles'

const CurrentWord = ({ currentWord }) => {
  const currentWordScore = currentWord.reduce((score, letterData) => {
    return score + letters[letterData.letter].points
  }, 0)

  let currentWordString = currentWord
    .map(letterData =>letterData.letter)
    .join('')
  
  if (currentWordString.length > 10) {
    currentWordString = '...'.concat(currentWordString.slice(currentWordString.length - 10))
  } 

  const currentWordAndScore = currentWordScore
    ? currentWordString + (` (${currentWordScore})`)
    : ''

  return (
    <View style={[styles.container, customStyles.flatShadow]}>
      <Text style={[styles.currentWord, !currentWordAndScore && { color: '#bababa' } ]}>
        {currentWordAndScore ? currentWordAndScore : 'START SPELLING!'}
      </Text>
    </View>
  )
}

export default CurrentWord

const deviceWidth = Dimensions.get('window').width
const deviceHeight = Dimensions.get('window').height

const styles = StyleSheet.create({
  container: {
    marginLeft: '3%',
    borderRadius: 5,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: '#cccccc',
    backgroundColor: 'white',
    flex: 3,
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 15,
    overflow: 'hidden',
  },
  currentWord: {
    width: deviceWidth * 2,
    fontWeight: 'bold',
    fontSize: 18,
  },
})