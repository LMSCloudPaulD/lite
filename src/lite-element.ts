import { LitElement, PropertyValueMap } from "lit";
import { render, TemplateResult } from "lit";

export abstract class LiteElement {
    abstract render(): TemplateResult;

    update(host: HTMLElement) {
        render(this.render(), host);
    }
}

class LiteElementHost {
    private _liteElement: LiteElement;

    constructor(liteElement: LiteElement, host: HTMLElement) {
        this._liteElement = liteElement;
        this.updateContent(host);
    }

    updateContent(host: HTMLElement) {
        render(this._liteElement.render(), host);
    }
}

const liteElementsMap = new Map<string, new () => LiteElement>();

/**
 * This decorator is used to traverse the DOM and find all elements with the
 * lite attribute. It then creates a list of references to these elements and
 * instantiates LiteElements for each of them. The LiteElements themselves are
 * initialised and then render their declarative content into the reference
 * that they belong to.
 * @param elements 
 */
export function lite<T extends new (...args: any[]) => LitElement>(
    Base: T,
    elements: Array<[string, new () => LiteElement]>
): T {
    elements.forEach(([name, LiteElementConstructor]) => {
        liteElementsMap.set(name, LiteElementConstructor);
    });

    class LiteBase extends Base {
        protected updated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
            super.updated(_changedProperties);
            this.updateContent();
        }

        updateContent() {
            const liteElements = this.shadowRoot?.querySelectorAll('[lite]');
            if (liteElements?.length) {
                liteElements.forEach((liteElementHost) => {
                    if (liteElementHost instanceof HTMLElement) {
                        const liteElementName = liteElementHost.getAttribute('lite');
                        if (liteElementName) {
                            const LiteElementConstructor = liteElementsMap.get(liteElementName);
                            if (LiteElementConstructor) {
                                const liteElementInstance = new LiteElementConstructor();
                                new LiteElementHost(liteElementInstance, liteElementHost);
                            }
                        }
                    }
                });
            }
        }
    }

    return (LiteBase as unknown) as T;
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
