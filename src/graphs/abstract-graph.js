import constants from '../constants'
import AbstractComponent from '../components/abstract-component'

export default class AbstractGraph extends AbstractComponent {
  _width = 0
  _height = 0
  _margin = { top: 10, left: 60, right: 20, bottom: 40 }
  _buffer = 10
  _markers = []
  _baselines = []
  _colors = []
  _xScale = null
  _yScale = null
  _xAxis = null
  _yAxis = null
  _showTooltip = true
  _tooltipFunction = null
  _legend = null
  _brush = null
  _data = null

  get isSingleObject () { return !Array.isArray(this.data) }
  get isArrayOfArrays () { return !this.data.some(dataArray => !Array.isArray(dataArray)) }

  get top () { return this.margin.top }
  get left () { return this.margin.left }
  get bottom () { return this.height - this.margin.bottom }

  get plotTop () { return this.top + this.buffer }
  get plotLeft () { return this.left + this.buffer }

  get innerWidth () {
    return this.width - this.margin.left - this.margin.right - 2 * this.buffer
  }

  get innerHeight () {
    return this.height - this.margin.top - this.margin.bottom - 2 * this.buffer
  }

  computeAxisType (accessor) {
    const flatData = this.data.flat()
    const value = accessor(flatData[0])

    return value instanceof Date
      ? constants.axisFormat.date
      : constants.axisFormat.number
  }
}
