import React from 'react'
import { Text, Animated, Easing, TouchableWithoutFeedback, StyleSheet } from 'react-native'
import letters from '../config/letters'
import customStyles from '../utils/customStyles'

export default class SubmitWordButton extends React.Component {
  constructor() {
    super()
    this.colorValue = new Animated.Value(1)
  }

  render() {
    const { currentWordIsValid, currentWord } = this.props
    const backgroundColor = this.colorValue.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [
        'rgb(150, 255, 150)',
        'rgb(255, 255, 255)',
        'rgb(255, 150, 150)',
      ],
    })

    const borderColor = this.colorValue.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [
        'rgb(99, 255, 99)',
        'rgb(204, 204, 204)',
        'rgb(255, 99, 99)',
      ],
    })

    return (
      <TouchableWithoutFeedback
        onPress={() => {
          this.props.onPress()
          this.flash(currentWordIsValid)
        }}
      >
        <Animated.View style={[
          styles.container,
          customStyles.flatShadow,
          { backgroundColor },
          { borderColor },
        ]}>
          <Text style={[
            styles.submit,
            currentWord.length < 3 && { color: '#bababa' },
          ]}>
            SUBMIT
          </Text>
        </Animated.View>
      </TouchableWithoutFeedback>
    )
  }

  flash(currentWordIsValid) {
    Animated.timing(
      this.colorValue,
      {
        toValue: currentWordIsValid ? 0 : 2,
        duration: 100,
        easing: Easing.ease,
      },
    ).start(() => this.normalize())
  }

  normalize() {
    Animated.timing(
      this.colorValue,
      {
        toValue: 1,
        duration: 100,
        easing: Easing.linear,
      },
    ).start()
  }
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: '3%',
    borderRadius: 5,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: 'rgb(204, 204, 204)',
    backgroundColor: 'white',
    height: 50,
    flex: 1.94,
    justifyContent: 'center',
  },
  submit: {
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
})