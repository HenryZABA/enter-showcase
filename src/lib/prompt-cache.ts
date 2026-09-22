const MAX_CACHED_PROMPTS = 32;
const cache = new Map<string, string>();
const inFlight = new Map<string, Promise<string>>();

/** Versioned asset URLs are cache keys; failed requests never poison retries. */
export function loadPrompt(url: string): Promise<string> {
  const cached = cache.get(url);
  if (cached !== undefined) {
    cache.delete(url);
    cache.set(url, cached);
    return Promise.resolve(cached);
  }
  const pending = inFlight.get(url);
  if (pending) return pending;
  const request = fetch(url).then(async response => {
    if (!response.ok || response.headers.get("content-type")?.includes("text/html")) {
      throw new Error(`Prompt request failed: ${response.status}`);
    }
    const text = await response.text();
    cache.set(url, text);
    while (cache.size > MAX_CACHED_PROMPTS) cache.delete(cache.keys().next().value!);
    return text;
  }).finally(() => inFlight.delete(url));
  inFlight.set(url, request);
  return request;
}

/** Four workers preserve catalog ordering without firing hundreds of requests. */
export async function loadPromptBatch<T extends { promptUrl: string | null }>(entries: readonly T[]): Promise<(T & { prompt: string | null })[]> {
  const result = new Array<T & { prompt: string | null }>(entries.length);
  let cursor = 0;
  let failed = false;
  const worker = async () => {
    while (!failed && cursor < entries.length) {
      const index = cursor++;
      const entry = entries[index];
      try {
        result[index] = { ...entry, prompt: entry.promptUrl ? await loadPrompt(entry.promptUrl) : null };
      } catch (error) {
        failed = true;
        throw error;
      }
    }
  };
  await Promise.all(Array.from({ length: Math.min(4, entries.length) }, worker));
  return result;
}
