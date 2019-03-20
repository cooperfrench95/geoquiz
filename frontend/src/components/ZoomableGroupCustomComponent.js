import React, { Component } from "react";

function isChildOfType(child, expectedTypes) {
    return expectedTypes.indexOf(child.props.componentIdentifier) !== -1
}
function createNewChildren(children, props) {
    if (!children) return
    if (!children.length) {
      return isChildOfType(children, ["Geographies"]) ? React.cloneElement(children, {
        projection: props.projection,
      }) : (isChildOfType(children, ["Group", "Markers", "Lines", "Annotations", "Annotation", "Graticule"]) ?
      React.cloneElement(children, {
        projection: props.projection,
        zoom: props.zoom,
        width: props.width,
        height: props.height,
        groupName: props.groupName,
        itemName: props.itemName,
      }) : children)
    }
    else {
      return children.map((child, i) => {
        if (!child) return null;
        return isChildOfType(child, ["Geographies"]) ?
          React.cloneElement(child, {
            key: `zoomable-child-${i}`,
            projection: props.projection,
          }) : (isChildOfType(child, ["Group", "Markers", "Lines", "Annotations", "Annotation", "Graticule"]) ?
          React.cloneElement(child, {
            key: `zoomable-child-${i}`,
            projection: props.projection,
            zoom: props.zoom,
            width: props.width,
            height: props.height,
            groupName: props.groupName,
            itemName: props.itemName,
          }) : child)
      })
    }
}
function computeBackdrop(projection, backdrop) {
    const canRotate = projection.rotate
    const originalRotation = canRotate ? projection.rotate() : null
  
    const tl = canRotate
      ? projection.rotate([0,0,0])([backdrop.x[0],backdrop.y[0]])
      : projection([backdrop.x[0],backdrop.y[0]])
  
    const br = canRotate
      ? projection.rotate([0,0,0])([backdrop.x[1],backdrop.y[1]])
      : projection([backdrop.x[1],backdrop.y[1]])
  
    const x = tl ? tl[0] : 0
    const x0 = br ? br[0] : 0
  
    const y = tl ? tl[1] : 0
    const y0 = br ? br[1] : 0
  
    const width = x0 - x
    const height = y0 - y
  
    if (originalRotation) projection.rotate(originalRotation)
  
    return { x, y, width, height }
}
function calculateResizeFactor(actualDimension, baseDimension) {
    if (actualDimension === 0) return 1;
    return 1 / 100 * (100 / actualDimension * baseDimension)
  }
  
function calculateMousePosition(direction, projection, props, zoom, resizeFactor, center = props.center, width = props.width, height = props.height) {
    const reference = { x: 0, y: 1 }
    const canRotate = !!projection.rotate
    const reverseRotation = !!canRotate ? projection.rotate().map(item => -item) : false
    const point = !!reverseRotation
      ? projection.rotate(reverseRotation)([-center[0],-center[1]])
      : projection([center[0],center[1]])
    const returner = point
      ? (point[reference[direction]] - (reference[direction] === 0 ? width : height) / 2) * zoom * (1/resizeFactor)
      : 0
    if (canRotate) projection.rotate([-reverseRotation[0],-reverseRotation[1],-reverseRotation[2]])
    return !!reverseRotation ? returner : -returner
}

