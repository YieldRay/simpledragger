export default function simpleDragger(hostEle: HTMLElement) {
    hostEle.style.position = "fixed";
    hostEle.style.zIndex = "2";
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

export function makeDraggable(hostEle: HTMLElement, targetEle: HTMLElement, percentage = false) {
    targetEle.style.cursor = "move";
    targetEle.style.userSelect = "none";
    targetEle.style.touchAction = "none";

    targetEle.addEventListener("pointerdown", (event) => {
        targetEle.setPointerCapture(event.pointerId);

        // record initial pointer shift
        const rect = targetEle.getBoundingClientRect();
        const shiftX = event.clientX - rect.x;
        const shiftY = event.clientY - rect.y;

        const onPointerMove = (event: PointerEvent) => {
            const pointerX = event.clientX;
            const pointerY = event.clientY;
            const left = pointerX - shiftX;
            const top = pointerY - shiftY;
            if (percentage) {
                hostEle.style.left = cssPercentage(left, document.documentElement.clientWidth);
                hostEle.style.top = cssPercentage(top, document.documentElement.clientHeight);
            } else {
                hostEle.style.left = left + "px";
                hostEle.style.top = top + "px";
            }
            hostEle.style.bottom = "";
            hostEle.style.right = "";
            // prevent moving element outside the window
            const rect = hostEle.getBoundingClientRect();
            if (hostEle.offsetLeft <= 0) hostEle.style.left = "0px";
            if (rect.top <= 0) hostEle.style.top = "0px";
            if (rect.right >= window.innerWidth) hostEle.style.left = window.innerWidth - rect.width + "px";
            if (rect.bottom >= window.innerHeight) hostEle.style.top = window.innerHeight - rect.height + "px";
        };

        targetEle.addEventListener("pointermove", onPointerMove);
        const cancelListener = () => targetEle.removeEventListener("pointermove", onPointerMove);
        targetEle.addEventListener("pointercancel", cancelListener);
        targetEle.addEventListener("pointerup", cancelListener);
    });
}
