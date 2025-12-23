
import { MoveType, Kata } from './types';

export const KATAS: Kata[] = [
  {
    id: 'heian-shodan',
    name: 'Heian Shodan (Simplifié)',
    description: 'Le premier kata fondamental. Paix et Tranquillité du premier niveau.',
    difficulty: 'Débutant',
    sequence: [
      MoveType.GEDAN_BARAI,   // Gauche
      MoveType.OI_ZUKI_JODAN, // Droite
      MoveType.GEDAN_BARAI,   // Droite
      MoveType.OI_ZUKI_JODAN, // Gauche
      MoveType.OI_ZUKI_JODAN, // Gauche centre
      MoveType.KIAI,          // Oi-Zuki Droite + KIAI
      MoveType.GEDAN_BARAI,   // Pivot gauche
      MoveType.OI_ZUKI_JODAN, // Gauche
      MoveType.GEDAN_BARAI,   // Pivot droite
      MoveType.OI_ZUKI_JODAN, // Droite
      MoveType.GEDAN_BARAI,   // Recul gauche
      MoveType.GEDAN_BARAI,   // Recul droite
      MoveType.YAME           // Salut final
    ],
    translations: {
      [MoveType.GEDAN_BARAI]: 'Blocage bas (balayage)',
      [MoveType.OI_ZUKI_JODAN]: 'Coup de poing direct (visage)',
      [MoveType.KIAI]: 'Cri de l\'esprit libéré',
      [MoveType.YAME]: 'Retour à la position de repos'
    }
  }
];

export const MOVE_KEYS: Record<string, MoveType> = {
  'ArrowDown': MoveType.GEDAN_BARAI,
  'ArrowUp': MoveType.OI_ZUKI_JODAN,
  'Space': MoveType.KIAI,
  'Enter': MoveType.KIAI,
  'Shift': MoveType.YAME,
  's': MoveType.GEDAN_BARAI,
  'w': MoveType.OI_ZUKI_JODAN,
  'k': MoveType.KIAI,
  'y': MoveType.YAME
};
