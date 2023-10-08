export default function simpleDragger(hostEle: HTMLElement) {
    hostEle.style.margin = "0";
    hostEle.querySelectorAll("[data-draggable]").forEach((e) => {
        if (e instanceof HTMLElement) {
            makeDraggable(hostEle, e);
        }
    });
}

function cssPercentage(lhs: number, rhs: number, toFixed?: number): string {
    const percent = (lhs / rhs) * 100;
    return (typeof toFixed === "number" ? percent.toFixed(toFixed) : percent.toString()) + "%";
}

export function makeDraggable(hostEle: HTMLElement, dragEle: HTMLElement, usePercentage = false) {
    dragEle.style.cursor = "move";
    dragEle.style.userSelect = "none";
    dragEle.style.touchAction = "none";
    hostEle.style.position = "fixed";

    dragEle.addEventListener("pointerdown", (event) => {
        dragEle.setPointerCapture(event.pointerId);

        // record initial pointer shift
        const rect = dragEle.getBoundingClientRect();
        const shiftX = event.clientX - rect.x;
        const shiftY = event.clientY - rect.y;

        const onPointerMove = (event: PointerEvent) => {
            const pointerX = event.clientX;
            const pointerY = event.clientY;
            const left = pointerX - shiftX;
            const top = pointerY - shiftY;
            const docWidth = document.documentElement.clientWidth;
            const docHeight = document.documentElement.clientHeight;
            if (usePercentage) {
                hostEle.style.left = cssPercentage(left, docWidth);
                hostEle.style.top = cssPercentage(top, docHeight);
            } else {
                hostEle.style.left = left + "px";
                hostEle.style.top = top + "px";
            }
            hostEle.style.bottom = "";
            hostEle.style.right = "";
            // prevent moving element outside the window
            const rect = hostEle.getBoundingClientRect();
            if (hostEle.offsetLeft <= 0) hostEle.style.left = usePercentage ? "0%" : "0px";
            if (rect.top <= 0) hostEle.style.top = usePercentage ? "0%" : "0px";
            if (rect.right >= docWidth)
                hostEle.style.left = usePercentage ? `calc(100% - ${rect.width}px)` : docWidth - rect.width + "px";
            if (rect.bottom >= docHeight)
                hostEle.style.top = usePercentage ? `calc(100% - ${rect.height}px)` : docHeight - rect.height + "px";
        };

        dragEle.addEventListener("pointermove", onPointerMove);
        const cancelListener = () => dragEle.removeEventListener("pointermove", onPointerMove);
        dragEle.addEventListener("pointercancel", cancelListener);
        dragEle.addEventListener("pointerup", cancelListener);
    });
}
