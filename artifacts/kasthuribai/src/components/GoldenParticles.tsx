import { useEffect, useRef, memo } from "react";

// Pre-computed particle data — low density for premium look
const PARTICLE_COUNT = 22;

interface Particle {
  id: number;
  x: number;         // % from left
  size: number;      // px
  dur: number;       // animation duration (s)
  delay: number;     // animation delay (s)
  driftX: number;    // sideways drift (px)
  opacity: number;   // base opacity
  shape: "circle" | "diamond" | "star";
  color: string;
}

const COLORS = [
  "rgba(229,199,107,VAR)",   // warm gold
  "rgba(246,231,178,VAR)",   // champagne
  "rgba(255,249,240,VAR)",   // ivory white
  "rgba(233,180,76,VAR)",    // soft amber
  "rgba(253,247,236,VAR)",   // very light beige
];

const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
  const shapes: Particle["shape"][] = ["circle", "diamond", "star"];
  return {
    id: i,
    x: 2 + (i / PARTICLE_COUNT) * 96 + (i % 3) * 1.5,
    size: 2.5 + (i % 4) * 1.5,
    dur: 9 + (i % 7) * 2.2,
    delay: -(i * 1.1) % 14,
    driftX: (i % 2 === 0 ? 1 : -1) * (18 + (i % 5) * 22),
    opacity: 0.18 + (i % 5) * 0.09,
    shape: shapes[i % 3],
    color: COLORS[i % COLORS.length],
  };
});

function getColor(template: string, opacity: number) {
  return template.replace("VAR", String(Math.round(opacity * 100) / 100));
}

// SVG star path for tiny 5-point star
function starPath(cx: number, cy: number, r: number) {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    const radius = i % 2 === 0 ? r : r * 0.42;
    return `${cx + radius * Math.cos(angle)},${cy + radius * Math.sin(angle)}`;
  });
  return `M${pts.join("L")}Z`;
}

// Canvas particle system with mouse parallax
function CanvasParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const frameRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  // Particle state for canvas
  const state = useRef(
    particles.map((p) => ({
      ...p,
      // start at random Y positions
      y: Math.random() * -120,
      vy: 0.28 + Math.random() * 0.18,
      phase: Math.random() * Math.PI * 2,
      rotation: Math.random() * 360,
    }))
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouse = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMouse, { passive: true });

    const draw = (ts: number) => {
      const dt = Math.min((ts - timeRef.current) / 1000, 0.05);
      timeRef.current = ts;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mx = mouse.current.x / canvas.width - 0.5;
      const my = mouse.current.y / canvas.height - 0.5;

      state.current.forEach((p) => {
        p.y += p.vy * 60 * dt;
        p.rotation += (0.3 + p.id % 3 * 0.2) * dt * 60;
        p.phase += dt * 0.4;

        // sideways sway
        const swayX = Math.sin(p.phase) * (p.driftX * 0.012);
        // mouse parallax — subtle
        const px = p.x / 100 * canvas.width + swayX + mx * p.size * 4;
        const py = p.y + canvas.scrollY;

        // reset when off screen
        if (p.y > canvas.height + 20) {
          p.y = -10 - Math.random() * 30;
          p.phase = Math.random() * Math.PI * 2;
        }

        // fade in near top, fade out near bottom
        let alpha = p.opacity;
        if (p.y < 60) alpha *= p.y / 60;
        if (p.y > canvas.height - 80) alpha *= (canvas.height - p.y) / 80;

        ctx.save();
        ctx.translate(px, py);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, alpha);

        const color = getColor(p.color, 1);

        if (p.shape === "circle") {
          // bokeh circle with soft glow
          const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size);
          grad.addColorStop(0, color);
          grad.addColorStop(0.5, getColor(p.color, 0.6));
          grad.addColorStop(1, "rgba(255,240,200,0)");
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        } else if (p.shape === "diamond") {
          // small diamond
          const s = p.size * 0.85;
          ctx.beginPath();
          ctx.moveTo(0, -s);
          ctx.lineTo(s * 0.6, 0);
          ctx.lineTo(0, s);
          ctx.lineTo(-s * 0.6, 0);
          ctx.closePath();
          ctx.fillStyle = color;
          ctx.fill();
        } else {
          // tiny 5-point star
          const sp = new Path2D(starPath(0, 0, p.size * 0.9));
          ctx.fillStyle = color;
          ctx.fill(sp);
        }

        ctx.restore();
      });

      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[5]"
      aria-hidden="true"
      style={{ willChange: "transform" }}
    />
  );
}

const GoldenParticles = memo(CanvasParticles);
export default GoldenParticles;
