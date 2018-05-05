import React from 'react'
import Board from './Board'
import { View, Text, StyleSheet } from 'react-native'
import BonusAlerts from './BonusAlerts'
import ScoreAndTime from './ScoreAndTime'
import CurrentWordAndSubmit from './CurrentWordAndSubmit'

import Timer from 'timer.js'

export default class Game extends React.Component {
  constructor() {
    super()
    this.state = {
      wordsAtBonusActivation: [],
      speedCheckTimer: null,
    }
  }

  // componentDidMount() {
  //   this.props.dispatch({ type: 'START_NEW_GAME' })
  // }

  componentWillReceiveProps(nextProps) {
    if (nextProps.game.activeBonus === null) {
      return
    }

    if (
      this.props.game.activeBonus === null ||
      this.props.game.activeBonus.title !== nextProps.game.activeBonus.title
    ) {
      if (this.state.speedCheckTimer) {
        this.state.speedCheckTimer.stop()
      }

      this.setState({
        wordsAtBonusActivation: nextProps.game.scoredWords,
        speedCheckTimer: new Timer({
          onend: this.checkBonusValidity,
        }).start(60 / nextProps.game.activeBonus.required_wpm),
      })
    }
  }

  render() {
    const { game, dispatch } = this.props

    return(
      <View style={styles.container}>
        <BonusAlerts bonusAlerts={game.bonusAlerts} wpm={game.wpm} dispatch={dispatch}/>
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
  }

  checkBonusValidity = () => {
    if (this.state.wordsAtBonusActivation.length === this.props.game.scoredWords.length) {
      console.log('please remove bONUS')
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'cornflowerblue',
  },
})
