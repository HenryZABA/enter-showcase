import assert from "node:assert/strict";
import { test } from "node:test";
import { bindHoverVideo } from "../src/lib/hover-video.ts";

function fixture({ coarse = false, reduced = false, play } = {}) {
  const originalWindow = globalThis.window;
  const originalDocument = globalThis.document;
  const document = Object.assign(new EventTarget(), { hidden: false });
  globalThis.document = document;
  globalThis.window = { matchMedia: query => Object.assign(new EventTarget(), { matches: query.includes("reduced-motion") ? reduced : !coarse }) };
  const video = Object.assign(new EventTarget(), {
    src: "", muted: false, defaultMuted: false, paused: true, plays: 0, loads: 0,
    hasAttribute() { return Boolean(this.src); },
    removeAttribute() { this.src = ""; },
    load() { this.loads += 1; },
    pause() { this.paused = true; },
    play() { this.plays += 1; this.paused = false; return play ? play() : Promise.resolve(); },
  });
  const unbind = bindHoverVideo(video, "https://example.test/real-video.mp4");
  return { video, document, emit(type, pointerType = "mouse") { video.dispatchEvent(Object.assign(new Event(type), { pointerType })); },
    cleanup() { unbind(); globalThis.window = originalWindow; globalThis.document = originalDocument; } };
}

test("hover alone starts muted video; leaving unloads it and restores poster", async () => {
  const f = fixture();
  try {
    assert.equal(f.video.src, ""); assert.equal(f.video.plays, 0); assert.equal(f.video.loads, 0);
    f.emit("pointerenter"); await Promise.resolve();
    assert.equal(f.video.plays, 1); assert.equal(f.video.muted, true); assert.equal(f.video.defaultMuted, true);
    assert.ok(f.video.src); assert.equal(f.video.paused, false);
    f.emit("pointerleave");
    assert.equal(f.video.src, ""); assert.equal(f.video.paused, true);
    f.emit("pointerenter"); assert.equal(f.video.plays, 2);
    f.document.hidden = true; f.document.dispatchEvent(new Event("visibilitychange"));
    assert.equal(f.video.src, "");
  } finally { f.cleanup(); }
});

test("touch, coarse pointer and reduced motion do not request video", () => {
  for (const options of [{ coarse: true }, { reduced: true }, {}]) {
    const f = fixture(options);
    try { f.emit("pointerenter", Object.keys(options).length ? "mouse" : "touch"); assert.equal(f.video.plays, 0); assert.equal(f.video.src, ""); }
    finally { f.cleanup(); }
  }
});

test("play rejection restores poster, while stale rejection cannot stop a new hover", async () => {
  const rejects = [];
  const f = fixture({ play: () => new Promise((_, reject) => rejects.push(reject)) });
  try {
    f.emit("pointerenter"); f.emit("pointerleave"); f.emit("pointerenter");
    rejects[0](new Error("cancelled")); await new Promise(resolve => setImmediate(resolve));
    assert.ok(f.video.src); assert.equal(f.video.paused, false);
    rejects[1](new Error("denied")); await new Promise(resolve => setImmediate(resolve));
    assert.equal(f.video.src, ""); assert.equal(f.video.paused, true);
  } finally { f.cleanup(); }
});

test("cleanup removes hover listeners and media sources", () => {
  const f = fixture(); f.emit("pointerenter"); f.cleanup();
  f.emit("pointerenter"); assert.equal(f.video.plays, 1); assert.equal(f.video.src, "");
});
