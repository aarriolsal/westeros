import { useTranslation } from 'react-i18next'
import { useAppStore } from '@/store/useAppStore'
import { useDataStore } from '@/store/useDataStore'
import { translationNameSpace } from '@/config/lang'
import type { CharacterState, ThroneInfo, ProgressPoint } from '@/types/index.ts'

export function useProgress() {
  const { t } = useTranslation(translationNameSpace.common)
  const { progress, progMode } = useAppStore()
  const { charRank: CHARRANK, timelineRank: TLRANK, curioRank: CURIORANK, pointsSerie: POINTS_SERIE, pointsLibros: POINTS_LIBROS, allPoint: ALL_POINT, sagaMeta: SAGA_META } = useDataStore()

  const modeList: ProgressPoint[] = progMode === 'libros' ? POINTS_LIBROS : POINTS_SERIE
  const allPoints = [ALL_POINT, ...POINTS_SERIE, ...POINTS_LIBROS]
  const curPoint = allPoints.find(p => p.id === progress) ?? ALL_POINT

  function charState(id: string): CharacterState {
    const r = CHARRANK[id] ?? { a: 0, d: 99999 }
    const p = curPoint.rank
    if (r.a > p) return 'future'
    if (r.d <= p) return 'dead'
    return 'alive'
  }

  function stateMeta(s: CharacterState) {
    if (s === 'future') return { label: t('progress.stateFuture', 'Aún no aparece'), color: '#6f6552' }
    if (s === 'dead') return { label: t('progress.stateDead', 'Muerto'), color: '#9b3b3b' }
    return { label: t('progress.stateAlive', 'Vivo'), color: '#5aa86a' }
  }

  function throneAt(rank: number): ThroneInfo {
    if (rank < 13) return { h: t('progress.throne.houseTargaryen', 'Casa Targaryen'), who: t('progress.throne.viserysI', 'Viserys I') }
    if (rank < 16) return { h: t('progress.throne.houseTargaryen', 'Casa Targaryen'), who: t('progress.throne.aegonVsRhaenyra', 'Aegon II vs. Rhaenyra (en guerra)') }
    if (rank < 45) return { h: t('progress.throne.houseTargaryen', 'Casa Targaryen'), who: t('progress.throne.targaryenDynasty', 'Dinastía Targaryen') }
    if (rank < 52) return { h: t('progress.throne.houseBaratheon', 'Casa Baratheon'), who: t('progress.throne.robertI', 'Robert I') }
    if (rank < 59) return { h: t('progress.throne.houseLannister', 'Casa Lannister'), who: t('progress.throne.joffreyI', 'Joffrey I') }
    if (rank < 64) return { h: t('progress.throne.houseLannister', 'Casa Lannister'), who: t('progress.throne.tommenI', 'Tommen I') }
    if (rank < 70) return { h: t('progress.throne.houseLannister', 'Casa Lannister'), who: t('progress.throne.cerseiI', 'Cersei I') }
    return { h: t('progress.throne.sixKingdoms', 'Los Seis Reinos'), who: t('progress.throne.brandonTheBroken', 'Brandon el Roto') }
  }

  function isTimelineLocked(index: number): boolean {
    return (TLRANK[index] ?? 0) > curPoint.rank
  }

  function isCurioLocked(index: number): boolean {
    return (CURIORANK[index] ?? 0) > curPoint.rank
  }

  return {
    curPoint,
    modeList,
    charState,
    stateMeta,
    throneAt,
    isTimelineLocked,
    isCurioLocked,
    SAGA_META,
  }
}
