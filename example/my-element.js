import { LitElement, html, css } from 'lit';
import { LiteElement, lite } from '../dist/lite-element.js';

class MyLiteElement extends LiteElement {
    static properties = {
        message: { type: String },
        count: { type: Number }
    };

    constructor(host, element) {
        super(host, element);
        this.message = "LiteElement";
        this.count = 0;
    }

    handleClick() {
        this.message = "LiteElement that's reactive";
    }

    handleIncrement() {
        this.count++;
    }

    render() {
        return html`<h1 @click=${this.handleClick}>Hello from a ${this.message}!</h1>
            <button @click=${this.handleIncrement}>Click me!</button>
            <p>Count: ${this.count}</p>`;
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
            <div style="color: crimson;">
                <div lite="my-lite-element"></div>
            </div>
        `;
    }
}
customElements.define('my-element', MyElement);

