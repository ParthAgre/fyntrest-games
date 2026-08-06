import { Clock, Move, Trophy, ChevronLeft } from 'lucide-react';
import { Lives } from './Lives';

interface HeaderProps {
  timeElapsed: number;
  moves: number;
  score: number;
  lives: number;
  maxLives: number;
  matchedPairs: number;
  totalPairs: number;
  onGoHome: () => void;
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const Header = ({ timeElapsed, moves, score, lives, maxLives, matchedPairs, totalPairs, onGoHome }: HeaderProps) => {
  return (
    <header className="w-full flex justify-between items-center py-4 px-6 md:px-12 glass-panel rounded-b-3xl">
      <div className="flex gap-4 md:gap-6 items-center">
        <button 
          onClick={onGoHome}
          className="p-2 -ml-2 rounded-xl hover:bg-white/10 transition-colors text-white/70 hover:text-white"
          title="Quit Game"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <div className="flex items-center gap-2 hidden sm:flex">
          <Clock className="w-5 h-5 text-fyntrest-emerald" />
          <span className="font-mono text-xl font-medium w-16">{formatTime(timeElapsed)}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Move className="w-5 h-5 text-fyntrest-blue" />
          <span className="font-mono text-xl font-medium w-12">{moves}</span>
        </div>

        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-fyntrest-gold" />
          <span className="font-mono text-xl font-bold text-fyntrest-gold">{score}</span>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="flex flex-col items-center">
          <span className="text-sm text-white/70 uppercase tracking-widest font-semibold mb-1">Progress</span>
          <span className="font-bold text-lg">{matchedPairs} / {totalPairs} Pairs</span>
        </div>
        
        <Lives lives={lives} maxLives={maxLives} />
      </div>
    </header>
  );
};
