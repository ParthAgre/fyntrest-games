import { useState, useEffect, useCallback } from 'react';
import { CardData, Difficulty } from '../types/game';
import { createDeck } from '../utils/shuffle';
import { calculateScore } from '../utils/score';
import { StorageService } from '../services/storage';
import { LeaderboardService } from '../services/leaderboard';

const MATCH_DELAY = 700;

export const useGame = (
  timeElapsed: number,
  startTimer: () => void,
  stopTimer: () => void,
  resetTimer: () => void,
  playerName: string,
  difficulty: Difficulty
) => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [flippedCardIds, setFlippedCardIds] = useState<string[]>([]);
  const [matchedPairIds, setMatchedPairIds] = useState<string[]>([]);
  const maxLives = difficulty === 'easy' ? 4 : 5;
  const [lives, setLives] = useState(maxLives);
  const [moves, setMoves] = useState(0);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [score, setScore] = useState(0);
  const [mismatchedCardIds, setMismatchedCardIds] = useState<string[]>([]);
  const [lastMatchedCardIds, setLastMatchedCardIds] = useState<string[]>([]);
  const [isInitializing, setIsInitializing] = useState(false);
  const [hasStartedPreview, setHasStartedPreview] = useState(false);

  // Initialize game
  const initGame = useCallback(() => {
    const newCards = createDeck(difficulty);
    setCards(newCards);
    setFlippedCardIds([]); // Keep hidden initially
    const currentMaxLives = difficulty === 'easy' ? 4 : 5;
    setMatchedPairIds([]);
    setLives(currentMaxLives);
    setMoves(0);
    setWrongAttempts(0);
    setIsGameOver(false);
    setIsGameWon(false);
    setIsProcessing(true); // Prevent clicking
    setScore(0);
    setMismatchedCardIds([]);
    setLastMatchedCardIds([]);
    resetTimer();
    setIsInitializing(false);
    setHasStartedPreview(false);
  }, [resetTimer, difficulty]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const startPreview = () => {
    setHasStartedPreview(true);
    setFlippedCardIds(cards.map(c => c.id));
    setIsInitializing(true);
    setIsProcessing(true);
  };

  // Handle preview phase
  useEffect(() => {
    if (isInitializing) {
      const previewTimeMs = difficulty === 'hard' ? 5000 : 3000;
      const timeout = setTimeout(() => {
        setFlippedCardIds([]);
        setIsProcessing(false);
        setIsInitializing(false);
      }, previewTimeMs);
      return () => clearTimeout(timeout);
    }
  }, [isInitializing, difficulty]);

  // Handle game end scenarios
  useEffect(() => {
    if (lives === 0 && !isGameOver) {
      stopTimer();
      setIsGameOver(true);
      const finalScore = calculateScore(false, matchedPairIds.length, moves, wrongAttempts, timeElapsed);
      setScore(finalScore);
      StorageService.saveGame(false, finalScore, timeElapsed, moves, playerName, difficulty);
      
      LeaderboardService.submitScore({
        game: `memory-${difficulty}`,
        player_name: playerName,
        score: finalScore,
        time_taken: timeElapsed,
        moves,
        mistakes: wrongAttempts
      });
    }
  }, [lives, isGameOver, stopTimer, timeElapsed, moves, wrongAttempts, playerName, difficulty]);

  useEffect(() => {
    // Total pairs = cards.length / 2 (since deck is built by pairs)
    if (cards.length > 0 && matchedPairIds.length === cards.length / 2 && !isGameWon) {
      stopTimer();
      setIsGameWon(true);
      const finalScore = calculateScore(true, matchedPairIds.length, moves, wrongAttempts, timeElapsed);
      setScore(finalScore);
      StorageService.saveGame(true, finalScore, timeElapsed, moves, playerName, difficulty);
      
      LeaderboardService.submitScore({
        game: `memory-${difficulty}`,
        player_name: playerName,
        score: finalScore,
        time_taken: timeElapsed,
        moves,
        mistakes: wrongAttempts
      });
    }
  }, [matchedPairIds, cards.length, isGameWon, stopTimer, moves, wrongAttempts, timeElapsed, playerName, difficulty]);

  const handleCardClick = (cardId: string) => {
    if (isProcessing || isGameOver || isGameWon) return;
    if (flippedCardIds.includes(cardId)) return;
    if (matchedPairIds.includes(cards.find(c => c.id === cardId)?.pairId || '')) return;

    if (moves === 0 && flippedCardIds.length === 0) {
      startTimer();
    }

    setLastMatchedCardIds([]);

    const newFlippedIds = [...flippedCardIds, cardId];
    setFlippedCardIds(newFlippedIds);

    if (newFlippedIds.length === 2) {
      setMoves(prev => prev + 1);
      setIsProcessing(true);

      const card1 = cards.find(c => c.id === newFlippedIds[0]);
      const card2 = cards.find(c => c.id === newFlippedIds[1]);

      if (card1 && card2 && card1.pairId === card2.pairId) {
        // Match!
        setTimeout(() => {
          setMatchedPairIds(prev => [...prev, card1.pairId]);
          setFlippedCardIds([]);
          setLastMatchedCardIds([card1.id, card2.id]);
          setIsProcessing(false);
        }, 300);
      } else {
        // Mismatch! Wait for the card to flip before shaking
        setTimeout(() => {
          setMismatchedCardIds([card1!.id, card2!.id]); // Shake both wrong cards
          
          setTimeout(() => {
            setWrongAttempts(prev => prev + 1);
            setLives(prev => Math.max(0, prev - 1));
            setFlippedCardIds([]);
            setMismatchedCardIds([]);
            setIsProcessing(false);
          }, MATCH_DELAY); // Wait for shake animation to finish
        }, 400); // Wait for flip animation to finish
      }
    }
  };

  return {
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
    totalPairs: cards.length / 2,
    wrongAttempts
  };
};
