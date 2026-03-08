# IPTV PWA Xtream MVP

Web app mobile-first per login Xtream Codes, caricamento canali live e riproduzione browser-friendly di stream compatibili.

## Requisiti
- Node.js 20+
- npm 10+

## Installazione
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

## Deploy
Collega il repository a Cloudflare Pages oppure Vercel.

## Struttura
- Login server / username / password
- Fetch `player_api.php`
- Categorie live
- Canali live
- Player HLS con `hls.js`

## Nota importante
Usare solo con credenziali e contenuti autorizzati. Alcuni provider non espongono stream browser-friendly; in quel caso conviene un wrapper Android con Capacitor.
