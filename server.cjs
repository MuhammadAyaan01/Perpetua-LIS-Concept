// Local concept server: only explicit review assets are public.
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const {gzipSync}=require('node:zlib'),{createHash}=require('node:crypto');
const root=__dirname;
const publicFiles=new Map([
 ['/', ['index.html','text/html; charset=utf-8']],
 ['/index.html',['index.html','text/html; charset=utf-8']],
 ['/site.css',['site.css','text/css; charset=utf-8']],
 ['/site.js',['site.js','text/javascript; charset=utf-8']],
 ['/assets/logo-web.png',['assets/logo-web.png','image/png']],
 ['/assets/lis-logo-web.png',['assets/lis-logo-web.png','image/png']],
 ['/assets/demo-poster.jpg',['assets/demo-poster.jpg','image/jpeg']]
]);
const securityHeaders={
 'Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self'; media-src 'self' https://perpetuafoundry.ai; connect-src 'none'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'",
 'X-Content-Type-Options':'nosniff','X-Frame-Options':'DENY','Referrer-Policy':'strict-origin-when-cross-origin',
 'Permissions-Policy':'camera=(), microphone=(), geolocation=(), payment=()',
 'X-Robots-Tag':'noindex, nofollow','Cache-Control':'no-cache','Vary':'Accept-Encoding'
};
http.createServer((req,res)=>{
 for(const [key,value] of Object.entries(securityHeaders))res.setHeader(key,value);
 if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{'Allow':'GET, HEAD','Content-Type':'text/plain; charset=utf-8'});return res.end('Method not allowed')}
 let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}catch{res.writeHead(400,{'Content-Type':'text/plain; charset=utf-8'});return res.end('Bad request')}
 const entry=publicFiles.get(pathname);
 if(!entry){res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'});return res.end('Not found')}
 fs.readFile(path.join(root,entry[0]),(error,data)=>{
  if(error){res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'});return res.end('Not found')}
  const etag='"'+createHash('sha256').update(data).digest('hex').slice(0,24)+'"';res.setHeader('ETag',etag);
  if(req.headers['if-none-match']===etag){res.writeHead(304);return res.end()}
  const compressed=/\bgzip\b/.test(req.headers['accept-encoding']||'')&&/^(text\/|application\/json)/.test(entry[1]);
  const body=compressed?gzipSync(data):data;
  if(compressed)res.setHeader('Content-Encoding','gzip');
  res.writeHead(200,{'Content-Type':entry[1],'Content-Length':body.length});res.end(req.method==='HEAD'?undefined:body);
 });
}).listen(4173,'127.0.0.1',()=>console.log('Restricted local preview: http://127.0.0.1:4173'));
