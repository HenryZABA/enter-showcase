import React,{act} from 'react';
import {createRoot} from 'react-dom/client';
import {MemoryRouter} from 'react-router-dom';
import {it,expect,vi} from 'vitest';
import {CollectionCard} from '../../src/components/case-library/collection-card';
vi.mock('react-i18next',()=>({useTranslation:()=>({t:(key:string)=>key})}));
vi.mock('@/data/showcase-collections',()=>({getShowcaseCollectionCases:()=>[]}));
it('loads near viewport, plays only visible, pauses offscreen/hidden and disconnects on unmount',async()=>{
 (globalThis as any).IS_REACT_ACT_ENVIRONMENT=true;
 const observers:{callback:any;disconnect:any}[]=[];
 vi.stubGlobal('IntersectionObserver',class {callback;disconnect=vi.fn();constructor(callback:any){this.callback=callback;observers.push(this);}observe(){} });
 const play=vi.spyOn(HTMLMediaElement.prototype,'play').mockResolvedValue();
 const pause=vi.spyOn(HTMLMediaElement.prototype,'pause').mockImplementation(()=>{});
 const load=vi.spyOn(HTMLMediaElement.prototype,'load').mockImplementation(()=>{});
 const hidden=vi.spyOn(document,'hidden','get').mockReturnValue(false);
 const node=document.createElement('div');document.body.append(node);const root=createRoot(node);
 const collection={slug:'test',coverVideo:'/test.mp4',coverImage:'/test.webp',displayName:'Test',getCopy:()=>({openLabel:'Test',description:'Test'})} as any;
 try{
  await act(async()=>root.render(<MemoryRouter><CollectionCard collection={collection} href="/prompts/collections/test"/></MemoryRouter>));
  const video=node.querySelector('video')!;expect(video.getAttribute('src')).toBeNull();expect(play).not.toHaveBeenCalled();
  await act(async()=>observers[0].callback([{isIntersecting:true}]));expect(video.getAttribute('src')).toBe('/test.mp4');expect(load).toHaveBeenCalledOnce();
  await act(async()=>observers[1].callback([{isIntersecting:true}]));expect(play).toHaveBeenCalledOnce();
  await act(async()=>observers[1].callback([{isIntersecting:false}]));expect(pause).toHaveBeenCalled();
  hidden.mockReturnValue(true);await act(async()=>document.dispatchEvent(new Event('visibilitychange')));expect(play).toHaveBeenCalledOnce();
  hidden.mockReturnValue(false);await act(async()=>observers[1].callback([{isIntersecting:true}]));expect(play).toHaveBeenCalledTimes(2);
 }finally{await act(async()=>root.unmount());node.remove();vi.restoreAllMocks();vi.unstubAllGlobals();}
 expect(observers.every(observer=>observer.disconnect.mock.calls.length>0)).toBe(true);
});
