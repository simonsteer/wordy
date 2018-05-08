import React from 'react'
import { View, Text, StyleSheet, Animated, Easing } from 'react-native'
import letters from '../config/letters'
import customStyles from '../utils/customStyles'

export default class Score extends React.Component {
  constructor() {
    super()
    this.animatedValue = new Animated.Value(0)
    this.state = {
      incomingPoints: 0,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.game.score !== this.props.game.score) {
      const incomingPoints = nextProps.game.score - this.props.game.score

      this.setState({
        incomingPoints,
      })
      this.rollIncomingPoints()
    }
  }

  render() {
    const { game } = this.props

    const translateY = this.animatedValue.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [50, 0, -50],
    })

    const opacity = this.animatedValue.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [0, 1, 0],
    })

    return (
      <View style={[styles.container, customStyles.flatShadow]}>
        <View style={styles.box}>
          <Text style={[styles.score, { paddingLeft: 15 }]}>
            {'SCORE: ' + game.score}
          </Text>
          <Animated.Text
            style={[
              styles.score,
              { paddingRight: 15 },
              { transform: [{ translateY }] },
              { opacity },
            ]}
          >
            {'+' + this.state.incomingPoints}
          </Animated.Text>
        </View>
      </View>
    )
  }

  rollIncomingPoints() {
    Animated.sequence([
      Animated.timing(this.animatedValue, {
        toValue: 1,
        duration: 100,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(this.animatedValue, {
        toValue: 2,
        delay: 300,
        duration: 100,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start(() => this.animatedValue.setValue(0))
  }
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: '3%',
    height: 50,
    flex: 3,
    borderRadius: 5,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: '#cccccc',
    backgroundColor: 'white',
  },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
    flex: 1,
    overflow: 'hidden',
  },
  score: {
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
})
