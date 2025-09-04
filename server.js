import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';

// Obtener el directorio actual
const __dirname = fileURLToPath(new URL('.', import.meta.url));

// Mapeo de extensiones a tipos MIME
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

const PORT = process.env.PORT || 4173;
const DIST_FOLDER = join(__dirname, 'dist');

// Crear servidor HTTP
const server = createServer(async (req, res) => {
  try {
    // Obtener la ruta solicitada
    let path = req.url === '/' ? '/index.html' : req.url;

    // Para rutas SPA, siempre servir index.html
    if (!path.includes('.')) {
      path = '/index.html';
    }

    // Ruta completa al archivo
    const filePath = join(DIST_FOLDER, path);

    // Determinar el tipo MIME basado en la extensión
    const ext = extname(filePath);
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // Leer y servir el archivo
    const content = await readFile(filePath);
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);

  } catch (err) {
    // En caso de error, servir index.html para SPA o mostrar error 404
    if (err.code === 'ENOENT') {
      try {
        const content = await readFile(join(DIST_FOLDER, 'index.html'));
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content);
      } catch (e) {
        res.writeHead(404);
        res.end('File not found');
      }
    } else {
      res.writeHead(500);
      res.end(`Server Error: ${err.code}`);
    }
  }
});

// Iniciar el servidor
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});