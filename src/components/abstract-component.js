import { render, html } from 'lit-html'
import defaultStyle from '../style'

export default class AbstractComponent extends HTMLElement {
  needsRender = false

  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.invalidate()
  }

  static get style () { return defaultStyle }

  render () { return html`` }

  async invalidate () {
    if (!this.needsRender) {
      this.needsRender = true
      this.needsRender = await false
      render(this.render(), this.shadowRoot)
    }
  }
}
