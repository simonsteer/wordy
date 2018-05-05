import React from 'react'
import Game from './Game'
import { connect } from 'react-redux'

@connect(store => {
  return {
    game: store.game,
  }
})
export default class Wordy extends React.Component {
  render() {
    const {
      dispatch,
      game,
    } = this.props

    return (
      <Game game={game} dispatch={dispatch}/>
    )
  }
}
  