export {};

const configPayload = JSON.parse(
	document.getElementById("tasty-chicken-falling-effect-config")?.textContent || "{}",
);
const {
	fallingEffectConfig,
	sakuraConfig,
	baseUrl = "/",
} = configPayload;
const MODE_STORAGE_KEY = "fallingEffectMode";
const MODES = ["none", "sakura", "stars", "rain"];

let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;

const rand = (range) => range.min + Math.random() * (range.max - range.min);
const pick = (list) => list[Math.floor(Math.random() * list.length)];

// 樱花对象类
class Sakura {
	constructor(x, y, s, r, a, fn, idx, img, limitArray, config) {
		this.x = x;
		this.y = y;
		this.s = s;
		this.r = r;
		this.a = a;
		this.fn = fn;
		this.idx = idx;
		this.img = img;
		this.limitArray = limitArray;
		this.config = config;
	}

	draw(cxt) {
		cxt.save();
		cxt.translate(this.x, this.y);
		cxt.rotate(this.r);
		cxt.globalAlpha = this.a;
		cxt.drawImage(this.img, 0, 0, 40 * this.s, 40 * this.s);
		cxt.restore();
	}

	update() {
		this.x = this.fn.x(this.x, this.y);
		this.y = this.fn.y(this.y, this.y);
		this.r = this.fn.r(this.r);
		this.a = this.fn.a(this.a);
		if (
			this.x > windowWidth ||
			this.x < 0 ||
			this.y > windowHeight ||
			this.y < 0 ||
			this.a <= 0
		) {
			if (this.limitArray[this.idx] === -1) {
				this.resetPosition();
			} else if (this.limitArray[this.idx] > 0) {
				this.resetPosition();
				this.limitArray[this.idx]--;
			}
		}
	}

	resetPosition() {
		this.r = getRandom("fnr", this.config);
		if (Math.random() > 0.4) {
			this.x = getRandom("x", this.config);
			this.y = 0;
		} else {
			this.x = windowWidth;
			this.y = getRandom("y", this.config);
		}
		this.s = getRandom("s", this.config);
		this.r = getRandom("r", this.config);
		this.a = getRandom("a", this.config);
	}
}

function getRandom(option, config) {
	let ret;
	let random;

	switch (option) {
		case "x":
			ret = Math.random() * windowWidth;
			break;
		case "y":
			ret = Math.random() * windowHeight;
			break;
		case "s":
			ret =
				config.size.min + Math.random() * (config.size.max - config.size.min);
			break;
		case "r":
			ret = Math.random() * 6;
			break;
		case "a":
			ret =
				config.opacity.min +
				Math.random() * (config.opacity.max - config.opacity.min);
			break;
		case "fnx":
			random =
				config.speed.horizontal.min +
				Math.random() *
					(config.speed.horizontal.max - config.speed.horizontal.min);
			ret = (x, _y) => x + random;
			break;
		case "fny":
			random =
				config.speed.vertical.min +
				Math.random() * (config.speed.vertical.max - config.speed.vertical.min);
			ret = (_x, y) => y + random;
			break;
		case "fnr":
			ret = (r) => r + config.speed.rotation;
			break;
		case "fna":
			ret = (alpha) => alpha - config.speed.fadeSpeed * 0.01;
			break;
	}
	return ret;
}

// 流星：带微光十字星芒，缓慢斜向下飘落
function createStar(config) {
	const speed = rand(config.stars.speed);
	return {
		x: Math.random() * windowWidth,
		y: Math.random() * windowHeight,
		vx: speed * 0.55,
		vy: speed,
		size: rand(config.stars.size),
		alpha: rand(config.stars.opacity),
		rotation: Math.random() * Math.PI,
		spin: (Math.random() - 0.5) * 0.00035,
		sway: Math.random() * Math.PI * 2,
		swaySpeed: 0.0004 + Math.random() * 0.0007,
		twinkle: Math.random() * Math.PI * 2,
		twinkleSpeed: 0.0016 + Math.random() * 0.0022,
		color: pick(["#fff8dc", "#ffe9b0", "#dbeafe", "#fce7f3"]),
		trail: Math.random() < 0.6,
	};
}

