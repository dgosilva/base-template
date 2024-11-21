import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const choices = ["Rock", "Paper", "Scissors"];

const getComputerChoice = () => choices[Math.floor(Math.random() * choices.length)];

const determineWinner = (playerChoice, computerChoice) => {
  if (playerChoice === computerChoice) return "Tie";
  if (
    (playerChoice === "Rock" && computerChoice === "Scissors") ||
    (playerChoice === "Paper" && computerChoice === "Rock") ||
    (playerChoice === "Scissors" && computerChoice === "Paper")
  ) {
    return "Player";
  }
  return "Computer";
};

const ChoiceButton = ({ choice, onClick, disabled }) => (
  <Button
    onClick={() => onClick(choice)}
    disabled={disabled}
    className="w-full sm:w-auto"
  >
    {choice}
  </Button>
);

const RoundResult = ({ playerChoice, computerChoice, winner }) => (
  <div className="text-center mt-4">
    <p>You chose: {playerChoice}</p>
    <p>Computer chose: {computerChoice}</p>
    <p className="font-bold mt-2">
      {winner === "Tie" ? "It's a tie!" : `${winner} wins this round!`}
    </p>
  </div>
);

const ScoreBoard = ({ playerScore, computerScore }) => (
  <div className="flex justify-between mt-4">
    <p>Player: {playerScore}</p>
    <p>Computer: {computerScore}</p>
  </div>
);

const GameOver = ({ winner, onPlayAgain }) => (
  <Card className="mt-8">
    <CardHeader>
      <CardTitle className="text-center">Game Over</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-center text-2xl font-bold">
        {winner === "Tie" ? "It's a tie!" : `${winner} wins the game!`}
      </p>
    </CardContent>
    <CardFooter className="justify-center">
      <Button onClick={onPlayAgain}>Play Again</Button>
    </CardFooter>
  </Card>
);

export default function App() {
  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [rounds, setRounds] = useState(0);
  const [playerChoice, setPlayerChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [roundWinner, setRoundWinner] = useState(null);
  const [gameWinner, setGameWinner] = useState(null);

  useEffect(() => {
    if (playerScore === 2 || computerScore === 2) {
      setGameWinner(playerScore > computerScore ? "Player" : "Computer");
    }
  }, [playerScore, computerScore]);

  const handlePlayerChoice = (choice) => {
    const compChoice = getComputerChoice();
    setPlayerChoice(choice);
    setComputerChoice(compChoice);
    const winner = determineWinner(choice, compChoice);
    setRoundWinner(winner);
    setRounds(rounds + 1);

    if (winner === "Player") setPlayerScore(playerScore + 1);
    if (winner === "Computer") setComputerScore(computerScore + 1);
  };

  const resetGame = () => {
    setPlayerScore(0);
    setComputerScore(0);
    setRounds(0);
    setPlayerChoice(null);
    setComputerChoice(null);
    setRoundWinner(null);
    setGameWinner(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Rock Paper Scissors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-center gap-2 mb-4">
            {choices.map((choice) => (
              <ChoiceButton
                key={choice}
                choice={choice}
                onClick={handlePlayerChoice}
                disabled={gameWinner !== null}
              />
            ))}
          </div>
          {playerChoice && computerChoice && (
            <RoundResult
              playerChoice={playerChoice}
              computerChoice={computerChoice}
              winner={roundWinner}
            />
          )}
          <ScoreBoard playerScore={playerScore} computerScore={computerScore} />
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-gray-500">
            Best of 3 - Round {rounds} of 3
          </p>
        </CardFooter>
      </Card>
      {gameWinner && <GameOver winner={gameWinner} onPlayAgain={resetGame} />}
    </div>
  );
}