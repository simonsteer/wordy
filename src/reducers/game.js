import letterConfig from '../config/letters'
import getRandomLetter from '../utils/getRandomLetter'
import { dictionary1 } from '../utils/dictionary1'
import { dictionary2 } from '../utils/dictionary2'
import { dictionary3 } from '../utils/dictionary3'

import _ from 'lodash'

const game = {
    letters: 'HAPPYHAPPYHAPPYHAPPYHAPPY'.split(''),
    currentWord: [],
    currentWordIsValid: false,
    scoringInProgress: false,
    score: 0,
    scoredWords: [],
    wps: 0,
    gameOver: true,
    activeBonus: null,
    bonusAlerts: [],
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
      const wordString = currentWord
        .map(letterData => letterData.letter)
        .join('')

      const scoredWords = state.scoredWords.concat(wordString)

      let wordScore = currentWord.reduce((total, letterData) => {
        return total + letterConfig[letterData.letter].points
      }, 0)

      const newBonusAlerts = []

      scoreWordBonuses.forEach(bonus => {
        if (bonus.meets_conditions({ ...state, scoredWords })) {
          wordScore = wordScore * bonus.multiplier

          newBonusAlerts.push({
            description: bonus.description,
            effect: bonus.effect,
          })
        }
      })

      return {
        ...state,
        score: state.score + wordScore,
        scoredWords,
        bonusAlerts: [...state.bonusAlerts, ...newBonusAlerts],
        currentWordIsValid: false,
        scoringInProgress: true,
      }
    case 'SCORE_WORD_FINISH':
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
        scoringInProgress: false,
      }
    case 'DISMISS_BONUS_ALERT':
      return {
        ...state,
        bonusAlerts: state.bonusAlerts.slice(1),
      }
    default:
      return state
  }
}

const scoreWordBonuses = [
  {
    description: 'Spell the same word twice in a row',
    effect: 'TRIPLE SCORE',
    meets_conditions: nextState =>
      nextState.scoredWords.length >= 2 &&
      _.last(nextState.scoredWords) === _.last(_.initial(nextState.scoredWords)),
    multiplier: 3,
  },
  {
    description: 'Spell two 5 letter words in a row',
    effect: 'QUINTUPLE SCORE',
    meets_conditions: nextState =>
      nextState.scoredWords.length >= 2 &&
      _.last(nextState.scoredWords).length === 5 && _.last(_.initial(nextState.scoredWords)).length === 5,
    multiplier: 5,
  },
]

