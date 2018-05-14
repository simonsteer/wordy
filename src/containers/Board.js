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

export default class Board extends React.Component {
  constructor() {
    super()
    this.state = {
      isDragging: false,
      activeTile: null,
    }
  }

  componentWillMount() {
    this.props.dispatch({ type: 'START_NEW_GAME' })

    this._panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,

      onPanResponderGrant: e => {},

      onPanResponderMove: e => {
        const { dispatch, currentWord } = this.props

        if (!this.state.isDragging) {
          this.setState({ isDragging: true })
        }

        const yOffset = (deviceHeight - deviceWidth) / 2
        const tileSize = deviceWidth / 5

        const xCoord = Math.floor(e.nativeEvent.pageX / tileSize)
        const yCoord = Math.floor((e.nativeEvent.pageY - yOffset) / tileSize)

        const index = yCoord * 5 + xCoord
        const letter = this.props.letters[index]

        const { canChain, isChained } = this['tile' + index].props

        if (index === this.state.activeTile) {
          return
        }

        this.setState({ activeTile: index })

        if (canChain) {
          this['tile' + index].spin()
          dispatch(addToChain({ letter, index }))
        } else if (isChained) {
          this['tile' + last(currentWord).index].unspin()
          dispatch(removeFromChain(last(currentWord).index))
        }
      },

      onPanResponderRelease: e => this.setState({ isDragging: false }),
    })
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
              ? true
              : currentWord.length === 0 ||
                (!isChained &&
                  ((i + 1 === index && index % 5 !== 0) ||
                    (i - 1 === index && index % 5 !== 4) ||
                    (i + 6 === index && index % 5 !== 0) ||
                    (i - 6 === index && index % 5 !== 4) ||
                    (i + 4 === index && index % 5 !== 4) ||
                    (i - 4 === index && index % 5 !== 0) ||
                    i + 5 === index ||
                    i - 5 === index))

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
