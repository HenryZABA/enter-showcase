import type { CurvedGalleryItem } from "@/data/curved-gallery";
import { createMesh, createProgram } from "./shaders";
import { GalleryMedia } from "./media";
import { clamp, hitSurface, surfaceBounds, type SurfaceCard, type SurfaceView } from "./surface";

type Layout = SurfaceCard & { index: number; baseCenter: number };
type VisibleCard = Layout & { hover: number };
type GalleryRendererOptions = {
  canvas: HTMLCanvasElement; items: CurvedGalleryItem[]; reducedMotion: boolean; onFallback: () => void;
  onNavigate: (href: string) => void;
};
const GAP = 10;

export class CurvedGalleryRenderer {
  private canvas: HTMLCanvasElement;
  private items: CurvedGalleryItem[];
  private gl: WebGLRenderingContext;
  private program: WebGLProgram;
  private mesh: ReturnType<typeof createMesh>;
  private media: GalleryMedia;
  private layouts: Layout[] = [];
  private visibleCards: VisibleCard[] = [];
  private visibleIndices = new Set<number>();
  private totalWidth = 1;
  private current = 0;
  private target = 0;
  private disposed = false;
  private reducedMotion: boolean;
  private inView = true;
  private paused = false;
  private pointerInside = false;
  private keyboardFocus = false;
  private resumeDelay = 1.2;
  private raf = 0;
  private lastTime = 0;
  private lastDraw = 0;
  private hoverIndex = -1;
  private hoverValues: number[];
  private hoverPoint: { x: number; y: number } | null = null;
  private hoverPending = false;
  private rect: DOMRect = new DOMRect();
  private view: SurfaceView = { width: 1, height: 1, camera: 1, speed: 0 };
  private pointer = { id: -1, startX: 0, lastX: 0, lastTime: 0, velocity: 0, dragging: false, moved: false };
  private observer: IntersectionObserver;
  private resizeObserver: ResizeObserver;
  private onFallback: () => void;
  private onNavigate: (href: string) => void;
  private locations: Record<string, WebGLUniformLocation>;
  private positionAttribute: number;
  private contextLost = (event: Event) => { event.preventDefault(); this.onFallback(); this.destroy(); };

  constructor({ canvas, items, reducedMotion, onFallback, onNavigate }: GalleryRendererOptions) {
    this.canvas = canvas; this.items = items.map(item => ({ ...item })); this.reducedMotion = reducedMotion; this.onFallback = onFallback; this.onNavigate = onNavigate;
    const gl = canvas.getContext("webgl", { alpha: true, antialias: true, powerPreference: "high-performance" });
    if (!gl) throw new Error("WebGL unavailable");
    this.gl = gl; this.program = createProgram(gl); this.mesh = createMesh(gl); this.hoverValues = items.map(() => 0);
    this.locations = Object.fromEntries(["u_view", "u_size", "u_center", "u_camera", "u_speed", "u_hover", "u_media", "u_overlay"].map(name => {
      const location = gl.getUniformLocation(this.program, name);
      if (location === null) throw new Error(`Missing gallery uniform ${name}`);
      return [name, location];
    }));
    this.positionAttribute = gl.getAttribLocation(this.program, "a_position");
    this.media = new GalleryMedia(gl, this.items, () => this.invalidate(), (index, width, height) => {
      const item = this.items[index];
      if (!width || !height || Math.abs(item.width / item.height - width / height) < .001) return;
      const anchor = this.layouts.reduce((a, b) => Math.abs(this.center(a)) < Math.abs(this.center(b)) ? a : b);
      const anchorCenter = this.center(anchor), lag = this.target - this.current;
      item.width = width; item.height = height;
      this.resize(true);
      this.current = anchorCenter - this.layouts[anchor.index].baseCenter;
      this.target = this.current + lag;
    });
    canvas.addEventListener("webglcontextlost", this.contextLost);
    this.bindInputs();
    this.observer = new IntersectionObserver(([entry]) => {
      this.inView = entry.isIntersecting; this.syncActivity();
    });
    this.observer.observe(canvas);
    this.resizeObserver = new ResizeObserver(this.onResize);
    this.resizeObserver.observe(canvas);
    document.addEventListener("visibilitychange", this.syncActivity);
    this.resize(false);
    const order = [...this.layouts].sort((a, b) => Math.abs(this.center(a)) - Math.abs(this.center(b))).map(card => card.index);
    void this.media.load(order, this.layouts.map(card => card.width * Math.min(devicePixelRatio || 1, 2)), () => {
      if (this.disposed) return;
      this.canvas.dataset.ready = "true"; this.invalidate();
    }).catch(() => { if (!this.disposed) { this.onFallback(); this.destroy(); } });
  }

