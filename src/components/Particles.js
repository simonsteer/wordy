import React from 'react'
import { View, Animated, Easing, StyleSheet } from 'react-native'
import range from 'lodash/range'
import random from 'lodash/random'

export default class Particles extends React.Component {
  constructor() {
    super()
    this.animatedValue = new Animated.ValueXY()
    this.particles = range(0, 30).map(() => ({
      translateX: this.animatedValue.x.interpolate({
        inputRange: [0, 1],
        outputRange: [0, random(-35, 35)],
      }),
      translateY: this.animatedValue.y.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [0, random(-25, -50), random(50, 150)],
      }),
    }))
  }

  componentDidMount() {
    this.blast()
  }

  render() {
    const opacity = this.animatedValue.y.interpolate({
      inputRange: [0, 1, 1.5, 2],
      outputRange: [0, 1, 0, 0],
    })

    return this.particles.map((config, index) => (
      <Animated.View
        key={`particle-${index}`}
        style={[
          styles.particle,
          {
            transform: [
              { translateX: config.translateX },
              { translateY: config.translateY },
            ],
            opacity,
          },
        ]}
      />
    ))
  }

  blast = () => {
    Animated.parallel([
      Animated.timing(this.animatedValue.x, {
        toValue: 1,
        duration: 600,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(this.animatedValue.y, {
          toValue: 1,
          duration: 200,
          easing: Easing.out(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(this.animatedValue.y, {
          toValue: 2,
          duration: 400,
          easing: Easing.in(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => this.animatedValue.setValue({ x: 0, y: 0 }))
  }
}

const styles = StyleSheet.create({
  particle: {
    position: 'absolute',
    backgroundColor: 'red',
    width: 5,
    height: 5,
    borderRadius: 100,
  },
})
