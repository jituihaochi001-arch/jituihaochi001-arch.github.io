// 关于我页的标签切换与邮箱复制由持久布局统一绑定。
// Swup 只替换页面内容且不会重新执行其中的内联脚本，绑在这里才能保证无刷新切页后仍可用。
const VIEW_LINK_SELECTOR = "[data-about-view-link]";
const COPY_SELECTOR = "[data-about-copy]";

type AboutView = "profile" | "mail";

const getRoot = () => document.querySelector(".github-profile");

const applyView = (view: AboutView) => {
	const root = getRoot();
	if (!root) return;
	root.querySelectorAll<HTMLElement>("[data-about-view]").forEach((panel) => {
		panel.hidden = panel.getAttribute("data-about-view") !== view;
	});
	root.querySelectorAll<HTMLElement>(VIEW_LINK_SELECTOR).forEach((link) => {
		const active = link.getAttribute("data-about-view-link") === view;
		link.classList.toggle("profile-tab--active", active);
		if (active) link.setAttribute("aria-current", "page");
		else link.removeAttribute("aria-current");
	});
};

const syncFromLocation = () => {
	if (!getRoot()) return;
	applyView(window.location.hash === "#mail" ? "mail" : "profile");
};

const handleViewClick = (event: MouseEvent) => {
	const link =
		event.target instanceof Element
			? event.target.closest<HTMLElement>(VIEW_LINK_SELECTOR)
			: null;
	if (!link || !getRoot()) return;
	if (
		event.button !== 0 ||
		event.metaKey ||
		event.ctrlKey ||
		event.shiftKey ||
		event.altKey
	)
		return;
	event.preventDefault();
	event.stopPropagation();
	const view: AboutView =
		link.getAttribute("data-about-view-link") === "mail" ? "mail" : "profile";
	applyView(view);
	window.history.replaceState(
		null,
		"",
		`${window.location.pathname}${window.location.search}${view === "mail" ? "#mail" : ""}`,
	);
};

const handleCopyClick = async (event: MouseEvent) => {
	const target =
		event.target instanceof Element
			? event.target.closest<HTMLElement>(COPY_SELECTOR)
			: null;
	if (!target) return;
	const value = target.getAttribute("data-about-copy") || "";
	if (!value) return;

	let copied = false;
	try {
		await navigator.clipboard.writeText(value);
		copied = true;
	} catch {
		// 非安全上下文下浏览器可能拒绝剪贴板写入。
	}

	const hint = target.querySelector("em");
	if (!hint) return;
	const original = hint.dataset.originalText || hint.textContent || "";
	hint.dataset.originalText = original;
	hint.textContent = copied ? "已复制" : "复制失败";
	window.setTimeout(() => {
		hint.textContent = original;
	}, 1600);
};

const setup = () => {
	const runtime = ((window as any).__jituiAboutRuntime ||= { bound: false });
	if (runtime.bound) return;
	runtime.bound = true;

	document.addEventListener("click", handleViewClick, true);
	document.addEventListener("click", (event) => void handleCopyClick(event));
	window.addEventListener("hashchange", syncFromLocation);
	window.addEventListener("popstate", syncFromLocation);
	document.addEventListener("swup:content:replace", syncFromLocation);
	document.addEventListener("swup:page:view", syncFromLocation);
	document.addEventListener("astro:page-load", syncFromLocation);

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", syncFromLocation, {
			once: true,
		});
	} else {
		syncFromLocation();
	}
};

setup();
