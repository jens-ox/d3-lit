import { LitElement, html, property } from 'lit-element'
import { line, curveLinear, area } from 'd3-shape'
import constants from '../constants'

const hexToRgba = (hex, opacity) => {
  hex = hex.charAt('#') ? hex.substr(1) : hex
  const bigint = parseInt(hex, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255

  return `rgba(${r},${g},${b},${opacity})`
}

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
  @property({ type: Array }) defined = []
  @property({ type: Array }) area = []
  @property({ type: Function }) areaOpacity = () => 0.4

  get lineObject () {
    return line()
      .x(d => this.xScale(this.xAccessor(d)))
      .y(d => this.yScale(this.yAccessor(d)))
      .curve(this.curve)
  }

  get areaObject () {
    return area()
      .x(d => this.xScale(this.xAccessor(d)))
      .y1(d => this.yScale(this.yAccessor(d)))
      .y0(() => this.yScale(0))
      .curve(this.curve)
  }

  render () {
    // check if data has correct format
    if (this.data.some(dataArray => !Array.isArray(dataArray))) throw new Error('data needs to be array of data arrays')
    return html`
      <canvas width=${this.width} height=${this.height} id="canvas"></canvas>
    `
  }

  updated () {
    const ctx = this.shadowRoot.getElementById('canvas').getContext('2d')
    ctx.translate(0.5, 0.5)
    this.data.forEach((dataArray, i) => {
      const lineInstance = this.lineObject
        .defined(d => this.yAccessor(d) === null
          ? false
          : this.defined[i] ? this.defined[i](d) : true)
        .context(ctx)
      const areaInstance = this.areaObject
        .defined(d => this.yAccessor(d) === null
          ? false
          : this.defined[i] ? this.defined[i](d) : true)
        .context(ctx)
      ctx.beginPath()
      lineInstance(dataArray)
      ctx.lineWidth = 1.5
      ctx.strokeStyle = this.colors[i]
      ctx.stroke()
      ctx.beginPath()
      areaInstance(dataArray)
      ctx.fillStyle = hexToRgba(this.colors[i], this.areaOpacity(i))
      ctx.fill()
    })
    ctx.translate(-0.5, -0.5)
  }
}

customElements.define('line-container', LineContainer)