class ZoomableGroupCustom extends Component {
  constructor(props) {
    super(props)

    const backdrop = computeBackdrop(props.projection, props.backdrop)

    this.state = {
      mouseX: calculateMousePosition("x", props.projection, props, props.zoom, 1),
      mouseY: calculateMousePosition("y", props.projection, props, props.zoom, 1),
      mouseXStart: 0,
      mouseYStart: 0,
      isPressed: false,
      resizeFactorX: 1,
      resizeFactorY: 1,
      backdrop: {
        width: Math.round(backdrop.width),
        height: Math.round(backdrop.height),
        x: Math.round(backdrop.x),
        y: Math.round(backdrop.y),
      },
    }

    this.handleMouseMove = this.handleMouseMove.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)
    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleTouchStart = this.handleTouchStart.bind(this)
    this.handleTouchMove = this.handleTouchMove.bind(this)
    this.handleResize = this.handleResize.bind(this)

  }
  handleMouseMove({ pageX, pageY }) {
    if (this.props.disablePanning) return
    if (!this.state.isPressed) return
    this.setState({
      mouseX: pageX - this.state.mouseXStart,
      mouseY: pageY - this.state.mouseYStart,
    })
  }
  handleTouchMove({ touches }) {
    this.handleMouseMove(touches[0])
  }
  handleMouseUp() {
    if (this.props.disablePanning) return
    if (!this.state.isPressed) return
    this.setState({
      isPressed: false,
    })
    if (!this.props.onMoveEnd) return
    const { mouseX, mouseY, resizeFactorX, resizeFactorY } = this.state
    const { zoom, width, height, projection, onMoveEnd } = this.props
    const x = width / 2 - (mouseX * resizeFactorX / zoom)
    const y = height / 2 - (mouseY * resizeFactorY / zoom)
    const newCenter = projection.invert([ x, y ])
    onMoveEnd(newCenter)
  }
  handleMouseDown({ pageX, pageY }) {
    if (this.props.disablePanning) return
    const { mouseX, mouseY, resizeFactorX, resizeFactorY } = this.state
    const { zoom, width, height, projection, onMoveStart } = this.props
    this.setState({
      isPressed: true,
      mouseXStart: pageX - mouseX,
      mouseYStart: pageY - mouseY,
    })
    if (!onMoveStart) return
    const x = width / 2 - (mouseX * resizeFactorX / zoom)
    const y = height / 2 - (mouseY * resizeFactorY / zoom)
    const currentCenter = projection.invert([ x, y ])
    onMoveStart(currentCenter)
  }
  handleTouchStart({ touches }) {
    if (touches.length > 1) {
      this.handleMouseDown(touches[0])
    }
    else {
      this.handleMouseUp()
    }
  }
  preventTouchScroll(evt) {
    if (evt.touches.length > 1) {
      evt.preventDefault()
    }
  }
  componentWillReceiveProps(nextProps) {
    const { mouseX, mouseY, resizeFactorX, resizeFactorY } = this.state
    const { center, zoom } = this.props

    const zoomFactor = nextProps.zoom / zoom
    const centerChanged = JSON.stringify(nextProps.center) !== JSON.stringify(center)

    this.setState({
      zoom: nextProps.zoom,
      mouseX: centerChanged ? calculateMousePosition("x", nextProps.projection, nextProps, nextProps.zoom, resizeFactorX) : mouseX * zoomFactor,
      mouseY: centerChanged ? calculateMousePosition("y", nextProps.projection, nextProps, nextProps.zoom, resizeFactorY) : mouseY * zoomFactor,
    })
  }
  handleResize() {
    const { width, height } = this.props

    const resizeFactorX = calculateResizeFactor(this.zoomableGroupNode.parentNode.getBoundingClientRect().width, width)
    const resizeFactorY = calculateResizeFactor(this.zoomableGroupNode.parentNode.getBoundingClientRect().height, height)

    const xPercentageChange = 1 / resizeFactorX * this.state.resizeFactorX
    const yPercentageChange = 1 / resizeFactorY * this.state.resizeFactorY

    this.setState({
      resizeFactorX: resizeFactorX,
      resizeFactorY: resizeFactorY,
      mouseX: this.state.mouseX * xPercentageChange,
      mouseY: this.state.mouseY * yPercentageChange,
    })
  }
  componentDidMount() {
    const { width, height, projection, zoom } = this.props

    const resizeFactorX = calculateResizeFactor(this.zoomableGroupNode.parentNode.getBoundingClientRect().width, width)
    const resizeFactorY = calculateResizeFactor(this.zoomableGroupNode.parentNode.getBoundingClientRect().height, height)

    this.setState({
      resizeFactorX: resizeFactorX,
      resizeFactorY: resizeFactorY,
      mouseX: calculateMousePosition("x", projection, this.props, zoom, resizeFactorX),
      mouseY: calculateMousePosition("y", projection, this.props, zoom, resizeFactorY),
    })

    window.addEventListener("resize", this.handleResize)
    window.addEventListener("mouseup", this.handleMouseUp)
    this.zoomableGroupNode.addEventListener("touchmove", this.preventTouchScroll)
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize)
    window.removeEventListener("mouseup", this.handleMouseUp)
    this.zoomableGroupNode.removeEventListener("touchmove", this.preventTouchScroll)
  }
  render() {
    const {
      width,
      height,
      zoom,
      style,
      children,
    } = this.props

    const {
      mouseX,
      mouseY,
      resizeFactorX,
      resizeFactorY,
    } = this.state

    return (
      <g className="rsm-zoomable-group"
         ref={ zoomableGroupNode => this.zoomableGroupNode = zoomableGroupNode }
         transform={`
           translate(
             ${ Math.round((width / 2 + resizeFactorX * mouseX) * 100) / 100 }
             ${ Math.round((height / 2 + resizeFactorY * mouseY) * 100) / 100 }
           )
           scale(${ zoom })
           translate(${ -width / 2 } ${ -height / 2 })
         `}
         onMouseMove={ this.handleMouseMove }
         onMouseUp={ this.handleMouseUp }
         onMouseDown={ this.handleMouseDown }
         onTouchStart={ this.handleTouchStart }
         onTouchMove={ this.handleTouchMove }
         onTouchEnd={ this.handleMouseUp }
         style={ style }
      >
        <rect
          x={ this.props.x }
          y={ this.state.backdrop.y }
          width={ this.props.desiredWidth }
          height={ this.props.desiredHeight }
          fill="transparent"
          style={{ strokeWidth: 0 }}
        />
        { createNewChildren(children, this.props) }
      </g>
    )
  }
}

ZoomableGroupCustom.defaultProps = {
  center: [ 0, 0 ],
  backdrop: {
    x: [-179.9, 179.9],
    y: [89.9, -89.9],
  },
  zoom: 1,
  disablePanning: false,
}

export default ZoomableGroupCustom