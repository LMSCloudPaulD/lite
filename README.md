# lite

Lite is a lightweight library for building web components, based on Lit.

It provides a simple way to create LiteElements that can be included in your Lit components.

The main difference between LiteElements and LitElements is that LiteElements are not web components, and therefore cannot be used directly in HTML. 

Instead, they are intended to be used as part of other web components.

## Installation

To use Lite in your project, you will need to install it via npm:

```bash
npm install @lmscloud/lite lit
```

## Usage

Here's a simple example of how to use Lite.

### TypeScript

```TypeScript
import { LiteElement, lite } from '@lmscloud/lite';
import { LitElement, html, customElement } from 'lit';

class MyLiteElement extends LiteElement {
    render() {
        return html`<h1>Hello from a LiteElement!</h1>`;
    }
}

@lite([["my-lite-element", MyLiteElement]])
@customElement('my-element')
class MyElement extends LitElement {
    render() {
        return html`
            <h1>Hello, world!</h1>
            <div style="color: crimson;">
                <div lite="my-lite-element"></div>
            </div>
        `;
    }
}
```

### JavaScript

```JavaScript
import { LiteElement, lite } from '@lmscloud/lite';
import { LitElement, html, css } from 'lit';

class MyLiteElement extends LiteElement {
    render() {
        return html`<h1>Hello from a LiteElement!</h1>`;
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

```



