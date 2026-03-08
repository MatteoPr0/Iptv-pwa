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

## Funzionalità MVP attuali
- Login Xtream (`player_api.php` con username/password)
- Caricamento categorie live (`get_live_categories`)
- Caricamento canali live per categoria (`get_live_streams`)
- Riproduzione HLS (`hls.js`) con fallback nativo se supportato dal browser

## Deploy
Collega il repository a Cloudflare Pages oppure Vercel.

## Nota importante
Usare solo con credenziali e contenuti autorizzati.
Alcuni provider non espongono stream browser-friendly o bloccano CORS; in quel caso conviene usare un backend proxy o wrapper Android con Capacitor.
