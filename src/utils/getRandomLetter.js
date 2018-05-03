import letters from '../config/letters'
import _ from 'lodash'

const getRandomLetter = unweighted => {
  if (unweighted) {
     return _.sample(Object.keys(letters))
  }

  const weightedArray = []
  Object.keys(letters).forEach(l => {
    for (let i = 0; i < letters[l].weight; i++) {
      weightedArray.push(l)
    }
  })
  return _.sample(weightedArray)
}

export default getRandomLetter
