
import { MoveType, Kata } from './types';

export const KATAS: Kata[] = [
  {
    id: '1',
    name: 'Heian Shodan',
    description: 'Le premier pas. Maîtrisez la base de la frappe.',
    sequence: [MoveType.BLOCK, MoveType.PUNCH, MoveType.PUNCH, MoveType.KIAI],
    difficulty: 'Débutant'
  },
  {
    id: '2',
    name: 'Gojushiho',
    description: 'La danse du guerrier. Enchaînement de coups de pieds.',
    sequence: [MoveType.KICK, MoveType.BLOCK, MoveType.PUNCH, MoveType.BLOCK, MoveType.KICK, MoveType.KIAI],
    difficulty: 'Intermédiaire'
  },
  {
    id: '3',
    name: 'Enpi',
    description: 'Le vol de l\'hirondelle. Vitesse et précision extrêmes.',
    sequence: [MoveType.BLOCK, MoveType.KICK, MoveType.PUNCH, MoveType.KICK, MoveType.PUNCH, MoveType.BLOCK, MoveType.PUNCH, MoveType.KIAI],
    difficulty: 'Maître'
  }
];

export const MOVE_KEYS: Record<string, MoveType> = {
  'ArrowUp': MoveType.PUNCH,
  'ArrowDown': MoveType.BLOCK,
  'ArrowLeft': MoveType.KICK,
  'ArrowRight': MoveType.KICK,
  'Space': MoveType.KIAI,
  'w': MoveType.PUNCH,
  's': MoveType.BLOCK,
  'a': MoveType.KICK,
  'd': MoveType.KICK,
  'Enter': MoveType.KIAI
};
