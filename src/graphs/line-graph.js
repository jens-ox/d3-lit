import { html, property } from 'lit-element'
import { styleMap } from 'lit-html/directives/style-map'
import { extent } from 'd3-array'
import axis from '../components/axis'
import AbstractGraph from './abstract-graph'
import '../components/lines'
import '../components/delaunay'
import { curveLinear } from 'd3-shape'
import generateScale from '../generators/scale'
import constants from '../constants'

export default class LineGraph extends AbstractGraph {
  @property({ type: Function }) curve = curveLinear
  @property({ type: Number }) pointX = -1
  @property({ type: Number }) pointY = -1

  get extents () {
    console.log('getting extents')
    const flatData = this.data.flat()
    return {
      x: extent(flatData, this.xAccessor),
      y: extent(flatData, this.yAccessor)
    }
  }

  get normalizedData () {
    return this.isArrayOfArrays ? this.data : [this.data]
  }

  render () {
    console.log('render toggled')
    const xScale = generateScale({
      type: constants.scaleType.time,
      domain: this.extents.x,
      range: [0, this.innerWidth]
    })
    const yScale = generateScale({
      type: constants.scaleType.linear,
      domain: this.extents.y,
      range: [this.innerHeight, 0]
    })
    const childStyle = {
      position: 'absolute',
      top: `${this.plotTop}px`,
      left: `${this.plotLeft}px`
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
              ${axis({ orientation: 4, scale: yScale, buffer: this.buffer, tickFormat: this.computeAxisType(this.yAccessor) })}
            </g>
    
            <!-- x axis -->
            <g transform=${`translate(${this.left}, ${this.top + this.innerHeight + 2 * this.buffer})`}>
              ${axis({ orientation: 3, scale: xScale, buffer: this.buffer })}
            </g>
          </g>
        </svg>
        <div className="container-child" style=${styleMap(childStyle)}>
          <line-container
            width=${this.innerWidth}
            height=${this.innerHeight}
            .data=${this.normalizedData}
            .xAccessor=${this.xAccessor}
            .yAccessor=${this.yAccessor}
            .xScale=${xScale}
            .yScale=${yScale}
            .curve=${this.curve}
          ></line-container>
          <svg style="position:absolute;top:0;left:0" width=${this.innerWidth} height=${this.innerHeight}>
            <circle cx=${this.pointX} cy=${this.pointY} r="3"></circle>
          </svg>
          <delaunay-container
            .points=${this.data}
            .xAccessor=${this.xAccessor}
            .yAccessor=${this.yAccessor}
            .xScale=${xScale}
            .yScale=${yScale}
            .onPoint=${point => {
              console.log('got point: ', point)
              if (!point[0]) return
              this.pointX = xScale(this.xAccessor(point[0]))
              this.pointY = yScale(this.yAccessor(point[0]))
              console.log('point: ', this.pointX, this.pointY)
            }}
            .onLeave=${() => {
              this.pointX = -1
              this.pointY = -1
            }}
            .onClick=${point => { console.log('clicked point: ', point) }}
          ></delaunay-container>
        </div>
      </div>
    `
  }
}

customElements.define('line-graph', LineGraph)
