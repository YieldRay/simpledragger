import SimpleDraggerWindow from "./SimpleDraggerWindow";

/**
 * 提供一个管理外壳，此元素只允许包含 simple-dragger-window 作为直接子元素
 */
export default class SimpleDraggerWindowManager extends HTMLElement {
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.innerHTML = String.raw`
        <slot></slot>
        <footer>
            <button>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256">
                    <path
                        fill="#0078D4"
                        d="M0 0h121.329v121.329H0V0Zm134.671 0H256v121.329H134.671V0ZM0 134.671h121.329V256H0V134.671Zm134.671 0H256V256H134.671V134.671Z"
                    />
                </svg>
            </button>
            <div class="windows-list"></div>
        </footer>
        <style>
            footer {
                position: fixed;
                bottom: 0;
                width: 100%;
                max-width: 100vw;
                overflow: hidden;
                background: rgb(0 0 0 / 0.1);
                color: #fff;
                z-index: 2;
                display: flex;
                gap: 2px;
                /* !!! */
                height: 40px; 
            }
            .windows-list {
                display: flex;
                gap: 2px;
                button {
                    cursor: pointer;
                    border: none;
                    color: #fff;
                    background: rgb(0 0 0 / 0.2);
                    &:hover{
                        background: rgb(0 0 0 / 0.1);
                    }
                }
                .minimize-true {
                    opacity: 0.5;
                    border-bottom: solid 4px transparent;
                }
                .minimize-false {
                    opacity: 1;
                    border-bottom: solid 4px blue;
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

    private _renderWindowsList() {
        const windows = this.windows;

        const list = this.shadowRoot!.querySelector(".windows-list")!;
        list.innerHTML = "";
        list.append(
            ...windows.map((win) => {
                win.maximizeStyle = {
                    left: "0px",
                    top: "0px",
                    width: "100%",
                    height: "calc(100% - 40px)",
                };
                const button = document.createElement("button");
                button.textContent = win.title;
                button.onclick = () => {
                    win.toggleMinimize();
                    this._renderWindowsList();
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
        const slot = this.shadowRoot!.querySelector("slot")!;
        slot.addEventListener("slotchange", () => {
            this._renderWindowsList();
        });
    }
}

customElements.define("simple-dragger-window-manager", SimpleDraggerWindowManager);

declare global {
    interface HTMLElementTagNameMap {
        "simple-dragger-window-manager": SimpleDraggerWindowManager;
    }
}
