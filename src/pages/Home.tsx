import { useMemo, useState } from 'react'

type Credentials = {
  server: string
  username: string
  password: string
}

const initialCredentials: Credentials = {
  server: '',
  username: '',
  password: '',
}

export default function Home() {
  const [credentials, setCredentials] = useState<Credentials>(initialCredentials)

  const isValid = useMemo(() => {
    return (
      credentials.server.trim().length > 5 &&
      credentials.username.trim().length > 0 &&
      credentials.password.trim().length > 0
    )
  }, [credentials])

  const updateField = (field: keyof Credentials, value: string) => {
    setCredentials((current) => ({ ...current, [field]: value }))
  }

  return (
    <main className="shell">
      <section className="card">
        <h1>IPTV PWA</h1>
        <p className="lead">
          Ottima base: stack moderno (React + Vite + TypeScript) e dipendenza HLS pronta.
          Il prossimo step è implementare login Xtream e chiamata a <code>player_api.php</code>.
        </p>

        <form className="form" onSubmit={(event) => event.preventDefault()}>
          <label>
            Server URL
            <input
              type="url"
              placeholder="https://provider.example"
              value={credentials.server}
              onChange={(event) => updateField('server', event.target.value)}
            />
          </label>

          <label>
            Username
            <input
              type="text"
              placeholder="Il tuo username"
              value={credentials.username}
              onChange={(event) => updateField('username', event.target.value)}
            />
          </label>

          <label>
            Password
            <input
              type="password"
              placeholder="••••••••"
              value={credentials.password}
              onChange={(event) => updateField('password', event.target.value)}
            />
          </label>

          <button type="submit" disabled={!isValid}>
            Continua
          </button>
        </form>

        <ul className="roadmap">
          <li>✅ Bootstrap progetto PWA</li>
          <li>🔜 Connessione API Xtream + gestione errori</li>
          <li>🔜 Liste categorie/canali live</li>
          <li>🔜 Player HLS + fallback Android (Capacitor)</li>
        </ul>
      </section>
    </main>
  )
}
