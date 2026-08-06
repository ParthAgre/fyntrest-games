import { useState } from 'react';
import { Home } from './components/Home';
import { Game } from './components/Game';
import { Difficulty } from './types/game';

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [playerEmail, setPlayerEmail] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('hard');

  return (
    <div className="w-full min-h-screen bg-fyntrest-darker text-white selection:bg-fyntrest-emerald/30">
      {isPlaying ? (
        <Game playerName={playerName} playerEmail={playerEmail} difficulty={difficulty} onGoHome={() => setIsPlaying(false)} />
      ) : (
        <Home onStartGame={(name, email, diff) => {
          setPlayerName(name);
          setPlayerEmail(email);
          setDifficulty(diff);
          setIsPlaying(true);
        }} />
      )}
    </div>
  );
}

export default App;
