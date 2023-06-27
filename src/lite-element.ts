import { LitElement } from 'lit';

export abstract class LiteElement extends HTMLElement {
    abstract render(): void;

    connectedCallback() {
        this.render();
    }
}

/**
 * This decorator is used to traverse the DOM and find all elements with the
 * lite attribute. It then creates a list of references to these elements and
 * instantiates LiteElements for each of them. The LiteElements themselves are
 * initialised and then render their declarative content into the reference
 * that they belong to.
 * @param elements 
 */
function lite<T extends new (...args: any[]) => LitElement>(constructor: T): T {
    return class extends constructor {
        connectedCallback() {
            super.connectedCallback();
            const liteElements = this.querySelectorAll('[lite]');
            for (let i = 0; i < liteElements.length; ++i) {
                const liteElementHost = liteElements[i];
                const liteElement = new (liteElementHost.getAttribute('lite') as any)(); 
                liteElement.render();
            }
        }
    };
}

/*

Usage:

import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { lite } from './lite';

@lite([MyLiteElement])
@customElement('my-element')
export class MyElement extends LitElement {

    render() {
        return html`
            <div lite="${MyLiteElement}"></div>
        `;
    }

*/
