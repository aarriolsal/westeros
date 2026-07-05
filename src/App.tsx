import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Layout } from './layout/BaseLayout.tsx'
import HomePage from './pages/HomePage'
import EncyclopediaPage from './pages/EncyclopediaPage'
import MapPage from './pages/MapPage'
import GenealogyPage from './pages/GenealogyPage'
import TimelinePage from './pages/TimelinePage'
import CuriosPage from './pages/CuriosPage'
import { AnimatePresence, motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { useDataStore } from './store/useDataStore'
import { useAppStore } from './store/useAppStore'
import { translationNameSpace } from './config/lang'
import EmptyState from './components/common/EmptyState'
import type { Lang } from './types/index.ts'

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/encyclopedia" element={<EncyclopediaPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/genealogy" element={<GenealogyPage />} />
        <Route path="/timeline" element={<TimelinePage />} />
        <Route path="/curios" element={<CuriosPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </AnimatePresence>
  )
}

function DataGate({ children }: { children: React.ReactNode }) {
  const { status, error, load } = useDataStore()
  const { lang } = useAppStore()
  const { t, i18n, ready: i18nReady } = useTranslation(translationNameSpace.common)
  const [loadedUiLang, setLoadedUiLang] = useState<Lang | null>(null)
  const langLoaded = loadedUiLang === lang

  useEffect(() => {
    load(lang)
  }, [load, lang])

  useEffect(() => {
    i18n.changeLanguage(lang).then(() => setLoadedUiLang(lang))
  }, [i18n, lang])

  if (status === 'error') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <EmptyState icon="⚠" message={`${t('errorLoadingData', 'No se pudieron cargar los datos de la enciclopedia.')} ${error ?? ''}`} />
      </div>
    )
  }

  if (status !== 'loaded' || !langLoaded || !i18nReady) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.p
          initial={{ opacity: 0.4 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, repeat: Infinity, repeatType: 'reverse' }}
          style={{
            fontFamily: 'var(--font-cinzel)',
            fontSize: '0.85rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--color-gold-dim)',
          }}
        >
          {t('loading', 'Cargando la enciclopedia…')}
        </motion.p>
      </div>
    )
  }

  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <DataGate>
        <Layout>
          <AnimatedRoutes />
        </Layout>
      </DataGate>
    </BrowserRouter>
  )
}
