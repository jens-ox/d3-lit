import {
  LitElement,
  html,
  svg,
  css
} from 'lit-element'

import { scaleLinear } from 'd3-scale'

// constants
const TOP = 1
const RIGHT = 2
const BOTTOM = 3
const LEFT = 4

class Axis extends LitElement {
  static get properties () {
    return {
      orientation: Number,
      scale: Object,
      tickArguments: Array,
      tickValues: Array,
      tickFormat: Function,
      tickSize: Number,
      tickSizeInner: Number,
      tickSizeOuter: Number,
      tickPadding: Number
    }
  }

  static get styles () {
    return css`
    .domain {
      fill: none;
      stroke: black;
    }
    text {
      fill: currentColor;
      font-size: 10;
      font-family: 'sans-serif';
    }
    line {
      fill: none;
      stroke: black;
    }
    `
  }

  constructor () {
    super()
    this.orientation = BOTTOM
    this.scale = scaleLinear().domain([0, 100]).range([0, 400])
    this.tickArguments = []
    this.tickValues = null
    this.tickFormat = null
    this.tickSize = 6
    this.tickSizeInner = 6
    this.tickSizeOuter = 6
    this.tickPadding = 3
  }

  get scale () { return this._scale }
  get tickArguments () { return this._tickArguments }
  get tickValues () { return this._tickValues }
  get tickFormat () { return this._tickFormat }
  get tickSize () { return this._tickSizeInner }
  get tickSizeInner () { return this._tickSizeInner }
  get tickSizeOuter () { return this._tickSizeOuter }
  get tickPadding () { return this._tickPadding }
  get isHorizontal () { return [TOP, BOTTOM].includes(this.orientation) }
  get transform () { return this.isHorizontal ? this.translateX : this.translateY }

  // "complex" getters
  get k () {
    return [TOP, LEFT].includes(this.orientation) ? -1 : 1
  }

  get x () {
    return this.isHorizontal ? 'y' : 'x'
  }

  get values () {
    return this.tickValues == null
      ? (this.scale.ticks
        ? this.scale.ticks.apply(this.scale, this.tickArguments)
        : this.scale.domain())
      : this.tickValues
  }

  get format () {
    return this.tickFormat == null
      ? (this.scale.tickFormat
        ? this.scale.tickFormat.apply(this.scale, this.tickArguments)
        : d => d)
      : this.tickFormat
  }

  get spacing () {
    return Math.max(this.tickSizeInner, 0) + this.tickPadding
  }

  get range () {
    return this.scale.range()
  }

  get range0 () {
    return +this.range[0] + 0.5
  }

  get range1 () {
    return +this.range[this.range.length - 1] + 0.5
  }

  get position () {
    return (this.scale.bandwidth
      ? this.center
      : this.number)(this.scale.copy())
  }

  get pathData () {
    return [LEFT, RIGHT].includes(this.orientation)
      ? this.tickSizeOuter
        ? `M${this.k * this.tickSizeOuter},${this.range0}H0.5V${this.range1}H${this.k * this.tickSizeOuter}`
        : `M0.5${this.range0}V${this.range1}`
      : this.tickSizeOuter
        ? `M${this.range0},${this.k * this.tickSizeOuter}V0.5H${this.range1}V${this.k * this.tickSizeOuter}`
        : `M${this.range0},0.5H${this.range1}`
  }

  get textAnchor () {
    return this.orientation === RIGHT
      ? 'start'
      : this.orientation === LEFT
        ? 'end'
        : 'middle'
  }

  get dy () {
    return this.orientation === TOP
      ? '0em'
      : this.orientation === BOTTOM
        ? '0.71em'
        : '0.32em'
  }

  set scale (x) { this._scale = x }
  set tickArguments (x = []) { this._tickArguments = x }
  set tickValues (x = []) { this._tickValues = x }
  set tickFormat (x) { this._tickFormat = x }
  set tickSizeInner (x) { this._tickSizeInner = x }
  set tickSizeOuter (x) { this._tickSizeOuter = x }
  set tickPadding (x) { this._tickPadding = +x }
  set ticks (x) { this._tickArguments = x }

  set tickSize (x) {
    this._tickSizeInner = x
    this._tickSizeOuter = x
  }

  translateX (x) { return 'translate(' + (x + 0.5) + ',0)' }
  translateY (y) { return 'translate(0,' + (y + 0.5) + ')' }
  number (scale) { return d => +scale(d) }

  center (scale) {
    let offset = Math.max(0, scale.bandwidth() - 1) / 2 // Adjust for 0.5px offset.
    if (scale.round()) offset = Math.round(offset)
    return d => +scale(d) + offset
  }

  render () {
    return html`
    <svg width="500" height="60">
      <g
        class="lit-axis"
        text-anchor="${this.textAnchor}"
        transform="translate(10,10)"
      >
        <path
          class="domain"
          d="${this.pathData}"
        ></path>
        ${this.values.map(d => svg`
          <g
            class="tick"
            transform="${this.transform(this.position(d))}"
          >
            ${this.x === 'x'
              ? svg`<line x2="${this.k * this.tickSizeInner}"></line>`
              : svg`<line y2="${this.k * this.tickSizeInner}"></line>`
            }
            ${this.x === 'x'
              ? svg`<text x="${this.k * this.spacing}" dy="${this.dy}">${this.format(d)}</text>`
              : svg`<text y="${this.k * this.spacing}" dy="${this.dy}">${this.format(d)}</text>`
            }
          </g>
        `)}
      </g>
    </svg>
    `
  }
}

customElements.define('d3-axis', Axis)
