import { html, LitElement } from 'lit-element'
import users from '../data/users'
import '../components/lines'
import './abstract-graph'

class TestGraph extends LitElement {
  get width () {
    return (this.shadowRoot.host.getBoundingClientRect()).width
  }

  get height () {
    return (this.shadowRoot.host.getBoundingClientRect()).height
  }

  render () {
    return html`
      <p>
        Test
      </p>
      <abstract-graph
        width="700"
        height="250"
        .data=${users.map(entry => ({
          date: new Date(entry.date),
          value: entry.value
        }))}
        .yScale=${{ minValue: 0 }}
        brush
        area
        xAccessor="date"
        yAccessor="value"
      >
        <line-container />
      </abstract-graph>
    `
  }
}

customElements.define('test-graph', TestGraph)
