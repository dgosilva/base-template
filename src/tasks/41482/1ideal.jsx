import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const Character = ({ health, onClick, isGameOver }) => {
  return (
    <div
      className={`w-32 h-32 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-300 ${
        isGameOver ? "bg-gray-500" : "bg-blue-500"
      }`}
      onClick={onClick}
    >
      <span className="text-white text-4xl">👤</span>
    </div>
  );
};

const LifeBar = ({ health }) => {
  return (
    <div className="w-full mt-4">
      <Progress value={health} className="w-full" />
    </div>
  );
};

const GameOverMessage = () => {
  return (
    <div className="text-2xl font-bold text-red-600 mt-4">Game Over!</div>
  );
};

const PlayAgainButton = ({ onClick }) => {
  return (
    <Button onClick={onClick} className="mt-4">
      Play Again
    </Button>
  );
};

export default function App() {
  const [health, setHealth] = useState(100);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    if (health <= 0) {
      setIsGameOver(true);
    }
  }, [health]);

  const handleCharacterClick = () => {
    if (!isGameOver) {
      const damage = Math.floor(Math.random() * 20) + 1;
      setHealth((prevHealth) => Math.max(prevHealth - damage, 0));
    }
  };

  const handlePlayAgain = () => {
    setHealth(100);
    setIsGameOver(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardContent className="flex flex-col items-center pt-6">
          <Character
            health={health}
            onClick={handleCharacterClick}
            isGameOver={isGameOver}
          />
          <LifeBar health={health} />
          {isGameOver && <GameOverMessage />}
        </CardContent>
        <CardFooter className="flex justify-center">
          {isGameOver && <PlayAgainButton onClick={handlePlayAgain} />}
        </CardFooter>
      </Card>
    </div>
  );
}