  private center(layout: Layout) {
    const raw = layout.baseCenter + this.current;
    return raw - Math.round(raw / this.totalWidth) * this.totalWidth;
  }

  resize(preserve = true) {
    if (this.disposed) return;
    const previousTotal = this.totalWidth;
    const rect = this.canvas.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
    this.rect = rect;
    this.view = { width: rect.width, height: rect.height, camera: Math.max(rect.height, innerHeight) / 2 / Math.tan(26.7 * Math.PI / 180), speed: this.view.speed };
    const width = Math.max(1, Math.round(rect.width * dpr)), height = Math.max(1, Math.round(rect.height * dpr));
    if (this.canvas.width !== width || this.canvas.height !== height) { this.canvas.width = width; this.canvas.height = height; }
    this.gl.viewport(0, 0, width, height);
    let cursor = 0;
    this.layouts = this.items.map((item, index) => {
      const ratio = item.width / item.height;
      const height = Math.min(innerHeight * .35, rect.height * .75, rect.width * .74 / ratio);
      const width = height * ratio;
      const layout = { index, baseCenter: cursor + width / 2, center: 0, width, height };
      cursor += width + GAP;
      return layout;
    });
    // Include the last-to-first gap in the loop period.
    this.totalWidth = Math.max(1, cursor);
    if (!preserve) {
      const featured = this.layouts.find(layout => this.items[layout.index].status === "available") ?? this.layouts[0];
      this.current = this.target = -featured.baseCenter;
    }
    else { this.current = this.current / previousTotal * this.totalWidth; this.target = this.target / previousTotal * this.totalWidth; }
    this.invalidate();
  }

  setPaused(paused: boolean) {
    this.paused = paused;
    this.canvas.dataset.paused = String(paused);
    this.syncActivity();
  }

  private active() { return !this.disposed && !this.paused && this.inView && !document.hidden; }
  private stop() { cancelAnimationFrame(this.raf); this.raf = 0; this.lastTime = 0; this.lastDraw = 0; }
  private syncActivity = () => {
    this.media.sync(this.visibleIndices, this.active() && !this.reducedMotion);
    if (this.active()) this.invalidate(); else this.stop();
  };
  private invalidate() {
    if (!this.raf && this.active()) this.raf = requestAnimationFrame(this.frame);
  }

  private frame = (time: number) => {
    this.raf = 0;
    if (!this.active()) return;
    // Idle drift draws at 30fps; pointer/hover/inertial motion retains 60fps.
    const interactive = this.pointer.id >= 0 || this.hoverIndex >= 0 || this.hoverPending || Math.abs(this.target - this.current) > 8;
    if (!interactive && this.lastDraw && time - this.lastDraw < 30) { this.invalidate(); return; }
    const dt = this.lastTime ? clamp((time - this.lastTime) / 1000, 0, .05) : 1 / 60;
    this.lastTime = this.lastDraw = time;
    if (this.hoverPending) { this.resolveHover(); this.hoverPending = false; }
    // Start with the featured collection, then drift only when input is idle.
    // Count visible time, so loading/background tabs cannot skip the opening card.
    const autoEligible = !this.reducedMotion && this.canvas.dataset.ready === "true"
      && !this.pointerInside && !this.keyboardFocus && this.pointer.id < 0;
    if (autoEligible) {
      this.resumeDelay = Math.max(0, this.resumeDelay - dt);
      if (!this.resumeDelay) this.target -= dt * clamp(this.view.width * .025, 20, 36);
    }
    const lagLimit = this.reducedMotion ? 180 : 760;
    this.target = this.current + clamp(this.target - this.current, -lagLimit, lagLimit);
    const follow = this.reducedMotion ? .42 : 1 - Math.pow(.9, dt * 60);
    this.current += (this.target - this.current) * follow;
    const lag = this.target - this.current;
    const changingPosition = Math.abs(lag) > .08;
    if (!changingPosition) this.current = this.target;
    const cycles = Math.round(this.current / this.totalWidth);
    this.current -= cycles * this.totalWidth;
    this.target -= cycles * this.totalWidth;
    this.view.speed = this.reducedMotion || !changingPosition ? 0 : Math.pow(Math.tanh(lag / 550), 2);
    let changing = changingPosition;
    this.hoverValues.forEach((value, index) => {
      const goal = index === this.hoverIndex && !this.pointer.dragging ? 1 : 0;
      const next = value + (goal - value) * (1 - Math.pow(.82, dt * 60));
      this.hoverValues[index] = Math.abs(next - goal) < .001 ? goal : next;
      changing ||= this.hoverValues[index] !== goal;
    });
    this.draw();
    if (autoEligible || changing || this.media.resources.some(r => r?.playing && !r.video?.requestVideoFrameCallback)) this.invalidate();
  };

