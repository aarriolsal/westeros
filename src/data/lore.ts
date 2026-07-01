import type { TimelineEvent, Curio, SagaId } from '../types/index.ts';

export const TIMELINE: TimelineEvent[] = [
  { era: 'Edad de los Héroes', year: '~8000 a.D.C.', saga: 'lore' as SagaId, title: 'El Pacto y el Muro', desc: 'Los Primeros Hombres y los Hijos del Bosque pactan. Tras la Larga Noche y la derrota de los Otros, Brandon el Constructor erige el Muro.' },
  { era: 'Conquista', year: '2–1 a.D.C.', saga: 'lore' as SagaId, title: 'La Conquista de Aegon', desc: 'Aegon Targaryen y sus hermanas-esposas, con tres dragones, someten seis de los siete reinos y forjan el Trono de Hierro. Comienza el calendario "después de la Conquista".' },
  { era: 'Casa del Dragón', year: '101–129 d.C.', saga: 'hotd' as SagaId, title: 'El Gran Consejo y la sucesión', desc: 'Viserys I hereda el trono y nombra heredera a Rhaenyra, desafiando la costumbre. Las tensiones entre Negros y Verdes crecen durante décadas.' },
  { era: 'Casa del Dragón', year: '129–131 d.C.', saga: 'hotd' as SagaId, title: 'La Danza de los Dragones', desc: 'Estalla la guerra civil Targaryen entre Rhaenyra y Aegon II. La mayoría de los dragones mueren y la dinastía queda mutilada para siempre.' },
  { era: 'El Caballero', year: '~209 d.C.', saga: 'dunk' as SagaId, title: 'Las aventuras de Dunk y Egg', desc: 'El caballero errante Ser Duncan el Alto y su escudero Egg recorren los reinos. Egg llegará a ser el rey Aegon V.' },
  { era: 'Rebelión', year: '282–283 d.C.', saga: 'got' as SagaId, title: 'La Rebelión de Robert', desc: 'El rapto de Lyanna Stark y la locura del rey Aerys II desatan la guerra. Robert Baratheon derroca a los Targaryen; Daenerys y Viserys huyen al exilio.' },
  { era: 'Juego de Tronos', year: '298 d.C.', saga: 'got' as SagaId, title: 'Muere la Mano; comienza el juego', desc: 'La muerte de Jon Arryn lleva a Ned Stark a Desembarco. Sus descubrimientos sobre los hijos de Cersei encienden la Guerra de los Cinco Reyes.' },
  { era: 'Juego de Tronos', year: '299 d.C.', saga: 'got' as SagaId, title: 'La Boda Roja y los dragones', desc: 'Robb y Catelyn son asesinados por los Frey. Al otro lado del mar, Daenerys libera ciudades esclavistas con sus dragones ya crecidos.' },
  { era: 'Juego de Tronos', year: '303–305 d.C.', saga: 'got' as SagaId, title: 'La Larga Noche y la Batalla final', desc: 'El ejército de los muertos cae en Invernalia y Arya mata al Rey de la Noche. Daenerys arrasa Desembarco, muere a manos de Jon, y Bran es elegido rey.' },
];

export const CURIOS: Curio[] = [
  { cat: 'Libros vs. Serie', q: '¿Cuántas novelas hay y siguen sin terminar?', a: 'La saga "Canción de Hielo y Fuego" planea siete novelas; se han publicado cinco. "Vientos de Invierno" lleva más de una década en espera, así que la serie de televisión adelantó al autor.' },
  { cat: 'Dragones', q: '¿Por qué los dragones menguaron?', a: 'En su apogeo, los dragones Targaryen eran colosales (Balerion podía tragarse un mamut). Tras la Danza de los Dragones, las pocas crías nacieron cada vez más pequeñas hasta extinguirse, posiblemente por el cautiverio en el Pozo Dragón.' },
  { cat: 'Personajes', q: '¿Quién es realmente Jon Nieve?', a: 'No es bastardo de Ned, sino hijo de Lyanna Stark y el príncipe Rhaegar Targaryen. Su nombre verdadero es Aegon Targaryen, lo que lo convierte en heredero legítimo del Trono de Hierro.' },
  { cat: 'Idiomas', q: '¿El valyrio y el dothraki son inventados?', a: 'Sí: el lingüista David J. Peterson construyó lenguas completas con gramática y vocabulario para la serie, ampliando las pocas palabras que aparecían en los libros.' },
  { cat: 'Historia', q: '¿Qué fue la Danza de los Dragones?', a: 'Una guerra civil Targaryen (129–131 d.C.) entre Rhaenyra (los Negros) y su medio hermano Aegon II (los Verdes). Diezmó a la familia y a casi todos los dragones, y es el corazón de "La Casa del Dragón".' },
  { cat: 'El Caballero', q: '¿Dónde encaja "El Caballero de los Siete Reinos"?', a: 'Sucede unos 90 años antes de "Juego de Tronos" y sigue al caballero errante Ser Duncan el Alto y a su escudero "Egg", el futuro rey Aegon V Targaryen.' },
  { cat: 'Geografía', q: '¿Qué hay al oeste de Poniente?', a: 'Es un misterio. Nadie que zarpó hacia el oeste del Mar del Ocaso ha regresado; por eso el viaje final de Arya resuena tanto entre los seguidores.' },
  { cat: 'Cultura', q: '¿Qué significa "pagar el precio del hierro"?', a: 'La filosofía de los Hombres del Hierro: obtener lo que se desea tomándolo por la fuerza en combate, no comprándolo ("el precio del oro"), que consideran cobarde.' },
  { cat: 'Casas', q: '¿Por qué Dorne es diferente?', a: 'Los rhoynar de Nymeria se asentaron allí y mezclaron sus costumbres: igualdad en la herencia sin importar el sexo, mayor libertad y un orgullo feroz por no haber sido conquistados por los dragones.' },
  { cat: 'Símbolos', q: '¿Qué es la Boda Roja?', a: 'La matanza de Robb Stark, su madre y su ejército durante un banquete de los Frey, violando el sagrado derecho de hospitalidad. Está inspirada en hechos históricos escoceses reales.' },
  { cat: 'Magia', q: '¿Qué es un "warg" o "cambiapieles"?', a: 'Alguien capaz de introducir su mente en animales y controlarlos. Bran Stark es el más poderoso, capaz incluso de entrar en personas y ver a través del tiempo como verdevidente.' },
  { cat: 'Trono', q: '¿De qué está hecho el Trono de Hierro?', a: 'De mil espadas de los enemigos derrotados de Aegon, fundidas con el aliento de Balerion. En los libros es una montaña monstruosa y peligrosa, mucho mayor que en la serie.' },
];

// Family tree data moved to src/data/familyTrees.ts (FAMILY_TREES), which models
// real parent/spouse relationships instead of flat generation lists.
