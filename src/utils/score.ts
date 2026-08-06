const COST_PER_MOVE = 10;
const COST_PER_WRONG_ATTEMPT = 50;

export const calculateScore = (
  isWin: boolean,
  matchedPairsCount: number,
  moves: number, 
  wrongAttempts: number, 
  timeInSeconds: number
): number => {
  let score = 0;

  if (isWin) {
    // Time bracket bonuses for winning
    if (timeInSeconds <= 20) score += 2000;
    else if (timeInSeconds <= 30) score += 1500;
    else if (timeInSeconds <= 45) score += 1000;
    else if (timeInSeconds <= 60) score += 500;
    else score += 250;
  } else {
    // Base score for losing based on progress
    score += matchedPairsCount * 100;
  }

  // Penalties
  score -= moves * COST_PER_MOVE;
  score -= wrongAttempts * COST_PER_WRONG_ATTEMPT;

  return Math.max(0, score);
};
