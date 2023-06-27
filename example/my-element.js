import { LitElement, html, css } from 'lit';
import { LiteElement, lite } from '../dist/lite-element.js';

class MyLiteElement extends LiteElement {
    render() {
        return `<h1>Hello from a LiteElement!</h1>`;
    }
}

export class MyElement extends lite(LitElement, [["my-lite-element", MyLiteElement]]) {
    static styles = [
        css`
            :host {
                display: block;
            }
        `
    ];

    render() {
        return html`
            <h1>Hello, world!</h1>
            <div lite="my-lite-element"></div>
        `;
    }
}
customElements.define('my-element', MyElement);

