import { createServer } from 'node:http';
import { readFile, stat, writeFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { gzipSync } from 'node:zlib';
import { chromium } from 'playwright';
const root = resolve(process.argv[2] || 'dist');
const output = process.argv[3] || '.enter/performance-audit/browser-after.json';
const types = {'.html':'text/html','.js':'application/javascript','.css':'text/css','.json':'application/json','.txt':'text/plain','.svg':'image/svg+xml','.webp':'image/webp','.woff2':'font/woff2','.mp4':'video/mp4'};
const server = createServer(async (req,res) => {
 try {
  let file=resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
  if (!file.startsWith(root+'/')) file=resolve(root,'index.html');
  try { if (!(await stat(file)).isFile()) file=resolve(root,'index.html'); } catch { file=resolve(root,'index.html'); }
  const ext=extname(file), compress=['.html','.js','.css','.json','.txt','.svg'].includes(ext);
  const body=await readFile(file);
  res.writeHead(200,{'Content-Type':types[ext]||'application/octet-stream','Cache-Control':ext==='.html'?'no-cache':'public,max-age=3600',...(compress?{'Content-Encoding':'gzip'}:{})});
  res.end(compress?gzipSync(body):body);
 } catch {res.writeHead(500);res.end();}
});
await new Promise(r=>server.listen(4179,'127.0.0.1',r));
const browser = await chromium.launch({...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ? {executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE} : {}),args:['--no-sandbox']});
const results=[];
try {
 for (const route of ['/prompts','/prompts/collections','/prompts/collections/gpt6']) {
  for(let sample=0;sample<5;sample++) {
   const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true,locale:'en-US'});
   const page=await context.newPage();
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.addInitScript(()=>{
    window.__perf={lcp:0,cls:0,longTasks:[]};
    new PerformanceObserver(l=>{for(const e of l.getEntries())window.__perf.lcp=e.startTime;}).observe({type:'largest-contentful-paint',buffered:true});
    new PerformanceObserver(l=>{for(const e of l.getEntries())if(!e.hadRecentInput)window.__perf.cls+=e.value;}).observe({type:'layout-shift',buffered:true});
    new PerformanceObserver(l=>{for(const e of l.getEntries())window.__perf.longTasks.push(e.duration);}).observe({type:'longtask',buffered:true});
   });
   const cdp=await context.newCDPSession(page);
   await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
   await cdp.send('Network.enable');
   await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:1.6*1024*1024/8,uploadThroughput:750*1024/8});
   for (const cache of ['cold','warm']) {
    await page.goto(`http://127.0.0.1:4179${route}?hl=en`,{waitUntil:'domcontentloaded',timeout:60000});
    await page.locator('h1').waitFor();
    await page.waitForTimeout(6500);
    const metrics=await page.evaluate(()=>({...window.__perf,fcp:performance.getEntriesByName('first-contentful-paint')[0]?.startTime,resources:performance.getEntriesByType('resource').filter(e=>e.name.startsWith(location.origin)).map(e=>({url:e.name,transfer:e.transferSize,decoded:e.decodedBodySize})),iframes:document.querySelectorAll('iframe').length}));
    results.push({route,sample,cache,...metrics,errors:[...errors]});
    await writeFile(output,JSON.stringify({environment:{viewport:'390x844',dpr:2,cpu:4,rtt:150,downMbps:1.6,upKbps:750,consent:'fresh/default, unchanged',server:'local gzip; lab cache headers, not deployment evidence'},results},null,2));
   }
   await context.close();
  }
 }
} finally { await browser.close(); await new Promise(r=>server.close(r)); }
console.log(`Saved ${results.length} samples to ${output}`);
