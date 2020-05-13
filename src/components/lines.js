import { LitElement, html, property } from 'lit-element'
import { line, curveLinear } from 'd3-shape'
import constants from '../../../metrics-graphics/packages/lib/src/js/misc/constants'

class LineContainer extends LitElement {
  @property({ type: Number }) width = 100
  @property({ type: Number }) height = 100
  @property({ type: Array }) data = []
  @property({ type: Function }) xAccessor = x => x.date
  @property({ type: Function }) yAccessor = x => x.value
  @property({ type: Function }) xScale = null
  @property({ type: Function }) yScale = null
  @property({ type: Function }) curve = curveLinear
  @property({ type: Array }) colors = constants.defaultColors
  @property({ type: Function }) defined = () => true

  get lineObject () {
    return line()
      .defined(d => this.yAccessor(d) === null ? false : this.defined(d))
      .x(d => this.xScale(this.xAccessor(d)))
      .y(d => this.yScale(this.yAccessor(d)))
      .curve(this.curve)
  }

  render () {
    return html`
      <canvas width=${this.width} height=${this.height} id="canvas"></canvas>
    `
  }

  updated () {
    const ctx = this.shadowRoot.getElementById('canvas').getContext('2d')
    const lineInstance = this.lineObject.context(ctx)
    ctx.translate(0.5, 0.5)
    ctx.beginPath()
    lineInstance(this.data)
    ctx.lineWidth = 1.5
    ctx.strokeStyle = 'steelblue'
    ctx.stroke()
    ctx.translate(-0.5, -0.5)
  }
}

customElements.define('line-container', LineContainer)
