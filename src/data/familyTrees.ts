import type { FamilyTreeData } from '../types/index.ts'

// Every person that appeared in the original flat generation lists is preserved here.
// `id` matches the corresponding entry in `CHARS` (src/data/characters.ts) whenever one
// exists — set `inCast: true` in that case so the tree can open that character's detail
// view. Genealogy-only ancestors (not in CHARS) use a dedicated id and `inCast: false`.
//
// `parents`/`spouses` only link ids that exist within the SAME house's `members` array.
// Some real relationships (e.g. Rhaegar Targaryen ↔ Elia Martell) intentionally aren't
// wired here because the two people live in different house trees — the renderer only
// draws edges between members of the tree currently on screen.
//
// A few links between eras that the original data groups together (e.g. Aegon I's
// generation vs. Viserys I's, generations apart) are left without a `parents` edge:
// the intermediate ancestors were never part of this dataset, and fabricating a direct
// parent link across a real multi-generation gap would misrepresent the family tree.

export const FAMILY_TREES: Record<string, FamilyTreeData> = {
  targaryen: {
    label: 'Casa Targaryen',
    note: 'La línea real desde la Conquista hasta el final de la dinastía, pasando por la Danza de los Dragones.',
    members: [
      { id: 'aegon1', name: 'Aegon I "el Conquistador"', house: 'targaryen', generation: 0, spouses: ['rhaenys_i', 'visenya'], inCast: false },
      { id: 'rhaenys_i', name: 'Rhaenys (hermana-esposa de Aegon I)', house: 'targaryen', generation: 0, spouses: ['aegon1'], inCast: false },
      { id: 'visenya', name: 'Visenya (hermana-esposa de Aegon I)', house: 'targaryen', generation: 0, spouses: ['aegon1'], inCast: false },

      { id: 'viserys1', name: 'Viserys I', house: 'targaryen', generation: 1, spouses: ['alicent'], inCast: true },
      { id: 'alicent', name: 'Alicent Hightower (reina)', house: 'hightower', generation: 1, spouses: ['viserys1'], inCast: true },
      { id: 'rhaenyra', name: 'Rhaenyra (heredera)', house: 'targaryen', generation: 1, parents: ['viserys1'], spouses: ['daemon'], inCast: true },
      { id: 'daemon', name: 'Daemon (esposo y tío)', house: 'targaryen', generation: 1, spouses: ['rhaenyra'], inCast: true },
      { id: 'aegon2', name: 'Aegon II', house: 'targaryen', generation: 1, parents: ['viserys1', 'alicent'], inCast: true },
      { id: 'aemond', name: 'Aemond', house: 'targaryen', generation: 1, parents: ['viserys1', 'alicent'], inCast: true },
      { id: 'helaena', name: 'Helaena', house: 'targaryen', generation: 1, parents: ['viserys1', 'alicent'], inCast: false },

      { id: 'egg', name: 'Aegon V "Egg"', house: 'targaryen', generation: 2, inCast: true },

      { id: 'aerys2', name: 'Aerys II "el Rey Loco"', house: 'targaryen', generation: 3, spouses: ['rhaella'], inCast: false },
      { id: 'rhaella', name: 'Rhaella', house: 'targaryen', generation: 3, spouses: ['aerys2'], inCast: false },

      { id: 'rhaegar', name: 'Rhaegar', house: 'targaryen', generation: 4, parents: ['aerys2', 'rhaella'], inCast: true },
      { id: 'viserysT', name: 'Viserys', house: 'targaryen', generation: 4, parents: ['aerys2', 'rhaella'], inCast: true },
      { id: 'dany', name: 'Daenerys', house: 'targaryen', generation: 4, parents: ['aerys2', 'rhaella'], inCast: true },

      { id: 'jon', name: 'Jon Nieve (Aegon, hijo de Rhaegar y Lyanna)', house: 'targaryen', generation: 5, parents: ['rhaegar'], inCast: true },
    ],
  },

  stark: {
    label: 'Casa Stark',
    note: 'Los lobos de Invernalia durante la Guerra de los Cinco Reyes.',
    members: [
      { id: 'rickard', name: 'Rickard Stark', house: 'stark', generation: 0, spouses: ['lyarra'], inCast: false },
      { id: 'lyarra', name: 'Lyarra', house: '', generation: 0, spouses: ['rickard'], inCast: false },

      { id: 'ned', name: 'Eddard "Ned"', house: 'stark', generation: 1, parents: ['rickard', 'lyarra'], spouses: ['cat'], inCast: true },
      { id: 'brandon', name: 'Brandon', house: 'stark', generation: 1, parents: ['rickard', 'lyarra'], inCast: false },
      { id: 'lyanna', name: 'Lyanna', house: 'stark', generation: 1, parents: ['rickard', 'lyarra'], inCast: false },
      { id: 'benjen', name: 'Benjen', house: 'stark', generation: 1, parents: ['rickard', 'lyarra'], inCast: false },
      { id: 'cat', name: 'Catelyn Tully (esposa)', house: 'tully', generation: 1, spouses: ['ned'], inCast: true },

      { id: 'robb', name: 'Robb', house: 'stark', generation: 2, parents: ['ned', 'cat'], inCast: true },
      { id: 'sansa', name: 'Sansa', house: 'stark', generation: 2, parents: ['ned', 'cat'], inCast: true },
      { id: 'arya', name: 'Arya', house: 'stark', generation: 2, parents: ['ned', 'cat'], inCast: true },
      { id: 'bran', name: 'Bran', house: 'stark', generation: 2, parents: ['ned', 'cat'], inCast: true },
      { id: 'rickon', name: 'Rickon', house: 'stark', generation: 2, parents: ['ned', 'cat'], inCast: false },
      { id: 'jon', name: 'Jon Nieve (criado como bastardo)', house: 'stark', generation: 2, parents: ['lyanna'], inCast: true },
    ],
  },

  lannister: {
    label: 'Casa Lannister',
    note: 'Los leones del Oeste, los más ricos de Poniente.',
    members: [
      { id: 'tywin', name: 'Tywin Lannister', house: 'lannister', generation: 0, spouses: ['joanna'], inCast: true },
      { id: 'joanna', name: 'Joanna (esposa)', house: 'lannister', generation: 0, spouses: ['tywin'], inCast: false },

      { id: 'cersei', name: 'Cersei', house: 'lannister', generation: 1, parents: ['tywin', 'joanna'], inCast: true },
      { id: 'jaime', name: 'Jaime', house: 'lannister', generation: 1, parents: ['tywin', 'joanna'], inCast: true },
      { id: 'tyrion', name: 'Tyrion', house: 'lannister', generation: 1, parents: ['tywin', 'joanna'], inCast: true },

      { id: 'joffrey', name: 'Joffrey', house: 'lannister', generation: 2, parents: ['cersei', 'jaime'], inCast: true },
      { id: 'myrcella', name: 'Myrcella', house: 'lannister', generation: 2, parents: ['cersei', 'jaime'], inCast: false },
      { id: 'tommen', name: 'Tommen', house: 'lannister', generation: 2, parents: ['cersei', 'jaime'], inCast: false },
    ],
  },

  baratheon: {
    label: 'Casa Baratheon',
    note: 'Los venados de la Tormenta, casa real tras la Rebelión.',
    members: [
      { id: 'robert', name: 'Robert (rey)', house: 'baratheon', generation: 0, spouses: ['cersei'], inCast: true },
      { id: 'stannis', name: 'Stannis', house: 'baratheon', generation: 0, spouses: ['selyse'], inCast: true },
      { id: 'renly', name: 'Renly', house: 'baratheon', generation: 0, inCast: false },

      { id: 'cersei', name: 'Cersei Lannister (reina)', house: 'lannister', generation: 1, spouses: ['robert'], inCast: true },
      { id: 'selyse', name: 'Selyse', house: '', generation: 1, spouses: ['stannis'], inCast: false },
      { id: 'gendry', name: 'Gendry (legitimado como Baratheon)', house: 'baratheon', generation: 1, parents: ['robert'], inCast: false },

      { id: 'shireen', name: 'Shireen (hija de Stannis)', house: 'baratheon', generation: 2, parents: ['stannis', 'selyse'], inCast: false },
    ],
  },

  tully: {
    label: 'Casa Tully',
    note: 'Los señores de los Ríos, unidos a Stark y Arryn por matrimonio.',
    members: [
      { id: 'hoster', name: 'Hoster Tully', house: 'tully', generation: 0, inCast: false },

      { id: 'cat', name: 'Catelyn (→ Stark)', house: 'tully', generation: 1, parents: ['hoster'], inCast: true },
      { id: 'lysa', name: 'Lysa (→ Arryn)', house: 'tully', generation: 1, parents: ['hoster'], inCast: false },
      { id: 'edmure', name: 'Edmure', house: 'tully', generation: 1, parents: ['hoster'], inCast: false },
      { id: 'brynden', name: 'Brynden "Pez Negro"', house: 'tully', generation: 1, inCast: false },
    ],
  },

  martell: {
    label: 'Casa Martell',
    note: 'Los príncipes de Dorne, nunca conquistados.',
    members: [
      { id: 'doran', name: 'Doran Martell', house: 'martell', generation: 0, inCast: false },
      { id: 'oberyn', name: 'Oberyn "la Víbora Roja"', house: 'martell', generation: 0, inCast: false },
      { id: 'elia', name: 'Elia (→ Rhaegar)', house: 'martell', generation: 0, inCast: false },

      { id: 'trystane', name: 'Trystane', house: 'martell', generation: 1, parents: ['doran'], inCast: false },
      { id: 'arianne', name: 'Arianne', house: 'martell', generation: 1, parents: ['doran'], inCast: false },
    ],
  },

  greyjoy: {
    label: 'Casa Greyjoy',
    note: 'Los krakens de las Islas del Hierro.',
    members: [
      { id: 'balon', name: 'Balon Greyjoy', house: 'greyjoy', generation: 0, inCast: false },
      { id: 'euron', name: 'Euron', house: 'greyjoy', generation: 0, inCast: false },
      { id: 'victarion', name: 'Victarion', house: 'greyjoy', generation: 0, inCast: false },
      { id: 'aeron', name: 'Aeron', house: 'greyjoy', generation: 0, inCast: false },

      { id: 'theon', name: 'Theon', house: 'greyjoy', generation: 1, parents: ['balon'], inCast: true },
      { id: 'yara', name: 'Yara/Asha', house: 'greyjoy', generation: 1, parents: ['balon'], inCast: false },
    ],
  },
}
