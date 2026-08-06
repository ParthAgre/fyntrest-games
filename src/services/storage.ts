import { GameStatistics, LeaderboardEntry, Difficulty } from '../types/game';

const STORAGE_KEY = 'fyntrest_memory_game_stats';

const defaultStats: GameStatistics = {
  bestScore: 0,
  bestTime: 0,
  gamesPlayed: 0,
  wins: 0,
  losses: 0,
  leaderboardEasy: [],
  leaderboardHard: [],
};

export class StorageService {
  static initialize() {
    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultStats));
    }
  }

  static getStatistics(): GameStatistics {
    this.initialize();
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const stats = JSON.parse(data);
        // Migration from legacy leaderboard array
        if (stats.leaderboard) {
          stats.leaderboardHard = [...(stats.leaderboardHard || []), ...stats.leaderboard];
          delete stats.leaderboard;
          if (!stats.leaderboardEasy) stats.leaderboardEasy = [];
          localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
        }
        return stats;
      }
      return defaultStats;
    } catch {
      return defaultStats;
    }
  }

  static saveGame(isWin: boolean, score: number, time: number, moves: number, name: string = 'Player', difficulty: Difficulty = 'hard') {
    const stats = this.getStatistics();
    
    stats.gamesPlayed += 1;
    if (isWin) {
      stats.wins += 1;
      
      if (score > stats.bestScore) {
        stats.bestScore = score;
      }
      
      if (stats.bestTime === 0 || time < stats.bestTime) {
        stats.bestTime = time;
      }
    } else {
      stats.losses += 1;
    }

    const newEntry: LeaderboardEntry = {
      name,
      score,
      time,
      moves,
      date: new Date().toISOString(),
    };

    const listName = difficulty === 'easy' ? 'leaderboardEasy' : 'leaderboardHard';
    stats[listName].push(newEntry);
    stats[listName].sort((a, b) => b.score - a.score); // Highest score first
    stats[listName] = stats[listName].slice(0, 10); // Keep top 10

    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  }

  static deleteEntry(index: number, difficulty: Difficulty) {
    const stats = this.getStatistics();
    const listName = difficulty === 'easy' ? 'leaderboardEasy' : 'leaderboardHard';
    
    if (index >= 0 && index < stats[listName].length) {
      stats[listName].splice(index, 1);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    }
  }

  static getLeaderboard(difficulty: Difficulty): LeaderboardEntry[] {
    const listName = difficulty === 'easy' ? 'leaderboardEasy' : 'leaderboardHard';
    return this.getStatistics()[listName] || [];
  }

  static getBestScore(): number {
    return this.getStatistics().bestScore;
  }

  static clearLeaderboard() {
    const stats = this.getStatistics();
    stats.leaderboard = [];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  }
}
