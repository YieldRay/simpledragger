import { makeDraggable } from "./drag";

function isHTMLElement(x: unknown): x is HTMLElement {
    return x instanceof HTMLElement;
}

export default class SimpleDragger extends HTMLElement {
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.innerHTML = `<slot></slot>`;
    }

    connectedCallback() {
        makeDraggable(
            this,
            (this.shadowRoot
                ?.querySelector("slot")!
                .assignedElements({ flatten: true })
                .filter(isHTMLElement)
                .map((e) => e.querySelector("[data-draggable]"))
                .at(0) as HTMLElement) || this
        );
    }
}

window.customElements.define("simple-dragger", SimpleDragger);

declare global {
    interface HTMLElementTagNameMap {
        "simple-dragger": SimpleDragger;
    }
}
