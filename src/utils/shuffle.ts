import { COUNTRY_CURRENCY_PAIRS } from '../constants/pairs';
import { CardData, Difficulty } from '../types/game';

export const createDeck = (difficulty: Difficulty = 'hard'): CardData[] => {
  const cards: CardData[] = [];
  
  // Easy: 6 pairs (12 cards) -> 3x4 grid
  // Hard: 8 pairs (16 cards) -> 4x4 grid
  const pairCount = difficulty === 'easy' ? 6 : 8;
  const selectedPairs = COUNTRY_CURRENCY_PAIRS.slice(0, pairCount);

  selectedPairs.forEach((pair) => {
    // Add country card
    cards.push({
      id: `country-${pair.pairId}`,
      type: 'country',
      pairId: pair.pairId,
      content: pair.country,
    });

    // Add currency card
    cards.push({
      id: `currency-${pair.pairId}`,
      type: 'currency',
      pairId: pair.pairId,
      content: `${pair.symbol} ${pair.currency}`,
      symbol: pair.symbol,
    });
  });

  // Fisher-Yates Shuffle
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  return cards;
};
