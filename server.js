const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { URL } = require('node:url');

const root = __dirname;
const dataDir = process.env.DATA_DIR || path.join(root, 'data');
const contactsFile = path.join(dataDir, 'contactos.txt');
const port = Number(process.env.PORT || 3000);
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff' };

function reply(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(body));
}
function clean(value, max) { return String(value || '').replace(/[\r\n\t]+/g, ' ').trim().slice(0, max); }

http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  if (req.method === 'POST' && url.pathname === '/api/contacto') {
    try {
      const chunks = []; let size = 0;
      for await (const chunk of req) { size += chunk.length; if (size > 12000) return reply(res, 413, { error: 'La consulta es demasiado larga.' }); chunks.push(chunk); }
      const form = new URLSearchParams(Buffer.concat(chunks).toString());
      if (form.get('website')) return reply(res, 200, { ok: true }); // Honeypot
      const name = clean(form.get('name'), 120), email = clean(form.get('email'), 254);
      const phone = clean(form.get('phone'), 50), subject = clean(form.get('subject'), 160), message = clean(form.get('message'), 3000);
      if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !subject || !message) return reply(res, 400, { error: 'Revisa nombre, correo, motivo y mensaje.' });
      await fs.promises.mkdir(dataDir, { recursive: true });
      const record = { fecha: new Date().toISOString(), nombre: name, correo: email, celular: phone, motivo: subject, mensaje: message };
      await fs.promises.appendFile(contactsFile, JSON.stringify(record) + '\n', { encoding: 'utf8', mode: 0o600 });
      return reply(res, 201, { ok: true });
    } catch (error) { console.error('No se pudo guardar la consulta:', error.message); return reply(res, 500, { error: 'No se pudo guardar la consulta. Intenta más tarde.' }); }
  }
  if (req.method === 'GET' && url.pathname === '/api/contactos') {
    const token = process.env.CONTACTS_VIEW_TOKEN;
    if (!token || req.headers.authorization !== `Bearer ${token}`) return reply(res, 404, { error: 'No encontrado.' });
    try { const data = await fs.promises.readFile(contactsFile, 'utf8'); return reply(res, 200, data.split('\n').filter(Boolean).map(line => JSON.parse(line))); }
    catch (error) { if (error.code === 'ENOENT') return reply(res, 200, []); return reply(res, 500, { error: 'No se pudieron leer las consultas.' }); }
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') return reply(res, 405, { error: 'Método no permitido.' });
  let pathname = decodeURIComponent(url.pathname);
  if (pathname === '/') pathname = '/index.html';
  const file = path.resolve(root, `.${pathname}`);
  const privatePath = pathname.toLowerCase();
  if (!file.startsWith(root + path.sep) || file === contactsFile || privatePath.startsWith('/data/') || privatePath === '/data' || privatePath.startsWith('/private-source-assets/') || privatePath === '/private-source-assets') return reply(res, 404, { error: 'No encontrado.' });
  try {
    const stat = await fs.promises.stat(file);
    if (!stat.isFile()) return reply(res, 404, { error: 'No encontrado.' });
    res.writeHead(200, { 'Content-Type': mime[path.extname(file).toLowerCase()] || 'application/octet-stream', 'X-Content-Type-Options': 'nosniff' });
    if (req.method === 'HEAD') return res.end();
    fs.createReadStream(file).pipe(res);
  } catch { reply(res, 404, { error: 'No encontrado.' }); }
}).listen(port, '0.0.0.0', () => console.log(`Portfolio listo en puerto ${port}`));
