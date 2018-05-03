import React from 'react'
import Wordy from './src/containers/Wordy'

import store from './src/store'
import { Provider } from 'react-redux';

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Wordy />
      </Provider>
    )
  }
}

