import React from 'react'
import { Text, View, StyleSheet, Dimensions, Button } from 'react-native'
import Tile from '../components/Tile'
import Connection from '../components/Connection'

const LetterConnections = ({ letters, currentWord, scoringInProgress }) => {
  const currentWordString = currentWord
    .map(letterData => letterData.letter)
    .join('')

  return (
    <View style={styles.container} pointerEvents="none">
      {letters.map((l, index) => {
        const indexInChain = currentWord.map(l => l.index).indexOf(index)
        const connection =
          indexInChain > 0
            ? currentWord[indexInChain].index -
              currentWord[indexInChain - 1].index
            : 0

        const first = indexInChain === 1
        const last = indexInChain === currentWord.length - 1

        return (
          <View
            key={`connection-${index}`}
            style={{
              height: '20%',
              width: '20%',
              position: 'relative',
            }}
          >
            {connection !== 0 && (
              <Connection
                scoringInProgress={scoringInProgress}
                connectionIndex={connection}
              />
            )}
          </View>
        )
      })}
    </View>
  )
}

export default LetterConnections

const deviceWidth = Dimensions.get('window').width

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    padding: '1.5%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
