import letters from '../config/letters'
import sample from 'lodash/sample'

const getRandomLetter = unweighted => {
  if (unweighted) {
    return sample(Object.keys(letters))
  }

  const weightedArray = []
  Object.keys(letters).forEach(l => {
    for (let i = 0; i < letters[l].weight; i++) {
      weightedArray.push(l)
    }
  })
  return sample(weightedArray)
}

export default getRandomLetter
