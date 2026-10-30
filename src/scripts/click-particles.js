export {};

const SPARKLE_COLOR = "255, 252, 240";
const MAX_PARTICLES = 260;

(() => {
	if (window.__aemeathClickParticles) return;
	window.__aemeathClickParticles = true;

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

	function spawn(x, y) {
		const now = performance.now();
		if (now - lastSpawn < 45) return;
		lastSpawn = now;

		const count = 10 + Math.round(Math.random() * 6);
		for (let i = 0; i < count; i++) {
			const angle = Math.random() * Math.PI * 2;
			const speed = 0.04 + Math.random() * 0.22;
			particles.push({
				x,
				y,
				vx: Math.cos(angle) * speed,
				vy: Math.sin(angle) * speed - 0.03,
				gravity: 0.00008 + Math.random() * 0.00012,
				drag: 0.004 + Math.random() * 0.003,
				size: 2.4 + Math.random() * 4.2,
				rotation: Math.random() * Math.PI,
				spin: (Math.random() - 0.5) * 0.008,
				twinklePhase: Math.random() * Math.PI * 2,
				twinkleSpeed: 0.012 + Math.random() * 0.012,
				life: 0,
				maxLife: 420 + Math.random() * 380,
			});
		}
		if (particles.length > MAX_PARTICLES) {
			particles.splice(0, particles.length - MAX_PARTICLES);
		}
		if (!frameId) {
			lastFrame = now;
			frameId = requestAnimationFrame(tick);
		}
	}

	function drawSparkle(p, alpha) {
		const len = p.size;
		const width = Math.max(0.7, len * 0.16);

		ctx.save();
		ctx.globalCompositeOperation = "lighter";
		ctx.translate(p.x, p.y);
		ctx.rotate(p.rotation);
		ctx.fillStyle = `rgb(${SPARKLE_COLOR})`;

		ctx.globalAlpha = alpha * 0.16;
		ctx.beginPath();
		ctx.arc(0, 0, len * 0.85, 0, Math.PI * 2);
		ctx.fill();

		ctx.globalAlpha = alpha * 0.95;
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
		},
		{ capture: true, passive: true },
	);

	document.addEventListener("visibilitychange", () => {
		if (document.visibilityState === "hidden") {
			if (frameId) cancelAnimationFrame(frameId);
			frameId = 0;
			particles.length = 0;
			ctx.clearRect(0, 0, canvas.width, canvas.height);
		} else {
			resize();
		}
	});
})();
