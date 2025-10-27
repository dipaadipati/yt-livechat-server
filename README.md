# YouTube Live Chat Server

Aplikasi untuk scrape YouTube Live Chat secara real-time dan mengirim data melalui WebSocket.

## 📋 Fitur

- ✅ Scrape live chat YouTube secara real-time
- ✅ WebSocket server untuk broadcast chat ke multiple clients
- ✅ HTTP server untuk menampilkan chat di browser
- ✅ Support emoji custom
- ✅ Support member badge & moderator badge
- ✅ Chat history (max 100 pesan)
- ✅ Auto-reconnect ke server

## 🛠️ Requirement

- **Node.js** v14+ (download dari https://nodejs.org/)
- **Tampermonkey** browser extension (Chrome, Firefox, dll)

## 📦 Installation

### 1. Setup Node.js Server

```bash
# Clone atau download project ini
git clone https://github.com/dipaadipati/yt-livechat-server.git

# Pindah lokasi
cd yt-livechat-server

# Install dependencies
npm install
```

### 2. Install Tampermonkey

- **Chrome**: https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobp53f
- **Firefox**: https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/

### 3. Setup Tampermonkey Script

1. Buka extension Tampermonkey di browser
2. Klik **Create a new script**
3. Copy-paste isi dari [tampermonkey_script.js](tampermonkey_script.js)
4. Save script (Ctrl + S)

## 🚀 Cara Menggunakan

### Step 1: Jalankan Server

```bash
node server.js
```

Output yang benar:
```
HTTP server listening on http://localhost:3000
WebSocket server listening on ws://localhost:8080
```

### Step 2: Buka YouTube Live Chat

1. Buka YouTube Live Chat di tab browser
2. Pastikan Tampermonkey script sudah aktif
3. Buka browser console (F12) untuk melihat debug log
4. Tunggu sampai muncul: `[YT Chat] Connected to WebSocket server`

### Step 3: Lihat Chat

**Opsi A: Browser**
- Buka `http://localhost:3000` di browser baru
- Chat akan muncul real-time

**Opsi B: OBS**
1. Buka OBS Studio
2. Add Source → **Browser**
3. URL: `http://localhost:3000`
4. Width: 500 (dapat disesuaikan)
5. Height: 600 (dapat disesuaikan)
6. Centang **Shutdown source when not visible** (optional)

## ⚙️ Struktur Folder

```
│ yt-livechat-server
├── server.js              # Main WebSocket + HTTP server
├── tampermonkey_script.js # Script untuk scrape YouTube
├── public/
│   ├── index.html         # UI untuk menampilkan chat
│   ├── script.js          # Frontend logic
│   └── style.css          # Styling
├── emojis/                # Folder untuk custom emoji (optional)
├── package.json
└── README.md              # File ini
```

## 🎯 Konfigurasi (optional)

### Ubah Port Server

Edit di `server.js`:
```javascript
const PORT = 8080;        // WebSocket port
const HTTP_PORT = 3000;   // HTTP server port
```

### Ubah Jumlah Chat History

Edit di `server.js`:
```javascript
const MAX_HISTORY = 100;  // Ubah 100 ke nilai lain
```

### Ubah Interval Scrape

Edit di `tampermonkey_script.js`:
```javascript
setInterval(scrapeLiveChat, 500);  // 500ms = 0.5 detik
// Ubah ke:
// 200 = ultra real-time (lebih boros)
// 1000 = 1 detik (lebih hemat)
// 2000 = 2 detik (sangat hemat)
```

### Custom Emoji

1. Buat folder `emojis` di root project
2. Taruh file emoji (.png, .jpg, .webp) ke sana
3. Nama file harus sesuai dengan kode emoji di chat
   - Contoh: `YT_emote1.webp` → `YT_emote1` di chat akan diganti gambar

Contoh struktur:
```
emojis/
├── emote_name.png
├── lol.jpg
├── YT_emote1.webp
└── thumbsup.png
```

## ⚠️ Known Issues & Solusi

### ❌ Problem 1: "WebSocket is closed" Error

**Penyebab:** Server tidak running atau port terblokir

**Solusi:**
```bash
# Pastikan server sudah running
node server.js

# Cek apakah port 8080 & 3000 tidak terpakai
# Windows:
netstat -ano | findstr :8080
netstat -ano | findstr :3000
```

### ❌ Problem 2: Tab Live Chat Harus Selalu Berjalan

**Penyebab:** Tampermonkey script hanya berjalan di tab yang aktif

**Solusi:**
1. **Background Tab Script**
   - Buka live chat di tab tersendiri
   - Jangan tutup tab tersebut (bisa dimininimalkan)
   - Script akan terus berjalan di background

2. **Prevent Tab Sleeping** (Chrome Extension)
   - Install "Don't Close Window With Last Tab" atau extension sejenis
   - Agar tab live chat tidak auto-close

3. **Dedicated Device**
   - Gunakan device/laptop terpisah hanya untuk live chat
   - Hanya jalankan server, tidak perlu buka UI

### ❌ Problem 3: Chat Tidak Muncul di OBS

**Penyebab:** Browser source setting salah atau URL tidak accessible

**Solusi:**
1. Buka `http://localhost:3000` di browser lokal, pastikan chat muncul
2. Di OBS, cek ulang URL dan settings
3. Restart OBS browser source (right-click → Refresh)
4. Cek firewall Windows tidak memblokir port 3000

### ❌ Problem 4: Emoji Tidak Muncul

**Penyebab:** 
- Folder `emojis` tidak ada
- Nama file emoji tidak sesuai

**Solusi:**
1. Buat folder `emojis` di root project
2. Pastikan nama file emoji sesuai format di chat
3. Cek di `/api/emojis` apakah emoji sudah ter-load:
   ```
   http://localhost:3000/api/emojis
   ```

### ❌ Problem 5: Browser Tab Freeze/Lag

**Penyebab:** 
- Chat history terlalu banyak
- Rendering 100+ chat items

**Solusi:**
- Kurangi `MAX_HISTORY` di server.js:
  ```javascript
  const MAX_HISTORY = 50;  // Ubah dari 100 ke 50
  ```

## 🔧 Troubleshooting

### Cek Debug Log

**Di Tampermonkey (YouTube):**
1. Buka F12 → Console
2. Filter: `[YT Chat]`
3. Lihat apakah ada error atau message

**Di Browser OBS (localhost:3000):**
1. Buka F12 → Console
2. Lihat apakah WebSocket connected atau ada error

### Clear Chat History

Restart server:
```bash
# Stop: Ctrl + C
# Start: node server.js
```

## 📱 API Endpoints

Jika butuh integrate ke aplikasi lain:

```bash
# Get all chat history
GET http://localhost:3000/api/chats

# Get all emoji mappings
GET http://localhost:3000/api/emojis

# Get specific emoji
GET http://localhost:3000/emojis/emoji_name.png
```

## 🚀 Deployment (Optional)

Untuk production / long-term streaming:

1. **Gunakan PM2** untuk auto-restart:
   ```bash
   npm install -g pm2
   pm2 start server.js --name "yt-chat"
   pm2 startup
   pm2 save
   ```

2. **Gunakan VPS/Cloud** jika perlu akses dari luar
3. **Setup HTTPS** jika perlu secure connection

## 📝 Changelog

### v1.1
- Tambah support member & moderator badge
- Tambah support custom emoji
- Tambah chat history API
- Fix memory leak (process cache limit)

### v1.0
- Initial release
- Basic scrape & broadcast

## 🤝 Support

Jika ada masalah:
1. Cek console F12 untuk error message
2. Restart server & browser
3. Cek firewall & antivirus tidak memblokir

## 📄 License

Free to use for personal & streaming purpose

---

**Author:** Adipati Rezkya  
**Last Updated:** October 28, 2025