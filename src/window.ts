import { makeDraggable } from "./drag";
import { html, render } from "lit-html";
import { ref, createRef } from "lit-html/directives/ref.js";

function css(strings: TemplateStringsArray, ...data: any[]) {
    let s = strings[0];
    for (let i = 1; i < strings.length; i++) s += strings[i] + data[i - 1];
    return s;
}

const style = document.createElement("style");
style.innerHTML = css`
    .simple-dragger-container {
        position: fixed;
        background-color: #f0f0f0;
        border-radius: 0.15em;
        box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1), -1px -1px 1px rgba(0, 0, 0, 0.1);
        z-index: 1;
        overflow: hidden;
    }
    .simple-dragger-header {
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
        overflow: auto;
    }
`;
document.head.append(style);

export default class DragWindow {
    // DOM
    private _dom = document.createElement("div");
    constructor(title: string, initStyle?: Partial<CSSStyleDeclaration>, percentage = false) {
        this._dom.className = "simple-dragger-container";
        const dragRef = createRef<HTMLDivElement>();
        render(
            html`
                <header class="simple-dragger-header">
                    <div ${ref(dragRef)} class="simple-dragger-title">${title}</div>
                    <div style="display:flex; flex-wrap:nowrap">
                        <div
                            class="simple-dragger-button simple-dragger-button-minimize"
                            .onclick=${() => this.toggleMin()}
                        >
                            <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <title>window-minimize</title>
                                <path d="M20,14H4V10H20" />
                            </svg>
                        </div>
                        <div
                            class="simple-dragger-button simple-dragger-button-maximize"
                            .onclick=${() => this.toggleMax()}
                        >
                            <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <title>window-maximize</title>
                                <path d="M4,4H20V20H4V4M6,8V18H18V8H6Z" />
                            </svg>
                        </div>
                        <div class="simple-dragger-button simple-dragger-button-close" .onclick=${() => this.close()}>
                            <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <title>window-close</title>
                                <path
                                    d="M13.46,12L19,17.54V19H17.54L12,13.46L6.46,19H5V17.54L10.54,12L5,6.46V5H6.46L12,10.54L17.54,5H19V6.46L13.46,12Z"
                                />
                            </svg>
                        </div>
                    </div>
                </header>
                <article class="simple-dragger-body"></article>
                <footer></footer>
            `,
            this._dom
        );

        this._dom.style.top = "0";
        this._dom.style.left = "0";
        applyCSSStyle(this._dom, initStyle);
        makeDraggable(this._dom, dragRef.value!, percentage);
        document.body.append(this._dom);
    }

    /**
     * 关闭窗口
     */
    public close() {
        this._dom.remove();
    }

    isMax = false;
    private _lastPosition = { top: "0", left: "0" };
    /**
     * 切换是否最大化
     */
    toggleMax(): this {
        if (this.isMax) {
            applyCSSStyle(this._dom, {
                width: "",
                height: "",
                ...this._lastPosition,
            });
        } else {
            this._lastPosition = {
                left: this._dom.style.left,
                top: this._dom.style.top,
            };
            applyCSSStyle(this._dom, {
                width: "calc(100%)",
                height: "calc(100%)",
                left: "0",
                top: "0",
            });
        }
        this.isMax = !this.isMax;
        return this;
    }

    isMin = false;
    /**
     * 切换是否最小化
     */
    public toggleMin(): this {
        if (this.isMin) {
            this._dom.style.display = "";
        } else {
            this._dom.style.display = "none";
        }
        this.isMin = !this.isMin;
        return this;
    }

    private get _body() {
        return this._dom.querySelector(".simple-dragger-body")! as HTMLElement;
    }

    public title(s: string, isHTML = false) {
        this._body[isHTML ? "innerHTML" : "textContent"] = s;
    }
    public append(...nodes: (string | Node)[]) {
        this._body.append(...nodes);
    }
    public html(h: string) {
        this._body.innerHTML = h;
    }
    public text(t: string) {
        this._body.textContent = t;
    }
    /**
     * 渲染 lit-html 模板
     * @example
     * w.render(html`<p>lit-html</p>`)
     */
    public render(l: ReturnType<typeof html>) {
        render(l, this._body);
    }

    public getButton(cls: "minimize" | "maximize" | "close") {
        return this._dom.querySelector(`.simple-dragger-button-${cls}`);
    }
}

function applyCSSStyle(ele: HTMLElement, styl?: Partial<CSSStyleDeclaration>) {
    if (!styl) return;
    for (const k in styl) ele.style[k] = styl[k] || "";
}
