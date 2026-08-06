import { useEffect, useState, useCallback } from 'react';
import { LeaderboardService } from '../services/leaderboard';
import { SupabaseLeaderboardRow, Difficulty } from '../types/game';
import { Trophy, Clock, Move, Trash2, Loader2 } from 'lucide-react';

interface LeaderboardProps {
  defaultTab?: Difficulty;
}

export const Leaderboard = ({ defaultTab = 'hard' }: LeaderboardProps = {}) => {
  const [entries, setEntries] = useState<SupabaseLeaderboardRow[]>([]);
  const [activeTab, setActiveTab] = useState<Difficulty>(defaultTab);
  const [isLoading, setIsLoading] = useState(true);

  const fetchScores = useCallback(async () => {
    setIsLoading(true);
    const gameId = `memory-${activeTab}`;
    const topScores = await LeaderboardService.getTopScoresByGame(gameId);
    setEntries(topScores);
    setIsLoading(false);
  }, [activeTab]);

  useEffect(() => {
    fetchScores();

    // Subscribe to realtime updates
    const subscription = LeaderboardService.subscribeToUpdates(() => {
      fetchScores();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchScores]);

  const handleDelete = async (id: string) => {
    // Optimistic UI update
    setEntries(prev => prev.filter(entry => entry.id !== id));
    const success = await LeaderboardService.deleteScore(id);
    
    // If RLS blocks the deletion, reset the UI to match the database
    if (!success) {
      alert("You don't have permission to delete this score.");
      fetchScores();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      {/* Tabs */}
      <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 mb-4">
        <button
          onClick={() => setActiveTab('easy')}
          className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${
            activeTab === 'easy' 
              ? 'bg-fyntrest-blue text-white shadow-md' 
              : 'text-white/50 hover:text-white hover:bg-white/5'
          }`}
        >
          Easy Mode
        </button>
        <button
          onClick={() => setActiveTab('hard')}
          className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${
            activeTab === 'hard' 
              ? 'bg-fyntrest-emerald text-white shadow-md' 
              : 'text-white/50 hover:text-white hover:bg-white/5'
          }`}
        >
          Hard Mode
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="w-8 h-8 text-fyntrest-emerald animate-spin" />
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center text-white/70 py-8">
          No scores yet for {activeTab} mode.
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry, index) => (
            <div 
              key={entry.id} 
              className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className={`w-6 text-center font-bold ${
                  index === 0 ? 'text-fyntrest-gold text-lg drop-shadow-[0_0_5px_rgba(251,191,36,0.8)]' : 
                  index === 1 ? 'text-gray-300' : 
                  index === 2 ? 'text-amber-600' : 'text-white/50'
                }`}>
                  #{index + 1}
                </span>
                <span className="font-medium">{entry.player_name}</span>
              </div>
              
              <div className="flex gap-4 items-center">
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-1.5 bg-fyntrest-emerald/20 px-3 py-1 rounded-full border border-fyntrest-emerald/30">
                    <Trophy className="w-4 h-4 text-fyntrest-gold" />
                    <span className="font-bold text-fyntrest-emerald text-lg">{entry.score}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-xs text-white/50">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{entry.time_taken}s</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Move className="w-3 h-3" />
                      <span>{entry.moves}</span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="p-2 bg-red-500/10 hover:bg-red-500/30 text-red-400 hover:text-red-300 rounded-lg transition-colors border border-red-500/20 shadow-sm ml-2"
                  title="Delete Entry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
