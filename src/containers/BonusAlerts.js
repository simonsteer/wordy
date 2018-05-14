import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
} from 'react-native'

import Timer from 'timer.js'

const secondsBetweenAlerts = 1

class BonusAlerts extends React.Component {
  constructor(props) {
    super(props)
    this.animatedValue = new Animated.Value(0)
    this.state = {
      timer: new Timer({
        tick: secondsBetweenAlerts,
        ontick: () => this.endAlert(),
      }),
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.bonusAlerts.length !== this.props.bonusAlerts.length) {
      this.beginAlert()
      this.state.timer.stop()
      this.state.timer.start(
        (nextProps.bonusAlerts.length + 1) * secondsBetweenAlerts
      )
    }
  }

  render() {
    const { bonusAlerts } = this.props

    const topTextTranslateX = this.animatedValue.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [-deviceWidth, 0, deviceWidth],
    })

    const bottomTextTranslateX = this.animatedValue.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [deviceWidth, 0, -deviceWidth],
    })

    return (
      <View style={styles.container}>
        {bonusAlerts.length && (
          <View style={styles.bonus}>
            <Animated.Text
              style={[
                styles.topText,
                { transform: [{ translateX: topTextTranslateX }] },
              ]}
            >
              {bonusAlerts[0].description}
            </Animated.Text>
            <Animated.Text
              style={[
                styles.bottomText,
                { transform: [{ translateX: bottomTextTranslateX }] },
              ]}
            >
              {bonusAlerts[0].effect}
            </Animated.Text>
          </View>
        )}
      </View>
    )
  }

  dismissAlert = () => this.props.dispatch({ type: 'DISMISS_BONUS_ALERT' })

  beginAlert() {
    Animated.spring(this.animatedValue, {
      toValue: 1,
      tension: 200,
      friction: 8,
      useNativeDriver: true,
    }).start()
  }

  endAlert() {
    Animated.timing(this.animatedValue, {
      toValue: 2,
      duration: 200,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => {
      this.animatedValue.setValue(0)
      this.dismissAlert()
    })
  }
}

export default BonusAlerts

const deviceWidth = Dimensions.get('window').width

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bonus: {
    flex: 1,
    paddingTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topText: {
    fontSize: 16,
  },
  bottomText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
})
