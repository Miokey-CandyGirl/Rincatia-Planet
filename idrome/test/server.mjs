import { createServer } from 'http'
import { readFile, stat } from 'fs/promises'
import { extname, join, normalize } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const root = join(__dirname, '..')
const PORT = 8765

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ttf': 'font/ttf',
  '.ico': 'image/x-icon'
}

const server = createServer(async (req, res) => {
  try {
    let urlPath = decodeURIComponent(req.url.split('?')[0])
    if (urlPath === '/') urlPath = '/dromai.html'
    const filePath = normalize(join(root, urlPath))
    if (!filePath.startsWith(root)) { res.writeHead(403); res.end('Forbidden'); return }
    const stats = await stat(filePath)
    if (stats.isDirectory()) { res.writeHead(403); res.end('Forbidden'); return }
    const data = await readFile(filePath)
    const ext = extname(filePath).toLowerCase()
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' })
    res.end(data)
  } catch (e) {
    res.writeHead(404); res.end('Not Found: ' + req.url)
  }
})

server.listen(PORT, '127.0.0.1', () => {
  console.log(`[iDrome] http://127.0.0.1:${PORT}/dromai.html`)
})
