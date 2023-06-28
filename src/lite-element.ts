import { LitElement, PropertyValueMap, ReactiveController } from "lit";
import { render, TemplateResult } from "lit";

export class ReactiveProperty<T> {
    host: LitElement;
    
    private value: T;

    constructor(host: LitElement, value: T) {
        this.host = host;
        this.value = value;
    }

    get(): T {
        return this.value;
    }

    set(newValue: T) {
        this.value = newValue;
        this.host.requestUpdate();
    }
}

export abstract class LiteElement implements ReactiveController {
    host: LitElement;
    
    element: HTMLElement;

    constructor(host: LitElement, element: HTMLElement) {
        this.host = host;
        this.element = element;
        host.addController(this);
    }

    hostConnected() {
        this.update(this.element);
    }

    hostUpdate() {
        this.update(this.element);
    }

    abstract render(): TemplateResult;

    update(element: HTMLElement) {
        render(this.render(), element);
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

const liteElementsMap = new Map<string, new (host: LitElement, element: HTMLElement) => LiteElement>();
const liteElementsInstancesMap = new WeakMap<HTMLElement, LiteElement>();

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
                                let liteElementInstance = liteElementsInstancesMap.get(liteElementHost);
                                if (!liteElementInstance) {
                                    liteElementInstance = new LiteElementConstructor(this, liteElementHost);
                                    liteElementsInstancesMap.set(liteElementHost, liteElementInstance);
                                }
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
