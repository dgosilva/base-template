import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function Character({ initialLife = 100, onLifeChange }) {
  const [life, setLife] = useState(initialLife);

  const handleClick = useCallback(() => {
    const damage = Math.floor(Math.random() * 20) + 1; // Random damage between 1 and 20
    const newLife = Math.max(life - damage, 0);
    setLife(newLife);
    onLifeChange(newLife);
  }, [life, onLifeChange]);

  const lifePercentage = (life / initialLife) * 100;

  return (
    <div className="flex flex-col items-center" onClick={handleClick}>
      <div className="w-4 h-24 bg-green-500 mb-2" style={{ width: `${lifePercentage}%` }}></div>
      <div className="w-16 h-16 bg-gray-500 rounded-full flex items-center justify-center text-white text-lg">
        {life > 0 ? '👾' : '💀'}
      </div>
    </div>
  );
}

export default function App() {
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const resetGame = () => {
    setGameOver(false);
    setScore(0);
  };

  const handleLifeChange = (currentLife) => {
    if (currentLife === 0) {
      setGameOver(true);
      setScore(prevScore => prevScore + 1);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Character Life Game</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          {gameOver ? (
            <>
              <p className="text-2xl mb-4">Game Over</p>
              <p>Characters Defeated: {score}</p>
              <Button onClick={resetGame} className="mt-4">Play Again</Button>
            </>
          ) : (
            <Character onLifeChange={handleLifeChange} />
          )}
        </CardContent>
      </Card>
      <p className="mt-4 text-sm text-gray-500">Click on the character to reduce its life!</p>
    </div>
  );
}