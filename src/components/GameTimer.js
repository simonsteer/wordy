import React from 'react'
import { View, Text, StyleSheet, Animated, Easing } from 'react-native'
import letters from '../config/letters'
import customStyles from '../utils/customStyles'

import Timer from 'timer.js'

export default class GameTimer extends React.Component {
  constructor() {
    super()
    this.colorValue = new Animated.Value(0)
    this.state = {
      inDanger: false,
      time: 60,
      timer: new Timer({
        tick: 1,
        ontick: this.decrement,
      }),
    }
  }

  componentWillReceiveProps = nextProps => {
    if (nextProps.scoringInProgress) {
      const secondsLeft = Math.floor(this.state.timer.getDuration() / 1000)
      const updatedTime =
        secondsLeft + this.props.currentWord.length < 61
          ? secondsLeft + this.props.currentWord.length
          : 60

      if (updatedTime > 10 && this.state.inDanger) {
        this.normalize()
        this.setState({ inDanger: false })
      }

      this.state.timer.stop()
      this.setState({
        time: updatedTime,
      })
      this.state.timer.start(updatedTime + 1)
    }
  }

  componentDidMount() {
    this.state.timer.start(20)
  }

  render() {
    const backgroundColor = this.colorValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['rgb(255, 255, 255)', 'rgb(255, 150, 150)'],
    })

    const borderColor = this.colorValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['rgb(204, 204, 204)', 'rgb(255, 99, 99)'],
    })

    return (
      <Animated.View
        style={[
          styles.container,
          customStyles.flatShadow,
          { borderColor, backgroundColor },
        ]}
      >
        <Text style={styles.timer}>{timeToString(this.state.time)}</Text>
      </Animated.View>
    )
  }

  decrement = () => {
    const time = this.state.time - 1
    this.setState({
      time,
    })

    if (time < 11 && !this.state.inDanger) {
      this.red()
      this.setState({ inDanger: true })
    }
  }

  red() {
    Animated.timing(this.colorValue, {
      toValue: 1,
      duration: 500,
      easing: Easing.linear,
    }).start()
  }

  normalize() {
    Animated.timing(this.colorValue, {
      toValue: 0,
      duration: 500,
      easing: Easing.linear,
    }).start()
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: '3%',
    marginLeft: 0,
    borderRadius: 5,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: '#cccccc',
    backgroundColor: 'white',
    height: 50,
    flex: 1.94,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timer: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18,
  },
})

const timeToString = timeInSeconds => {
  let minutes
  let seconds
  const secondsPrefix = timeInSeconds < 10 ? '0' : ''

  if (timeInSeconds < 60) {
    seconds = secondsPrefix + timeInSeconds
    minutes = 0
  } else {
    seconds = '00'
    minutes = 1
  }

  const timerString = minutes + ':' + seconds
  return timerString
}
