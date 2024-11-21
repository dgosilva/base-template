import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

function App() {
  const [numbers, setNumbers] = useState([]);
  const [primeIndex, setPrimeIndex] = useState(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const generateNumbers = () => {
    let nums = [];
    let primePos = Math.floor(Math.random() * 5);
    for(let i = 0; i < 5; i++) {
      let num;
      if (i === primePos) {
        num = generatePrime(2, 100);
      } else {
        num = Math.floor(Math.random() * 99) + 2; // 2 to 100, avoiding 1
        while (isPrime(num)) {
          num = Math.floor(Math.random() * 99) + 2;
        }
      }
      nums.push(num);
    }
    setNumbers(nums);
    setPrimeIndex(primePos);
  };

  const generatePrime = (min, max) => {
    let num = Math.floor(Math.random() * (max - min + 1)) + min;
    while (!isPrime(num)) {
      num++;
      if (num > max) num = min;
    }
    return num;
  };

  const isPrime = (num) => {
    for(let i = 2, s = Math.sqrt(num); i <= s; i++)
      if(num % i === 0) return false; 
    return num > 1;
  };

  const checkAnswer = (index) => {
    if (index === primeIndex) {
      setScore(score + 1);
      generateNumbers();
    } else {
      setGameOver(true);
    }
  };

  useEffect(() => {
    generateNumbers();
  }, []);

  const restartGame = () => {
    setScore(0);
    setGameOver(false);
    generateNumbers();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 sm:p-8">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Prime Number Game</CardTitle>
        </CardHeader>
        <CardContent>
          {gameOver ? (
            <div>
              <p className="text-center mb-4">Game Over! Your score was {score}.</p>
              <Button onClick={restartGame} className="w-full">Play Again</Button>
            </div>
          ) : (
            <>
              <Label className="mb-4 text-center block">Which one is the prime number?</Label>
              <div className="grid grid-cols-5 gap-2 mb-4">
                {numbers.map((num, index) => (
                  <Button key={index} onClick={() => checkAnswer(index)} variant="outline">
                    {num}
                  </Button>
                ))}
              </div>
              <p className="text-center">Score: {score}</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default App;