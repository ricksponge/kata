
export enum MoveType {
  GEDAN_BARAI = 'Gedan-Barai', // Blocage bas
  OI_ZUKI_JODAN = 'Oi-Zuki Jodan', // Poing niveau visage
  KIAI = 'KIAI',
  YAME = 'Yame' // Retour au calme
}

export interface Kata {
  id: string;
  name: string;
  sequence: MoveType[];
  difficulty: 'Débutant' | 'Intermédiaire' | 'Maître';
  description: string;
  translations: Record<string, string>;
}

export enum GameState {
  IDLE = 'IDLE',
  STARTING = 'STARTING',
  PERFORMING = 'PERFORMING',
  SUCCESS = 'SUCCESS',
  FAIL = 'FAIL'
}

export interface SenseiQuote {
  text: string;
  mood: 'peaceful' | 'strict' | 'proud';
}
