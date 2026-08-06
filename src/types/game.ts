export interface CardData {
  id: string;
  type: 'country' | 'currency';
  pairId: string;
  content: string;
  symbol?: string;
}

export type Difficulty = 'easy' | 'hard';

export interface GameState {
  cards: CardData[];
  flippedCardIds: string[];
  matchedPairIds: string[];
  lives: number;
  score: number;
  moves: number;
  isGameOver: boolean;
  isGameWon: boolean;
  timeElapsed: number;
}

export interface LeaderboardEntry {
  name: string;
  score: number;
  time: number;
  moves: number;
  date: string;
}

export interface GameStatistics {
  bestScore: number;
  bestTime: number;
  gamesPlayed: number;
  wins: number;
  losses: number;
  leaderboardEasy: LeaderboardEntry[];
  leaderboardHard: LeaderboardEntry[];
  leaderboard?: LeaderboardEntry[]; // Legacy
}
