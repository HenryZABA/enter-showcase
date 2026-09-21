export const clamp = (value: number, low: number, high: number) => Math.min(high, Math.max(low, value));
export const smoothstep = (low: number, high: number, value: number) => {
  const t = clamp((value - low) / (high - low), 0, 1);
  return t * t * (3 - 2 * t);
};

export type SurfaceView = { width: number; height: number; camera: number; speed: number };
export type SurfaceCard = { center: number; width: number; height: number };
type Point = { x: number; y: number };

// Exact CPU counterpart of the vertex shader for curved hit testing.
export function projectSurface(view: SurfaceView, card: SurfaceCard, u: number, v: number, hover: number) {
  const halfW = view.width / 2;
  const x = card.center + u * card.width / 2;
  let y = v * card.height / 2;
  const q = x / halfW * 1.15 - .2;
  const wave = Math.sin(Math.PI * q) * Math.exp(-q * q);
  const slope = (Math.PI * Math.cos(Math.PI * q) - 2 * q * Math.sin(Math.PI * q)) * Math.exp(-q * q);
  let z = -halfW * .2 * (1 + 1.1 * view.speed) * wave;
  const roll = -.16 * slope / Math.PI + 1.8 * view.speed * smoothstep(.3, .9, Math.abs(x / halfW)) * Math.sign(x / halfW);
  const sourceY = y;
  y = sourceY * Math.cos(roll) - z * Math.sin(roll);
  z = sourceY * Math.sin(roll) + z * Math.cos(roll);
  y += .03 * x;
  const edge = clamp(x / halfW, -1, 1);
  z += -.12 * halfW * edge * (1.5 - .5 * edge * edge);
  const rear = 1 - smoothstep(-1, .3, x / halfW);
  y += .1 * halfW * view.speed * rear;
  z += .2 * halfW * view.speed * rear;
  z -= hover * .1 * card.height * (1 - u * u) * (1 - v * v);
  const perspective = 1 / (1 - z / view.camera);
  return { x: view.width / 2 + x * perspective, y: view.height / 2 + y * perspective, z };
}

const triangleContains = (p: Point, a: Point, b: Point, c: Point) => {
  const cross = (p1: Point, p2: Point, p3: Point) => (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
  const d1 = cross(p, a, b), d2 = cross(p, b, c), d3 = cross(p, c, a);
  return !((d1 < 0 || d2 < 0 || d3 < 0) && (d1 > 0 || d2 > 0 || d3 > 0));
};

/** Conservative projected bounds before triangle-level testing or drawing. */
export function surfaceBounds(view: SurfaceView, card: SurfaceCard, hover: number) {
  let left = Infinity, right = -Infinity, top = Infinity, bottom = -Infinity;
  for (let column = 0; column <= 6; column++) for (const v of [-1, 0, 1]) {
    const p = projectSurface(view, card, column / 3 - 1, v, hover);
    left = Math.min(left, p.x); right = Math.max(right, p.x);
    top = Math.min(top, p.y); bottom = Math.max(bottom, p.y);
  }
  return { left: left - 24, right: right + 24, top: top - 24, bottom: bottom + 24 };
}

export function hitSurface(view: SurfaceView, card: SurfaceCard, hover: number, point: Point) {
  const steps = 12;
  const points = Array.from({ length: (steps + 1) ** 2 }, (_, i) =>
    projectSurface(view, card, (i % (steps + 1)) / steps * 2 - 1, Math.floor(i / (steps + 1)) / steps * 2 - 1, hover));
  for (let row = 0; row < steps; row++) for (let column = 0; column < steps; column++) {
    const i = row * (steps + 1) + column;
    const a = points[i], b = points[i + 1], c = points[i + steps + 1], d = points[i + steps + 2];
    if (triangleContains(point, a, b, c) || triangleContains(point, b, d, c)) return true;
  }
  return false;
}
