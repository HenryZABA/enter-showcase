import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CasePhotoCard } from '../../src/components/case-library/case-photo-card';
import { ModelTrendingPrompts } from '../../src/components/case-library/model-trending-prompts';
import { cases, type CaseEntry } from '../../src/data/cases';
import type { TrendingPrompt } from '../../src/data/model-pages/trending-prompts';

vi.mock('react-i18next', async importOriginal => ({ ...await importOriginal<typeof import('react-i18next')>(), useTranslation:()=>({t:(key:string)=>key}) }));
vi.mock('@/hooks/use-current-language',()=>({useCurrentLanguage:()=> 'en'}));
const localized={en:'A caption','zh-CN':'图片说明'};
const caseEntry:CaseEntry={...cases[0],gallery:{imageUrl:'/case-poster.webp',format:'landscape',caption:localized}};
const promptEntry:TrendingPrompt={id:'source',title:{en:'Prompt','zh-CN':'提示词'},description:{en:'A description','zh-CN':'简介'},sourceName:'Author',sourceUrl:'https://example.org',promptUrl:'/source-prompt.txt',kind:'original'};
let container:HTMLDivElement,root:Root,observers:Array<{callback:(entries:Array<{isIntersecting:boolean}>)=>void;disconnect:ReturnType<typeof vi.fn>}>;
let play:ReturnType<typeof vi.spyOn>,pause:ReturnType<typeof vi.spyOn>,load:ReturnType<typeof vi.spyOn>;
let reduced:{matches:boolean;addEventListener:ReturnType<typeof vi.fn>;removeEventListener:ReturnType<typeof vi.fn>;callback?:()=>void};
beforeEach(()=>{
 (globalThis as any).IS_REACT_ACT_ENVIRONMENT=true;
 observers=[];
 vi.stubGlobal('IntersectionObserver',class {callback;disconnect=vi.fn();constructor(callback:any){this.callback=callback;observers.push(this);}observe(){} });
 reduced={matches:false,addEventListener:vi.fn((_event,callback)=>{reduced.callback=callback;}),removeEventListener:vi.fn()};
 vi.stubGlobal('matchMedia',()=>reduced);
 vi.spyOn(document,'hidden','get').mockReturnValue(false);
 play=vi.spyOn(HTMLMediaElement.prototype,'play').mockResolvedValue();
 pause=vi.spyOn(HTMLMediaElement.prototype,'pause').mockImplementation(()=>{});
 load=vi.spyOn(HTMLMediaElement.prototype,'load').mockImplementation(()=>{});
 container=document.createElement('div');document.body.append(container);root=createRoot(container);
});
afterEach(async()=>{await act(async()=>root.unmount());container.remove();vi.restoreAllMocks();vi.unstubAllGlobals();});
const render=async(node:React.ReactNode)=>act(async()=>root.render(<MemoryRouter>{node}</MemoryRouter>));
const card=(entry:CaseEntry)=><CasePhotoCard entry={entry} index={1} selectionMode={false} selected={false} onSelectedChange={()=>{}} onOpenDetails={()=>{}}/>;
describe('case and prompt card media',()=>{
 it('keeps static case images and their captions intact',async()=>{
  await render(card(caseEntry));
  expect(container.querySelector('.case-photo-media img')?.getAttribute('src')).toBe('/case-poster.webp');
  expect(container.querySelector('video')).toBeNull();
  expect(container.textContent).toContain('A caption');
 });
 it('supports poster-backed case video with near/visible/hidden/reduced-motion lifecycle',async()=>{
  const videoEntry={...caseEntry,gallery:{...caseEntry.gallery!,videoUrl:'/case.mp4'}};
  await render(card(videoEntry));
  const video=container.querySelector('video')!;
  expect(video.getAttribute('poster')).toBe('/case-poster.webp');expect(video.getAttribute('src')).toBeNull();
  await act(async()=>observers[0].callback([{isIntersecting:true}]));
  expect(video.getAttribute('src')).toBe('/case.mp4');expect(load).toHaveBeenCalled();
  await act(async()=>observers[1].callback([{isIntersecting:true}]));
  expect(play).toHaveBeenCalled();
  await act(async()=>observers[1].callback([{isIntersecting:false}]));expect(pause).toHaveBeenCalled();
  reduced.matches=true;await act(async()=>reduced.callback?.());expect(pause).toHaveBeenCalled();
  await act(async()=>root.render(<MemoryRouter>{null}</MemoryRouter>));
  expect(observers.every(observer=>observer.disconnect.mock.calls.length>0)).toBe(true);
  expect(video.hasAttribute('src')).toBe(false);
  expect(reduced.removeEventListener).toHaveBeenCalled();
 });
 it('keeps the real poster if silent autoplay is blocked',async()=>{
  play.mockRejectedValueOnce(new DOMException('Autoplay blocked','NotAllowedError'));
  await render(card({...caseEntry,gallery:{...caseEntry.gallery!,videoUrl:'/blocked.mp4'}}));
  const video=container.querySelector('video')!;
  await act(async()=>observers[0].callback([{isIntersecting:true}]));
  await act(async()=>observers[1].callback([{isIntersecting:true}]));
  expect(video.getAttribute('poster')).toBe('/case-poster.webp');
  expect(pause).toHaveBeenCalled();
 });
 it('renders a sourced prompt image or video only when that media is provided',async()=>{
  await render(<ModelTrendingPrompts entries={[{...promptEntry,media:{type:'image',src:'/prompt.webp'}}]}/>);
  expect(container.querySelector('.model-trending-media')?.tagName).toBe('IMG');
  await render(<ModelTrendingPrompts entries={[{...promptEntry,media:{type:'video',src:'/prompt.mp4',poster:'/prompt-poster.webp'}}]}/>);
  const video=container.querySelector('video.model-trending-media')!;
  expect(video.getAttribute('poster')).toBe('/prompt-poster.webp');expect(video.getAttribute('src')).toBeNull();
  await act(async()=>observers[0].callback([{isIntersecting:true}]));expect(video.getAttribute('src')).toBe('/prompt.mp4');
  expect(container.textContent).toContain('Prompt');
 });
});
