import { motion } from 'framer-motion';
import { RotateCcw, Home as HomeIcon } from 'lucide-react';
import { Header } from './Header';
import { GameBoard } from './GameBoard';
import { Modal } from './Modal';
import { Leaderboard } from './Leaderboard';
import { useGame } from '../hooks/useGame';
import { useTimer } from '../hooks/useTimer';
import { Difficulty } from '../types/game';

interface GameProps {
  playerName: string;
  playerEmail: string;
  difficulty: Difficulty;
  onGoHome: () => void;
}

export const Game = ({ playerName, playerEmail, difficulty, onGoHome }: GameProps) => {
  const { timeElapsed, startTimer, stopTimer, resetTimer } = useTimer();
  const {
    cards,
    flippedCardIds,
    matchedPairIds,
    mismatchedCardIds,
    lastMatchedCardIds,
    lives,
    maxLives,
    moves,
    score,
    isGameOver,
    isGameWon,
    handleCardClick,
    initGame,
    startPreview,
    hasStartedPreview,
    totalPairs
  } = useGame(timeElapsed, startTimer, stopTimer, resetTimer, playerName, playerEmail, difficulty);

  return (
    <div className="w-full h-screen flex flex-col items-center bg-fyntrest-darker relative">
      <Header
        timeElapsed={timeElapsed}
        moves={moves}
        score={score}
        lives={lives}
        maxLives={maxLives}
        matchedPairs={matchedPairIds.length}
        totalPairs={totalPairs}
        onGoHome={onGoHome}
      />
      
      <main className="flex-1 w-full flex items-center justify-center p-4">
        <GameBoard
          cards={cards}
          flippedCardIds={flippedCardIds}
          matchedPairIds={matchedPairIds}
          mismatchedCardIds={mismatchedCardIds}
          lastMatchedCardIds={lastMatchedCardIds}
          difficulty={difficulty}
          onCardClick={handleCardClick}
        />
      </main>

      {/* Win Modal */}
      <Modal isOpen={isGameWon} title="🎉 Currency Master!">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-panel p-4 rounded-2xl">
              <span className="text-white/60 text-sm uppercase tracking-wider font-bold">Time</span>
              <p className="text-2xl font-mono mt-1">{timeElapsed}s</p>
            </div>
            <div className="glass-panel p-4 rounded-2xl bg-gradient-to-br from-fyntrest-gold/20 to-transparent border-fyntrest-gold/30">
              <span className="text-fyntrest-gold/80 text-sm uppercase tracking-wider font-bold">Score</span>
              <p className="text-3xl font-mono mt-1 font-bold text-fyntrest-gold">{score}</p>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-2xl max-h-[30vh] overflow-y-auto custom-scrollbar">
            <h3 className="text-lg font-bold mb-3 text-white/80 uppercase tracking-widest">Leaderboard</h3>
            <Leaderboard defaultTab={difficulty} />
          </div>

          <div className="flex gap-4 pt-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={initGame}
              className="flex-1 bg-gradient-to-r from-fyntrest-emerald to-emerald-600 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-lg py-4 rounded-2xl flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Play Again
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onGoHome}
              className="flex-1 glass-panel hover:bg-white/20 text-white font-bold text-lg py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors"
            >
              <HomeIcon className="w-5 h-5" />
              Home
            </motion.button>
          </div>
        </div>
      </Modal>

      {/* Lose Modal */}
      <Modal isOpen={isGameOver && !isGameWon} title="💸 Better Luck Next Time!">
        <div className="space-y-6">
          <p className="text-lg text-white/90">
            World currencies can be tricky! You've run out of lives.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-panel p-3 rounded-2xl">
              <span className="text-white/60 text-xs uppercase tracking-wider font-bold">Pairs Found</span>
              <p className="text-xl font-mono mt-1 font-bold text-fyntrest-emerald">{matchedPairIds.length} <span className="text-sm text-white/40">/ {totalPairs}</span></p>
            </div>
            <div className="glass-panel p-3 rounded-2xl">
              <span className="text-white/60 text-xs uppercase tracking-wider font-bold">Time Survived</span>
              <p className="text-xl font-mono mt-1 font-bold">{timeElapsed}s</p>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-2xl max-h-[30vh] overflow-y-auto custom-scrollbar">
            <h3 className="text-lg font-bold mb-3 text-white/80 uppercase tracking-widest">Leaderboard</h3>
            <Leaderboard defaultTab={difficulty} />
          </div>

          <div className="flex gap-4 pt-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={initGame}
              className="flex-1 bg-gradient-to-r from-fyntrest-blue to-blue-600 hover:from-blue-500 hover:to-blue-400 text-white font-bold text-lg py-4 rounded-2xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.4)]"
            >
              <RotateCcw className="w-5 h-5" />
              Try Again
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onGoHome}
              className="flex-1 glass-panel hover:bg-white/20 text-white font-bold text-lg py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors"
            >
              <HomeIcon className="w-5 h-5" />
              Home
            </motion.button>
          </div>
        </div>
      </Modal>

      {/* Get Ready Modal */}
      <Modal
        isOpen={!hasStartedPreview}
        onClose={() => {}}
        title="Get Ready!"
      >
        <div className="text-center space-y-6">
          <p className="text-xl text-white/90 leading-relaxed">
            You will have <strong className="text-fyntrest-emerald">{difficulty === 'hard' ? 5 : 3} seconds</strong> to memorize the positions of the countries and their currencies.
          </p>
          <p className="text-lg text-white/70">
            Pay close attention!
          </p>
          
          <button
            onClick={startPreview}
            className="w-full bg-gradient-to-r from-fyntrest-blue to-fyntrest-emerald text-white font-bold text-xl py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-95"
          >
            I'm Ready!
          </button>
        </div>
      </Modal>
    </div>
  );
};
