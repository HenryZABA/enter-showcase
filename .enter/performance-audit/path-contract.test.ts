import {it,expect} from 'vitest';
import {withEntryPrefix,assetPath} from '../../src/lib/app-paths';
it('preserves both entry families and the resource namespace',()=>{
 for(const suffix of ['', '/collections','/collections/gpt6','/collections/gpt-6-astra','/gpt-6-sol-luna','/claude-opus-5-5','/collections/claude-opus-5-5']){
  expect(withEntryPrefix('/showcases'+suffix,'/prompts')).toBe('/prompts'+suffix);
  expect(withEntryPrefix('/showcases'+suffix,'/showcases')).toBe('/showcases'+suffix);
 }
 expect(withEntryPrefix('/prompts/collections/gpt6','/prompts')).toBe('/prompts/collections/gpt6');
 expect(assetPath('media/preview.webp')).toBe('/_prompts/media/preview.webp');
});