function updateStar(star, dt) {
	star.sway += star.swaySpeed * dt;
	star.twinkle += star.twinkleSpeed * dt;
	star.rotation += star.spin * dt;
	star.x += (star.vx + Math.cos(star.sway) * 0.02) * dt;
	star.y += star.vy * dt;
	if (star.y > windowHeight + 30 || star.x > windowWidth + 30) {
		star.x = Math.random() * windowWidth;
		star.y = -30;
	}
}

function drawStar(cxt, star) {
	const pulse = 0.68 + 0.32 * Math.sin(star.twinkle);
	const alpha = star.alpha * pulse;
	cxt.save();
	cxt.globalCompositeOperation = "lighter";
	cxt.translate(star.x, star.y);
	cxt.rotate(star.rotation);
	cxt.fillStyle = star.color;

	if (star.trail) {
		cxt.globalAlpha = alpha * 0.36;
		cxt.strokeStyle = star.color;
		cxt.lineWidth = Math.max(0.9, star.size * 0.24);
		cxt.beginPath();
		cxt.moveTo(0, 0);
		cxt.lineTo(-star.size * 2.8, -star.size * 4.8);
		cxt.stroke();
	}

	cxt.globalAlpha = alpha;
	cxt.beginPath();
	for (let i = 0; i < 8; i++) {
		const radius = i % 2 === 0 ? star.size : star.size * 0.32;
		const angle = (i * Math.PI) / 4;
		const px = Math.cos(angle) * radius;
		const py = Math.sin(angle) * radius;
		if (i === 0) cxt.moveTo(px, py);
		else cxt.lineTo(px, py);
	}
	cxt.closePath();
	cxt.fill();

	cxt.globalAlpha = alpha * 0.28;
	cxt.beginPath();
	cxt.arc(0, 0, star.size * 1.5, 0, Math.PI * 2);
	cxt.fill();
	cxt.restore();
}

// 雨滴：从右上斜向左下的细长雨丝
function createDrop(config) {
	const speed = rand(config.rain.speed);
	return {
		x: Math.random() * (windowWidth + 160) - 40,
		y: Math.random() * windowHeight,
		vy: speed,
		vx: speed * config.rain.slant,
		length: rand(config.rain.length),
		alpha: rand(config.rain.opacity),
		width: Math.random() < 0.35 ? 1.6 : 1.05,
	};
}

function updateDrop(drop, dt) {
	drop.x += drop.vx * dt;
	drop.y += drop.vy * dt;
	if (drop.y > windowHeight + 40 || drop.x < -80 || drop.x > windowWidth + 80) {
		drop.x = Math.random() * (windowWidth + 160) - 40;
		drop.y = -drop.length - Math.random() * 120;
	}
}

function drawDrop(cxt, drop) {
	const tailX = drop.x - drop.vx * (drop.length / drop.vy);
	const tailY = drop.y - drop.length;
	cxt.beginPath();
	cxt.strokeStyle = `rgba(186, 220, 246, ${drop.alpha})`;
	cxt.lineWidth = drop.width;
	cxt.moveTo(drop.x, drop.y);
	cxt.lineTo(tailX, tailY);
	cxt.stroke();
}

class FallingEffectManager {
	constructor(config, sakura) {
		this.config = config;
		this.sakuraConfig = sakura;
		this.mode = "none";
		this.canvas = null;
		this.ctx = null;
		this.animationId = null;
		this.isRunning = false;
		this.isPaused = false;
		this.initToken = 0;
		this.lastFrame = 0;

		this.img = null;
		this.sakuraLoading = false;
		this.sakuraList = null;
		this.stars = [];
		this.drops = [];
	}

	async init(mode) {
		if (this.isRunning) return;
		const token = ++this.initToken;

		if (mode === "sakura" && !(await this.ensureSakuraImage())) {
			if (token !== this.initToken) return;
			return;
		}
		if (token !== this.initToken) return;
		if (!this.canvas) this.createCanvas();
		this.isRunning = true;
		this.isPaused = false;
		this.mode = mode;
		this.populate();

		this._boundHandleResize = this.handleResize.bind(this);
		window.addEventListener("resize", this._boundHandleResize);
		this.startAnimation();
	}

	ensureSakuraImage() {
		if (this.img && this.img.complete && this.img.naturalWidth > 0) {
			return Promise.resolve(true);
		}
		if (this.sakuraLoading) {
			return new Promise((resolve) => {
				const wait = () => {
					if (this.img && this.img.complete) resolve(this.img.naturalWidth > 0);
					else setTimeout(wait, 60);
				};
				wait();
			});
		}
		this.sakuraLoading = true;
		this.img = new Image();
		this.img.src = "/assets/images/effects/sakura.webp";
		return new Promise((resolve) => {
			this.img.onload = () => resolve(true);
			this.img.onerror = () => {
				console.warn("[FallingEffect] Unable to load the sakura image.");
				resolve(false);
			};
		});
	}

