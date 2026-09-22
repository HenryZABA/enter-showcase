import { describe, it, expect, vi, afterEach } from 'vitest';
import { createPreviewBudget } from '../../src/components/case-library/preview-budget';
afterEach(()=>vi.unstubAllGlobals());
describe('shared preview budget',()=>{
 it.each([1,3])('caps visible iframe grants at %i and releases offscreen/paused/unmounted',limit=>{
  const observers:{callback:(entries:{isIntersecting:boolean}[])=>void;disconnect:ReturnType<typeof vi.fn>}[]=[];
  vi.stubGlobal('IntersectionObserver',class { callback;disconnect=vi.fn();constructor(callback:any){this.callback=callback;observers.push(this);}observe(){} });
  const budget=createPreviewBudget();budget.setLimit(limit);
  const states=new Array(24).fill(false);
  const cleanup=states.map((_,i)=>budget.register(document.createElement('div'),active=>{states[i]=active;}));
  observers.forEach(observer=>observer.callback([{isIntersecting:true}]));
  expect(states.filter(Boolean)).toHaveLength(limit);
  observers[0].callback([{isIntersecting:false}]);expect(states[0]).toBe(false);expect(states.filter(Boolean)).toHaveLength(limit);
  budget.setLimit(0);expect(states.filter(Boolean)).toHaveLength(0);
  budget.setLimit(limit);expect(states.filter(Boolean)).toHaveLength(limit);
  cleanup.forEach(fn=>fn());expect(observers.every(o=>o.disconnect.mock.calls.length===1)).toBe(true);
 });
});
