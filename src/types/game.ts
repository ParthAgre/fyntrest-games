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
  email: string;
  score: number;
  time: number;
  moves: number;
  date: string;
}

export interface SupabaseLeaderboardRow {
  id: string;
  game: string;
  player_name: string;
  player_email: string;
  score: number;
  time_taken: number;
  moves: number;
  mistakes: number;
  created_at: string;
}

export type InsertScoreDTO = Omit<SupabaseLeaderboardRow, 'id' | 'created_at'>;

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
