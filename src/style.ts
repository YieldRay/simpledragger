const style = document.createElement("style");

style.innerHTML = css`
    .simple-dragger-container {
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
`;
document.head.append(style);

export {};

/**
 * just for highlight
 */
function css(strings: TemplateStringsArray, ...data: any[]) {
    let s = strings[0];
    for (let i = 1; i < strings.length; i++) s += strings[i] + data[i - 1];
    return s;
}
