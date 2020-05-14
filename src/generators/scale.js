import { scaleLinear, scaleOrdinal, scaleLog, scaleTime } from 'd3-scale'
import constants from '../constants'

export default ({
  type,
  range,
  domain
}) => {
  // instantiate base scale type
  // TODO implement other scale types
  const scaleObject = !type || type === constants.scaleType.linear
    ? scaleLinear()
    : type === constants.scaleType.categorical
      ? scaleOrdinal()
      : type === constants.scaleType.time
        ? scaleTime()
        : scaleLog()

  if (range) scaleObject.range(range)
  if (domain) scaleObject.domain(domain)

  return scaleObject
}
