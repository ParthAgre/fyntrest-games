import { useEffect, useState } from 'react';
import { StorageService } from '../services/storage';
import { LeaderboardEntry, Difficulty } from '../types/game';
import { Trophy, Clock, Move, Trash2 } from 'lucide-react';

interface LeaderboardProps {
  defaultTab?: Difficulty;
}

export const Leaderboard = ({ defaultTab = 'hard' }: LeaderboardProps = {}) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [activeTab, setActiveTab] = useState<Difficulty>(defaultTab);

  useEffect(() => {
    setEntries(StorageService.getLeaderboard(activeTab));
  }, [activeTab]);

  const handleDelete = (index: number) => {
    StorageService.deleteEntry(index, activeTab);
    setEntries(StorageService.getLeaderboard(activeTab));
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

      {entries.length === 0 ? (
        <div className="text-center text-white/70 py-8">
          No scores yet for {activeTab} mode.
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry, index) => (
            <div 
              key={index} 
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
                <span className="font-medium">{entry.name}</span>
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
                      <span>{entry.time}s</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Move className="w-3 h-3" />
                      <span>{entry.moves}</span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => handleDelete(index)}
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
