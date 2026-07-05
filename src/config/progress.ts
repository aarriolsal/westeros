import type { ProgMode } from '@/types/index.ts'

export interface ProgModeOption {
  id: ProgMode
  labelKey: string  // key under common.json's "progress" namespace
}

export const PROG_MODE_OPTIONS: ProgModeOption[] = [
  { id: 'serie', labelKey: 'progress.modeSerie' },
  { id: 'libros', labelKey: 'progress.modeLibros' },
]
