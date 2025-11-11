const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const HTTP_PORT = 3000;

// Simpan chat history
let chatHistory = [];
const MAX_HISTORY = 100;

// Create HTTP server
const httpServer = http.createServer((req, res) => {
    if (req.url === '/api/chats') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(chatHistory));
    } else if (req.url === '/api/emojis') {
        const emojisDir = path.join(__dirname, 'emojis');
        fs.readdir(emojisDir, (err, files) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
                return;
            }
            const emojis = {};
            files.forEach(file => {
                const ext = path.extname(file).toLowerCase();
                const name = path.basename(file, ext);
                emojis[name] = `/emojis/${file}`;
            });
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ emojis }));
        });
    } else if (req.url === '/api/config') {
        const configPath = path.join(__dirname, 'config.json');
        fs.readFile(configPath, (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data);
        });
    } else if (req.url.startsWith('/emojis/')) {
        const emojiPath = path.join(__dirname, req.url);
        fs.readFile(emojiPath, (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Not Found');
            } else {
                res.writeHead(200, { 'Content-Type': 'image/png' });
                res.end(data);
            }
        });
    } else {
        let filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Not Found');
            } else {
                const ext = path.extname(filePath).toLowerCase();
                const mimeTypes = {
                    '.html': 'text/html',
                    '.js': 'application/javascript',
                    '.css': 'text/css',
                    '.json': 'application/json',
                    '.png': 'image/png',
                    '.jpg': 'image/jpeg',
                    '.gif': 'image/gif',
                };
                res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
                res.end(data);
            }
        });
    }
});

httpServer.listen(HTTP_PORT, () => {
    console.log(`HTTP server listening on http://localhost:${HTTP_PORT}`);
});

// Create WebSocket server
const wss = new WebSocket.Server({ port: PORT });

console.log(`WebSocket server listening on ws://localhost:${PORT}`);

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (data) => {
        try {
            const chat = JSON.parse(data);
            if (chat.type && chat.type === 'ui-config:update') {
                fs.writeFileSync(path.join(__dirname, 'config.json'), JSON.stringify(chat.data, null, 2));
                console.log('UI config updated and saved to config.json');
            }

            // Simpan ke history
            chatHistory.push(chat);
            if (chatHistory.length > MAX_HISTORY) {
                chatHistory.shift();
            }

            // Broadcast ke semua WebSocket clients
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(chat));
                }
            });
        } catch (err) {
            console.error('Invalid message:', data);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});