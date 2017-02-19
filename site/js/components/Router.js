import React from 'react'
import ReactDOM from 'react-dom'

import { Router, IndexRoute, Route, Link, browserHistory, hashHistory, Redirect} from 'react-router'

import Navigation from './Navigation'
import Home from './Home'

class _Router extends React.Component {
  render() {
    return (
      <Router history={hashHistory}>
        <Route path="/" component={Navigation}>
          <IndexRoute component={Home}/>
          <Redirect from='*' to='/'/>
        </Route>
      </Router>
    )
  }
}

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../redux/actions'
export default connect(
  (state) => {
    return {
      
    }
  },
  (dispatch) => {
    return {
      actions: bindActionCreators(actions, dispatch)
    }
  }
)(_Router)