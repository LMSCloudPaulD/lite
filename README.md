# lite

## Usage

### TypeScript

```TypeScript
class MyLiteElement extends LiteElement {
    render() {
        return `<h1>Hello from a LiteElement!</h1>`;
    }
}

@lite([["my-lite-element", MyLiteElement]])
@customElement('my-element')
class MyElement extends LitElement {
    render() {
        return html`
            <div lite="my-lite-element"></div>
        `;
    }
}
```

### JavaScript

```JavaScript
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
```



