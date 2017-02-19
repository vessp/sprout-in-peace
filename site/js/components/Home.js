import React from 'react'
import axios from 'axios'
import GO from 'gojs'
const $ = GO.GraphObject.make

import VDiagram from './VDiagram'


var myDiagram

class Home extends React.Component {
  constructor (props) {
    super (props)

    this.state = {
      isDirty: false,
      isSaving: false,
    }
  }

  componentDidMount () {
    myDiagram = VDiagram.newDiagram('diagramDiv')
    myDiagram.addDiagramListener('Modified', () => this.setState({isDirty:myDiagram.isModified}))

    this.load()
  }

  save() {
    if(this.state.isSaving)
      return

    this.setState({isSaving:true})
    axios.post('/save/data.json', myDiagram.model.toJson())
      .then(res => {
        this.setState({isDirty:false, isSaving:false})
      })
  }
  load() {
    axios.get('/load/data.json')
      .then(res => {
        myDiagram.model = GO.Model.fromJson(res.data)
        this.setState({isDirty:false})
      })
  }

  render () {
    const {isDirty, isSaving} = this.state

    return (
      <div className='home'>
        <div id='diagramDiv'/>
        <div className='button-bar'>
          <button
            className={'btn btn-default' + (isDirty?'':' disabled')}
            onClick={() => this.save()}>
            <i className={'fa fa-save' + (isSaving?' fa-spin':'')}/>
            </button>
          <button
            className='btn btn-default fa fa-refresh'
            onClick={() => this.load()}/>
        </div>
      </div>
      )
  }
}

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../redux/actions'
export default connect(
  (state) => {
    return {
      data: []
    }
  },
  (dispatch) => {
    return {
      actions: bindActionCreators(actions, dispatch)
    }
  }
)(Home)