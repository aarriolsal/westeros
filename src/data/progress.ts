import type { CharRankEntry, ProgressPoint, AllPoint, SagaMeta } from '../types/index.ts';

export const CHARRANK: Record<string, CharRankEntry> = {
  ned: { a: 50, d: 52 }, cat: { a: 50, d: 58 }, robb: { a: 50, d: 58 }, jon: { a: 50, d: 99999 }, sansa: { a: 50, d: 99999 },
  arya: { a: 50, d: 99999 }, bran: { a: 50, d: 99999 }, tywin: { a: 50, d: 58 }, cersei: { a: 50, d: 70 }, jaime: { a: 50, d: 70 },
  tyrion: { a: 50, d: 99999 }, joffrey: { a: 50, d: 58 }, dany: { a: 50, d: 70 }, viserysT: { a: 50, d: 52 }, rhaegar: { a: 45, d: 45 },
  robert: { a: 50, d: 52 }, stannis: { a: 54, d: 64 }, baelish: { a: 50, d: 67 }, varys: { a: 50, d: 70 }, brienne: { a: 54, d: 99999 },
  hound: { a: 50, d: 70 }, davos: { a: 54, d: 99999 }, melisandre: { a: 54, d: 70 }, theon: { a: 50, d: 70 }, drogo: { a: 50, d: 52 },
  jorah: { a: 50, d: 70 }, samwell: { a: 50, d: 99999 }, nightking: { a: 50, d: 70 },
  viserys1: { a: 10, d: 13 }, rhaenyra: { a: 10, d: 15 }, daemon: { a: 10, d: 15 }, alicent: { a: 10, d: 99999 }, otto: { a: 10, d: 14 },
  aegon2: { a: 11, d: 16 }, aemond: { a: 11, d: 15 }, rhaenys: { a: 10, d: 14 }, corlys: { a: 10, d: 99999 },
  dunk: { a: 30, d: 46 }, egg: { a: 30, d: 46 },
};

export const TLRANK: number[] = [0, 5, 11, 13, 30, 45, 51, 58, 70];

export const CURIORANK: number[] = [0, 13, 64, 0, 13, 30, 70, 0, 0, 58, 50, 5];

export const POINTS_SERIE: ProgressPoint[] = [
  { id: 's_hotd1', saga: 'hotd', label: 'La Casa del Dragón · T1', rank: 12 },
  { id: 's_hotd2', saga: 'hotd', label: 'La Casa del Dragón · T2', rank: 14 },
  { id: 's_knight', saga: 'dunk', label: 'El Caballero de los 7 Reinos · T1', rank: 30 },
  { id: 's_got1', saga: 'got', label: 'Juego de Tronos · T1', rank: 52 },
  { id: 's_got2', saga: 'got', label: 'Juego de Tronos · T2', rank: 54 },
  { id: 's_got3', saga: 'got', label: 'Juego de Tronos · T3', rank: 58 },
  { id: 's_got4', saga: 'got', label: 'Juego de Tronos · T4', rank: 59 },
  { id: 's_got5', saga: 'got', label: 'Juego de Tronos · T5', rank: 61 },
  { id: 's_got6', saga: 'got', label: 'Juego de Tronos · T6', rank: 64 },
  { id: 's_got7', saga: 'got', label: 'Juego de Tronos · T7', rank: 67 },
  { id: 's_got8', saga: 'got', label: 'Juego de Tronos · T8', rank: 70 },
];

export const POINTS_LIBROS: ProgressPoint[] = [
  { id: 'b_fs', saga: 'hotd', label: 'Fuego y Sangre', rank: 16 },
  { id: 'b_dunk', saga: 'dunk', label: 'El Caballero de los 7 Reinos (Dunk y Egg)', rank: 40 },
  { id: 'b1', saga: 'got', label: 'Juego de Tronos (Libro I)', rank: 52 },
  { id: 'b2', saga: 'got', label: 'Choque de Reyes (II)', rank: 54 },
  { id: 'b3', saga: 'got', label: 'Tormenta de Espadas (III)', rank: 58 },
  { id: 'b4', saga: 'got', label: 'Festín de Cuervos (IV)', rank: 60 },
  { id: 'b5', saga: 'got', label: 'Danza de Dragones (V)', rank: 62 },
];

export const ALL_POINT: AllPoint = { id: 'all', label: 'Toda la saga (sin ocultar nada)', rank: 9000 };

export const SAGA_META: Record<string, SagaMeta> = {
  got: { label: 'Juego de Tronos', color: '#c9a44c' },
  hotd: { label: 'La Casa del Dragón', color: '#b5121b' },
  dunk: { label: 'El Caballero de los 7 Reinos', color: '#3a9b9b' },
  lore: { label: 'Historia antigua', color: '#7a6a4a' },
};
