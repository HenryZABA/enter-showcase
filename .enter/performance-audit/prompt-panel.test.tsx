import React,{act} from 'react';
import {createRoot} from 'react-dom/client';
import {it,expect,vi} from 'vitest';
import {PromptPanel} from '../../src/components/case-library/prompt-panel';
vi.mock('react-i18next',()=>({useTranslation:()=>({t:(key:string)=>key})}));
vi.mock('@/data/cases',()=>({pickLocalized:(value:any)=>value.en}));
const actions=vi.hoisted(()=>({copyText:vi.fn(async()=>true),downloadTextFile:vi.fn(()=>true),sanitizeFilename:(title:string)=>title}));
vi.mock('@/lib/prompt-file',()=>actions);
it('retries failed prompt reads, copies and downloads verbatim content',async()=>{
 (globalThis as any).IS_REACT_ACT_ENVIRONMENT=true;
 const raw=['Exact','  content','```nested```'].join(String.fromCharCode(10));
 const fetcher=vi.fn().mockResolvedValueOnce(new Response('offline',{status:503})).mockResolvedValueOnce(new Response(raw));
 vi.stubGlobal('fetch',fetcher);
 const node=document.createElement('div');document.body.append(node);const root=createRoot(node);
 try{
  await act(async()=>root.render(<PromptPanel promptUrl="/panel-test.txt" title="Title" promptKind="original"/>));
  expect(node.textContent).toContain('common.error');
  await act(async()=>{node.querySelector('button')!.click();});
  expect(node.querySelector('pre')?.textContent).toBe(raw);
  await act(async()=>node.querySelectorAll('button')[0].click());
  expect(actions.copyText).toHaveBeenCalledWith(raw);
  await act(async()=>node.querySelectorAll('button')[1].click());
  expect(actions.downloadTextFile.mock.calls[0][1]).toContain(['````text',raw,'````'].join(String.fromCharCode(10)));
 }finally{await act(async()=>root.unmount());node.remove();vi.unstubAllGlobals();}
});