	applyMode(mode) {
		if (mode === "none") {
			this.stop();
			return;
		}
		if (this.isRunning) {
			if (this.isPaused) {
				this.resume();
				if (this.mode === mode) return;
			}
			if (this.mode === mode) return;
			if (mode === "sakura" && !(this.img && this.img.naturalWidth > 0)) {
				this.stop();
				this.init(mode);
				return;
			}
			this.mode = mode;
			this.populate();
			return;
		}
		this.init(mode);
	}

	populate() {
		this.sakuraList = null;
		this.stars = [];
		this.drops = [];

		if (this.mode === "sakura") {
			if (!this.img || !this.ctx) return;
			const list = [];
			const limitArray = new Array(this.sakuraConfig.sakuraNum).fill(
				this.sakuraConfig.limitTimes,
			);
			for (let i = 0; i < this.sakuraConfig.sakuraNum; i++) {
				list.push(
					new Sakura(
						getRandom("x", this.sakuraConfig),
						getRandom("y", this.sakuraConfig),
						getRandom("s", this.sakuraConfig),
						getRandom("r", this.sakuraConfig),
						getRandom("a", this.sakuraConfig),
						{
							x: getRandom("fnx", this.sakuraConfig),
							y: getRandom("fny", this.sakuraConfig),
							r: getRandom("fnr", this.sakuraConfig),
							a: getRandom("fna", this.sakuraConfig),
						},
						i,
						this.img,
						limitArray,
						this.sakuraConfig,
					),
				);
			}
			this.sakuraList = list;
		} else if (this.mode === "stars") {
			this.stars = Array.from({ length: this.config.stars.count }, () =>
				createStar(this.config),
			);
		} else if (this.mode === "rain") {
			this.drops = Array.from({ length: this.config.rain.count }, () =>
				createDrop(this.config),
			);
		}
	}

	createCanvas() {
		this.canvas = document.createElement("canvas");
		this.canvas.height = windowHeight;
		this.canvas.width = windowWidth;
		this.canvas.setAttribute(
			"style",
			`position: fixed; left: 0; top: 0; pointer-events: none; z-index: ${this.config.zIndex}; transform: translateZ(0);`,
		);
		this.canvas.setAttribute("id", "canvas_falling_effect");
		document.body.appendChild(this.canvas);
		this.ctx = this.canvas.getContext("2d");
	}

	startAnimation() {
		if (!this.ctx || !this.canvas) return;
		this.lastFrame = performance.now();

		const animate = (now) => {
			if (!this.ctx || !this.canvas || !this.isRunning) return;
			const dt = Math.min(now - this.lastFrame, 48);
			this.lastFrame = now;

			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

			if (this.mode === "sakura" && this.sakuraList) {
				for (const sakura of this.sakuraList) {
					sakura.update();
					sakura.draw(this.ctx);
				}
			} else if (this.mode === "stars") {
				for (const star of this.stars) {
					updateStar(star, dt);
					drawStar(this.ctx, star);
				}
			} else if (this.mode === "rain") {
				for (const drop of this.drops) {
					updateDrop(drop, dt);
					drawDrop(this.ctx, drop);
				}
			}

			this.animationId = requestAnimationFrame(animate);
		};

		this.animationId = requestAnimationFrame(animate);
	}

	handleResize() {
		windowWidth = window.innerWidth;
		windowHeight = window.innerHeight;
		if (this.canvas) {
			this.canvas.width = windowWidth;
			this.canvas.height = windowHeight;
		}
	}

	pause() {
		if (!this.isRunning || this.isPaused) return;
		if (this.animationId) {
			cancelAnimationFrame(this.animationId);
			this.animationId = null;
		}
		this.isPaused = true;
	}

	resume() {
		if (!this.isRunning || !this.isPaused) return;
		this.isPaused = false;
		this.startAnimation();
	}

