import React from 'react'
import { View, StyleSheet, Animated, Easing, Dimensions } from 'react-native'

export default class Connection extends React.Component {
  constructor() {
    super()
    this.transformValue = new Animated.Value(0)
  }

  componentDidMount() {
    this.expand()
  }
  
  render() {
    const { connectionIndex, scoringInProgress } = this.props

    const scaleY = this.transformValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1]
    })

    const isDiagonal = connectionIndex % 2 === 0
    const translateY = this.transformValue.interpolate({
      inputRange: [0, 1],
      outputRange: [
        isDiagonal
          ? tileWidth * -0.1
          : tileWidth * -0.055,
        0,
      ]
    })

    return (
        <Animated.View
          style={[
            styles.container,
            connectionConfig[connectionIndex],
            scoringInProgress && { opacity: 0 },
          ]}
        >
          <Animated.View 
            style={[
              styles.bridge,
              { transform: [{ translateY }, { scaleY }] },
            ]}
          />
        </Animated.View>
    )
  }

  expand() {
    Animated.timing(
      this.transformValue,
      {
        toValue: 1,
        duration: 150,
        easing: Easing.ease,
        useNativeDriver: true,
      },
    ).start()
  }
}

const h = 100

const tileWidth = Dimensions.get('window').width

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    height: '100%',
    width: '100%',
    alignItems: 'center',
    zIndex: 9999,
    paddingVertical: '20%',
  },
  dot: {
    backgroundColor: 'white',
    width: 10,
    height: 10,
    borderRadius: 50,
  },
  bridge: {
    position: 'relative',
    backgroundColor: 'white',
    flex: 1,
    width: 4,
    borderRadius: 100,
  },
})

const connectionConfig = {
  [-6]: {
    bottom: `-${h - 1.4*h/2}%`,
    right: `-${h/2}%`,
    transform: [{ rotate: '-225deg' }],
    height: `${h*1.4}%`,
  },
  [-5]: {
    bottom: `-${h/2}%`,
    transform: [{ rotate: '180deg' }],
  },
  [-4]: {
    bottom: `-${h - h*1.4/2}%`,
    left: `-${h - h/2}%`,
    transform: [{ rotate: '225deg' }], 
    height: `${h*1.4}%`,
  },
  [-1]: {
    right: `-${h/2}%`,
    transform: [{ rotate: '90deg' }], 
    height: `${h}%`,
  },
  [1]: {
    top: 0,
    left: `-${h/2}%`, 
    transform: [{ rotate: '-90deg' }],
  },
  [4]: {
    bottom: `${h*1.4/2}%`,
    left: `${h - h/2}%`,
    transform: [{ rotate: '45deg' }], 
    height: `${h*1.4}%`,
  },
  [5]: {
    top: `-${h/2}%`,
  },
  [6]: {
    top: `-${h*1.4/2}%`,
    left: `-${h - h/2}%`,
    transform: [{ rotate: '-45deg' }], 
    height: `${h*1.4}%`,
  },
}