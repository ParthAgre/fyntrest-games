import { CardData, Difficulty } from '../types/game';
import { Card } from './Card';

interface GameBoardProps {
  cards: CardData[];
  flippedCardIds: string[];
  matchedPairIds: string[];
  mismatchedCardIds: string[];
  lastMatchedCardIds: string[];
  difficulty: Difficulty;
  onCardClick: (cardId: string) => void;
}

export const GameBoard = ({
  cards,
  flippedCardIds,
  matchedPairIds,
  mismatchedCardIds,
  lastMatchedCardIds,
  difficulty,
  onCardClick
}: GameBoardProps) => {
  const gridClass = difficulty === 'easy' ? 'grid-cols-4 grid-rows-3' : 'grid-cols-4 grid-rows-4';
  
  return (
    <div className={`grid ${gridClass} gap-3 md:gap-4 w-full h-full max-w-4xl mx-auto p-4 flex-1 items-center justify-center content-center`}>
      {cards.map(card => (
        <Card
          key={card.id}
          card={card}
          isFlipped={flippedCardIds.includes(card.id)}
          isMatched={matchedPairIds.includes(card.pairId)}
          isMismatched={mismatchedCardIds.includes(card.id)}
          isRecentlyMatched={lastMatchedCardIds.includes(card.id)}
          onClick={() => onCardClick(card.id)}
        />
      ))}
    </div>
  );
};
