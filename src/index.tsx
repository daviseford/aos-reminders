import React from 'react'
import { render } from 'react-dom'
import 'bootstrap/dist/css/bootstrap.css'
import './index.css'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import { visibilityFilter, todos } from './ducks'
import * as serviceWorker from './serviceWorker'
import App from './components/App'

const store = createStore(
  combineReducers({
    todos: todos.reducer,
    visibilityFilter: visibilityFilter.reducer,
  })
)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
