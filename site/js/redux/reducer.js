import Immutable from 'immutable'

const initialState = Immutable.fromJS({
  cards: null,
})

function appReducer(state = initialState, action) {
  const {type, payload} = action

  switch (type) {
  case 'cheekySet':
    for(let key in payload) {
      if(!state.has(key) || !state.get(key))
        state = state.set(key, Immutable.fromJS(payload[key]))
      else if(payload[key] == null || Immutable.List.isList(payload[key]) || Immutable.Set.isSet(payload[key]))
        state = state.setIn([key], payload[key])
      else
        state = state.mergeIn([key], payload[key])

      if(key == 'bundleQuery')
        localStorage[key] = state.get('bundleQuery')
      else if(key == 'filters')
        localStorage[key] = JSON.stringify(state.get('filters').toJS())
    }
    // console.log('state', state, state.get('filters'), payload)
    return state
  case 'clean':
    return initialState
  }

  return state
}

export default appReducer