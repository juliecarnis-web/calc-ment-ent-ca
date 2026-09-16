export type Level = 'CP' | 'CE1' | 'CE2' | 'CM1' | 'CM2';

export type DisplayFormat = 'classique' | 'boulier' | 'blocs';

export type GameMode = 'entrainement' | 'sprint';

export interface SkillDefinition {
  id: string;
  name: string;
}

export interface CardState {
  id: number;
  playerName: string;
  level: Level;
  skill: string;
  limit: number;
  format: DisplayFormat;
  n1: number;
  n2: number;
  op: '+' | '-' | 'x' | '÷';
  ans: number;
  expected: number;
  display: string;
  subtype: 'double' | 'moitie' | null;
  roundedN1?: number;
  roundedN2?: number;
  userAnswer: string;
  isFlipped: boolean;
  isCorrect: boolean | null;
  score: number;
  streak: number;
  attempts: number;
}

export interface GameSettings {
  sprintDuration: number;
  soundEnabled: boolean;
  showHints: boolean;
}
