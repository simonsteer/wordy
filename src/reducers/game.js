import letterConfig from '../config/letters'
import getRandomLetter from '../utils/getRandomLetter'
import { dictionary1 } from '../utils/dictionary1'
import { dictionary2 } from '../utils/dictionary2'
import { dictionary3 } from '../utils/dictionary3'

import _ from 'lodash'

const game = {
    letters: 'YESNOYESNOYESNOYESNOYESNO'.split(''),
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
      const time = new Date().getTime()
      const string = currentWord
        .map(letterData => letterData.letter)
        .join('')

      const scoredWord = {
        string,
        time,
      }
      const scoredWords = state.scoredWords.concat(scoredWord)
      
      const lastWords = [...scoredWords].reverse().slice(0,5)
      const wpm = scoredWords.length > 1
        ? 60 / (((lastWords[0].time - lastWords[lastWords.length - 1].time) / 1000) / lastWords.length)
        : 0

      let wordScore = currentWord.reduce((total, letterData) => {
        return total + letterConfig[letterData.letter].points
      }, 0)
      const newBonusAlerts = []
      
      scoredWordBonuses({ ...state, scoredWords, wpm }).forEach(bonus => {
        if (bonus.meets_conditions) {
          wordScore = wordScore * bonus.multiplier

          newBonusAlerts.push({
            description: bonus.description,
            effect: bonus.effect,
          })
        }
      })

      const activeBonus = speedBonuses({ ...state, scoredWords, wpm }).find(bonus =>
          bonus.meets_conditions) || {}

      return {
        ...state,
        score: score + wordScore,
        scoredWords,
        activeBonus,
        bonusAlerts: [...state.bonusAlerts, ...newBonusAlerts],
        currentWordIsValid: false,
        scoringInProgress: true,
        wpm,
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

const scoredWordBonuses = nextState => [
  {
    description: 'Scored a palindrome',
    effect: '3X POINTS',
    multiplier: 5,
    meets_conditions:
      _.last(nextState.scoredWords).string.split('').every((char, i, word) =>
        char === word[word.length - 1 - i]),
  },
  {
    description: `Score two ${_.last(nextState.scoredWords).string.length}-letter words in a row`,
    effect: `${_.last(nextState.scoredWords).string.length}X POINTS`,
    multiplier: _.last(nextState.scoredWords).string.length,
    meets_conditions:
      nextState.scoredWords.length >= 2 &&
      _.last(nextState.scoredWords).string.length > 3 &&
      _.last(nextState.scoredWords).string.length === _.last(_.initial(nextState.scoredWords)).string.length,
  },
]

const speedBonuses = nextState => [
  {
    title: 'On The Fly',
    description: `Score more than 20 words per minute to maintain`,
    effect: '2X POINTS',
    meets_conditions:
      nextState.scoredWords.length > 4 &&
      nextState.wpm >= 15 &&
      nextState.wpm < 25,
    multiplier: 2,
    required_wpm: 15,
  },
  {
    title: 'Quicker Thinker',
    description: `Score more than 25 words per minute`,
    effect: '4X POINTS',
    meets_conditions:
      nextState.scoredWords.length > 4 &&
      nextState.wpm >= 25 &&
      nextState.wpm < 35,
    multiplier: 4,
    required_wpm: 25,
  },
  {
    title: 'Speed Demon',
    description: `Score more than 35 words per minute`,
    effect: '6X POINTS',
    meets_conditions:
      nextState.scoredWords.length > 4 &&
      nextState.wpm >= 35,
    multiplier: 6,
    required_wpm: 35,
  },
]