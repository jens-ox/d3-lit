import { svg } from 'lit-html'
import { scaleLinear } from 'd3-scale'

// constants
const TOP = 1
const RIGHT = 2
const BOTTOM = 3
const LEFT = 4

const translateX = x => `translate(${x + 0.5},0)`
const translateY = y => `translate(0,${y + 0.5})`
const number = scale => d => +scale(d)
const center = scale => {
  let offset = Math.max(0, scale.bandwidth() - 1) / 2 // Adjust for 0.5px offset.
  if (scale.round()) offset = Math.round(offset)
  return d => +scale(d) + offset
}

export default ({
  orientation = BOTTOM,
  scale = scaleLinear().domain([0, 100]).range([0, 400]),
  tickArguments = [],
  tickValues = null,
  tickFormat = null,
  tickSize = 6,
  tickSizeInner = 6,
  tickSizeOuter = 6,
  tickPadding = 3
} = {}) => {
  const isHorizontal = [TOP, BOTTOM].includes(orientation)
  const k = [TOP, LEFT].includes(orientation) ? -1 : 1
  const x = isHorizontal ? 'y' : 'x'
  const transform = isHorizontal ? translateX : translateY

  const values = tickValues == null
    ? (scale.ticks
      ? scale.ticks.apply(scale, tickArguments)
      : scale.domain())
    : tickValues

  const format = tickFormat == null
    ? (scale.tickFormat
      ? scale.tickFormat.apply(scale, tickArguments)
      : d => d)
    : tickFormat

  const spacing = Math.max(tickSizeInner, 0) + tickPadding

  const range = scale.range()
  const range0 = +range[0] + 0.5
  const range1 = +range[range.length - 1] + 0.5

  const position = (scale.bandwidth ? center : number)(scale.copy())

  const pathData = [LEFT, RIGHT].includes(orientation)
    ? tickSizeOuter
      ? `M${k * tickSizeOuter},${range0}H0.5V${range1}H${k * tickSizeOuter}`
      : `M0.5${range0}V${range1}`
    : tickSizeOuter
      ? `M${range0},${k * tickSizeOuter}V0.5H${range1}V${k * tickSizeOuter}`
      : `M${range0},0.5H${range1}`

  const textAnchor = orientation === RIGHT
    ? 'start'
    : orientation === LEFT
      ? 'end'
      : 'middle'

  const dy = orientation === TOP
    ? '0em'
    : orientation === BOTTOM
      ? '0.71em'
      : '0.32em'

  console.log('rendering axis')

  return svg`
    <g
      class="lit-axis"
      text-anchor="${textAnchor}"
      transform="translate(10,10)"
    >
      <path
        class="domain"
        d="${pathData}"
      ></path>
      ${values.map(d => svg`
        <g
          class="tick"
          transform="${transform(position(d))}"
        >
          ${x === 'x'
            ? svg`<line x2="${k * tickSizeInner}"></line>`
            : svg`<line y2="${k * tickSizeInner}"></line>`
          }
          ${x === 'x'
            ? svg`<text x="${k * spacing}" dy="${dy}">${format(d)}</text>`
            : svg`<text y="${k * spacing}" dy="${dy}">${format(d)}</text>`
          }
        </g>
      `)}
    </g>
  `
}
