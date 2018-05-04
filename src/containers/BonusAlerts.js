import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

import Timer from 'timer.js'

const secondsBetweenAlerts = 2

class BonusAlerts extends React.Component {
  constructor() {
    super()
    this.state = {
      timer: new Timer({
        tick: secondsBetweenAlerts,
        ontick: this.dismissAlerts,
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.bonusAlerts.length) {
      this.state.timer.stop()
      this.state.timer.start(secondsBetweenAlerts * (nextProps.bonusAlerts.length + 1))
    }
  }

  render() {
    const { bonusAlerts } = this.props

    return (
      <View style={styles.container}>
        {bonusAlerts.length && (
          <Text>
            {bonusAlerts[0].description}
            {bonusAlerts[0].effect}
          </Text>
        )}
      </View>
    ) 
  }

  dismissAlerts = () => {
    this.props.dispatch({ type: 'DISMISS_BONUS_ALERT' })
  }
} 



export default BonusAlerts

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
    justifyContent: 'center',
  },
})