	stop() {
		this.initToken++;
		this.sakuraLoading = false;

		if (this.animationId) {
			cancelAnimationFrame(this.animationId);
			this.animationId = null;
		}
		if (this.canvas) {
			this.canvas.remove();
			this.canvas = null;
		}
		if (this._boundHandleResize) {
			window.removeEventListener("resize", this._boundHandleResize);
			this._boundHandleResize = null;
		}
		this.ctx = null;
		this.sakuraList = null;
		this.stars = [];
		this.drops = [];
		this.mode = "none";
		this.isRunning = false;
		this.isPaused = false;
	}
}

function getPreferredMode() {
	if (fallingEffectConfig?.enable === false) return "none";
	try {
		const stored = localStorage.getItem(MODE_STORAGE_KEY);
		if (stored && MODES.includes(stored)) return stored;
	} catch {
		// 忽略隐私模式下的存储限制
	}
	return fallingEffectConfig?.defaultMode ?? "none";
}

function isHomePage() {
	const homePath = baseUrl.replace(/\/$/, "") || "/";
	const pathname = window.location.pathname.replace(/\/index\.html$/, "").replace(/\/$/, "") || "/";
	return pathname === homePath;
}

function syncFallingEffect() {
	const mode = getPreferredMode();
	const shouldRun =
		mode !== "none" &&
		isHomePage() &&
		document.visibilityState === "visible" &&
		!window.__friendsPortalActive;

	if (!window.fallingEffectManager) {
		window.fallingEffectManager = new FallingEffectManager(
			fallingEffectConfig,
			sakuraConfig,
		);
	}
	window.fallingEffectManager.applyMode(shouldRun ? mode : "none");
}

let pendingStart = false;
let scrollResumeTimer = 0;

function queueFallingEffectSync() {
	if (pendingStart) return;
	pendingStart = true;
	const start = () => {
		pendingStart = false;
		if (typeof window.requestIdleCallback === "function") {
			window.requestIdleCallback(() => syncFallingEffect(), { timeout: 1200 });
		} else {
			window.setTimeout(syncFallingEffect, 120);
		}
	};
	start();
}

// 首页加载后初始化飘落效果
(() => {
	const setup = () => {
		if (window.fallingEffectInitialized) return;
		window.fallingEffectInitialized = true;
		queueFallingEffectSync();
	};

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", setup);
	} else {
		setup();
	}
})();

// Swup/Astro 页面切换时同步运行状态
if (!window.fallingEffectRouteSyncBound) {
	window.fallingEffectRouteSyncBound = true;
	[
		"astro:page-load",
		"astro:after-swap",
		"swup:contentReplaced",
		"swup:content:replace",
		"swup:page:view",
	].forEach((eventName) =>
		document.addEventListener(eventName, queueFallingEffectSync),
	);
	window.addEventListener("pageshow", queueFallingEffectSync);

	const bindSwupHooks = () => {
		if (!window.swup?.hooks || window.fallingEffectSwupHooksBound) return;
		window.fallingEffectSwupHooksBound = true;
		window.swup.hooks.on("content:replace", queueFallingEffectSync);
		window.swup.hooks.on("page:view", queueFallingEffectSync);
	};
	document.addEventListener("swup:enable", bindSwupHooks);
	bindSwupHooks();
}

// 设置面板切换飘落效果
window.addEventListener("fallingEffectChange", () => {
	queueFallingEffectSync();
});

// 滚动时只暂停水波纹，飘落效果保持运行
window.addEventListener(
	"scroll",
	() => {
		document.documentElement.classList.add("is-tasty-chicken-scrolling");
		window.clearTimeout(scrollResumeTimer);
		scrollResumeTimer = window.setTimeout(() => {
			document.documentElement.classList.remove("is-tasty-chicken-scrolling");
		}, 180);
	},
	{ passive: true },
);

document.addEventListener("visibilitychange", () => {
	if (document.visibilityState === "hidden") {
		window.clearTimeout(scrollResumeTimer);
		document.documentElement.classList.remove("is-tasty-chicken-scrolling");
		window.fallingEffectManager?.pause?.();
	} else {
		queueFallingEffectSync();
	}
});

// 全屏友链漫游打开时暂停 Canvas，避免与 WebGL 隧道争抢帧
window.addEventListener("friends-portal-open", () => {
	window.__friendsPortalActive = true;
	window.fallingEffectManager?.pause?.();
});
window.addEventListener("friends-portal-close", () => {
	window.__friendsPortalActive = false;
	queueFallingEffectSync();
});
