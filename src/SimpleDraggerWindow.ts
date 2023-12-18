import type SimpleDraggerWindowManager from "./SimpleDraggerWindowManager";
import { makeDraggable } from "./drag";
import { createIframeFromHTML } from "./utils/code";

const html = String.raw.bind(String);

/**
 * 要隐藏特定窗口按钮，需要自行操纵 shadowRoot
 */
export default class SimpleDraggerWindow extends HTMLElement {
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.innerHTML = html`
            <style>
                :host {
                    display: inline-block;
                    opacity: 1;
                    position: fixed;
                    max-width: 100vw;
                    max-height: 100vh;
                    width: fit-content;
                    height: fit-content;
                    contain: content;
                    background-color: #f0f0f0;
                    border-radius: 0.15em;
                    box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1), -1px -1px 1px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                    --header-height: 1.75em;
                }
                .simple-dragger-header {
                    height: var(--header-height);
                    background-color: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    overflow: hidden;
                }
                .simple-dragger-title {
                    align-self: stretch;
                    padding: 0 0.5em;
                    min-width: 0;
                    width: 100%;
                    height: var(--header-height);
                    line-height: var(--header-height);
                    display: inline-block;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
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
                    min-width: 100%;
                    max-height: calc(100% - var(--header-height));
                    scrollbar-gutter: stable;
                    overscroll-behavior: contain;
                    overflow: auto;
                }
                /* fade */
                :host {
                    transition: opacity 200ms, display 200ms, width 50ms, height 50ms;
                    transition-behavior: allow-discrete;
                    @starting-style {
                        opacity: 0;
                    }
                }
            </style>

            <header class="simple-dragger-header">
                <div class="simple-dragger-title"><slot name="title" /></div>
                <div style="display: flex; flex-wrap: nowrap">
                    <div class="simple-dragger-button simple-dragger-button-minimize">
                        <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <title>window-minimize</title>
                            <path d="M20,14H4V10H20" />
                        </svg>
                    </div>
                    <div class="simple-dragger-button simple-dragger-button-maximize">
                        <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <title>simple-dragger-window-maximize</title>
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
            <div class="simple-dragger-body"><slot /></div>
        `;
    }

    get title() {
        const slot = this.shadowRoot!.querySelector("slot[name=title]") as HTMLSlotElement;
        return slot
            .assignedNodes({ flatten: true })
            .map((n) => n.textContent)
            .join("")
            .trim();
    }

    connectedCallback() {
        const r = this.getBoundingClientRect();
        applyCSSStyle(this, {
            left: this.style.left ? r.left + "px" : "0px",
            top: this.style.top ? r.top + "px" : "0px",
        });

        const root = this.shadowRoot!;

        makeDraggable(this, root.querySelector(".simple-dragger-title")!, this.hasAttribute("percentage"));

        root.querySelector(".simple-dragger-button-close")!.addEventListener("click", () => {
            this.close();
            this.dispatchEvent(new CustomEvent("close"));
        });

        root.querySelector(".simple-dragger-button-maximize")!.addEventListener("click", () => {
            this.toggleMaximize();
            this.dispatchEvent(new CustomEvent("maximize"));
        });

        root.querySelector(".simple-dragger-button-minimize")!.addEventListener("click", () => {
            this.toggleMinimize();
            this.dispatchEvent(new CustomEvent("minimize"));
        });
    }

    public close() {
        this.remove();
    }

    #styleBeforeMaximize: Partial<CSSStyleDeclaration> = {};

    /**
     * 允许自定义最大化样式
     */
    public maximizeStyle: Partial<CSSStyleDeclaration> = {
        width: "100%",
        height: "100%",
    };

    public get isMaximize() {
        console.log(this.maximizeStyle);
        for (const [key, val] of Object.entries(this.maximizeStyle)) {
            if (Reflect.get(this.style, key) !== val) {
                return false;
            }
        }
        return true;
    }

    public toggleMaximize() {
        if (this.isMaximize) {
            applyCSSStyle(this, this.#styleBeforeMaximize);
        } else {
            // 记录之前的样式，之后可以恢复
            this.#styleBeforeMaximize = {
                left: this.style.left,
                top: this.style.top,
            };
            for (const key of Object.keys(this.maximizeStyle)) {
                Reflect.set(this.#styleBeforeMaximize, key, Reflect.get(this.style, key));
            }

            // 应用最大化样式
            applyCSSStyle(this, { ...this.maximizeStyle, left: "0px", top: "0px" });
        }
    }

    public get isMinimize() {
        return this.style.display === "none";
    }

    public toggleMinimize() {
        if (this.isMinimize) {
            applyCSSStyle(this, {
                display: "inline-block",
                opacity: "1",
            });
            this.animate(
                { opacity: ["0", "1"] },
                {
                    duration: 200,
                }
            );
        } else {
            applyCSSStyle(this, {
                display: "none",
                opacity: "0",
            });
        }
    }

    /**
     * 设置 zIndex 的快捷方法
     */
    public z(z: number | string): this {
        this.style.zIndex = z.toString();
        return this;
    }

    /**
     * 居中的快捷方法
     */
    public center(): this {
        applyCSSStyle(this, {
            left: `calc(50% - ${this.clientWidth / 2}px)`,
            top: `calc(50% - ${this.clientHeight / 2}px)`,
        });
        return this;
    }

    public get width() {
        return this.style.width;
    }

    public set width(width: string) {
        this.style.width = width;
    }

    public get height() {
        return this.style.height;
    }

    public set height(height: string) {
        this.style.height = height;
    }

    public get left() {
        return this.style.left;
    }

    public set left(left: string) {
        this.style.left = left;
    }

    public get top() {
        return this.style.top;
    }

    public set top(top: string) {
        this.style.left = top;
    }

    public manager?: SimpleDraggerWindowManager;

    public async loadHTML(html: string) {
        const span = document.createElement("span");
        const iframe = createIframeFromHTML(html);
        span.slot = "title";
        iframe.width = "100%";
        iframe.height = "100%";
        iframe.style.border = "0";
        const { promise, resolve, reject } = Promise.withResolvers<HTMLIFrameElement>();
        iframe.onload = () => {
            span.textContent = iframe.contentDocument!.title;
            this.manager?.renderWindowsList();
            resolve(iframe);
        };
        iframe.onerror = reject;
        this.innerHTML = "";
        this.append(span, iframe);
        return await promise;
    }
}

customElements.define("simple-dragger-window", SimpleDraggerWindow);

declare global {
    interface HTMLElementTagNameMap {
        "simple-dragger-window": SimpleDraggerWindow;
    }
}

function applyCSSStyle(ele: HTMLElement, styl?: Partial<CSSStyleDeclaration>) {
    if (!styl) return;
    for (const k in styl) ele.style[k] = styl[k] || "";
}
