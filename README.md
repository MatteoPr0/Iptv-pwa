# IPTV PWA Xtream MVP

Web app mobile-first per login Xtream Codes, caricamento canali live e riproduzione browser-friendly di stream compatibili.

## Requisiti
- Node.js 20+
- npm 10+

## Installazione locale
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

## Deploy su GitHub Pages
Il repository include workflow automatico in `.github/workflows/deploy-pages.yml`.

1. In GitHub vai su **Settings → Pages**
2. In **Build and deployment** seleziona **Source: GitHub Actions**
3. Fai push su `main`
4. Il workflow costruisce con `VITE_BASE_PATH=/<nome-repo>/` e pubblica `dist` su Pages

## Funzionalità MVP attuali
- Login Xtream (`player_api.php` con username/password)
- Caricamento categorie live (`get_live_categories`)
- Caricamento canali live per categoria (`get_live_streams`)
- Riproduzione HLS (`hls.js`) con fallback nativo se supportato dal browser
- Manifest PWA con icone app (`public/icons`)

## Nota importante
Usare solo con credenziali e contenuti autorizzati.
Alcuni provider non espongono stream browser-friendly o bloccano CORS; in quel caso conviene usare un backend proxy o wrapper Android con Capacitor.
