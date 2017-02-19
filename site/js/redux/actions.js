import Immutable from 'immutable'
import {dispatch, tightenDispatch, getState, asyncAction} from './store'
import config from '../config'
import axios from 'axios'

const get = (...getIn) => getState('app', ...getIn)
const send = tightenDispatch('cheekySet')

//----------------------------------------------------------------
export const init = asyncAction(() => {
  // console.log('config', config)

  if(config.isDevelopment) {
    document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] +
    ':35729/livereload.js?snipver=1"></' + 'script>')
  }
})

export const set = asyncAction(obj => {
  send(obj)
})

export const fetchCards = asyncAction(() => {
  if(get('cards'))
    return
  
  axios.get('/cards.json')
    .then(res => {
      send({cards: res.data})
    })
})