import { html, render } from 'lit-html'
import { scaleLinear } from 'd3-scale'
import axis from '../components/axis'

export default class AbstractGraph extends HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    render(this.render(), this.shadowRoot)
  }

  get width () {
    return parseInt(this.getAttribute('width'))
  }

  get height () {
    return parseInt(this.getAttribute('height'))
  }

  get innerWidth () {
    return this.width - 50
  }

  get innerHeight () {
    return this.height - 50
  }

  render () {
    const xScale = scaleLinear().domain([0, 100]).range([0, this.innerWidth])
    const yScale = scaleLinear().domain([0, 100]).range([this.innerHeight, 0])
    return html`
      <style>
        :host {
          display: inline-block;
        }
        .domain {
          fill: none;
          stroke: black;
        }
        text {
          fill: currentColor;
          font-size: 10;
        }
        line {
          fill: none;
          stroke: black;
        }
      </style>
      <svg viewBox=${`0 0 ${this.width} ${this.height}`} width=${this.width} height=${this.height}>
        <g transform="translate(20,20)">
          ${axis({ orientation: 4, scale: yScale })}
        </g>
        <g transform=${`translate(20, ${this.innerHeight + 20})`}>
          ${axis({ orientation: 3, scale: xScale })}
        </g>
      </svg>
    `
  }
}

customElements.define('abstract-graph', AbstractGraph)
