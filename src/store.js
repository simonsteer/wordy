import { createStore, applyMiddleware } from 'redux';

import reducers from './reducers';

const middleware = applyMiddleware()

export default createStore(reducers, {}, middleware)