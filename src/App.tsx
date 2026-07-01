import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import HomePage from './pages/HomePage'
import EncyclopediaPage from './pages/EncyclopediaPage'
import MapPage from './pages/MapPage'
import TreePage from './pages/TreePage'
import TimelinePage from './pages/TimelinePage'
import CuriosPage from './pages/CuriosPage'
import { AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/encyclopedia" element={<EncyclopediaPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/tree" element={<TreePage />} />
        <Route path="/timeline" element={<TimelinePage />} />
        <Route path="/curios" element={<CuriosPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Layout>
        <AnimatedRoutes />
      </Layout>
    </BrowserRouter>
  )
}
