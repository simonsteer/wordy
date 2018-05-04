import React from 'react'
import { View, StyleSheet } from 'react-native'
import Score from '../components/Score'
import GameTimer from '../components/GameTimer'

const ScoreAndTime = ({ game }) => 
  <View style={styles.gui}>
    <Score game={game} />
    <GameTimer
      scoringInProgress={game.scoringInProgress}
      currentWord={game.currentWord}
    />
  </View>


export default ScoreAndTime

const styles = StyleSheet.create({
  gui: {
    height: 50,
    flexDirection: 'row',
  },
})