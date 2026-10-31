export {};

const SPARKLE_COLOR = "255, 252, 240";
const TRAIL_COLOR = "32, 164, 205";
const MAX_PARTICLES = 260;
const TRAIL_STEP = 10;

(() => {
	if (window.__tastyChickenClickParticles) return;
	window.__tastyChickenClickParticles = true;

	const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
	if (reducedMotion.matches) return;

	const canvas = document.createElement("canvas");
	canvas.id = "click-particle-canvas";
	canvas.setAttribute("aria-hidden", "true");
	canvas.style.cssText =
		"position:fixed;left:0;top:0;width:100%;height:100%;pointer-events:none;z-index:100;";
	document.body.appendChild(canvas);

	const ctx = canvas.getContext("2d");
	if (!ctx) return;

	let dpr = 1;
	const resize = () => {
		dpr = Math.min(window.devicePixelRatio || 1, 2);
		canvas.width = Math.round(window.innerWidth * dpr);
		canvas.height = Math.round(window.innerHeight * dpr);
	};
	resize();
	window.addEventListener("resize", resize, { passive: true });

	const particles = [];
	let frameId = 0;
	let lastFrame = 0;
	let lastSpawn = 0;
	let dragging = false;
	let lastTrail = null;

	const random = (min, max) => min + Math.random() * (max - min);

	function pushParticle(particle) {
		particles.push(particle);
		if (particles.length > MAX_PARTICLES) {
			particles.splice(0, particles.length - MAX_PARTICLES);
		}
	}

	function startLoop() {
		if (frameId) return;
		lastFrame = performance.now();
		frameId = requestAnimationFrame(tick);
	}

	function spawn(x, y) {
		const now = performance.now();
		if (now - lastSpawn < 45) return;
		lastSpawn = now;

		const count = 10 + Math.round(Math.random() * 6);
		for (let i = 0; i < count; i++) {
			const angle = Math.random() * Math.PI * 2;
			const speed = random(0.04, 0.26);
			pushParticle({
				x,
				y,
				vx: Math.cos(angle) * speed,
				vy: Math.sin(angle) * speed - 0.03,
				gravity: random(0.00008, 0.0002),
				drag: random(0.004, 0.007),
				size: random(2.4, 6.6),
				rotation: Math.random() * Math.PI,
				spin: (Math.random() - 0.5) * 0.008,
				twinklePhase: Math.random() * Math.PI * 2,
				twinkleSpeed: random(0.012, 0.024),
				life: 0,
				maxLife: random(420, 800),
			});
		}
		startLoop();
	}

	// 按住拖拽时沿指针轨迹洒下碎星星
	function spawnTrail(x, y) {
		for (let i = 0; i < 3; i++) {
			pushParticle({
				x: x + random(-8, 8),
				y: y + random(-8, 8),
				vx: random(-0.03, 0.03),
				vy: random(-0.05, -0.01),
				gravity: 0.00004,
				drag: random(0.006, 0.01),
				size: random(4, 7.5),
				rotation: Math.random() * Math.PI,
				spin: (Math.random() - 0.5) * 0.006,
				twinklePhase: Math.random() * Math.PI * 2,
				twinkleSpeed: random(0.014, 0.028),
				life: 0,
				maxLife: random(420, 820),
				tinted: true,
			});
		}
		startLoop();
	}

	function traceTrail(x, y) {
		if (!lastTrail) {
			lastTrail = { x, y };
			spawnTrail(x, y);
			return;
		}
		const dx = x - lastTrail.x;
		const dy = y - lastTrail.y;
		const distance = Math.hypot(dx, dy);
		if (distance < TRAIL_STEP) return;
		// 快速划动时按固定间距补点，拖尾才不会断成一截一截
		const steps = Math.min(Math.floor(distance / TRAIL_STEP), 6);
		for (let i = 1; i <= steps; i++) {
			spawnTrail(lastTrail.x + (dx * i) / steps, lastTrail.y + (dy * i) / steps);
		}
		lastTrail = { x, y };
	}

	function drawSparkle(p, alpha) {
		const len = p.size;
		// 点击爆发按深色壁纸调成白光；拖尾会落在白卡片上，改用主题青色才看得见
		const tinted = p.tinted;
		const width = Math.max(tinted ? 1 : 0.7, len * (tinted ? 0.2 : 0.16));

		ctx.save();
		ctx.globalCompositeOperation = tinted ? "source-over" : "lighter";
		ctx.translate(p.x, p.y);
		ctx.rotate(p.rotation);
		ctx.fillStyle = `rgb(${tinted ? TRAIL_COLOR : SPARKLE_COLOR})`;

		ctx.globalAlpha = alpha * (tinted ? 0.18 : 0.16);
		ctx.beginPath();
		ctx.arc(0, 0, len * 0.85, 0, Math.PI * 2);
		ctx.fill();

		ctx.globalAlpha = tinted ? Math.min(1, alpha * 1.15) : alpha * 0.95;
		ctx.beginPath();
		ctx.moveTo(0, -len);
		ctx.lineTo(width, 0);
		ctx.lineTo(0, len);
		ctx.lineTo(-width, 0);
		ctx.closePath();
		ctx.fill();

		ctx.rotate(Math.PI / 2);
		ctx.beginPath();
		ctx.moveTo(0, -len * 0.72);
		ctx.lineTo(width * 0.72, 0);
		ctx.lineTo(0, len * 0.72);
		ctx.lineTo(-width * 0.72, 0);
		ctx.closePath();
		ctx.fill();

		ctx.rotate(-Math.PI / 2);
		ctx.fillStyle = `rgb(${tinted ? TRAIL_COLOR : SPARKLE_COLOR})`;
		ctx.globalAlpha = Math.min(1, alpha * 1.2);
		ctx.beginPath();
		ctx.arc(0, 0, Math.max(0.8, len * 0.2), 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	function tick(now) {
		const dt = Math.min(now - lastFrame, 48);
		lastFrame = now;
		frameId = 0;

		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

		for (let i = particles.length - 1; i >= 0; i--) {
			const p = particles[i];
			p.life += dt;
			if (p.life >= p.maxLife) {
				particles.splice(i, 1);
				continue;
			}

			const damping = Math.max(0, 1 - p.drag * dt);
			p.vx *= damping;
			p.vy = p.vy * damping + p.gravity * dt;
			p.x += p.vx * dt;
			p.y += p.vy * dt;
			p.rotation += p.spin * dt;
			p.twinklePhase += p.twinkleSpeed * dt;

			const progress = p.life / p.maxLife;
			const fade =
				progress < 0.12
					? progress / 0.12
					: 1 - (progress - 0.12) / 0.88;
			const twinkle = 0.55 + 0.45 * Math.sin(p.twinklePhase);
			drawSparkle(p, Math.max(0, fade) * twinkle);
		}

		if (particles.length > 0) {
			frameId = requestAnimationFrame(tick);
		}
	}

	window.addEventListener(
		"pointerdown",
		(event) => {
			if (event.button !== 0 && event.pointerType === "mouse") return;
			// Swup 替换 body 后画布会脱离文档，点击时重新挂载。
			if (!canvas.isConnected) document.body.appendChild(canvas);
			spawn(event.clientX, event.clientY);
			if (event.pointerType === "mouse") {
				dragging = true;
				lastTrail = { x: event.clientX, y: event.clientY };
				spawnTrail(event.clientX, event.clientY);
			}
		},
		{ capture: true, passive: true },
	);

	window.addEventListener(
		"pointermove",
		(event) => {
			if (!dragging || (event.buttons & 1) === 0) return;
			if (!canvas.isConnected) document.body.appendChild(canvas);
			traceTrail(event.clientX, event.clientY);
		},
		{ capture: true, passive: true },
	);

	const stopDrag = () => {
		dragging = false;
		lastTrail = null;
	};
	window.addEventListener("pointerup", stopDrag, { capture: true, passive: true });
	window.addEventListener("pointercancel", stopDrag, { capture: true, passive: true });
	window.addEventListener("blur", stopDrag);

	// 图片默认可以原生拖拽，拖动时会冒出“禁止”光标；拦掉原生拖拽，只保留星星拖尾
	document.addEventListener(
		"dragstart",
		(event) => {
			if (event.target instanceof Element && event.target.closest("img")) {
				event.preventDefault();
			}
		},
		{ capture: true },
	);

	document.addEventListener("visibilitychange", () => {
		if (document.visibilityState === "hidden") {
			if (frameId) cancelAnimationFrame(frameId);
			frameId = 0;
			particles.length = 0;
			stopDrag();
			ctx.clearRect(0, 0, canvas.width, canvas.height);
		} else {
			resize();
		}
	});
})();
