# IPTV PWA Xtream MVP

Web app mobile-first per login Xtream Codes, caricamento canali live e riproduzione browser-friendly di stream compatibili.

## Uso da tablet Android (senza terminale)
Non devi eseguire `npm install` o `npm run dev` dal tablet.

1. Apri il repository su GitHub
2. Vai in **Settings → Pages**
3. In **Build and deployment** imposta **Source: GitHub Actions**
4. Fai push su `main`
5. Attendi il job **Deploy to GitHub Pages**
6. Apri l'URL pubblicato (formato tipico: `https://<username>.github.io/<nome-repo>/`)

Una volta aperta la pagina dal browser Android, puoi anche aggiungerla alla home come app (PWA).

## Se su GitHub Pages appare "Login fallito"
Se le stesse credenziali funzionano in altre app, il problema di solito è CORS/rete browser, non username/password.

Cosa fare:
- verifica che il server sia `https://` (non solo `http://`)
- nel form usa il campo **Proxy URL (opzionale)** con un tuo endpoint proxy che accetta `?url=...`
- esempio chiamata dal client: `https://tuo-proxy.example/proxy?url=<url-xtream-encoded>`

Nota: su browser web (incluso Android) il provider può bloccare richieste cross-origin anche con credenziali corrette.

## Deploy automatico (GitHub Actions)
Il workflow è già incluso in `.github/workflows/deploy-pages.yml` e pubblica la cartella `dist` su GitHub Pages.

## Sviluppo locale (solo PC)
Questa parte serve solo se sviluppi dal computer:

```bash
npm install
npm run dev
```

Build di produzione locale:

```bash
npm run build
```

## Funzionalità MVP attuali
- Login Xtream (`player_api.php` con username/password)
- Caricamento categorie live (`get_live_categories`)
- Caricamento canali live per categoria (`get_live_streams`)
- Riproduzione HLS (`hls.js`) con fallback nativo se supportato dal browser
- Supporto proxy opzionale nel login (`Proxy URL`) per bypassare limiti CORS lato browser
- Manifest PWA con icone app (`public/icons`)

## Nota importante
Usare solo con credenziali e contenuti autorizzati.
Alcuni provider non espongono stream browser-friendly o bloccano CORS; in quel caso conviene usare un backend proxy o wrapper Android con Capacitor.
