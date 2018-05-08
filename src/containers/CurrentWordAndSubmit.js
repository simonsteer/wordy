import React from 'react'
import { View, StyleSheet } from 'react-native'
import CurrentWord from '../components/CurrentWord'
import SubmitWordButton from '../components/SubmitWordButton'

const CurrentWordAndSubmit = ({ game, dispatch }) => (
  <View style={styles.gui}>
    <CurrentWord currentWord={game.currentWord} />
    <SubmitWordButton
      currentWord={game.currentWord}
      currentWordIsValid={game.currentWordIsValid}
      onPress={() => {
        if (game.currentWordIsValid) {
          dispatch({ type: 'SCORE_WORD_START' })
        }
      }}
    />
  </View>
)

export default CurrentWordAndSubmit

const styles = StyleSheet.create({
  gui: {
    height: 50,
    flexDirection: 'row',
  },
})
