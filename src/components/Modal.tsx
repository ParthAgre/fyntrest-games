import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
  children: ReactNode;
  showCloseButton?: boolean;
}

export const Modal = ({ isOpen, onClose, title, children, showCloseButton = false }: ModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-fyntrest-darker/80 backdrop-blur-sm"
            onClick={showCloseButton ? onClose : undefined}
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg glass-panel bg-gradient-to-b from-white/10 to-white/5 border border-white/20 rounded-3xl shadow-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto custom-scrollbar"
          >
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-fyntrest-emerald/20 blur-[60px] rounded-full pointer-events-none" />
            
            {showCloseButton && onClose && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors text-white/70 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            {title && (
              <h2 className="text-3xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                {title}
              </h2>
            )}

            <div className="relative z-10 text-center">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
