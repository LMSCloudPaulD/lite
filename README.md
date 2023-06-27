# lite

## Usage

### TypeScript

```TypeScript
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



