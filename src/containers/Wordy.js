import React from 'react'
import Board from './Board'
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import CurrentWordAndSubmit from './CurrentWordAndSubmit'
import ScoreAndTime from './ScoreAndTime'

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

    return (
      <View style={styles.container}>
        <ScoreAndTime game={game} />
        <Board
          letters={game.letters}
          dispatch={dispatch}
          currentWord={game.currentWord}
          currentWordIsValid={game.currentWordIsValid}
          score={game.score}
          scoringInProgress={game.scoringInProgress}
        />
        <CurrentWordAndSubmit game={game} dispatch={dispatch}/>
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
