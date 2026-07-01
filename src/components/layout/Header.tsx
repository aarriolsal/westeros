import { useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAppStore } from '../../store/useAppStore'
import { useProgress } from '../../hooks/useProgress'
import { ProgressSelector } from './ProgressSelector'

const NAV_ITEMS = [
  { label: 'Inicio',       section: 'home',        route: '/' },
  { label: 'Enciclopedia', section: 'encyclopedia', route: '/encyclopedia' },
  { label: 'Cronología',   section: 'timeline',     route: '/timeline' },
  { label: 'Árboles',      section: 'tree',         route: '/tree' },
  { label: 'Mapa',         section: 'map',          route: '/map' },
  { label: 'Curiosidades', section: 'curios',       route: '/curios' },
] as const

const LANG_OPTIONS = [
  { id: 'es', label: 'Español',  flag: '🇪🇸', code: 'ES' },
  { id: 'en', label: 'English',  flag: '🇬🇧', code: 'EN' },
  { id: 'hv', label: 'Valyrio',  flag: '🐉',  code: 'VAL' },
] as const

export function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const { lang, langOpen, setLang, toggleLangOpen, closeLangOpen, toggleProgOpen, navigate: storeNavigate } = useAppStore()
  const { curPoint, SAGA_META } = useProgress()

  const langRef = useRef<HTMLDivElement>(null)

  // Close lang dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        closeLangOpen()
      }
    }
    if (langOpen) {
      document.addEventListener('mousedown', handleClick)
    }
    return () => document.removeEventListener('mousedown', handleClick)
  }, [langOpen, closeLangOpen])

  function handleNav(route: string, sec: string) {
    storeNavigate(sec as Parameters<typeof storeNavigate>[0])
    navigate(route)
  }

  // Determine active section from URL path
  function isActive(route: string): boolean {
    if (route === '/') return location.pathname === '/'
    return location.pathname.startsWith(route)
  }

  // Progress dot color from saga
  const sagaId = (curPoint as { saga?: string }).saga
  const sagaColor = sagaId ? (SAGA_META[sagaId]?.color ?? '#c9a44c') : '#c9a44c'
  const currentLang = LANG_OPTIONS.find(l => l.id === lang) ?? LANG_OPTIONS[0]

  return (
    <header
      style={{
        background: 'var(--color-bg-card)',
        borderBottom: '1px solid var(--color-border)',
        height: '56px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        flexShrink: 0,
      }}
      className="flex items-center px-4 gap-4"
    >
      {/* Left: Brand */}
      <button
        onClick={() => handleNav('/', 'home')}
        className="flex items-center gap-2 shrink-0 cursor-pointer bg-transparent border-0 p-0"
        style={{ outline: 'none' }}
        aria-label="Ir al inicio"
      >
        {/* Hexagon sigil with W */}
        <div
          style={{
            width: 32,
            height: 32,
            background: 'var(--color-bg-raised)',
            border: '1.5px solid var(--color-gold-dim)',
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-cinzel)',
              fontWeight: 700,
              fontSize: 14,
              color: 'var(--color-gold)',
              lineHeight: 1,
            }}
          >
            W
          </span>
        </div>

        {/* Title stack */}
        <div className="flex flex-col items-start leading-none">
          <span
            style={{
              fontFamily: 'var(--font-cinzel)',
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: '0.12em',
              color: 'var(--color-gold)',
              lineHeight: 1.2,
            }}
          >
            WESTEROS
          </span>
          <span
            style={{
              fontFamily: 'var(--font-cinzel)',
              fontWeight: 400,
              fontSize: 9,
              letterSpacing: '0.08em',
              color: 'var(--color-text-muted)',
              lineHeight: 1.2,
            }}
          >
            Enciclopedia
          </span>
        </div>
      </button>

      {/* Center: Nav tabs (hidden on mobile) */}
      <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
        {NAV_ITEMS.map(({ label, section: sec, route }) => {
          const active = isActive(route)
          return (
            <button
              key={sec}
              onClick={() => handleNav(route, sec)}
              style={{
                fontFamily: 'var(--font-cinzel)',
                fontWeight: active ? 600 : 400,
                fontSize: 11,
                letterSpacing: '0.06em',
                color: active ? 'var(--color-gold)' : 'var(--color-text-muted)',
                background: 'transparent',
                border: 'none',
                borderBottom: active ? '2px solid var(--color-gold)' : '2px solid transparent',
                padding: '0 10px',
                height: 56,
                cursor: 'pointer',
                transition: 'color 0.15s, border-color 0.15s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => {
                if (!active) (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text)'
              }}
              onMouseLeave={e => {
                if (!active) (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-muted)'
              }}
            >
              {label}
            </button>
          )
        })}
      </nav>

      {/* Spacer on mobile */}
      <div className="flex-1 md:hidden" />

      {/* Right: Progress + Language */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Progress button */}
        <button
          onClick={toggleProgOpen}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'var(--color-bg-raised)',
            border: '1px solid var(--color-border)',
            borderRadius: 6,
            padding: '4px 10px',
            cursor: 'pointer',
            transition: 'border-color 0.15s',
            maxWidth: 180,
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--color-border-hover)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}
          title="Configurar punto de progreso"
        >
          {/* Colored dot */}
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: sagaColor,
              flexShrink: 0,
              boxShadow: `0 0 4px ${sagaColor}88`,
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-cinzel)',
              fontSize: 9,
              letterSpacing: '0.05em',
              color: 'var(--color-text-muted)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: 140,
            }}
          >
            {curPoint.label}
          </span>
        </button>

        {/* Language selector */}
        <div ref={langRef} style={{ position: 'relative' }}>
          <button
            onClick={toggleLangOpen}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              background: 'var(--color-bg-raised)',
              border: '1px solid var(--color-border)',
              borderRadius: 6,
              padding: '4px 8px',
              cursor: 'pointer',
              transition: 'border-color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--color-border-hover)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}
            aria-label="Seleccionar idioma"
          >
            <span style={{ fontSize: 14, lineHeight: 1 }}>{currentLang.flag}</span>
            <span
              style={{
                fontFamily: 'var(--font-cinzel)',
                fontSize: 10,
                letterSpacing: '0.06em',
                color: 'var(--color-text-muted)',
                fontWeight: 600,
              }}
            >
              {currentLang.code}
            </span>
            {/* Chevron */}
            <svg
              width="8"
              height="8"
              viewBox="0 0 8 8"
              fill="none"
              style={{
                color: 'var(--color-text-dim)',
                transform: langOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.15s',
              }}
            >
              <path d="M1 2.5L4 5.5L7 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Dropdown */}
          {langOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 4px)',
                right: 0,
                background: 'var(--color-bg-raised)',
                border: '1px solid var(--color-border)',
                borderRadius: 6,
                minWidth: 130,
                overflow: 'hidden',
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                zIndex: 100,
              }}
            >
              {LANG_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setLang(opt.id)
                    closeLangOpen()
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    width: '100%',
                    padding: '8px 12px',
                    background: lang === opt.id ? 'var(--color-bg-card)' : 'transparent',
                    border: 'none',
                    borderLeft: lang === opt.id ? '2px solid var(--color-gold)' : '2px solid transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => {
                    if (lang !== opt.id) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(201,164,76,0.06)'
                  }}
                  onMouseLeave={e => {
                    if (lang !== opt.id) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
                  }}
                >
                  <span style={{ fontSize: 14 }}>{opt.flag}</span>
                  <span
                    style={{
                      fontFamily: 'var(--font-cinzel)',
                      fontSize: 10,
                      letterSpacing: '0.06em',
                      color: lang === opt.id ? 'var(--color-gold)' : 'var(--color-text-muted)',
                      fontWeight: lang === opt.id ? 600 : 400,
                    }}
                  >
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Progress dropdown panel — rendered outside normal flow via fixed positioning */}
      <ProgressSelector />
    </header>
  )
}
