import { html, render } from 'lit-html'
import axis from '../components/axis'

class TestGraph extends HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    render(this.render(), this.shadowRoot)
  }

  render () {
    return html`
      <style>
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
      </style>
      <p>test</p>
      <svg width="500" height="60">
        ${axis()}
      </svg>
    `
  }
}

customElements.define('test-graph', TestGraph)
