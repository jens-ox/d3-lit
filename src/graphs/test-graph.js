import { html, render } from 'lit-html'
import './abstract-graph'

class TestGraph extends HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    render(this.render(), this.shadowRoot)
  }

  get width () {
    return (this.shadowRoot.host.getBoundingClientRect()).width
  }

  get height () {
    return (this.shadowRoot.host.getBoundingClientRect()).height
  }

  get innerWidth () {
    return this.width - 50
  }

  get innerHeight () {
    return this.height - 50
  }

  render () {
    return html`
      <p>
        Test
      </p>
      <abstract-graph width="700" height="250" />
    `
  }
}

customElements.define('test-graph', TestGraph)
