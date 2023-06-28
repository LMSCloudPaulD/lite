import { LitElement, html, css } from 'lit';
import { LiteElement, lite, ReactiveProperty } from '../dist/lite-element.js';

class MyLiteElement extends LiteElement {
    test;

    constructor(host, element) {
        super(host, element);
        this.test = new ReactiveProperty(host, "LiteElement");
        this.handleClick = this.handleClick.bind(this); // Bind the method
    }

    handleClick = () => {
        this.test?.set("LiteElement that's reactive");
    }

    render() {
        return html`<h1 @click=${this.handleClick}>Hello from a ${this.test?.get()}!</h1>`;
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

