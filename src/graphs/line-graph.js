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

  get extents () {
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
          <delaunay-container
            .points=${this.data}
            .xAccessor=${this.xAccessor}
            .yAccessor=${this.yAccessor}
            .xScale=${xScale}
            .yScale=${yScale}
            .onPoint=${point => { console.log('on point: ', point) }}
            .onLeave=${() => { console.log('left') }}
          ></delaunay-container>
        </div>
      </div>
    `
  }
}

customElements.define('line-graph', LineGraph)
