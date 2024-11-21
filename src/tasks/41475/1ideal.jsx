import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const choices = ['rock', 'paper', 'scissors'];
const gameResult = {
  win: 'You win!',
  lose: 'Computer wins!',
  tie: "It's a tie!"
};

function Game() {
  // State management
  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [round, setRound] = useState(1);
  const [playerChoice, setPlayerChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [result, setResult] = useState('');
  const [gameOver, setGameOver] = useState(false);

  const playAgain = () => {
    setPlayerScore(0);
    setComputerScore(0);
    setRound(1);
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult('');
    setGameOver(false);
  };

  const determineWinner = (player, computer) => {
    if (player === computer) return gameResult.tie;
    if (
      (player === 'rock' && computer === 'scissors') ||
      (player === 'scissors' && computer === 'paper') ||
      (player === 'paper' && computer === 'rock')
    ) {
      setPlayerScore(playerScore + 1);
      return gameResult.win;
    } else {
      setComputerScore(computerScore + 1);
      return gameResult.lose;
    }
  };

  const handleChoice = (choice) => {
    if (!gameOver) {
      setPlayerChoice(choice);
      const compChoice = choices[Math.floor(Math.random() * choices.length)];
      setComputerChoice(compChoice);
      const roundResult = determineWinner(choice, compChoice);
      setResult(roundResult);
      // Increment round only if it's not a tie
      if (roundResult !== gameResult.tie) {
        setRound(round + 1);
      }
    }
  };

  useEffect(() => {
    if (playerScore === 2 || computerScore === 2) {
      setGameOver(true);
    }
  }, [playerScore, computerScore]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Rock Paper Scissors</CardTitle>
        </CardHeader>
        <CardContent>
          {gameOver ? (
            <div>
              <h2 className="text-2xl font-bold mb-4">{`Game Over! ${playerScore > computerScore ? 'You Win!' : 'Computer Wins!'}`}</h2>
              <Button onClick={playAgain}>Play Again</Button>
            </div>
          ) : (
            <>
              <p>Round: {round}</p>
              <p>Score - You: {playerScore} | Computer: {computerScore}</p>
              <div className="mt-4 space-x-2">
                {choices.map(choice => (
                  <Button key={choice} onClick={() => handleChoice(choice)} className="capitalize">
                    {choice}
                  </Button>
                ))}
              </div>
              {playerChoice && (
                <div className="mt-4">
                  <p>You chose: {playerChoice}</p>
                  <p>Computer chose: {computerChoice}</p>
                  <p><strong>{result}</strong></p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function App() {
  return <Game />;
}