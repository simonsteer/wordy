import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import letters from '../config/letters'
import customStyles from '../utils/customStyles'

import Timer from 'timer.js'

export default class GameTimer extends React.Component {
  constructor() {
    super()
    this.state = {
      time: 60,
      timer: new Timer({
        tick: 1,
        ontick: this.decrement,
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.scoringInProgress) {
      const secondsLeft = Math.floor(this.state.timer.getDuration() / 1000)
      const updatedTime = secondsLeft + this.props.currentWord.length < 61
        ? secondsLeft + this.props.currentWord.length
        : 60

      this.state.timer.stop()
      this.setState({
        time: updatedTime,
      })
      this.state.timer.start(updatedTime + 1)
    }
  }

  componentDidMount() {
    this.state.timer.start(61)
  }
  
  render() {
    return (
    <View style={[styles.container, customStyles.flatShadow]}>
      <Text style={[
        styles.timer,
        this.state.time < 11 && { color: 'rgb(255, 99, 99)' },
      ]}>
        {getTimerString(this.state.time)}
      </Text>
    </View>
    )
  }

  decrement = () =>
    this.setState({
      time: this.state.time - 1,
    })
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

const getTimerString = timeInSeconds => {
  let minutes
  let seconds
  const secondsPrefix = timeInSeconds < 10
    ? '0'
    : ''
  
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