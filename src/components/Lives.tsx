import { Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LivesProps {
  lives: number;
  maxLives?: number;
}

export const Lives = ({ lives, maxLives = 3 }: LivesProps) => {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: maxLives }).map((_, index) => {
        const isAlive = index < lives;
        
        return (
          <div key={index} className="relative w-8 h-8">
            {/* Empty heart background */}
            <Heart className="absolute inset-0 w-8 h-8 text-white/20" fill="currentColor" />
            
            {/* Filled heart with animation */}
            <AnimatePresence>
              {isAlive && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0, transition: { duration: 0.3 } }}
                  className="absolute inset-0"
                >
                  <Heart className="w-8 h-8 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]" fill="currentColor" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};
