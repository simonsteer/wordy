import React from 'react'
import Board from './Board'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import BonusAlerts from './BonusAlerts'
import ScoreAndTime from './ScoreAndTime'
import CurrentWordAndSubmit from './CurrentWordAndSubmit'

const Game = ({ game, dispatch }) => (
  <View style={styles.container}>
    <BonusAlerts
      bonusAlerts={game.bonusAlerts}
      wpm={game.wpm}
      dispatch={dispatch}
    />
    <ScoreAndTime game={game} />
    <Board
      letters={game.letters}
      dispatch={dispatch}
      currentWord={game.currentWord}
      currentWordIsValid={game.currentWordIsValid}
      score={game.score}
      scoringInProgress={game.scoringInProgress}
    />
    <CurrentWordAndSubmit game={game} dispatch={dispatch} />
    <View style={{ flex: 1 }} />
  </View>
)

export default Game

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'cornflowerblue',
  },
})
