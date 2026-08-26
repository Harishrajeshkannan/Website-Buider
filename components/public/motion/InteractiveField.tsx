"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Ambient interactive canvas — a field of nodes connected by thin lines that
 * drift slowly and react to the cursor (nodes near the pointer brighten and
 * are gently pushed). Monochrome + minimal to match the editorial direction.
 *
 * Pure canvas (no library) for performance. Reduced-motion renders a single
 * static frame so the space is still filled without any animation.
 */
export function InteractiveField({ className }: { className?: string }) {
  const prefersReduced = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    // Non-null locals so nested closures don't trip strict null checks.
    const ctx: CanvasRenderingContext2D = context;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    type Node = { x: number; y: number; vx: number; vy: number };
    let nodes: Node[] = [];
    const pointer = { x: -9999, y: -9999 };

    function resize() {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Scale node count to area, capped for performance.
      const count = Math.min(80, Math.max(30, Math.floor((width * height) / 12000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      // Update + draw connecting lines
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;

        // Wrap around edges
        if (n.x < 0) n.x = width;
        if (n.x > width) n.x = 0;
        if (n.y < 0) n.y = height;
        if (n.y > height) n.y = 0;

        // Cursor interaction: strong repulsion — dots push away from pointer
        const dxp = n.x - pointer.x;
        const dyp = n.y - pointer.y;
        const distP = Math.hypot(dxp, dyp);
        if (distP < 200 && distP > 0.001) {
          const force = ((200 - distP) / 200) * 4;
          n.x += (dxp / distP) * force;
          n.y += (dyp / distP) * force;
        }

        // Connections
        for (let j = i + 1; j < nodes.length; j++) {
          const m = nodes[j];
          const dx = n.x - m.x;
          const dy = n.y - m.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 160) {
            const alpha = (1 - dist / 160) * 0.28;
            ctx.strokeStyle = `rgba(10,10,10,${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(m.x, m.y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (const n of nodes) {
        const dxp = n.x - pointer.x;
        const dyp = n.y - pointer.y;
        const near = Math.hypot(dxp, dyp) < 200;
        ctx.fillStyle = near ? "rgba(10,10,10,0.9)" : "rgba(10,10,10,0.55)";
        ctx.beginPath();
        ctx.arc(n.x, n.y, near ? 3 : 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    let raf = 0;
    function loop() {
      draw();
      raf = requestAnimationFrame(loop);
    }

    function onPointerMove(e: PointerEvent) {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    }
    function onPointerLeave() {
      pointer.x = -9999;
      pointer.y = -9999;
    }

    resize();
    window.addEventListener("resize", resize);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);

    if (prefersReduced) {
      draw(); // single static frame
    } else {
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [prefersReduced]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{ width: "100%", height: "100%", touchAction: "none" }}
    />
  );
}
