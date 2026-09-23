import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ShowcaseLibraryView } from '../../src/components/case-library/showcase-library-view';
import { cases, type CaseEntry } from '../../src/data/cases';
import { useCaseFilters } from '../../src/hooks/use-case-filters';

vi.mock('react-i18next',async(importOriginal)=>({...await importOriginal<typeof import('react-i18next')>(),useTranslation:()=>({t:(key:string,options?:any)=>options?.value === undefined ? key : `${key}:${options.value}`})}));
vi.mock('@/hooks/use-current-language',()=>({useCurrentLanguage:()=> 'en'}));
vi.mock('@/components/layout/Header',()=>({Header:()=>null}));
vi.mock('@/components/layout/Footer',()=>({Footer:()=>null}));
vi.mock('@/components/case-library/hero-stage',()=>({HeroStage:()=>null}));
vi.mock('@/components/case-library/collection-carousel',()=>({CollectionCarousel:()=>null}));
vi.mock('@/components/case-library/case-detail-shell',()=>({CaseDetailShell:()=>null}));
const download = vi.hoisted(()=>vi.fn(()=>true));
vi.mock('@/lib/prompt-file',()=>({downloadTextFile:download}));
let container:HTMLDivElement,root:Root;
let observers:{callback:any;node?:Element}[];
beforeEach(()=>{
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT=true;
  observers=[];
  vi.stubGlobal('IntersectionObserver',class {callback;node?:Element;constructor(callback:any){this.callback=callback;observers.push(this);}observe(node:Element){this.node=node;}disconnect(){} });
  vi.stubGlobal('ResizeObserver',class {observe(){}disconnect(){} });
  vi.stubGlobal('matchMedia',()=>({matches:false,addEventListener(){},removeEventListener(){}}));
  HTMLElement.prototype.scrollIntoView=vi.fn();
  vi.stubGlobal('fetch',vi.fn(async(url:string)=>new Response(`VERBATIM ${url}\n  spacing\n`)));
  download.mockClear();
  container=document.createElement('div');document.body.append(container);root=createRoot(container);
});
afterEach(async()=>{await act(async()=>root.unmount());container.remove();vi.unstubAllGlobals();});
const entries=(count:number):CaseEntry[]=>Array.from({length:count},(_,i)=>({...cases[i%cases.length],id:`fixture-${i}`,title:{en:`Case ${i}`,'zh-CN':`测试案例 ${i}`},description:{en:`Description ${i}`,'zh-CN':`内容 ${i}`},promptUrl:`/fixture-${i}.txt`,gallery:{imageUrl:'/fixture.webp',caption:{en:`Image ${i}`,'zh-CN':`图片 ${i}`},format:'landscape'}}));
const click=async(node:Element)=>act(async()=>{node.dispatchEvent(new MouseEvent('click',{bubbles:true}));});
const button=(text:string)=>Array.from(container.querySelectorAll('button')).find(node=>node.textContent?.includes(text))!;
async function mount(data:CaseEntry[],layout:'catalog'|'collection'='catalog') {
 await act(async()=>root.render(<MemoryRouter initialEntries={['/prompts?hl=en']}><ShowcaseLibraryView entries={data} layout={layout} documentTitle="Test" heading="Cases" hero={{eyebrow:'',titleLine1:'',titleLine2:'',image:'',imageWidth:1,imageHeight:1}} bundleTitle="Test" downloadFileName="test.md" /></MemoryRouter>));
}
describe('bounded real card rendering (synthetic data only in tests)',()=>{
 it.each([100,300,500])('keeps %i catalog cases bounded, preserves cross-page selection and download',async count=>{
  const data=entries(count);await mount(data);
  expect(container.querySelectorAll('article')).toHaveLength(9);
  await click(button('bundle.buttonWithCount'));
  expect(container.querySelectorAll('article')).toHaveLength(9);
  await click(container.querySelector('[role="checkbox"]')!);
  await click(button('gallery.exploreMore'));
  expect(container.querySelectorAll('article')).toHaveLength(24);
  await click(button('common.next'));
  expect(container.querySelectorAll('article')).toHaveLength(24);
  await click(container.querySelector('[role="checkbox"]')!);
  expect(button('bundle.downloadSelectedCount')?.textContent).toContain(':2');
  await click(button('common.previous'));
  expect(container.querySelector('[role="checkbox"]')?.getAttribute('data-state')).toBe('checked');
  await click(button('bundle.downloadSelectedCount'));
  await act(async()=>{await new Promise(r=>setTimeout(r,50));});
  expect(download).toHaveBeenCalledOnce();
  expect(container.querySelector('[role="dialog"]')).toBeNull();
  const markdown=download.mock.calls[0][1] as string;
  expect(markdown).toContain('VERBATIM /fixture-0.txt\n  spacing\n');expect(markdown).toContain('VERBATIM /fixture-24.txt');
  expect(markdown.indexOf('Case 0')).toBeLessThan(markdown.indexOf('Case 24'));
 });
 it.each([100,300,500])('mounts at most 24 of %i collection cards and at most three live frames',async count=>{
  await mount(entries(count),'collection');expect(container.querySelectorAll('article')).toHaveLength(24);
  await act(async()=>{observers.forEach(o=>o.callback([{isIntersecting:true}]));});
  expect(container.querySelectorAll('iframe')).toHaveLength(3);
  await click(button('common.next'));
  expect(container.querySelectorAll('article')).toHaveLength(24);expect(container.querySelectorAll('iframe')).toHaveLength(0);
 });
 it.each([0,1,9,24,25])('handles %i-entry collection boundaries and final pages',async count=>{
  await mount(entries(count),'collection');expect(container.querySelectorAll('article')).toHaveLength(Math.min(count,24));
  if(count===25){await click(button('common.next'));expect(container.querySelectorAll('article')).toHaveLength(1);expect(button('common.next').disabled).toBe(true);}
  if(count===0)expect(container.textContent).toContain('gallery.emptyTitle');
 });
 it('resets category pagination without dropping selected IDs',async()=>{
  await mount(entries(300),'collection');await click(button('bundle.buttonWithCount'));await click(container.querySelector('[role="checkbox"]')!);
  await click(button('common.next'));await click(button('category.business'));
  expect(button('common.previous').disabled).toBe(true);expect(button('bundle.downloadSelectedCount').textContent).toContain(':1');
  expect(container.querySelectorAll('article')).toHaveLength(24);
 });
 it('indexes the complete collection in every display language, excluding provenance',async()=>{
  let result:ReturnType<typeof useCaseFilters>;
  const data=entries(500);
  function Harness(){result=useCaseFilters(data);return null;}
  await act(async()=>root.render(<Harness/>));
  await act(async()=>result!.setQuery('测试案例 499'));
  expect(result!.filteredCases.map(e=>e.id)).toEqual(['fixture-499']);
  await act(async()=>result!.setQuery(data[0].sourceTitle));expect(result!.filteredCases).toHaveLength(0);
  await act(async()=>result!.reset());expect(result!.filteredCases).toHaveLength(500);
  expect(result!.categoryCounts.get('all')).toBe(500);
 });
});
