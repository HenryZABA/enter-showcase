import type { CurvedGalleryItem } from "@/data/curved-gallery";

export type GalleryResource = {
  media: WebGLTexture;
  overlay: WebGLTexture;
  video?: HTMLVideoElement;
  videoDirty: boolean;
  videoTime: number;
  playing: boolean;
  frameId?: number;
};

function overlay(item: CurvedGalleryItem, width: number, density: number) {
  const canvas = document.createElement("canvas");
  const height = Math.round(width * item.height / item.width);
  canvas.width = width; canvas.height = height;
  const context = canvas.getContext("2d")!;
  // Typography follows card height, so square cards are as readable as widescreen cards.
  const scale = height / 440;
  // Keep the bright gradient art intact; only protect the small bottom label.
  const decorative = item.status === "decorative";
  const gradient = context.createLinearGradient(0, height * (decorative ? .75 : .5), 0, height);
  gradient.addColorStop(0, "rgba(0,0,0,0)"); gradient.addColorStop(1, decorative ? "rgba(0,0,0,.55)" : "rgba(0,0,0,.78)");
  context.fillStyle = gradient; context.fillRect(0, 0, width, height);
  context.font = `${Math.round(Math.max(25 * scale, 14 * density))}px "Curved Gallery Inter", Inter, sans-serif`;
  context.textBaseline = "bottom"; context.fillStyle = "rgba(255,255,255,.96)";
  const maxTextWidth = width - (item.href ? 126 : 76) * scale;
  context.fillText(item.title, 38 * scale, height - (item.subtitle ? Math.max(69 * scale, 34 * scale + 16 * density) : 34 * scale), maxTextWidth);
  if (item.subtitle) {
    context.font = `${Math.round(Math.max(20 * scale, 12 * density))}px "Curved Gallery Inter", Inter, sans-serif`;
    context.fillStyle = "rgba(255,255,255,.8)";
    context.fillText(item.subtitle, 38 * scale, height - 34 * scale, maxTextWidth);
  }
  // Upcoming concepts are not links: never draw a misleading navigation arrow.
  if (!item.href) return canvas;
  const radius = 23 * scale, cx = width - 48 * scale, cy = height - 48 * scale;
  context.beginPath(); context.arc(cx, cy, radius, 0, Math.PI * 2); context.fillStyle = "rgba(5,5,5,.8)"; context.fill();
  context.strokeStyle = "rgba(255,255,255,.96)"; context.lineWidth = 4 * scale; context.lineCap = "round"; context.lineJoin = "round";
  context.beginPath(); context.moveTo(cx - 7 * scale, cy + 6 * scale); context.lineTo(cx + 7 * scale, cy - 7 * scale); context.lineTo(cx + 7 * scale, cy + 1 * scale); context.moveTo(cx + 7 * scale, cy - 7 * scale); context.lineTo(cx - scale, cy - 7 * scale); context.stroke();
  return canvas;
}

/** Owns asynchronous media and GPU textures, including partially loaded resources. */
export class GalleryMedia {
  readonly resources: (GalleryResource | undefined)[] = [];
  private disposed = false;
  private pending = new Set<() => void>();
  constructor(
    private gl: WebGLRenderingContext,
    private items: CurvedGalleryItem[],
    private invalidate: () => void,
    private onDimensions: (index: number, width: number, height: number) => void,
  ) {}

  private image(src: string) {
    return new Promise<HTMLImageElement | null>(resolve => {
      const image = new Image();
      const finish = (result: HTMLImageElement | null) => {
        image.onload = image.onerror = null;
        this.pending.delete(cancel);
        resolve(result);
      };
      const cancel = () => { finish(null); image.removeAttribute("src"); };
      this.pending.add(cancel);
      image.decoding = "async";
      image.onload = () => finish(image);
      image.onerror = () => finish(null);
      image.src = src;
    });
  }

  private texture(source: TexImageSource) {
    const gl = this.gl, texture = gl.createTexture();
    if (!texture) throw new Error("Unable to allocate gallery texture");
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
    return texture;
  }

  async load(order: number[], widths: number[], onLoaded: () => void) {
    await document.fonts.load('16px "Curved Gallery Inter"');
    if (this.disposed) return;
    const queue = [...order];
    const worker = async () => {
      while (queue.length && !this.disposed) {
        const index = queue.shift()!;
        const item = this.items[index];
        const source = await this.image(item.type === "video" ? item.poster! : item.src);
        if (this.disposed) return;
        if (source) this.onDimensions(index, source.naturalWidth, source.naturalHeight);
        const width = Math.min(1536, Math.max(384, Math.round(widths[index])));
        const canvas = document.createElement("canvas");
        canvas.width = width; canvas.height = Math.round(width * item.height / item.width);
        const context = canvas.getContext("2d")!;
        if (source) context.drawImage(source, 0, 0, canvas.width, canvas.height);
        else { context.fillStyle = "#171717"; context.fillRect(0, 0, canvas.width, canvas.height); }
        const media = this.texture(canvas);
        let overlayTexture: WebGLTexture;
        try { overlayTexture = this.texture(overlay(item, width, width / widths[index] * Math.min(devicePixelRatio || 1, 2))); }
        catch (error) { this.gl.deleteTexture(media); throw error; }
        const resource: GalleryResource = { media, overlay: overlayTexture, videoDirty: false, videoTime: -1, playing: false };
        this.resources[index] = resource;
        if (item.type === "video") {
          const video = document.createElement("video");
          resource.video = video;
          video.src = item.src; video.poster = item.poster || "";
          video.muted = true; video.loop = true; video.playsInline = true;
          video.preload = "none";
          video.onloadedmetadata = () => {
            if (!this.disposed) this.onDimensions(index, video.videoWidth, video.videoHeight);
          };
        }
        onLoaded();
        // Yield between texture uploads; initial visible cards have queue priority.
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    };
    await Promise.all([worker(), worker()]);
  }

  private requestFrame(resource: GalleryResource) {
    const video = resource.video;
    if (!video || !resource.playing || this.disposed || !video.requestVideoFrameCallback) return;
    resource.frameId = video.requestVideoFrameCallback(() => {
      resource.frameId = undefined;
      if (!resource.playing || this.disposed) return;
      resource.videoDirty = true;
      this.invalidate(); this.requestFrame(resource);
    });
  }

  sync(visible: Set<number>, active: boolean) {
    this.resources.forEach((resource, index) => {
      if (!resource?.video) return;
      const play = active && visible.has(index);
      if (play === resource.playing) return;
      resource.playing = play;
      if (play) {
        resource.videoDirty = true;
        this.requestFrame(resource);
        void resource.video.play().then(() => {
          if (!resource.playing || this.disposed) resource.video?.pause();
        }).catch(() => { /* Autoplay denial keeps the real poster visible. */ });
      } else {
        resource.video.pause();
        if (resource.frameId !== undefined) resource.video.cancelVideoFrameCallback(resource.frameId);
        resource.frameId = undefined;
      }
    });
  }

  destroy() {
    this.disposed = true;
    this.pending.forEach(cancel => cancel()); this.pending.clear();
    this.resources.forEach(resource => {
      if (!resource) return;
      if (resource.video) {
        resource.playing = false;
        if (resource.frameId !== undefined) resource.video.cancelVideoFrameCallback(resource.frameId);
        resource.video.pause(); resource.video.removeAttribute("src"); resource.video.load();
      }
      this.gl.deleteTexture(resource.media); this.gl.deleteTexture(resource.overlay);
    });
  }
}
