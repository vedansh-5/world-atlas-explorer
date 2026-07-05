"use client";

import { useEffect, useRef } from "react";

interface Point3D {
  x: number;
  y: number;
  z: number;
}

function buildSpherePoints(latSteps: number, lngSteps: number): Point3D[] {
  const points: Point3D[] = [];
  for (let i = 0; i <= latSteps; i++) {
    const lat = (Math.PI * i) / latSteps - Math.PI / 2;
    for (let j = 0; j < lngSteps; j++) {
      const lng = (2 * Math.PI * j) / lngSteps;
      points.push({
        x: Math.cos(lat) * Math.cos(lng),
        y: Math.sin(lat),
        z: Math.cos(lat) * Math.sin(lng),
      });
    }
  }
  return points;
}

export function GlobeCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const points = buildSpherePoints(16, 32);
    let angle = 0;
    let frameId: number;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    }

    function draw() {
      if (!canvas || !ctx) return;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const radius = Math.min(w, h) * 0.42;

      const styles = getComputedStyle(document.documentElement);
      const isDark = document.documentElement.classList.contains("dark");
      const dotColor = isDark
        ? "255, 255, 255"
        : styles.getPropertyValue("--color-foreground").trim() || "0,0,0";

      const sorted = [...points].sort((a, b) => {
        const az = a.x * Math.sin(angle) + a.z * Math.cos(angle);
        const bz = b.x * Math.sin(angle) + b.z * Math.cos(angle);
        return az - bz;
      });

      for (const p of sorted) {
        const rotX = p.x * Math.cos(angle) - p.z * Math.sin(angle);
        const rotZ = p.x * Math.sin(angle) + p.z * Math.cos(angle);
        const depth = (rotZ + 1) / 2; // 0 (back) .. 1 (front)

        const screenX = cx + rotX * radius;
        const screenY = cy - p.y * radius;
        const size = (0.6 + depth * 1.6) * dpr;
        const opacity = 0.12 + depth * 0.75;

        ctx.beginPath();
        ctx.arc(screenX, screenY, size, 0, Math.PI * 2);
        ctx.fillStyle = isDark
          ? `rgba(${dotColor}, ${opacity})`
          : `rgba(30, 41, 59, ${opacity * 0.8})`;
        ctx.fill();
      }
    }

    function loop() {
      angle += 0.0022;
      draw();
      frameId = requestAnimationFrame(loop);
    }

    resize();
    draw();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    if (!prefersReducedMotion) {
      frameId = requestAnimationFrame(loop);
    }

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
      style={{ width: "100%", height: "100%" }}
    />
  );
}
