import { LitElement, PropertyValueMap, ReactiveController } from "lit";
import { render, TemplateResult } from "lit";

class ReactiveProperty<T> {
    private host: LitElement;

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

class ReactivePropertyCreator {
    static initReactiveProperties(host: LiteElement, properties: PropertyDescriptorMap) {
        for (const property in properties) {
            this.createReactiveProperty(host, property);
        }
    }

    private static createReactiveProperty(target: LiteElement, propertyKey: string) {
        let internalKey = `__${propertyKey}`;
        const originalValue = target[propertyKey as keyof LiteElement];

        const getter = function (this: any) {
            if (this[internalKey] === undefined) {
                this[internalKey] = new ReactiveProperty(this.host, originalValue);
            }
            return this[internalKey]?.get();
        };

        const setter = function (this: any, value: any) {
            if (this[internalKey] === undefined) {
                this[internalKey] = new ReactiveProperty(this.host, value);
            } else {
                this[internalKey].set(value);
            }
        };

        Object.defineProperty(target, propertyKey, {
            get: getter,
            set: setter,
            enumerable: true,
            configurable: true,
        });
    }
}

class MethodBinder {
    static bindMethodsToInstance(instance: any) {
        const methodNames = Object.getOwnPropertyNames(Object.getPrototypeOf(instance))
            .filter(prop => typeof instance[prop] === 'function');
        for (const methodName of methodNames) {
            instance[methodName] = instance[methodName].bind(instance);
        }
    }
}

export abstract class LiteElement implements ReactiveController {
    protected host: LitElement;
    
    protected element: HTMLElement;

    private reactivePropertiesInitialized = false;

    constructor(host: LitElement, element: HTMLElement) {
        this.host = host;
        this.element = element;
        host.addController(this);

        MethodBinder.bindMethodsToInstance(this);
    }

    hostConnected() {
        this.initReactiveProperties();
        this.update();
    }

    hostUpdate() {
        this.initReactiveProperties();
        this.update();
    }

    private initReactiveProperties() {
        if (!this.reactivePropertiesInitialized) {
            this.reactivePropertiesInitialized = true;
            ReactivePropertyCreator.initReactiveProperties(this, (this.constructor as any).properties);
        }
    }

    abstract render(): TemplateResult;

    private update() {
        render(this.render(), this.element);
    }
}

type LiteElementConstructor = new (host: LitElement, element: HTMLElement) => LiteElement;

class LiteElementHost {
    private _liteElement: LiteElement;

    constructor(liteElement: LiteElement, host: HTMLElement) {
        this._liteElement = liteElement;
        this.renderContent(host);
    }

    private renderContent(host: HTMLElement) {
        render(this._liteElement.render(), host);
    }
}

const liteElementHostMap = new WeakMap<HTMLElement, LiteElementHost>();

class LiteElementUpdater {
    static updateElements(host: LitElement, root: ShadowRoot, liteElementsMap: Map<string, LiteElementConstructor>) {
        const liteElements = root.querySelectorAll('[lite]');
        liteElements.forEach((liteElementHost: Element) => {
            if (liteElementHost instanceof HTMLElement) {
                const liteElementName = liteElementHost.getAttribute('lite');
                const LiteElementConstructor = liteElementsMap.get(liteElementName!);
                if (LiteElementConstructor) {
                    let liteElementHostInstance = liteElementHostMap.get(liteElementHost);
                    if (!liteElementHostInstance) {
                        const liteElementInstance = new LiteElementConstructor(host, liteElementHost);
                        liteElementHostInstance = new LiteElementHost(liteElementInstance, liteElementHost);
                        liteElementHostMap.set(liteElementHost, liteElementHostInstance);
                    }
                }
            }
        });
    }
}

export function lite<T extends new (...args: any[]) => LitElement>(
    Base: T,
    elements: Array<[string, LiteElementConstructor]>
): T {
    const liteElementsMap = new Map(elements);

    class LiteBase extends Base {
        protected updated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
            super.updated(_changedProperties);
            this.updateLiteElements();
        }

        private updateLiteElements() {
            LiteElementUpdater.updateElements(this, this.shadowRoot!, liteElementsMap);
        }
    }

    return (LiteBase as unknown) as T;
}
