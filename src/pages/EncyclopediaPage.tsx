import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useEncyclopedia } from '@/hooks/useEncyclopedia'
import { useAppStore } from '@/store/useAppStore'
import { useDataStore } from '@/store/useDataStore'
import EncItemCard from '@/components/sections/encyclopedia/EncItemCard'
import DetailPanel from '@/components/sections/encyclopedia/DetailPanel'
import SectionTitle from '@/components/common/SectionTitle'
import EmptyState from '@/components/common/EmptyState'
import { translationNameSpace } from '@/config/lang'
import type { EncTab } from '@/types/index.ts'

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.04,
      duration: 0.28,
      ease: [0.32, 0, 0.18, 1] as [number, number, number, number],
    },
  }),
}

export default function EncyclopediaPage() {
  const { t } = useTranslation(translationNameSpace.encyclopedia)
  const { encTab, encSearch, encHouse, setEncTab, setEncSearch, setEncHouse, setEncSel } = useAppStore()
  const { items, detail, houseChips } = useEncyclopedia()
  const { characters: CHARS, houses: HOUSES, places: PLACES } = useDataStore()

  const TABS: Array<{ id: EncTab; label: string; count: number }> = [
    { id: 'characters', label: t('tabs.characters', 'Personajes'), count: CHARS.length },
    { id: 'houses', label: t('tabs.houses', 'Casas'), count: HOUSES.length },
    { id: 'places', label: t('tabs.places', 'Lugares'), count: PLACES.length },
  ]

  return (
    <section
      style={{
        maxWidth: 1100,
        margin: '0 auto',
        padding: '2rem 1rem 4rem',
      }}
    >
      {/* Page header */}
      <div style={{ marginBottom: '2rem' }}>
        <SectionTitle kicker={t('kicker', 'Enciclopedia')} title={t('title', 'El Compendio')} />
      </div>

      {/* Controls bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.75rem',
          alignItems: 'center',
          marginBottom: '1.25rem',
        }}
      >
        {/* Tab bar */}
        <div
          role="tablist"
          aria-label={t('tabsAriaLabel', 'Categorías del compendio')}
          style={{
            display: 'flex',
            gap: 2,
            background: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)',
            borderRadius: 4,
            padding: 3,
          }}
        >
          {TABS.map((tab) => {
            const isActive = encTab === tab.id
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setEncTab(tab.id)}
                style={{
                  fontFamily: 'var(--font-cinzel)',
                  fontSize: 11,
                  letterSpacing: '0.06em',
                  padding: '6px 14px',
                  borderRadius: 3,
                  border: isActive ? '1px solid var(--color-gold-dim)' : '1px solid transparent',
                  background: isActive ? 'rgba(201,164,76,0.15)' : 'transparent',
                  color: isActive ? 'var(--color-gold)' : 'var(--color-text-dim)',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.color = 'var(--color-text-muted)'
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = 'var(--color-text-dim)'
                }}
              >
                {tab.label}
                <span
                  style={{
                    marginLeft: 5,
                    fontSize: 9,
                    opacity: 0.65,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {tab.count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Search input */}
        <div style={{ flex: 1, minWidth: 180 }}>
          <label style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
            {t('searchLabel', 'Buscar en el compendio')}
          </label>
          <input
            type="search"
            placeholder={t('searchPlaceholder', 'Buscar en el compendio…')}
            value={encSearch}
            onChange={(e) => setEncSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '7px 12px',
              background: 'var(--color-bg-card)',
              border: '1px solid var(--color-border)',
              borderRadius: 3,
              color: 'var(--color-text)',
              fontFamily: 'var(--font-cinzel)',
              fontSize: 11,
              letterSpacing: '0.04em',
              outline: 'none',
              transition: 'border-color 0.15s',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-gold)')}
            onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--color-border)')}
          />
        </div>
      </div>

      {/* House filter chips — characters tab only */}
      <AnimatePresence>
        {encTab === 'characters' && (
          <motion.div
            key="house-chips"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}
          >
            <div
              style={{
                display: 'flex',
                gap: 6,
                overflowX: 'auto',
                paddingBottom: '0.75rem',
                marginBottom: '0.5rem',
                scrollbarWidth: 'none',
              }}
              // Hide scrollbar in WebKit
              className="hide-scrollbar"
            >
              {houseChips.map((chip) => {
                const house = HOUSES.find((h) => h.id === chip.id)
                const accentColor = house?.accent ?? 'var(--color-gold)'
                const isActive = chip.active

                return (
                  <button
                    key={chip.id}
                    onClick={() => setEncHouse(chip.id)}
                    style={{
                      fontFamily: 'var(--font-cinzel)',
                      fontSize: 10,
                      letterSpacing: '0.06em',
                      padding: '4px 12px',
                      borderRadius: 20,
                      border: `1px solid ${isActive ? accentColor : 'var(--color-border)'}`,
                      background: isActive ? `${accentColor}22` : 'transparent',
                      color: isActive ? accentColor : 'var(--color-text-dim)',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.15s',
                      flexShrink: 0,
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.borderColor = accentColor + '88'
                        e.currentTarget.style.color = 'var(--color-text-muted)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.borderColor = 'var(--color-border)'
                        e.currentTarget.style.color = 'var(--color-text-dim)'
                      }
                    }}
                  >
                    {chip.name}
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results count */}
      {items.length > 0 && (
        <p
          style={{
            fontFamily: 'var(--font-cinzel)',
            fontSize: 9,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--color-text-dim)',
            marginBottom: '1rem',
          }}
        >
          {t('resultsCount', { count: items.length })}
        </p>
      )}

      {/* Grid */}
      {items.length === 0 ? (
        <EmptyState message={t('noResults', 'No se encontraron resultados para tu búsqueda.')} />
      ) : (
        <motion.div
          key={encTab + encSearch + encHouse}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 10,
          }}
        >
          <AnimatePresence mode="popLayout">
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.15 } }}
                layout
              >
                <EncItemCard item={item} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Detail panel */}
      <AnimatePresence>
        {detail && (
          <DetailPanel
            key="detail"
            detail={detail}
            onClose={() => setEncSel(null)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
