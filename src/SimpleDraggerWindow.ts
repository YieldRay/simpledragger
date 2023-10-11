import { makeDraggable } from "./drag";

/**
 * just for highlight
 */
function html(strings: TemplateStringsArray, ...data: any[]) {
    let s = strings[0];
    for (let i = 1; i < strings.length; i++) s += strings[i] + data[i - 1];
    return s;
}

export default class SimpleDraggerWindow extends HTMLElement {
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.innerHTML = html`
            <style>
                :host {
                    position: fixed;
                    max-width: 100%;
                    max-height: 100%;
                    width: max-content;
                    height: max-content;
                    background-color: #f0f0f0;
                    border-radius: 0.15em;
                    box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1), -1px -1px 1px rgba(0, 0, 0, 0.1);
                    z-index: 1;
                    overflow: hidden;
                    transition: width 0.05s, height 0.05s;
                }
                .simple-dragger-header {
                    height: 1.75em; /* important */
                    background-color: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                .simple-dragger-title {
                    padding: 0 0.5em;
                    min-width: 1em;
                    width: 100%;
                    align-self: stretch;
                    display: flex;
                    flex-wrap: nowrap;
                    align-items: center;
                }

                .simple-dragger-button {
                    font-size: 0.75em;
                    padding: 0.5em;
                    text-align: center;
                    width: 1.5em;
                    height: 1.5em;
                    flex-shrink: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .simple-dragger-button:hover {
                    background-color: rgba(0, 0, 0, 0.2);
                }
                .simple-dragger-button-close:hover {
                    color: #f0f0f0;
                    background-color: #e81123;
                }
                .simple-dragger-body {
                    min-height: 2em;
                    max-height: calc(100vh - 1.75em); /* important */
                    overflow: auto;
                }
            </style>

            <header class="simple-dragger-header">
                <div class="simple-dragger-title"><slot name="title" /></div>
                <div style="display:flex; flex-wrap:nowrap">
                    <div class="simple-dragger-button simple-dragger-button-minimize">
                        <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <title>window-minimize</title>
                            <path d="M20,14H4V10H20" />
                        </svg>
                    </div>
                    <div class="simple-dragger-button simple-dragger-button-maximize">
                        <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <title>window-maximize</title>
                            <path d="M4,4H20V20H4V4M6,8V18H18V8H6Z" />
                        </svg>
                    </div>
                    <div class="simple-dragger-button simple-dragger-button-close">
                        <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <title>window-close</title>
                            <path
                                d="M13.46,12L19,17.54V19H17.54L12,13.46L6.46,19H5V17.54L10.54,12L5,6.46V5H6.46L12,10.54L17.54,5H19V6.46L13.46,12Z"
                            />
                        </svg>
                    </div>
                </div>
            </header>
            <article class="simple-dragger-body"><slot /></article>
        `;
    }

    connectedCallback() {
        this.style.top = "0";
        this.style.left = "0";

        makeDraggable(this, this.shadowRoot!.querySelector(".simple-dragger-title")!, this.hasAttribute("percentage"));

        this.shadowRoot?.querySelector(".simple-dragger-button-close")!.addEventListener("click", () => this.close());

        this.shadowRoot
            ?.querySelector(".simple-dragger-button-maximize")!
            .addEventListener("click", () => (this.isMax = !this.isMax));

        this.shadowRoot
            ?.querySelector(".simple-dragger-button-minimize")!
            .addEventListener("click", () => (this.isMin = !this.isMin));
    }

    attributeChangedCallback(attr: string, oldVal: string | null, newVal: string | null) {
        switch (attr) {
            case "foo":
            // do something with 'foo' attribute

            case "bar":
            // do something with 'bar' attribute
        }
    }

    /**
     * 关闭窗口
     */
    public close() {
        this.dispatchEvent(new CustomEvent("close"));
    }

    private _lastCSSText = this.style.cssText;
    private _isMax = false;
    /**
     * 设置是否最大化窗口
     */
    get isMax(): boolean {
        return this._isMax;
    }
    set isMax(m: boolean) {
        if (m) {
            this._lastCSSText = this.style.cssText;
            applyCSSStyle(this, {
                width: "100%",
                height: "100%",
                left: "0",
                top: "0",
            });
        } else {
            this.style.cssText = this._lastCSSText;
        }
        this._isMax = m;
    }

    private _isMin = false;
    /**
     * 设置是否最小化
     */
    get isMin(): boolean {
        return this._isMin;
    }
    set isMin(m: boolean) {
        if (m) {
            this.style.display = "none";
        } else {
            this.style.display = "";
        }
        this._isMin = m;
    }

    /**
     * 设置zIndex的快捷方法
     */
    public z(z: number | string): this {
        this.style.zIndex = z.toString();
        return this;
    }
    /**
     *
     * @returns 居中
     */
    public center(): this {
        applyCSSStyle(this, {
            left: `calc(50% - ${this.clientWidth / 2}px)`,
            top: `calc(50% - ${this.clientHeight / 2}px)`,
        });
        return this;
    }
}

function applyCSSStyle(ele: HTMLElement, styl?: Partial<CSSStyleDeclaration>) {
    if (!styl) return;
    for (const k in styl) ele.style[k] = styl[k] || "";
}

window.customElements.define("simple-dragger-window", SimpleDraggerWindow);

declare global {
    interface HTMLElementTagNameMap {
        "simple-dragger-window": SimpleDraggerWindow;
    }
}
