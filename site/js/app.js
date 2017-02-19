import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import {createAppStore} from './redux/store'
import * as actions from './redux/actions'
import Router from './components/Router'

const store = createAppStore()
store.dispatch(actions.init())

class App extends React.Component {
  render () {
    return (
      <Provider store={store}>
        <Router/>
      </Provider>
    )
  }
}

ReactDOM.render(
  <App/>,
  document.getElementsByClassName('body-content')[0]
)