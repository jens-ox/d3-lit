import { svg } from 'lit-element'
import { format } from 'd3-format'
import { timeFormat } from 'd3-time-format'
import constants from '../constants'

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

const stringToFormat = (formatType, isHorizontal, scale) => {
  switch (formatType) {
    case constants.axisFormat.number: return isHorizontal ? format('') : format('~s')
    case constants.axisFormat.date: return diffToTimeFormat(scale)
    case constants.axisFormat.percentage: return format('.0%')
    default: return format(formatType)
  }
}

const diffToTimeFormat = scale => {
  const diff = Math.abs(scale.domain[1] - scale.domain[0]) / 1000

  const millisecondDiff = diff < 1
  const secondDiff = diff < 60
  const dayDiff = diff / (60 * 60) < 24
  const fourDaysDiff = diff / (60 * 60) < 24 * 4
  const manyDaysDiff = diff / (60 * 60 * 24) < 60
  const manyMonthsDiff = diff / (60 * 60 * 24) < 365

  return millisecondDiff
    ? timeFormat('%M:%S.%L')
    : secondDiff
      ? timeFormat('%M:%S')
      : dayDiff
        ? timeFormat('%H:%M')
        : fourDaysDiff || manyDaysDiff || manyMonthsDiff
          ? timeFormat('%b %d')
          : timeFormat('%Y')
}

export default ({
  orientation = BOTTOM,
  scale = null,
  tickArguments = [],
  tickValues = null,
  tickFormat = null,
  tickSize,
  tickSizeInner = 6,
  tickSizeOuter = 0,
  tickPadding = 3,
  tickCount,
  buffer = 0,
  prefix = '',
  suffix = ''
} = {}) => {
  const isHorizontal = [TOP, BOTTOM].includes(orientation)
  tickCount = tickCount || isHorizontal ? 5 : 3
  const k = [TOP, LEFT].includes(orientation) ? -1 : 1
  const x = isHorizontal ? 'y' : 'x'
  const transform = isHorizontal ? translateX : translateY

  if (tickCount) {
    tickArguments = [tickCount]
  }

  const values = tickValues == null
    ? (scale.ticks
      ? scale.ticks.apply(scale, tickArguments)
      : scale.domain())
    : tickValues

  const format = tickFormat == null
    ? (scale.tickFormat
      ? scale.tickFormat.apply(scale, tickArguments)
      : d => d)
    : typeof tickFormat === 'function'
      ? tickFormat
      : stringToFormat(tickFormat, isHorizontal, scale)

  if (tickSize) {
    tickSizeInner = tickSize
    tickSizeOuter = tickSize
  }

  const spacing = Math.max(tickSizeInner, 0) + tickPadding

  const range = scale.range()
  let range0 = +range[0] + 0.5
  let range1 = +range[range.length - 1] + 0.5

  // add buffer if necessary
  if (!isHorizontal) {
    range0 += 2 * buffer
  } else {
    range1 += 2 * buffer
  }

  const position = (scale.bandwidth ? center : number)(scale.copy())

  const pathData = !isHorizontal
    ? tickSizeOuter
      ? `M${k * tickSizeOuter},${range0}H0.5V${range1}H${k * tickSizeOuter}`
      : `M0.5,${range0}V${range1}`
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

  return svg`
    <g
      class="lit-axis"
      text-anchor="${textAnchor}"
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
            ? svg`<text x="${k * spacing}" dy="${dy}">${prefix}${format(d)}${suffix}</text>`
            : svg`<text y="${k * spacing}" dy="${dy}">${prefix}${format(d)}${suffix}</text>`
          }
        </g>
      `)}
    </g>
  `
}
