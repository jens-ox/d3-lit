import { Delaunay as DelaunayObject } from 'd3-delaunay'
import { mouse } from 'd3-selection'
import { LitElement, property, html } from 'lit-element'

export default class Delaunay extends LitElement {
  @property({ type: Array }) points = []
  @property({ type: Function }) xScale = null
  @property({ type: Function }) yScale = null
  @property({ type: Function }) xAccessor = x => x.date
  @property({ type: Function }) yAccessor = x => x.value
  @property({ type: Function }) onPoint = null
  @property({ type: Function }) onLeave = null
  @property({ type: Function }) onClick = null
  @property({ type: Boolean }) nested = false
  @property({ type: Boolean }) aggregate = false
  @property({ type: Function }) defined = () => true

  aggregatedPoints = null
  delaunay = null

  get isNested () {
    return this.nested ?? (Array.isArray(this.points[0]) && this.points.length > 1)
  }

  firstUpdated () {
    this.points = this.isNested
      ? this.points.map((pointArray, arrayIndex) => pointArray
        .filter(p => !this.defined || this.defined(p))
        .map((point, index) => ({
          ...point,
          index,
          arrayIndex
        }))).flat(Infinity)
      : this.points.flat(Infinity)
        .filter(p => !this.defined || this.defined(p))
        .map((p, index) => ({ ...p, index }))

    // if points should be aggregated, hash-map them based on their x accessor value
    this.aggregatedPoints = !this.aggregate
      ? this.points.reduce((acc, val) => {
        const key = JSON.stringify(this.xAccessor(val))
        if (!acc.has(key)) {
          acc.set(key, [val])
        } else {
          acc.set(key, [val, ...acc.get(key)])
        }
        return acc
      }, new Map())
      : null

    this.delaunay = DelaunayObject.from(
      this.points.map(point => ([this.xAccessor(point), this.isNested && !this.aggregate ? this.yAccessor(point) : 0]))
    )
  }

  /**
   * Handle raw mouse movement inside the delaunay rect.
   * Finds the nearest data point(s) and calls onPoint.
   *
   * @param {Number} rawX raw x coordinate of the cursor.
   * @param {Number} rawY raw y coordinate of the cursor.
   * @returns {void}
   */
  gotPoint (rawX, rawY) {
    const x = this.xScale.invert(rawX)
    const y = this.yScale.invert(rawY)

    // find nearest point
    const index = this.delaunay.find(x, y)

    // if points should be aggregated, get all points with the same x value
    if (this.aggregate) {
      this.onPoint(this.aggregatedPoints.get(JSON.stringify(this.xAccessor(this.points[index]))))
    } else {
      this.onPoint([this.points[index]])
    }
  }

  /**
   * Handle raw mouse clicks inside the delaunay rect.
   * Finds the nearest data point(s) and calls onClick.
   *
   * @param {Number} rawX raw x coordinate of the cursor.
   * @param {Number} rawY raw y coordinate of the cursor.
   * @returns {void}
   */
  clickedPoint (rawX, rawY) {
    const x = this.xScale.invert(rawX)
    const y = this.yScale.invert(rawY)

    // find nearest point
    const index = this.delaunay.find(x, y)
    if (this.onClick) this.onClick({ ...this.points[index], index })
  }

  render () {
    const width = Math.abs(this.xScale.range()[0] - this.xScale.range()[1])
    const height = Math.abs(this.yScale.range()[0] - this.yScale.range()[1])

    return html`
      <div
        id="container"
        style=${`position:absolute;top:0;left:0;width:${width}px;height:${height}px`}
        width=${width}
        height=${height}
        @mousemove=${({ x, y }) => this.gotPoint(x, y)}
        @mouseleave=${() => { this.onLeave() }}
        @click=${() => {
          const rawCoords = mouse(this.shadowRoot.getElementById('container'))
          this.clickedPoint(rawCoords[0], rawCoords[1])
        }}
      ></div>
    `
  }
}

customElements.define('delaunay-container', Delaunay)
