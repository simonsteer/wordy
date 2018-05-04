import React from 'react'
import Board from './Board'
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import BonusAlerts from './BonusAlerts'
import ScoreAndTime from './ScoreAndTime'
import CurrentWordAndSubmit from './CurrentWordAndSubmit'

import { connect } from 'react-redux'

@connect(store => {
  return {
    game: store.game,
  }
})
export default class Wordy extends React.Component {
  // componentDidMount() {
  //   this.props.dispatch({ type: 'START_NEW_GAME' })
  // }

  render() {
    const {
      dispatch,
      game,
    } = this.props

    console.log(game.bonusAlerts)

    return (
      <View style={styles.container}>
        <BonusAlerts bonusAlerts={game.bonusAlerts} dispatch={dispatch}/>
        <ScoreAndTime game={game}/>
        <Board
          letters={game.letters}
          dispatch={dispatch}
          currentWord={game.currentWord}
          currentWordIsValid={game.currentWordIsValid}
          score={game.score}
          scoringInProgress={game.scoringInProgress}
        />
        <CurrentWordAndSubmit game={game} dispatch={dispatch}/>
        <View style={{ flex: 1, backgroundColor: 'red' }}>
          <Text>Knock Knock</Text> 
          <Text>Who's there</Text> 
          <Text>Updog</Text>
          <Text>What's updog</Text>
        </View>
      </View>
    )
  }
}

const deviceWidth = Dimensions.get('window').width
const deviceHeight = Dimensions.get('window').height

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'cornflowerblue',
  },
  gui: {
    height: 50,
    flexDirection: 'row',
  },
})
