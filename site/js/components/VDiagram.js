import GO from 'gojs'
const $ = GO.GraphObject.make

//------------------------------------------------------------

const NODE_STYLE = {
  fill: $(GO.Brush, "Linear", { 0: '#4527A0', 1: '#673AB7' }),
  stroke: '#B0BEC5',
  opacity: 0.7,
  strokeWidth: 2,
  parameter1: 20, //borderRadius
}

const NODE_FONT_STYLE = {
  font: 'bold 11pt helvetica, bold arial, sans-serif',
  stroke: '#CFD8DC',
  editable: true,  // editing the text automatically updates the model data
}

const NODE_ACTIVE_STYLE = {
  fill: null,
  stroke: '#536DFE',
  strokeWidth: 2,
}

const LINE_COLOR = '#B0BEC5'

const LINK_LINE_STYLE = {
  strokeWidth: 2,
  stroke: LINE_COLOR,
  opacity: 0.4,
}

const LINK_ARROW_HEAD_STYLE = {
  toArrow: 'standard',
  stroke: LINE_COLOR,
  fill: LINE_COLOR,
}

const LINK_BG_STYLE = {
  //fill: $(GO.Brush, "Radial", { 0: "rgb(240, 240, 240)", 0.3: "rgb(240, 240, 240)", 1: "rgba(240, 240, 240, 0)" } ),
  fill: null,
  stroke: null,
}

const LINK_TEXT_STYLE = {
  font: '9pt helvetica, arial, sans-serif',
  stroke: '#CFD8DC',
  margin: 4,
  textAlign: 'center',
  editable: true,  // enable in-place editing
}


//--------------------------------------------------------------

export default {
  newDiagram,
}

export function newDiagram(divId) {
  const diagram = $(GO.Diagram, divId,  // must name or refer to the DIV HTML element
  {
    // start everything in the middle of the viewport
    initialContentAlignment: GO.Spot.Center,
    // have mouse wheel events zoom in and out instead of scroll up and down
    'toolManager.mouseWheelBehavior': GO.ToolManager.WheelZoom,
    // support double-click in background creating a new node
    'clickCreatingTool.archetypeNodeData': { text: "new node" },
    // enable undo & redo
    'undoManager.isEnabled': true,
  })
  setNodeTemplate(diagram)
  setActiveNodeTemplate(diagram)
  setLinkTemplate(diagram)
  return diagram
}

function setNodeTemplate(diagram) {
  diagram.nodeTemplate =
    $(GO.Node, 'Auto',
      new GO.Binding('location', 'loc', GO.Point.parse).makeTwoWay(GO.Point.stringify),
      // define the node's outer shape, which will surround the TextBlock
      $(GO.Shape, 'RoundedRectangle', Object.assign({}, NODE_STYLE, {
          portId: '',  // this Shape is the Node's port, not the whole Node
          fromLinkable: true, fromLinkableSelfNode: true, fromLinkableDuplicates: true,
          toLinkable: true, toLinkableSelfNode: true, toLinkableDuplicates: true,
          cursor: 'pointer'
        })),
      $(GO.TextBlock, NODE_FONT_STYLE,
        new GO.Binding('text').makeTwoWay())
    )
}

function setActiveNodeTemplate(diagram) {
  // unlike the normal selection Adornment, this one includes a Button
  diagram.nodeTemplate.selectionAdornmentTemplate =
    $(GO.Adornment,'Spot',
      $(GO.Panel, 'Auto',
        $(GO.Shape, NODE_ACTIVE_STYLE),
        $(GO.Placeholder)  // a Placeholder sizes itself to the selected Node
      ),
      // the button to create a "next" node, at the top-right corner
      $('Button',
        {
          alignment: GO.Spot.TopRight,
          click: addNodeAndLink  // this function is defined below
        },
        $(GO.Shape, 'PlusLine', { width: 6, height: 6 })
      ) // end button
    ) // end Adornment

  // clicking the button inserts a new node to the right of the selected node,
  // and adds a link to that new node
  function addNodeAndLink(e, obj) {
    var adornment = obj.part
    var diagram = e.diagram
    diagram.startTransaction('Add State')

    // get the node data for which the user clicked the button
    var fromNode = adornment.adornedPart
    var fromData = fromNode.data
    // create a new "State" data object, positioned off to the right of the adorned Node
    var toData = { text: 'new' }
    var p = fromNode.location.copy()
    p.x += 200
    toData.loc = GO.Point.stringify(p)  // the "loc" property is a string, not a Point object
    // add the new node data to the model
    var model = diagram.model
    model.addNodeData(toData)

    // create a link data from the old node data to the new node data
    var linkdata = {
      from: model.getKeyForNodeData(fromData),  // or just: fromData.id
      to: model.getKeyForNodeData(toData),
      text: 'transition'
    }
    // and add the link data to the model
    model.addLinkData(linkdata)

    // select the new Node
    var newnode = diagram.findNodeForData(toData)
    diagram.select(newnode)

    diagram.commitTransaction('Add State')

    // if the new node is off-screen, scroll the diagram to show the new node
    diagram.scrollToRect(newnode.actualBounds)
  }
}

function setLinkTemplate(diagram) {
  // replace the default Link template in the linkTemplateMap
  diagram.linkTemplate =
    $(GO.Link,  // the whole link panel
      {
        curve: GO.Link.Bezier, adjusting: GO.Link.Stretch,
        reshapable: true, relinkableFrom: true, relinkableTo: true,
        toShortLength: 3
      },
      new GO.Binding("points").makeTwoWay(),
      new GO.Binding("curviness"),
      $(GO.Shape, LINK_LINE_STYLE),
      $(GO.Shape, LINK_ARROW_HEAD_STYLE),
      $(GO.Panel, 'Auto',
        $(GO.Shape, LINK_BG_STYLE),
        $(GO.TextBlock, 'transition', LINK_TEXT_STYLE, // the label text
          // editing the text automatically updates the model data
          new GO.Binding('text').makeTwoWay()) //two way binding?
      )
    )
}