const INITIAL_SCORE = 1000;
const COST_PER_MOVE = 10;
const COST_PER_WRONG_ATTEMPT = 50;
const TIME_BONUS_THRESHOLD = 30; // seconds
const TIME_BONUS_AMOUNT = 200;

export const calculateScore = (moves: number, wrongAttempts: number, timeInSeconds: number): number => {
  let score = INITIAL_SCORE;

  score -= moves * COST_PER_MOVE;
  score -= wrongAttempts * COST_PER_WRONG_ATTEMPT;

  if (timeInSeconds <= TIME_BONUS_THRESHOLD) {
    score += TIME_BONUS_AMOUNT;
  }

  return Math.max(0, score);
};
