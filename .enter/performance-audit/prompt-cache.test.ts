import { describe, it, expect, vi, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadPrompt, loadPromptBatch } from '../../src/lib/prompt-cache';

afterEach(() => vi.unstubAllGlobals());
describe('versioned prompt cache', () => {
  it('coalesces requests, preserves exact bytes, caches success', async () => {
    const raw = readFileSync(resolve(import.meta.dirname, '../../src/data/prompts/wrens-room-build-prompt.txt'), 'utf8');
    const fetcher=vi.fn(async()=>new Response(raw)); vi.stubGlobal('fetch',fetcher);
    const [a,b]=await Promise.all([loadPrompt('/exact-v1.txt'),loadPrompt('/exact-v1.txt')]);
    expect(a).toBe(raw);expect(b).toBe(raw);await loadPrompt('/exact-v1.txt');expect(fetcher).toHaveBeenCalledTimes(1);
  });
  it('retries failures and rejects HTML SPA fallbacks',async()=>{
    const fetcher=vi.fn().mockResolvedValueOnce(new Response('no',{status:503})).mockResolvedValueOnce(new Response('<html>',{headers:{'content-type':'text/html'}})).mockResolvedValue(new Response('exact'));
    vi.stubGlobal('fetch',fetcher);
    await expect(loadPrompt('/retry.txt')).rejects.toThrow();await expect(loadPrompt('/retry.txt')).rejects.toThrow();expect(await loadPrompt('/retry.txt')).toBe('exact');expect(fetcher).toHaveBeenCalledTimes(3);
  });
  it('retains only 32 successful bodies using LRU',async()=>{
    const fetcher=vi.fn(async(url:string)=>new Response(url));vi.stubGlobal('fetch',fetcher);
    for(let i=0;i<32;i++)await loadPrompt(`/lru-${i}.txt`);
    await loadPrompt('/lru-0.txt');await loadPrompt('/lru-32.txt');await loadPrompt('/lru-0.txt');expect(fetcher).toHaveBeenCalledTimes(33);
    await loadPrompt('/lru-1.txt');expect(fetcher).toHaveBeenCalledTimes(34);
  });
  it.each([100,300,500])('bounds %i-entry batch concurrency at four and preserves order',async count=>{
    let active=0,peak=0;
    vi.stubGlobal('fetch',vi.fn(async(url:string)=>{active++;peak=Math.max(peak,active);await new Promise(r=>setTimeout(r,1));active--;return new Response(url);}));
    const entries=Array.from({length:count},(_,i)=>({id:String(i),promptUrl:`/batch-${count}-${i}.txt`}));
    const result=await loadPromptBatch(entries);expect(peak).toBeLessThanOrEqual(4);expect(result.map(e=>e.prompt)).toEqual(entries.map(e=>e.promptUrl));
  });
});
