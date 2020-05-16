import { html, LitElement } from 'lit-element'
import { curveCatmullRom } from 'd3-shape'
import fakeUsers2 from '../data/fakeUsers2'
import '../components/lines'
import './line-graph'

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
      <line-graph
        width="1200"
        height="400"
        .data=${fakeUsers2.map(fakeArray => fakeArray.map(fakeEntry => ({
      ...fakeEntry,
      date: new Date(fakeEntry.date)
    })))}
        .yScale=${{ minValue: 0 }}
        brush
        area
        .xAccessor=${x => x.date}
        .yAccessor=${x => x.value}
        .curve=${curveCatmullRom}
      />
    `
  }
}

customElements.define('test-graph', TestGraph)
