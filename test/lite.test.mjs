import { expect } from 'chai';
import { describe, it } from 'mocha';
import { LitElement, html } from 'lit';
import { LiteElement } from '../dist/lite.esm.js';

describe("LiteElement tests", () => {

  // 1. Testing LiteElement render
  it("LiteElement should render correctly", () => {
    class TestElement extends LiteElement {
      constructor(host, element) {
        super(host, element);
      }

      render() {
        return html`Hello, Test!`;
      }
    }

    const litElement = new LitElement();
    const testElement = new TestElement(litElement, document.createElement('div'));

    expect(testElement.render()).to.equal('Hello, Test!');
  });

  // Continue writing tests for the other parts of your library...
});
