import { build } from 'vite';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
const root=resolve(import.meta.dirname,'../..');
const baseline=JSON.parse(readFileSync(resolve(root,'dist/.vite/manifest.json')));
const outDir=resolve(root,'../cache-probe-dist');
// Synthetic content changes are confined to this isolated test build, never source or dist.
await build({root,plugins:[{name:'test-only-catalog-change',enforce:'pre',transform(code,id){if(id.endsWith('/src/data/cases.ts'))return code.replace("Wren's Room · Interactive 3D Studio","Wren's Room · Interactive 3D Studio (cache test)");}}],build:{outDir,emptyOutDir:true}});
const changed=JSON.parse(readFileSync(resolve(outDir,'.vite/manifest.json')));
const sdk=m=>Object.values(m).find(entry=>entry.name==='mixpanel-sdk').file;
const result={sdkBefore:sdk(baseline),sdkAfter:sdk(changed),sdkUnchanged:sdk(baseline)===sdk(changed),catalogChanged:baseline['index.html'].file!==changed['index.html'].file};
writeFileSync(resolve(root,'.enter/performance-audit/cache-probe.json'),JSON.stringify(result,null,2));
console.log(result);
if(!result.sdkUnchanged||!result.catalogChanged)process.exitCode=1;
