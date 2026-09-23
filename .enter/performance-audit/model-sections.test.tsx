import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ModelHotCaseGallery } from '../../src/components/case-library/model-hot-case-gallery';
import { CollectionCard } from '../../src/components/case-library/collection-card';
import { ModelTrendingPrompts } from '../../src/components/case-library/model-trending-prompts';
import { showcaseCollections } from '../../src/data/showcase-collections';
import { curvedGalleryItems } from '../../src/data/curved-gallery';
import type { TrendingPrompt } from '../../src/data/model-pages/trending-prompts';

vi.mock('react-i18next', async importOriginal => ({...await importOriginal<typeof import('react-i18next')>(),useTranslation:()=>({t:(key:string)=>key})}));
vi.mock('@/hooks/use-current-language',()=>({useCurrentLanguage:()=> 'en'}));
vi.mock('@/components/case-library/case-photo-card',()=>({CasePhotoCard:({entry}:any)=><article data-case-id={entry.id}>{entry.title.en}</article>}));
vi.mock('@/components/case-library/case-detail-shell',()=>({CaseDetailShell:()=>null}));
const messages=vi.hoisted(()=>({success:vi.fn(),error:vi.fn()}));
vi.mock('sonner',()=>({toast:messages}));
let root:Root;let element:HTMLDivElement;
beforeEach(()=>{(globalThis as any).IS_REACT_ACT_ENVIRONMENT=true;element=document.createElement('div');document.body.append(element);root=createRoot(element);messages.success.mockClear();messages.error.mockClear();});
afterEach(async()=>{await act(async()=>root.unmount());element.remove();vi.unstubAllGlobals();});
async function render(node:React.ReactNode){await act(async()=>root.render(<MemoryRouter>{node}</MemoryRouter>));}

describe('model membership and attributed prompts',()=>{
 it('keeps model directory cards free of media badges and Explore model labels',async()=>{
  await render(<CollectionCard collection={showcaseCollections[2]} href="/prompts/claude-opus-5-5"/>);
  expect(element.querySelector('.collection-directory-badge')).toBeNull();
  expect(element.querySelector('.collection-directory-count')).toBeNull();
  expect(element.textContent).not.toContain('modelAstra.viewModel');
  expect(element.querySelector('.collection-directory-info h2')?.textContent).toBe('Claude Opus 5.5');
 });
 it('only Astra owns its six real Hot Cases; other model collections have no borrowed projects',async()=>{
  expect(showcaseCollections.map(c=>c.slug)).toEqual(['gpt6','gpt-6-sol-luna','claude-opus-5-5']);
  await render(<ModelHotCaseGallery collection={showcaseCollections[0]}/>);
  expect(element.querySelectorAll('[data-case-id]')).toHaveLength(6);
  for(const collection of showcaseCollections.slice(1)){
   await render(<ModelHotCaseGallery key={collection.slug} collection={collection}/>);
   expect(element.querySelectorAll('[data-case-id]')).toHaveLength(0);
   expect(element.textContent).toContain('modelPages.casesEmpty');
  }
 });
 it('turns the first two former decorative gallery tiles into real model destinations',()=>{
  expect(curvedGalleryItems.slice(0,3).map(item=>item.id)).toEqual(showcaseCollections.map(collection=>collection.slug));
  expect(curvedGalleryItems.slice(0,3).every(item=>item.status==='available'&&Boolean(item.href))).toBe(true);
  expect(curvedGalleryItems.slice(3).every(item=>item.status==='decorative'&&!item.href)).toBe(true);
 });
 it('does not render fictional prompts before sources and texts are provided',async()=>{
  await render(<ModelTrendingPrompts entries={[]}/>);
  expect(element.textContent).toContain('modelPages.promptsEmpty');
  expect(element.querySelector('a,button,article')).toBeNull();
 });
 it('renders real source attribution and copies only the supplied original text (test fixture)',async()=>{
  const raw=['Original prompt','  indented detail'].join(String.fromCharCode(10));
  const writeText=vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText}});
  const fetcher=vi.fn(async()=>new Response(raw));vi.stubGlobal('fetch',fetcher);
  const fixture:TrendingPrompt={id:'verified-fixture',title:{en:'Verified case','zh-CN':'已核实案例'},description:{en:'Source summary','zh-CN':'来源简介'},sourceName:'Original author',sourceUrl:'https://example.org/original',promptUrl:'/verified-fixture.txt',kind:'original'};
  await render(<ModelTrendingPrompts entries={[fixture]}/>);
  expect(element.textContent).toContain('Verified case');expect(element.textContent).toContain('modelPages.originalPrompts');
  const source=element.querySelector('.model-trending-source a') as HTMLAnchorElement;
  expect(source.href).toBe(fixture.sourceUrl);expect(source.rel).toBe('noopener noreferrer');
  const copy=Array.from(element.querySelectorAll('button')).find(button=>button.textContent?.includes('modelPages.copyPrompt'))!;
  await act(async()=>{copy.dispatchEvent(new MouseEvent('click',{bubbles:true}));});
  expect(fetcher).toHaveBeenCalledOnce();expect(writeText).toHaveBeenCalledWith(raw);expect(messages.success).toHaveBeenCalledOnce();
  expect(element.querySelectorAll('a')).toHaveLength(1);
 });
});
