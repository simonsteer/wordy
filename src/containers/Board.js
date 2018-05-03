import React from 'react'
import { Text, View, StyleSheet, Dimensions, Button } from 'react-native'
import Tile from '../components/Tile'
import Connection from '../components/Connection'
import LetterConnections from './LetterConnections'

const Board = ({ scoringInProgress, score, letters, currentWord, currentWordIsValid, dispatch }) => {
  const currentWordString = currentWord.map(letterData => letterData.letter).join('')
  
  return (
    <View style={styles.container}>
      <View style={styles.board}>
        {letters.map((l, index) => {
          const isChained = !!currentWord.find(letterData =>
            letterData.index === index
          )

          const canChain =
            currentWord.length === 0 ||
            (!isChained && (
              currentWord[currentWord.length - 1].index + 1 === index && index % 5 !== 0 ||
              currentWord[currentWord.length - 1].index - 1 === index && index % 5 !== 4 ||
              currentWord[currentWord.length - 1].index + 6 === index && index % 5 !== 0 ||
              currentWord[currentWord.length - 1].index - 6 === index && index % 5 !== 4 ||
              currentWord[currentWord.length - 1].index + 4 === index && index % 5 !== 4 ||
              currentWord[currentWord.length - 1].index - 4 === index && index % 5 !== 0 ||
              currentWord[currentWord.length - 1].index + 5 === index ||
              currentWord[currentWord.length - 1].index - 5 === index
            ))

          return (
            <View
              key={l + index}
              style={{
                height: '17%',
                width: '17%',
                margin: '1.5%',
              }}
            >
              <Tile
                letter={l}
                index={index}
                canChain={canChain}
                isChained={isChained}
                dispatch={dispatch}
                currentWordIsValid={currentWordIsValid}
                currentWord={currentWord}
                scoringInProgress={scoringInProgress}
              />
            </View>
          )
        })}
      </View>
      <LetterConnections letters={letters} currentWord={currentWord} scoringInProgress={scoringInProgress} />
    </View>
  )
}

export default Board

const deviceWidth = Dimensions.get('window').width
const deviceHeight = Dimensions.get('window').height

const styles = StyleSheet.create({
  board: {
    padding: '1.5%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    width: deviceWidth,
    height: deviceWidth,
  },
  container: {
    width: deviceWidth,
    height: deviceWidth,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
