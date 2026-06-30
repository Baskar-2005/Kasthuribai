import { useEffect, useRef, memo } from "react";

/*
  Premium ambient particle system — Awwwards-quality.
  Warm gold/champagne/ivory bokeh circles, micro diamonds, and star sparks.
  Canvas-based, 60fps, GPU-accelerated, mouse-parallax.
*/

const COLORS = [
  [229, 199, 107], // Warm Gold  #E5C76B
  [246, 231, 178], // Champagne  #F6E7B2
  [255, 249, 240], // Ivory      #FFF9F0
  [233, 180,  76], // Soft Amber #E9B44C
  [253, 247, 236], // Lt Beige   #FDF7EC
] as const;

type Shape = "bokeh" | "diamond" | "spark";

interface P {
  x: number; y: number;        // position (px)
  vy: number;                  // fall speed (px/s)
  vx: number;                  // base horizontal drift (px/s)
  size: number;                // radius / half-size
  phase: number;               // sine wave phase
  freq: number;                // sine wave frequency
  amp: number;                 // sine wave amplitude
  rot: number;                 // current rotation (rad)
  rotV: number;                // rotation speed (rad/s)
  alpha: number;               // current opacity
  maxAlpha: number;            // peak opacity
  color: readonly [number, number, number];
  shape: Shape;
  blur: number;                // css blur equiv (0 = sharp, up to 1.5)
}

const N = 20; // low density = premium

function makeParticle(W: number, H: number, randomY = false): P {
  const shapes: Shape[] = ["bokeh", "bokeh", "diamond", "spark"]; // bokeh-weighted
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];
  const size = 2 + Math.random() * 5.5;
  return {
    x: Math.random() * W,
    y: randomY ? Math.random() * H : -size * 2 - Math.random() * 60,
    vy: 14 + Math.random() * 18,       // 14–32 px/s — slow, floating
    vx: (Math.random() - 0.5) * 6,
    size,
    phase: Math.random() * Math.PI * 2,
    freq: 0.25 + Math.random() * 0.4,
    amp: 18 + Math.random() * 45,
    rot: Math.random() * Math.PI * 2,
    rotV: (Math.random() - 0.5) * 0.9,
    alpha: 0,
    maxAlpha: 0.18 + Math.random() * 0.38,
    color,
    shape: shapes[Math.floor(Math.random() * shapes.length)],
    blur: Math.random() * 1.2,
  };
}

function drawBokeh(ctx: CanvasRenderingContext2D, p: P, a: number) {
  const [r, g, b] = p.color;
  const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size);
  grad.addColorStop(0,   `rgba(${r},${g},${b},${a})`);
  grad.addColorStop(0.5, `rgba(${r},${g},${b},${a * 0.55})`);
  grad.addColorStop(1,   `rgba(${r},${g},${b},0)`);
  ctx.beginPath();
  ctx.arc(0, 0, p.size, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();
  // soft ring
  ctx.beginPath();
  ctx.arc(0, 0, p.size * 0.7, 0, Math.PI * 2);
  ctx.strokeStyle = `rgba(${r},${g},${b},${a * 0.25})`;
  ctx.lineWidth = 0.5;
  ctx.stroke();
}

function drawDiamond(ctx: CanvasRenderingContext2D, p: P, a: number) {
  const [r, g, b] = p.color;
  const s = p.size * 0.9;
  ctx.beginPath();
  ctx.moveTo(0, -s);
  ctx.lineTo(s * 0.55, 0);
  ctx.lineTo(0, s);
  ctx.lineTo(-s * 0.55, 0);
  ctx.closePath();
  ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
  ctx.fill();
  // inner highlight
  ctx.beginPath();
  ctx.moveTo(0, -s * 0.45);
  ctx.lineTo(s * 0.22, 0);
  ctx.lineTo(0, s * 0.45);
  ctx.lineTo(-s * 0.22, 0);
  ctx.closePath();
  ctx.fillStyle = `rgba(255,255,255,${a * 0.35})`;
  ctx.fill();
}

function drawSpark(ctx: CanvasRenderingContext2D, p: P, a: number) {
  const [r, g, b] = p.color;
  const s = p.size;
  // 4-point star
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const angle = (Math.PI / 4) * i;
    const radius = i % 2 === 0 ? s : s * 0.38;
    const px = radius * Math.cos(angle - Math.PI / 2);
    const py = radius * Math.sin(angle - Math.PI / 2);
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
  ctx.fill();
}

function GoldenParticlesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef(0);
  const prevTRef = useRef(0);
  const particlesRef = useRef<P[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    // init particles spread across screen
    particlesRef.current = Array.from({ length: N }, () =>
      makeParticle(canvas.width, canvas.height, true)
    );

    const onResize = () => resize();
    const onMouse = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMouse, { passive: true });

    const tick = (ts: number) => {
      const dt = Math.min((ts - prevTRef.current) / 1000, 0.05);
      prevTRef.current = ts;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mx = (mouseRef.current.x / canvas.width  - 0.5) * 2; // -1..1
      const my = (mouseRef.current.y / canvas.height - 0.5) * 2;

      for (const p of particlesRef.current) {
        p.phase += p.freq * dt;
        p.y += p.vy * dt;
        p.x += p.vx * dt + Math.sin(p.phase) * p.amp * dt;
        p.rot += p.rotV * dt;

        // subtle mouse parallax (closer to mouse = slightly more shift)
        const px = p.x + mx * p.size * 3.5;
        const py = p.y + my * p.size * 1.5;

        // fade-in / fade-out
        const fadeZone = canvas.height * 0.12;
        let a = p.maxAlpha;
        if (p.y < fadeZone) a *= Math.max(0, p.y / fadeZone);
        if (p.y > canvas.height - fadeZone) a *= Math.max(0, (canvas.height - p.y) / fadeZone);
        p.alpha = a;

        // reset off-screen
        if (p.y > canvas.height + p.size * 3 || px < -80 || px > canvas.width + 80) {
          const fresh = makeParticle(canvas.width, canvas.height, false);
          Object.assign(p, fresh);
          continue;
        }

        if (a <= 0.005) continue;

        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(p.rot);
        if (p.blur > 0.3) ctx.filter = `blur(${p.blur.toFixed(1)}px)`;

        switch (p.shape) {
          case "bokeh":   drawBokeh(ctx, p, a);   break;
          case "diamond": drawDiamond(ctx, p, a); break;
          case "spark":   drawSpark(ctx, p, a);   break;
        }

        ctx.restore();
        ctx.filter = "none";
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 5,
        pointerEvents: "none",
        willChange: "transform",
      }}
    />
  );
}

export default memo(GoldenParticlesCanvas);
