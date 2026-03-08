import Hls from 'hls.js'
import { FormEvent, useEffect, useMemo, useRef, useState } from 'react'

type Credentials = {
  server: string
  username: string
  password: string
}

type XtreamUser = {
  auth: number
  status: string
  exp_date?: string
  active_cons?: string
  max_connections?: string
}

type XtreamCategory = {
  category_id: string
  category_name: string
}

type XtreamChannel = {
  stream_id: number
  name: string
  stream_icon?: string
}

type AppState = 'login' | 'channels'

const initialCredentials: Credentials = {
  server: '',
  username: '',
  password: '',
}

function normalizeServer(server: string) {
  return server.trim().replace(/\/$/, '')
}

async function fetchJson<T>(url: string) {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  return (await response.json()) as T
}

function useHlsPlayer(source: string | null) {
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video || !source) {
      return
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source
      return
    }

    if (Hls.isSupported()) {
      const hls = new Hls()
      hls.loadSource(source)
      hls.attachMedia(video)

      return () => {
        hls.destroy()
      }
    }

    return
  }, [source])

  return videoRef
}

export default function Home() {
  const [credentials, setCredentials] = useState<Credentials>(initialCredentials)
  const [appState, setAppState] = useState<AppState>('login')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [categories, setCategories] = useState<XtreamCategory[]>([])
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('')
  const [channels, setChannels] = useState<XtreamChannel[]>([])
  const [selectedChannel, setSelectedChannel] = useState<XtreamChannel | null>(null)
  const [isChannelsLoading, setIsChannelsLoading] = useState(false)

  const streamUrl = useMemo(() => {
    if (!selectedChannel) {
      return null
    }

    const server = normalizeServer(credentials.server)
    return `${server}/live/${credentials.username}/${credentials.password}/${selectedChannel.stream_id}.m3u8`
  }, [credentials.password, credentials.server, credentials.username, selectedChannel])

  const videoRef = useHlsPlayer(streamUrl)

  const isLoginValid = useMemo(() => {
    return (
      credentials.server.trim().length > 5 &&
      credentials.username.trim().length > 0 &&
      credentials.password.trim().length > 0
    )
  }, [credentials])

  const updateField = (field: keyof Credentials, value: string) => {
    setCredentials((current) => ({ ...current, [field]: value }))
  }

  const loadChannels = async (categoryId: string, creds = credentials) => {
    const server = normalizeServer(creds.server)
    setIsChannelsLoading(true)
    setError(null)

    try {
      const channelsUrl = `${server}/player_api.php?username=${encodeURIComponent(creds.username)}&password=${encodeURIComponent(creds.password)}&action=get_live_streams&category_id=${encodeURIComponent(categoryId)}`

      const data = await fetchJson<XtreamChannel[]>(channelsUrl)
      setChannels(data)
      setSelectedChannel(data[0] ?? null)
    } catch {
      setError(
        'Impossibile caricare i canali. Verifica CORS del provider o usa un proxy backend.',
      )
    } finally {
      setIsChannelsLoading(false)
    }
  }

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!isLoginValid) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const server = normalizeServer(credentials.server)

      const authUrl = `${server}/player_api.php?username=${encodeURIComponent(credentials.username)}&password=${encodeURIComponent(credentials.password)}`

      const authData = await fetchJson<{ user_info?: XtreamUser }>(authUrl)

      if (!authData.user_info || authData.user_info.auth !== 1) {
        throw new Error('Credenziali non valide')
      }

      const categoriesUrl = `${server}/player_api.php?username=${encodeURIComponent(credentials.username)}&password=${encodeURIComponent(credentials.password)}&action=get_live_categories`

      const categoriesData = await fetchJson<XtreamCategory[]>(categoriesUrl)
      setCategories(categoriesData)

      const firstCategoryId = categoriesData[0]?.category_id ?? ''
      setSelectedCategoryId(firstCategoryId)
      setAppState('channels')

      if (firstCategoryId) {
        await loadChannels(firstCategoryId, credentials)
      }
    } catch {
      setError(
        'Login fallito: controlla URL server/credenziali o eventuali blocchi CORS del provider.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleCategoryChange = async (categoryId: string) => {
    setSelectedCategoryId(categoryId)
    await loadChannels(categoryId)
  }

  return (
    <main className="shell">
      <section className="card">
        <h1>IPTV PWA</h1>

        {appState === 'login' ? (
          <>
            <p className="lead">
              Inserisci credenziali Xtream Codes per caricare categorie e canali live.
            </p>

            <form className="form" onSubmit={handleLogin}>
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

              <button type="submit" disabled={!isLoginValid || isLoading}>
                {isLoading ? 'Connessione...' : 'Accedi'}
              </button>
            </form>
          </>
        ) : (
          <div className="channels-layout">
            <div className="toolbar">
              <select
                value={selectedCategoryId}
                onChange={(event) => void handleCategoryChange(event.target.value)}
              >
                {categories.map((category) => (
                  <option key={category.category_id} value={category.category_id}>
                    {category.category_name}
                  </option>
                ))}
              </select>
              <button type="button" className="secondary" onClick={() => setAppState('login')}>
                Cambia account
              </button>
            </div>

            {isChannelsLoading ? <p className="muted">Caricamento canali...</p> : null}

            {!isChannelsLoading && channels.length === 0 ? (
              <p className="muted">Nessun canale in questa categoria.</p>
            ) : null}

            <ul className="channel-list">
              {channels.map((channel) => (
                <li key={channel.stream_id}>
                  <button
                    type="button"
                    className={selectedChannel?.stream_id === channel.stream_id ? 'channel active' : 'channel'}
                    onClick={() => setSelectedChannel(channel)}
                  >
                    {channel.name}
                  </button>
                </li>
              ))}
            </ul>

            <div className="player">
              <video ref={videoRef} controls playsInline autoPlay />
              {selectedChannel ? (
                <p className="muted">In riproduzione: {selectedChannel.name}</p>
              ) : (
                <p className="muted">Seleziona un canale per avviare la riproduzione.</p>
              )}
            </div>
          </div>
        )}

        {error ? <p className="error">{error}</p> : null}
      </section>
    </main>
  )
}
