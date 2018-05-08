import React from 'react'
import Board from './Board'
import { View, Text, StyleSheet } from 'react-native'
import BonusAlerts from './BonusAlerts'
import ScoreAndTime from './ScoreAndTime'
import CurrentWordAndSubmit from './CurrentWordAndSubmit'

import Timer from 'timer.js'

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
    <View style={{ flex: 1 }}>
      {game.activeBonus && (
        <View>
          <Text>{game.activeBonus.title}</Text>
          <Text>{game.activeBonus.description}</Text>
          <Text>{game.activeBonus.effect}</Text>
        </View>
      )}
    </View>
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
