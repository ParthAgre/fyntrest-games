import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Info, Trophy } from 'lucide-react';
import { Modal } from './Modal';
import { Leaderboard } from './Leaderboard';
import { Difficulty } from '../types/game';

interface HomeProps {
  onStartGame: (name: string, email: string, difficulty: Difficulty) => void;
}

export const Home = ({ onStartGame }: HomeProps) => {
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('hard');

  const handleStart = () => {
    if (!name.trim() || !email.trim()) return;
    onStartGame(name.trim(), email.trim(), difficulty);
  };

  return (
    <div className="w-full h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-fyntrest-emerald/20 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fyntrest-blue/20 blur-[100px] rounded-full pointer-events-none" />

      <motion.div 
        className="glass-panel max-w-2xl w-full rounded-[2.5rem] p-12 flex flex-col items-center text-center border border-white/20 relative z-10"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
      >
        {/* Fyntrest Logo */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/20 mb-4 shadow-lg">
            <span className="text-3xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-fyntrest-emerald to-fyntrest-blue">
              Fyntrest
            </span>
          </div>
        </div>

        <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tight drop-shadow-sm">
          🌍 Currency Match Challenge
        </h1>
        
        <p className="text-xl text-white/80 mb-8 max-w-lg font-medium leading-relaxed">
          Match every country with its currency before making {difficulty === 'easy' ? 4 : 5} mistakes.
        </p>

        <div className="w-full max-w-md mb-8 space-y-4">
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 px-6 text-xl text-white placeholder-white/50 focus:outline-none focus:border-fyntrest-emerald focus:ring-2 focus:ring-fyntrest-emerald/50 transition-all text-center font-bold"
            maxLength={15}
          />

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleStart()}
            className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 px-6 text-xl text-white placeholder-white/50 focus:outline-none focus:border-fyntrest-emerald focus:ring-2 focus:ring-fyntrest-emerald/50 transition-all text-center font-bold"
          />
          
          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
            <button
              onClick={() => setDifficulty('easy')}
              className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                difficulty === 'easy' 
                  ? 'bg-fyntrest-blue text-white shadow-lg' 
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              Easy (3x4)
            </button>
            <button
              onClick={() => setDifficulty('hard')}
              className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                difficulty === 'hard' 
                  ? 'bg-fyntrest-emerald text-white shadow-lg' 
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              Hard (4x4)
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full max-w-md">
          <motion.button
            whileHover={name.trim() && email.trim() ? { scale: 1.05 } : {}}
            whileTap={name.trim() && email.trim() ? { scale: 0.95 } : {}}
            onClick={handleStart}
            disabled={!name.trim() || !email.trim()}
            className={`w-full font-bold text-lg py-4 px-8 rounded-2xl flex items-center justify-center gap-2 transition-all min-h-[64px] ${
              name.trim() && email.trim()
                ? 'bg-gradient-to-r from-fyntrest-emerald to-emerald-600 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                : 'bg-white/10 text-white/30 cursor-not-allowed border border-white/10'
            }`}
          >
            <Play className="fill-current w-5 h-5" />
            Start Game
          </motion.button>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsHowToPlayOpen(true)}
              className="flex-1 glass-panel hover:bg-white/20 text-white font-bold text-lg py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all min-h-[64px]"
            >
              <Info className="w-5 h-5" />
              How to Play
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsLeaderboardOpen(true)}
              className="flex-1 glass-panel hover:bg-white/20 text-fyntrest-gold font-bold text-lg py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all min-h-[64px]"
            >
              <Trophy className="w-5 h-5" />
              Leaderboard
            </motion.button>
          </div>
        </div>
      </motion.div>

      <Modal
        isOpen={isHowToPlayOpen}
        onClose={() => setIsHowToPlayOpen(false)}
        title="How to Play"
        showCloseButton
      >
        <div className="text-left space-y-4 text-lg text-white/90">
          <ul className="space-y-4 font-medium">
            <li className="flex items-start gap-3">
              <span className="text-fyntrest-emerald mt-1">●</span>
              <span>There are <strong>20 hidden cards</strong> on the board.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-fyntrest-emerald mt-1">●</span>
              <span>Match each <strong>country</strong> with its corresponding <strong>currency</strong>.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red-400 mt-1">●</span>
              <span>Be careful! You are only allowed a maximum of <strong>{difficulty === 'easy' ? 4 : 5} wrong matches</strong>.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-fyntrest-gold mt-1">●</span>
              <span>Match all <strong>10 pairs</strong> to win the game.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-fyntrest-blue mt-1">●</span>
              <span>Try to finish quickly and with few mistakes for the <strong>highest score</strong>!</span>
            </li>
          </ul>
        </div>
      </Modal>

      <Modal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        title="Top Scores"
        showCloseButton
      >
        <div className="max-h-[50vh] overflow-y-auto custom-scrollbar pr-2">
          <Leaderboard defaultTab={difficulty} />
        </div>
      </Modal>
    </div>
  );
};