  private draw() {
    const gl = this.gl, view = this.view;
    // Let the shared CSS backdrop show through outside the opaque card surfaces.
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL); gl.useProgram(this.program);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.vertex); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.mesh.index);
    gl.enableVertexAttribArray(this.positionAttribute); gl.vertexAttribPointer(this.positionAttribute, 2, gl.FLOAT, false, 0, 0);
    gl.uniform2f(this.locations.u_view, view.width, view.height); gl.uniform1f(this.locations.u_camera, view.camera); gl.uniform1f(this.locations.u_speed, view.speed);
    gl.uniform1i(this.locations.u_media, 0); gl.uniform1i(this.locations.u_overlay, 1);
    // Draw neighboring periods too: wrapping a wide card must not cut it in half.
    const copies = Math.ceil(view.width / this.totalWidth) + 1;
    this.visibleCards = this.layouts.flatMap(layout =>
      Array.from({ length: copies * 2 + 1 }, (_, copy) => ({
        ...layout, center: this.center(layout) + (copy - copies) * this.totalWidth,
        hover: this.hoverValues[layout.index],
      })),
    ).filter(card => {
      if (Math.abs(card.center) > view.width + card.width) return false;
      const bounds = surfaceBounds(view, card, card.hover);
      return bounds.right >= 0 && bounds.left <= view.width && bounds.bottom >= 0 && bounds.top <= view.height;
    });
    this.visibleIndices = new Set(this.visibleCards.map(card => card.index));
    this.media.sync(this.visibleIndices, this.active() && !this.reducedMotion);
    this.visibleCards.forEach(card => {
      const resource = this.media.resources[card.index];
      if (!resource) return;
      const video = resource.video;
      if (video && resource.playing && video.readyState >= 2 && (resource.videoDirty || (!video.requestVideoFrameCallback && video.currentTime !== resource.videoTime))) {
        gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, resource.media);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
        resource.videoDirty = false; resource.videoTime = video.currentTime;
      }
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, resource.media);
      gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, resource.overlay);
      gl.uniform2f(this.locations.u_size, card.width, card.height); gl.uniform1f(this.locations.u_center, card.center); gl.uniform1f(this.locations.u_hover, card.hover);
      gl.drawElements(gl.TRIANGLES, this.mesh.count, gl.UNSIGNED_SHORT, 0);
    });
  }

  private resolveHover() {
    if (!this.hoverPoint) { this.hoverIndex = -1; return; }
    const point = { x: this.hoverPoint.x - this.rect.left, y: this.hoverPoint.y - this.rect.top };
    const hit = [...this.visibleCards].reverse().find(card => {
      const box = surfaceBounds(this.view, card, card.hover);
      return point.x >= box.left && point.x <= box.right && point.y >= box.top && point.y <= box.bottom && hitSurface(this.view, card, card.hover, point);
    });
    this.hoverIndex = hit?.index ?? -1;
    const title = hit ? this.items[hit.index].title : "";
    if (this.canvas.dataset.hover !== title) this.canvas.dataset.hover = title;
    const id = hit ? this.items[hit.index].id : "";
    if (this.canvas.dataset.hoverId !== id) this.canvas.dataset.hoverId = id;
    const linked = String(Boolean(hit && this.items[hit.index].href));
    if (this.canvas.dataset.hoverLink !== linked) this.canvas.dataset.hoverLink = linked;
  }
  private queueHover(event: PointerEvent) {
    this.hoverPoint = { x: event.clientX, y: event.clientY }; this.hoverPending = true; this.invalidate();
  }
  private pointerEnter = (event: PointerEvent) => {
    this.rect = this.canvas.getBoundingClientRect();
    this.pointerInside = event.pointerType !== "touch";
    this.invalidate();
  };
  private pointerDown = (event: PointerEvent) => {
    if (event.button !== 0) return;
    this.resumeDelay = 1.8;
    this.pointer = { id: event.pointerId, startX: event.clientX, lastX: event.clientX, lastTime: performance.now(), velocity: 0, dragging: false, moved: false };
    this.invalidate();
  };
  private pointerMove = (event: PointerEvent) => {
    if (event.pointerId !== this.pointer.id) { this.queueHover(event); return; }
    if (!this.pointer.dragging && Math.abs(event.clientX - this.pointer.startX) > 10) {
      this.pointer.dragging = true; this.pointer.moved = true; this.canvas.dataset.dragging = "true";
      this.hoverIndex = -1; this.hoverPending = false;
      try { this.canvas.setPointerCapture(event.pointerId); } catch { /* Interrupted pointer. */ }
    }
    if (this.pointer.dragging) {
      const now = performance.now(), dx = event.clientX - this.pointer.lastX, elapsed = Math.max(8, now - this.pointer.lastTime);
      this.target += dx; this.pointer.velocity = this.pointer.velocity * .65 + dx / elapsed * .35;
      this.pointer.lastX = event.clientX; this.pointer.lastTime = now; this.invalidate(); event.preventDefault();
    } else this.queueHover(event);
  };
  private finishPointer(event: PointerEvent, cancelled = false) {
    if (event.pointerId !== this.pointer.id) return;
    if (this.pointer.dragging && !cancelled) {
      const recent = Math.exp(-Math.max(0, performance.now() - this.pointer.lastTime - 40) / 80);
      this.target += clamp(this.pointer.velocity * recent, -4, 4) * (this.reducedMotion ? 28 : 190);
    }
    if (this.canvas.hasPointerCapture?.(event.pointerId)) this.canvas.releasePointerCapture(event.pointerId);
    delete this.canvas.dataset.dragging;
    if (!cancelled && !this.pointer.moved) {
      this.hoverPoint = { x: event.clientX, y: event.clientY }; this.resolveHover();
      const item = this.items[this.hoverIndex]; if (item?.status === "available" && item.href) this.onNavigate(item.href);
    }
    this.pointer.id = -1; this.pointer.dragging = false; this.resumeDelay = 1.8;
    if (event.pointerType === "touch") { this.pointerInside = false; this.hoverIndex = -1; this.hoverPoint = null; this.hoverPending = false; }
    this.invalidate();
  }
  private pointerUp = (event: PointerEvent) => this.finishPointer(event);
  private pointerCancel = (event: PointerEvent) => this.finishPointer(event, true);
  private pointerLeave = () => { this.pointerInside = false; this.resumeDelay = 1.2; if (this.pointer.id >= 0 && !this.pointer.dragging) this.pointer.id = -1; if (this.pointer.id < 0) { this.hoverPoint = null; this.hoverPending = false; this.hoverIndex = -1; this.canvas.dataset.hover = ""; this.canvas.dataset.hoverId = ""; this.canvas.dataset.hoverLink = "false"; this.invalidate(); } };
  private wheel = (event: WheelEvent) => {
    event.preventDefault(); this.resumeDelay = 1.8;
    const units = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? this.view.width : 1;
    this.target -= (Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY) * units;
    this.invalidate();
  };
  private keyDown = (event: KeyboardEvent) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault(); this.resumeDelay = 1.8; this.target += event.key === "ArrowLeft" ? 150 : -150; this.invalidate();
  };
  private focus = () => {
    this.keyboardFocus = this.canvas.matches(":focus-visible");
    this.invalidate();
  };
  private blur = () => { this.keyboardFocus = false; this.resumeDelay = 1.2; this.invalidate(); };
  private onResize = () => this.resize(true);
  private onScroll = () => { this.rect = this.canvas.getBoundingClientRect(); };
  private bindInputs() {
    this.canvas.addEventListener("focus", this.focus); this.canvas.addEventListener("blur", this.blur);
    this.canvas.addEventListener("pointerenter", this.pointerEnter);
    this.canvas.addEventListener("pointerdown", this.pointerDown); this.canvas.addEventListener("pointermove", this.pointerMove);
    this.canvas.addEventListener("pointerup", this.pointerUp); this.canvas.addEventListener("pointercancel", this.pointerCancel);
    this.canvas.addEventListener("pointerleave", this.pointerLeave); this.canvas.addEventListener("wheel", this.wheel, { passive: false });
    this.canvas.addEventListener("keydown", this.keyDown); window.addEventListener("resize", this.onResize);
    window.addEventListener("scroll", this.onScroll, { passive: true, capture: true });
  }
  destroy() {
    if (this.disposed) return;
    this.disposed = true; this.stop(); this.observer.disconnect(); this.resizeObserver.disconnect();
    document.removeEventListener("visibilitychange", this.syncActivity);
    this.canvas.removeEventListener("focus", this.focus); this.canvas.removeEventListener("blur", this.blur);
    this.canvas.removeEventListener("pointerenter", this.pointerEnter);
    this.canvas.removeEventListener("webglcontextlost", this.contextLost); this.canvas.removeEventListener("pointerdown", this.pointerDown);
    this.canvas.removeEventListener("pointermove", this.pointerMove); this.canvas.removeEventListener("pointerup", this.pointerUp);
    this.canvas.removeEventListener("pointercancel", this.pointerCancel); this.canvas.removeEventListener("pointerleave", this.pointerLeave);
    this.canvas.removeEventListener("wheel", this.wheel); this.canvas.removeEventListener("keydown", this.keyDown); window.removeEventListener("resize", this.onResize);
    window.removeEventListener("scroll", this.onScroll, true);
    this.media.destroy(); this.gl.deleteBuffer(this.mesh.vertex); this.gl.deleteBuffer(this.mesh.index); this.gl.deleteProgram(this.program);
  }
}
