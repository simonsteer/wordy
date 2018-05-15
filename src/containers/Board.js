import React from 'react'
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Button,
  PanResponder,
} from 'react-native'
import Tile from '../components/Tile'
import Connection from '../components/Connection'
import LetterConnections from './LetterConnections'
import addToChain from '../actions/addToChain'
import removeFromChain from '../actions/removeFromChain'

import get from 'lodash/get'
import last from 'lodash/last'
import initial from 'lodash/initial'

export default class Board extends React.Component {
  constructor() {
    super()
    this.state = {
      isDragging: false,
      activeTile: null,
    }
    this._panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderMove: e => this.handleMove(e),
      onPanResponderRelease: this.handleRelease,
    })
  }

  componentDidMount() {
    this.props.dispatch({ type: 'START_NEW_GAME' })
  }

  render() {
    const {
      scoringInProgress,
      score,
      letters,
      currentWord,
      currentWordIsValid,
      dispatch,
    } = this.props

    const currentWordString = currentWord
      .map(letterData => letterData.letter)
      .join('')

    return (
      <View
        style={styles.container}
        {...this._panResponder.panHandlers}
        ref={a => (this.board = a)}
      >
        <View style={styles.board}>
          {letters.map((l, index) => {
            const isChained = !!currentWord.find(
              letterData => letterData.index === index
            )

            const i = get(
              currentWord,
              `[${currentWord.length - 1}].index`,
              false
            )

            const canChain = !i
              ? !scoringInProgress && true
              : !scoringInProgress &&
                (currentWord.length === 0 ||
                  (!isChained &&
                    ((i + 1 === index && index % 5 !== 0) ||
                      (i - 1 === index && index % 5 !== 4) ||
                      (i + 6 === index && index % 5 !== 0) ||
                      (i - 6 === index && index % 5 !== 4) ||
                      (i + 4 === index && index % 5 !== 4) ||
                      (i - 4 === index && index % 5 !== 0) ||
                      i + 5 === index ||
                      i - 5 === index)))

            return (
              <View
                key={l + index}
                style={{
                  height: '17%',
                  width: '17%',
                  margin: '1.5%',
                }}
              >
                <Tile
                  ref={a => (this['tile' + index] = a)}
                  explode={score !== 0}
                  letter={l}
                  index={index}
                  canChain={canChain}
                  isChained={isChained}
                  dispatch={dispatch}
                  currentWordIsValid={currentWordIsValid}
                  currentWord={currentWord}
                  scoringInProgress={scoringInProgress}
                />
              </View>
            )
          })}
        </View>
        <LetterConnections
          letters={letters}
          currentWord={currentWord}
          scoringInProgress={scoringInProgress}
        />
      </View>
    )
  }

  handleMove = e => {
    const { dispatch, currentWordIsValid } = this.props

    const yOffset = (deviceHeight - deviceWidth) / 2
    const tileSize = deviceWidth / 5

    const xCoord = Math.floor(e.nativeEvent.pageX / tileSize)
    const yCoord = Math.floor((e.nativeEvent.pageY - yOffset) / tileSize)

    const index = yCoord * 5 + xCoord

    if (index === this.state.activeTile) {
      return
    }

    this.setState({ activeTile: index })

    const { canChain, isChained, letter } = this['tile' + index].props

    if (canChain) {
      this['tile' + index].spin()
      dispatch(addToChain({ letter, index }))
    } else if (isChained) {
      const previousIndex = last(this.props.currentWord).index

      this['tile' + previousIndex].unspin()
      dispatch(removeFromChain(previousIndex))
    }
  }

  handleRelease = () => {
    this.setState({ activeTile: null })

    if (this.props.currentWordIsValid) {
      this.props.dispatch({ type: 'SCORE_WORD_START' })

      return
    }

    if (this.props.currentWord.length) {
      this.props.dispatch(removeFromChain(this.props.currentWord[0].index))
    }
  }
}

const deviceWidth = Dimensions.get('window').width
const deviceHeight = Dimensions.get('window').height

const styles = StyleSheet.create({
  board: {
    padding: '1.5%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    width: deviceWidth,
    height: deviceWidth,
  },
  container: {
    width: deviceWidth,
    height: deviceWidth,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
