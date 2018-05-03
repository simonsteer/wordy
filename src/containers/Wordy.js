import React from 'react'
import Board from './Board'
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import CurrentWord from '../components/CurrentWord'
import SubmitWordButton from '../components/SubmitWordButton'
import Score from '../components/Score'
import GameTimer from '../components/GameTimer'

import { connect } from 'react-redux'

@connect(store => {
  return {
    game: store.game,
  }
})
export default class Wordy extends React.Component {
  componentDidMount() {
    this.props.dispatch({ type: 'START_NEW_GAME' })
  }

  render() {
    const {
      dispatch,
      game,
    } = this.props

    return (
      <View style={styles.container}>
        <View style={styles.gui}>
          <Score score={game.score} />
          <GameTimer
            scoringInProgress={game.scoringInProgress}
            currentWord={game.currentWord}
          />
        </View>

        <Board
          letters={game.letters}
          dispatch={dispatch}
          currentWord={game.currentWord}
          currentWordIsValid={game.currentWordIsValid}
          score={game.score}
          scoringInProgress={game.scoringInProgress}
        />
        
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
