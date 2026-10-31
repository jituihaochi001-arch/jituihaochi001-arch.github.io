export {};

const PANEL_ID = "music-nav-panel";
const EDGE_MARGIN = 8;
const DRAG_EXCLUSIONS =
	"button, a, input, select, textarea, label, [role='slider'], .lrc-container, .playlist-container";

interface DragState {
	panel: HTMLElement;
	pointerId: number;
	offsetX: number;
	offsetY: number;
}

let dragState: DragState | null = null;
let savedTransition = "";

const clamp = (value: number, min: number, max: number) =>
	Math.min(Math.max(value, min), Math.max(min, max));

const getBounds = (width: number, height: number) => ({
	minX: EDGE_MARGIN,
	minY: EDGE_MARGIN,
	maxX: window.innerWidth - width - EDGE_MARGIN,
	maxY: window.innerHeight - height - EDGE_MARGIN,
});

function liftPanelToViewport(panel: HTMLElement) {
	if (panel.style.position === "fixed") return;
	const rect = panel.getBoundingClientRect();
	// 导航外壳的 backdrop-filter 会成为 fixed 的包含块，移到 body 才能相对视口拖动
	document.body.appendChild(panel);
	panel.style.position = "fixed";
	panel.style.right = "auto";
	panel.style.bottom = "auto";
	panel.style.maxWidth = `calc(100vw - ${EDGE_MARGIN * 2}px)`;
	panel.style.left = `${rect.left}px`;
	panel.style.top = `${rect.top}px`;
	panel.style.zIndex = "1001";
}

document.addEventListener("pointerdown", (event) => {
	if (dragState || (event.pointerType === "mouse" && event.button !== 0)) return;
	const target = event.target;
	if (!(target instanceof Element)) return;
	const panel = target.closest<HTMLElement>(`#${PANEL_ID}`);
	if (!panel || panel.classList.contains("float-panel-closed")) return;
	if (target.closest(DRAG_EXCLUSIONS)) return;
	// 触屏只从标题区域起拖，避免和歌词/播放列表滚动冲突
	if (event.pointerType === "touch" && !target.closest("[data-music-drag-handle]")) {
		return;
	}

	liftPanelToViewport(panel);
	const rect = panel.getBoundingClientRect();
	dragState = {
		panel,
		pointerId: event.pointerId,
		offsetX: event.clientX - rect.left,
		offsetY: event.clientY - rect.top,
	};
	savedTransition = panel.style.transition;
	panel.style.transition = "none";
	panel.classList.add("is-dragging");
	document.body.classList.add("music-panel-dragging");
	try {
		panel.setPointerCapture(event.pointerId);
	} catch {
		// 指针已释放时忽略
	}
	event.preventDefault();
});

document.addEventListener("pointermove", (event) => {
	if (!dragState || event.pointerId !== dragState.pointerId) return;
	const { panel, offsetX, offsetY } = dragState;
	const rect = panel.getBoundingClientRect();
	const bounds = getBounds(rect.width, rect.height);
	panel.style.left = `${clamp(event.clientX - offsetX, bounds.minX, bounds.maxX)}px`;
	panel.style.top = `${clamp(event.clientY - offsetY, bounds.minY, bounds.maxY)}px`;
	event.preventDefault();
});

function endDrag() {
	if (!dragState) return;
	const { panel, pointerId } = dragState;
	dragState = null;
	try {
		panel.releasePointerCapture(pointerId);
	} catch {
		// 指针已释放时忽略
	}
	panel.style.transition = savedTransition;
	panel.classList.remove("is-dragging");
	document.body.classList.remove("music-panel-dragging");
}

document.addEventListener("pointerup", endDrag);
document.addEventListener("pointercancel", endDrag);

window.addEventListener("resize", () => {
	const panel = document.getElementById(PANEL_ID);
	if (!panel || panel.style.position !== "fixed") return;
	const left = Number.parseFloat(panel.style.left);
	const top = Number.parseFloat(panel.style.top);
	if (Number.isNaN(left) || Number.isNaN(top)) return;
	const rect = panel.getBoundingClientRect();
	const bounds = getBounds(rect.width, rect.height);
	panel.style.left = `${clamp(left, bounds.minX, bounds.maxX)}px`;
	panel.style.top = `${clamp(top, bounds.minY, bounds.maxY)}px`;
});
