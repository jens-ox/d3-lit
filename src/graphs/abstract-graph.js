import { html, LitElement, property } from 'lit-element'
import { styleMap } from 'lit-html/directives/style-map'
import { scaleLinear } from 'd3-scale'
import axis from '../components/axis'
import defaultStyle from '../style'

export default class AbstractGraph extends LitElement {
  @property({ type: Number }) width = 0
  @property({ type: Number }) height = 0
  @property({ type: Object }) margin = { top: 10, left: 60, right: 20, bottom: 40 }
  @property({ type: Number }) buffer = 10
  @property({ type: Array }) data = []
  @property({ type: Array }) markers = []
  @property({ type: Array }) baselines = []
  @property({ type: Function }) xAccessor = x => x.date
  @property({ type: Function }) yAccessor = x => x.value
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

  render () {
    const xScale = scaleLinear().domain([0, 100]).range([0, this.innerWidth])
    const yScale = scaleLinear().domain([0, 100]).range([this.innerHeight, 0])
    const childStyle = {
      position: 'absolute',
      top: `${this.plotTop}px`,
      left: `${this.plotLeft}px`,
      width: `${this.innerWidth}px`,
      height: `${this.innerHeight}px`
    }
    return html`
      <div class="container-main">
        <svg
          viewBox=${`0 0 ${this.width} ${this.height}`}
          width=${this.width}
          height=${this.height}
        >
          <defs>
            <clipPath id="clip-path">
              <rect width=${this.innerWidth} height=${this.innerHeight} />
            </clipPath>
          </defs>

          <!-- content -->
          <g>

            <!-- y axis -->
            <g transform=${`translate(${this.left},${this.top})`}>
              ${axis({ orientation: 4, scale: yScale })}
            </g>
    
            <!-- x axis -->
            <g transform=${`translate(${this.left}, ${this.innerHeight + this.buffer})`}>
              ${axis({ orientation: 3, scale: xScale })}
            </g>
          </g>
        </svg>
        <div className="container-child" style=${styleMap(childStyle)}>
          <slot />
        </div>
      </div>
    `
  }
}

customElements.define('abstract-graph', AbstractGraph)
