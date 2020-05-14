import { LitElement, property } from 'lit-element'
import defaultStyle from '../style'
import constants from '../constants'

export default class AbstractGraph extends LitElement {
  @property({ type: Number }) width = 0
  @property({ type: Number }) height = 0
  @property({ type: Object }) margin = { top: 10, left: 60, right: 20, bottom: 40 }
  @property({ type: Number }) buffer = 10
  @property({ type: Array }) markers = []
  @property({ type: Array }) baselines = []
  @property({ type: Array }) colors = []
  @property({ type: Object }) xScale = {}
  @property({ type: Object }) yScale = {}
  @property({ type: Object }) xAxis = {}
  @property({ type: Object }) yAxis = {}
  @property({ type: Boolean }) showTooltip = true
  @property({ type: Function }) tooltipFunction = null
  @property({ type: Object }) legend = {}
  @property({ type: String }) brush = null

  static get styles () {
    return [defaultStyle]
  }

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
