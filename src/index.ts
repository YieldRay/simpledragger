import simpleDragger from "./drag";
import DragWindow from "./window";
import { html, svg, render, nothing, noChange } from "lit-html";

const simpledragger: {
    (hostEle: HTMLElement): void;
    Window: typeof DragWindow;
    html: typeof html;
    svg: typeof svg;
    render: typeof render;
    nothing: typeof nothing;
    noChange: typeof noChange;
} = simpleDragger as any;

simpledragger.Window = DragWindow;
simpledragger.html = html;
simpledragger.svg = svg;
simpledragger.render = render;
simpledragger.nothing = nothing;
simpledragger.noChange = noChange;

export default simpledragger;
