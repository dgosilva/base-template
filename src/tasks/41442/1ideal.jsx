import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const Square = ({ value, onClick }) => (
  <button
    className="w-20 h-20 bg-white border border-gray-300 text-4xl font-bold focus:outline-none hover:bg-gray-100"
    onClick={onClick}
  >
    {value}
  </button>
);

const Board = ({ squares, onClick }) => (
  <div className="grid grid-cols-3 gap-1">
    {squares.map((square, i) => (
      <Square key={i} value={square} onClick={() => onClick(i)} />
    ))}
  </div>
);

const calculateWinner = (squares) => {
  for (let i = 0; i < WINNING_COMBINATIONS.length; i++) {
    const [a, b, c] = WINNING_COMBINATIONS[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

const getComputerMove = (squares) => {
  const emptySquares = squares.reduce((acc, square, index) => {
    if (!square) acc.push(index);
    return acc;
  }, []);
  return emptySquares[Math.floor(Math.random() * emptySquares.length)];
};

const Game = () => {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);
  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [matchNumber, setMatchNumber] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (!xIsNext && !gameOver) {
      const timer = setTimeout(() => {
        const squares = history[stepNumber].slice();
        const computerMove = getComputerMove(squares);
        handleClick(computerMove);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [xIsNext, gameOver, history, stepNumber]);

  const handleClick = (i) => {
    const newHistory = history.slice(0, stepNumber + 1);
    const current = newHistory[newHistory.length - 1];
    const squares = current.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = xIsNext ? "X" : "O";
    setHistory(newHistory.concat([squares]));
    setStepNumber(newHistory.length);
    setXIsNext(!xIsNext);

    const winner = calculateWinner(squares);
    if (winner) {
      if (winner === "X") {
        setPlayerScore(playerScore + 1);
      } else {
        setComputerScore(computerScore + 1);
      }
      setGameOver(true);
    } else if (squares.every((square) => square !== null)) {
      // It's a draw
      setGameOver(true);
    }
  };

  const nextMatch = () => {
    setHistory([Array(9).fill(null)]);
    setStepNumber(0);
    setXIsNext(true);
    setGameOver(false);
    setMatchNumber(matchNumber + 1);
  };

  const resetGame = () => {
    setHistory([Array(9).fill(null)]);
    setStepNumber(0);
    setXIsNext(true);
    setPlayerScore(0);
    setComputerScore(0);
    setMatchNumber(0);
    setGameOver(false);
  };

  const current = history[stepNumber];
  const winner = calculateWinner(current);

  let status;
  if (playerScore === 2 || computerScore === 2 || matchNumber === 3) {
    if (playerScore === 2) {
      status = "Player wins the game!";
    } else if (computerScore === 2) {
      status = "Computer wins the game!";
    } else {
      status = "It's a draw!";
    }
  } else if (winner) {
    status = `Winner of this match: ${winner === "X" ? "Player" : "Computer"}`;
  } else if (current.every((square) => square !== null)) {
    status = "Match Draw";
  } else {
    status = `Next player: ${xIsNext ? "Player (X)" : "Computer (O)"}`;
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Tic-Tac-Toe
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-4">
          <div>Player: {playerScore}</div>
          <div>Computer: {computerScore}</div>
        </div>
        <div className="text-center mb-4">{status}</div>
        <div className="flex justify-center">
          <Board squares={current} onClick={(i) => handleClick(i)} />
        </div>
        {(gameOver || winner) && playerScore < 2 && computerScore < 2 && matchNumber < 3 && (
          <div className="text-center mt-4">
            <Button onClick={nextMatch}>Next Match</Button>
          </div>
        )}
        {(playerScore === 2 || computerScore === 2 || matchNumber === 3) && (
          <div className="text-center mt-4">
            <Button onClick={resetGame}>Restart Game</Button>
          </div>
        )}
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