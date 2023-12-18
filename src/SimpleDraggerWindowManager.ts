import SimpleDraggerWindow from "./SimpleDraggerWindow";

const html = String.raw.bind(String);

/**
 * 提供一个管理外壳，此元素只允许包含 simple-dragger-window 作为直接子元素
 */
export default class SimpleDraggerWindowManager extends HTMLElement {
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.innerHTML = html`
            <slot></slot>
            <footer>
                <button class="meta-button" popovertarget="meta-popover">
                    <svg
                        style="scale: 0.6"
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 256 256"
                    >
                        <path
                            fill="#0078D4"
                            d="M0 0h121.329v121.329H0V0Zm134.671 0H256v121.329H134.671V0ZM0 134.671h121.329V256H0V134.671Zm134.671 0H256V256H134.671V134.671Z"
                        />
                    </svg>
                </button>
                <div id="meta-popover" popover>
                    <div class="meta-content"><slot name="meta"></slot></div>
                </div>
                <div class="windows-list"></div>
            </footer>
            <style>
                :host {
                    --height: 40px;
                }
                footer {
                    position: fixed;
                    left: 0;
                    bottom: 0;
                    width: 100%;
                    max-width: 100vw;
                    overflow: hidden;
                    background: rgb(0 0 0 / 0.1);
                    color: #fff;
                    z-index: 2;
                    display: flex;
                    gap: 2px;
                    height: var(--height);
                }
                .meta-button {
                    cursor: pointer;
                    border: none;
                    background: transparent;
                    display: grid;
                    place-items: center;
                    transition: all 100ms;
                    &:hover {
                        background: rgb(0 0 0 / 0.1);
                    }
                }
                #meta-popover {
                    border: none;
                    & .meta-content {
                        position: fixed;
                        left: 0;
                        bottom: var(--height);
                        background: rgb(0 0 0 / 0.2);
                        width: max(40vw, 400px);
                        max-width: 100vw;
                        max-height: 100vh;
                        overflow: auto;
                        display: inline-block;
                        animation: appear-from-bottom 200ms;
                    }
                }
                .windows-list {
                    display: flex;
                    overflow-x: auto;
                    gap: 2px;
                    button {
                        cursor: pointer;
                        border: none;
                        color: #fff;
                        background: rgb(0 0 0 / 0.2);
                        &:hover {
                            filter: brightness(90%);
                        }
                    }
                    & .minimize-true,
                    & .minimize-false {
                        width: 80px;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        transition: all 100ms;
                    }
                    .minimize-true {
                        border-bottom: solid 4px transparent;
                        opacity: 0.5;
                    }
                    .minimize-false {
                        border-bottom: solid 4px steelblue;
                    }
                }

                @keyframes appear-from-bottom {
                    from {
                        translate: 0 1rem;
                    }
                    to {
                        translate: 0 0;
                    }
                }
            </style>
        `;
    }

    get windows() {
        const slot = this.shadowRoot!.querySelector("slot")!;
        const eles = slot.assignedElements({ flatten: true });
        return eles.filter((e) => e instanceof SimpleDraggerWindow) as SimpleDraggerWindow[];
    }

    renderWindowsList() {
        const windows = this.windows;

        windows.forEach((win) => {
            win.manager = this;
            win.onpointerdown = () => {
                windows.forEach((w) => (w.style.zIndex = ""));
                win.style.zIndex = "2";
            };
        });

        const list = this.shadowRoot!.querySelector(".windows-list")!;
        list.innerHTML = "";
        list.append(
            ...windows.map((win) => {
                win.maximizeStyle = {
                    width: "100%",
                    height: "calc(100% - 40px)",
                };
                const button = document.createElement("button");
                button.textContent = win.title;
                button.onclick = () => {
                    win.toggleMinimize();
                    this.renderWindowsList();
                };
                button.className = win.isMinimize ? "minimize-true" : "minimize-false";
                win.addEventListener("minimize", () => {
                    button.className = win.isMinimize ? "minimize-true" : "minimize-false";
                });
                return button;
            })
        );
    }

    connectedCallback() {
        this.renderWindowsList();

        this.shadowRoot!.querySelectorAll("slot").forEach((slot) => {
            slot.addEventListener("slotchange", () => {
                this.renderWindowsList();
            });
        });
    }
}

customElements.define("simple-dragger-window-manager", SimpleDraggerWindowManager);

declare global {
    interface HTMLElementTagNameMap {
        "simple-dragger-window-manager": SimpleDraggerWindowManager;
    }
}
