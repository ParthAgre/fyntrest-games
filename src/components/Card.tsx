import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CardData } from '../types/game';

interface CardProps {
  card: CardData;
  isFlipped: boolean;
  isMatched: boolean;
  isMismatched: boolean;
  isRecentlyMatched: boolean;
  onClick: () => void;
}

export const Card = ({ card, isFlipped, isMatched, isMismatched, isRecentlyMatched, onClick }: CardProps) => {
  return (
    <div className="w-full h-full perspective-1000">
      <motion.div
        className={twMerge(
          clsx(
            'w-full h-full relative transform-style-3d cursor-pointer rounded-2xl transition-shadow duration-300',
            {
              'animate-shake': isMismatched,
              'animate-bounce-match': isRecentlyMatched,
              'shadow-[0_0_20px_rgba(16,185,129,0.5)]': isMatched && !isRecentlyMatched,
            }
          )
        )}
        initial={false}
        animate={{ rotateY: isFlipped || isMatched ? 180 : 0 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 260, damping: 20 }}
        whileHover={!isFlipped && !isMatched ? { scale: 1.05, y: -5 } : {}}
        whileTap={!isFlipped && !isMatched ? { scale: 0.95 } : {}}
        onClick={onClick}
      >
        {/* Card Back (Facedown) */}
        <div className="absolute w-full h-full backface-hidden rounded-2xl glass-panel flex items-center justify-center bg-gradient-to-br from-fyntrest-emerald/20 to-fyntrest-blue/20">
          <div className="w-12 h-12 rounded-full border-2 border-white/30 flex items-center justify-center">
            <div className="w-8 h-8 bg-white/20 rounded-full" />
          </div>
        </div>

        {/* Card Front (Faceup) */}
        <div 
          className={twMerge(
            clsx(
              'absolute w-full h-full backface-hidden rotate-y-180 rounded-2xl flex items-center justify-center p-4 text-center',
              isMatched 
                ? 'bg-gradient-to-br from-emerald-500/90 to-emerald-700/90 border-2 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                : 'glass-panel bg-gradient-to-br from-white/15 to-white/5'
            )
          )}
        >
          {card.type === 'country' ? (
            <span className="text-2xl md:text-3xl font-bold">{card.content}</span>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2">
              <span className="text-3xl md:text-5xl font-black text-fyntrest-gold drop-shadow-lg">{card.symbol}</span>
              <span className="text-sm md:text-lg font-medium">{card.content.replace(card.symbol || '', '').trim()}</span>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
