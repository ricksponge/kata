
export enum MoveType {
  PUNCH = 'Oi-Zuki',
  KICK = 'Mae-Geri',
  BLOCK = 'Gedan-Barai',
  KIAI = 'KIAI'
}

export interface Kata {
  id: string;
  name: string;
  sequence: MoveType[];
  difficulty: 'Débutant' | 'Intermédiaire' | 'Maître';
  description: string;
}

export enum GameState {
  IDLE = 'IDLE',
  TUTORIAL = 'TUTORIAL',
  STARTING = 'STARTING',
  PERFORMING = 'PERFORMING',
  SUCCESS = 'SUCCESS',
  FAIL = 'FAIL'
}

export interface SenseiQuote {
  text: string;
  mood: 'peaceful' | 'strict' | 'proud';
}
