import React from 'react'
import {
  Text,
  View,
  StyleSheet,
  Animated,
  Easing,
  TouchableWithoutFeedback,
} from 'react-native'
import customStyles from '../utils/customStyles'
import addToChain from '../actions/addToChain'
import removeFromChain from '../actions/removeFromChain'
import letters from '../config/letters'

import sample from 'lodash/sample'
import last from 'lodash/last'
import difference from 'lodash/difference'
import Timer from 'timer.js'

export default class Tile extends React.Component {
  constructor(props) {
    super(props)
    this.spinValue = new Animated.Value(0)
    this.tileRotations = [-17, -13, -9, 9, 13, 17]
    this.state = {
      spinAmount: 0,
      scramble: false,
      scrambleTimer: new Timer({
        tick: 0.03,
        ontick: this.scramble,
      }),
      excludeFromScramble: [props.letter],
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isChained && !nextProps.isChained) {
      this.unspin()
    }

    if (nextProps.scoringInProgress && this.state.spinAmount) {
      this.state.scrambleTimer.start(1)
      this.unspin(nextProps.scoringInProgress)
    }
  }

  render() {
    const { index, isChained, letter, currentWord, explode } = this.props

    const rotate = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', `${this.state.spinAmount}deg`],
    })

    const scale = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.075],
    })

    const bubbleScale = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    })

    const zIndex = currentWord.findIndex(l => l.index === index)

    return (
      <Animated.View
        style={[
          styles.container,
          customStyles.flatShadow,
          isChained && { zIndex },
          {
            transform: [{ rotate }, { scale }],
          },
        ]}
      >
        <View style={styles.tile}>
          <Animated.View
            style={[styles.bubble, { transform: [{ scale: bubbleScale }] }]}
          />
          <Text style={styles.letter}>
            {this.state.scramble ? this.state.scramble : letter}
          </Text>

          <Text style={styles.points}>
            {this.state.scramble
              ? letters[this.state.scramble].points
              : letters[letter].points}
          </Text>
        </View>
      </Animated.View>
    )
  }

  spin() {
    this.setState({
      spinAmount: sample(this.tileRotations),
    })

    Animated.spring(this.spinValue, {
      toValue: 1,
      tension: 400,
      friction: 8,
      useNativeDriver: true,
    }).start()
  }

  unspin(scoringInProgress) {
    Animated.timing(this.spinValue, {
      toValue: 0,
      duration: 100,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => {
      this.setState({ spinAmount: 0 })

      if (scoringInProgress) {
        this.state.scrambleTimer.stop()
        this.setState({
          scramble: false,
        })

        if (this.props.index === last(this.props.currentWord).index) {
          this.props.dispatch({ type: 'SCORE_WORD_FINISH' })
        }
      }
    })
  }

  scramble = () => {
    const letters_array = Object.keys(letters)
    const unseenLetters = difference(
      letters_array,
      this.state.excludeFromScramble
    )
    const scrambleLetter = sample(unseenLetters)

    this.setState({
      scramble: scrambleLetter,
      excludeFromScramble: this.state.excludeFromScramble.concat(
        scrambleLetter
      ),
    })
  }
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    borderRadius: 5,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    backgroundColor: 'rgb(255,215,0)',
    borderColor: 'rgb(218,165,32)',
  },
  tile: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  bubble: {
    position: 'absolute',
    borderRadius: 100,
    width: '65%',
    height: '65%',
    backgroundColor: 'white',
  },
  letter: {
    fontWeight: 'bold',
    fontSize: 24,
  },
  points: {
    position: 'absolute',
    fontWeight: 'bold',
    bottom: 3,
    right: 5,
    fontSize: 12,
  },
})
