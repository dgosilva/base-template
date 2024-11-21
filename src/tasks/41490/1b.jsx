import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const emojis = ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🐔", "🐧", "🐦", "🦆", "🦅", "🦉", "🦇", "🐺", "🐗", "🐴", "🦄", "🐝", "🐛", "🦋", "🐌", "🐞", "🐜"];

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const GameBoard = ({ board, flipped, handleClick }) => {
  return (
    <div className="grid grid-cols-8 gap-1 sm:gap-2">
      {board.map((emoji, index) => (
        <Button
          key={index}
          className="w-8 h-8 sm:w-12 sm:h-12 text-lg sm:text-2xl flex items-center justify-center"
          onClick={() => handleClick(index)}
        >
          {flipped[index] ? emoji : "?"}
        </Button>
      ))}
    </div>
  );
};

export default function App() {
  const [board, setBoard] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [selected, setSelected] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const shuffledEmojis = shuffleArray(emojis).slice(0, 32);
    const newBoard = shuffleArray([...shuffledEmojis, ...shuffledEmojis]);
    setBoard(newBoard);
    setFlipped(new Array(64).fill(true));
    setSelected([]);
    setScore(0);
    setGameOver(false);
    setGameStarted(false);

    setTimeout(() => {
      setFlipped(new Array(64).fill(false));
      setGameStarted(true);
    }, 7000);
  };

  const handleClick = (index) => {
    if (gameOver || !gameStarted || flipped[index]) return;

    const newFlipped = [...flipped];
    newFlipped[index] = true;
    setFlipped(newFlipped);

    const newSelected = [...selected, index];
    setSelected(newSelected);

    if (newSelected.length === 2) {
      if (board[newSelected[0]] === board[newSelected[1]]) {
        setScore(score + 1);
        setSelected([]);
      } else {
        setTimeout(() => {
          setGameOver(true);
        }, 500);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl text-center">
            Emoji Memory Game
          </CardTitle>
        </CardHeader>
        <CardContent>
          {gameOver ? (
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Game Over!</h2>
              <p className="text-xl mb-4">Your score: {score}</p>
              <Button onClick={startNewGame}>Try Again</Button>
            </div>
          ) : (
            <>
              <div className="mb-4 text-center">
                <p className="text-xl font-semibold">Score: {score}</p>
                {!gameStarted && (
                  <p className="text-lg mt-2">Memorize the board! Game starts in 7 seconds.</p>
                )}
              </div>
              <GameBoard board={board} flipped={flipped} handleClick={handleClick} />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}