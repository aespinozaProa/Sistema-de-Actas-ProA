const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const clients = new Set();
const openPage = () => { if (process.platform === 'win32') require('node:child_process').execFile('rundll32.exe', ['url.dll,FileProtocolHandler', 'http://localhost:4173/']); };
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.webmanifest':'application/manifest+json','.png':'image/png','.svg':'image/svg+xml'};
const allowed = name => name === 'index.html' || name === 'manifest.webmanifest' || name === 'sw.js' || name.startsWith('assets/');
http.createServer((req, res) => {
  const pathname = new URL(req.url, 'http://localhost').pathname;
  if (pathname === '/__recargar') {
    res.writeHead(200, {'Content-Type':'text/event-stream', 'Cache-Control':'no-store', Connection:'keep-alive'});
    res.write(': conectado\n\n'); clients.add(res); req.on('close', () => clients.delete(res)); return;
  }
  let name; try { name = decodeURIComponent(pathname).replace(/^\/+/, '') || 'index.html'; } catch { res.writeHead(400).end(); return; }
  const file = path.resolve(root, name);
  if (!allowed(name) || !file.startsWith(root + path.sep) || (name.startsWith('assets/') && !file.startsWith(path.join(root, 'assets') + path.sep))) { res.writeHead(404).end(); return; }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404).end('No encontrado'); return; }
    res.writeHead(200, {'Content-Type':types[path.extname(file)] || 'application/octet-stream', 'Cache-Control':'no-store'});
    if (name === 'index.html') return res.end(data.toString().replace('</body>', '<script>new EventSource("/__recargar").onmessage=()=>location.reload()</script></body>'));
    res.end(data);
  });
}).listen(4173, '127.0.0.1', () => {
  console.log('Vista local: http://localhost:4173/ — cerrar esta ventana para detener.');
  openPage();
}).on('error', error => {
  if (error.code === 'EADDRINUSE') { console.log('Ya hay un servidor en el puerto 4173.'); openPage(); process.exit(0); }
  console.error(error.message); process.exit(1);
});
for (const directory of [root, path.join(root, 'assets')]) fs.watch(directory, {recursive:true}, (_, name) => {
  if (name && /\.(html|css|js|json|webmanifest|png|svg)$/.test(name)) for (const client of clients) client.write('data: recargar\n\n');
});
