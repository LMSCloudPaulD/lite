import { LitElement, html, css } from 'lit';

export class MyElement extends LitElement {
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
        `;
    }
}
customElements.define('my-element', MyElement);
