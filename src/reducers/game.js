import letterConfig from '../config/letters'
import getRandomLetter from '../utils/getRandomLetter'
import { dictionary1 } from '../utils/dictionary1'
import { dictionary2 } from '../utils/dictionary2'
import { dictionary3 } from '../utils/dictionary3'

const game = {
    letters: [],
    currentWord: [],
    currentWordIsValid: false,
    scoringInProgress: false,
    score: 0,
}

const dictionary = [
  ...dictionary1,
  ...dictionary2,
  ...dictionary3,
].reduce((dictionary, word) => {
  dictionary[word] = 1
  return dictionary
}, {})

export default (state = game, action) => {
  const {
    currentWord,
    letters,
    score,
    scoringInProgress,
  } = state

  switch (action.type) {
    case 'START_NEW_GAME':
      const randomLetters = []
      for (let i = 0; i < 25; i++) {
        randomLetters.push(getRandomLetter())
      }
      return {
        ...state,
        letters: randomLetters,
      }
    case 'ADD_TO_WORD':
      const addedWord = currentWord.concat(action.payload)
      const addedWordString = addedWord
        .map(letterData => letterData.letter)
        .join('')
        .toLowerCase()

      return {
        ...state,
        currentWord: addedWord,
        currentWordIsValid:
          !!dictionary[addedWordString] &&
          addedWord.length > 2,
      }
    case 'REMOVE_FROM_WORD':
      const sliceIndex = currentWord.findIndex(letterData => letterData.index === action.payload)
      const removedWord = currentWord.slice(0, sliceIndex)
      const removedWordString = removedWord
        .map(letterData => letterData.letter)
        .join('')
        .toLowerCase()
    
      return {
        ...state,
        currentWord: removedWord,
        currentWordIsValid:
          !!dictionary[removedWordString] &&
          removedWord.length > 2,
      }
    case 'SCORE_WORD_START':
      return {
        ...state,
        scoringInProgress: true,
      }
    case 'SCORE_WORD_FINISH':
      const newScore = currentWord.reduce((score, letterData) => {
        return score + letterConfig[letterData.letter].points
      }, score)

      const newLetters = letters.map((letter, index) => {
        if (!!currentWord.find(letterData =>
          letterData.index === index && letterData.letter === letter
        )) {
          return getRandomLetter()
        }

        return letter
      })
      

      return {
        ...state,
        letters: newLetters,
        currentWord: [],
        currentWordIsValid: false,
        score: newScore,
        scoringInProgress: false,
      }
    default:
      return state
  }
}
