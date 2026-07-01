import { useAppStore } from '../store/useAppStore'
import { CHARRANK, TLRANK, CURIORANK, POINTS_SERIE, POINTS_LIBROS, ALL_POINT, SAGA_META } from '../data/progress'
import type { CharacterState, ThroneInfo, ProgressPoint, AllPoint } from '../types/index.ts'

export function useProgress() {
  const { progress, progMode } = useAppStore()

  const modeList: ProgressPoint[] = progMode === 'libros' ? POINTS_LIBROS : POINTS_SERIE
  const allPoints = [ALL_POINT as AllPoint, ...POINTS_SERIE, ...POINTS_LIBROS]
  const curPoint = allPoints.find(p => p.id === progress) ?? ALL_POINT

  function charState(id: string): CharacterState {
    const r = CHARRANK[id] ?? { a: 0, d: 99999 }
    const p = curPoint.rank
    if (r.a > p) return 'future'
    if (r.d <= p) return 'dead'
    return 'alive'
  }

  function stateMeta(s: CharacterState) {
    if (s === 'future') return { label: 'Aún no aparece', color: '#6f6552' }
    if (s === 'dead') return { label: 'Muerto', color: '#9b3b3b' }
    return { label: 'Vivo', color: '#5aa86a' }
  }

  function throneAt(rank: number): ThroneInfo {
    if (rank < 13) return { h: 'Casa Targaryen', who: 'Viserys I' }
    if (rank < 16) return { h: 'Casa Targaryen', who: 'Aegon II vs. Rhaenyra (en guerra)' }
    if (rank < 45) return { h: 'Casa Targaryen', who: 'Dinastía Targaryen' }
    if (rank < 52) return { h: 'Casa Baratheon', who: 'Robert I' }
    if (rank < 59) return { h: 'Casa Lannister', who: 'Joffrey I' }
    if (rank < 64) return { h: 'Casa Lannister', who: 'Tommen I' }
    if (rank < 70) return { h: 'Casa Lannister', who: 'Cersei I' }
    return { h: 'Los Seis Reinos', who: 'Brandon el Roto' }
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
