import simpleDragger from "./drag";
import DragWindow from "./window";

const simpledragger: {
    (hostEle: HTMLElement): void;
    Window: typeof DragWindow;
} = simpleDragger as any;

simpledragger.Window = DragWindow;

export default simpledragger;
