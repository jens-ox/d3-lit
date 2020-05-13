import { LitElement, html } from 'lit-element'
import { line } from 'd3-shape'

class LineContainer extends LitElement {
  render () {
    return html`
      <canvas style="width:100%;height:100%" id="canvas"></canvas>
    `
  }

  updated () {
    const ctx = this.shadowRoot.getElementById('canvas').getBoundingClientRect('2d')
    console.log(ctx)
  }
}

customElements.define('line-container', LineContainer)
