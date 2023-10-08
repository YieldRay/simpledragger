import simpleDragger from "./drag";
import DragWindow from "./window";
import * as litHTML from "lit-html";

const simpledragger: {
    (hostEle: HTMLElement): void;
    Window: typeof DragWindow;
    litHTML: typeof litHTML;
} = simpleDragger as any;

simpledragger.Window = DragWindow;
simpledragger.litHTML = litHTML; // just export lit-html

export default simpledragger;
