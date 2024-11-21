import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const generateNumbers = () => {
  const numbers = [];
  while (numbers.length < 5) {
    const num = Math.floor(Math.random() * 100) + 1;
    if (!numbers.includes(num)) {
      numbers.push(num);
    }
  }
  return numbers;
};

const isPrime = (num) => {
  if (num <= 1) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
};

const NumberButton = ({ number, onClick, disabled }) => (
  <Button
    onClick={() => onClick(number)}
    disabled={disabled}
    className="w-full sm:w-auto m-1"
  >
    {number}
  </Button>
);

const GameOver = ({ score, onPlayAgain }) => (
  <Card className="w-full max-w-md mx-auto mt-8">
    <CardHeader>
      <CardTitle className="text-2xl font-bold text-center">Game Over</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-xl text-center mb-4">Your final score: {score}</p>
    </CardContent>
    <CardFooter className="justify-center">
      <Button onClick={onPlayAgain}>Play Again</Button>
    </CardFooter>
  </Card>
);

const Game = () => {
  const [numbers, setNumbers] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    setNumbers(generateNumbers());
  }, []);

  const handleNumberClick = (number) => {
    if (isPrime(number)) {
      setScore((prevScore) => prevScore + 1);
      setNumbers(generateNumbers());
    } else {
      setGameOver(true);
    }
  };

  const handlePlayAgain = () => {
    setScore(0);
    setGameOver(false);
    setNumbers(generateNumbers());
  };

  if (gameOver) {
    return <GameOver score={score} onPlayAgain={handlePlayAgain} />;
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Find the Prime Number
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg text-center mb-4">Score: {score}</p>
        <div className="flex flex-wrap justify-center">
          {numbers.map((number) => (
            <NumberButton
              key={number}
              number={number}
              onClick={handleNumberClick}
              disabled={gameOver}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Game />
    </div>
  );
}