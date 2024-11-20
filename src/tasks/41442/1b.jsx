import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const initialBoard = Array(9).fill(null);
const winConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],  // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8],  // Columns
  [0, 4, 8], [2, 4, 6]              // Diagonals
];

function Square({ value, onClick }) {
  return (
    <Button variant="outline" className="w-16 h-16 sm:w-20 sm:h-20 text-4xl sm:text-5xl" onClick={onClick}>
      {value}
    </Button>
  );
}

function Board() {
  const [board, setBoard] = useState(initialBoard);
  const [xIsNext, setXIsNext] = useState(true);
  const [scores, setScores] = useState({ player: 0, computer: 0 });
  const [gameOver, setGameOver] = useState(false);

  const handleClick = (i) => {
    if (gameOver || board[i]) return;

    const boardCopy = [...board];
    boardCopy[i] = xIsNext ? 'X' : 'O';
    setBoard(boardCopy);
    setXIsNext(!xIsNext);
  };

  useEffect(() => {
    if (!xIsNext && !gameOver) {
      const computerMove = findBestMove(board);
      setTimeout(() => handleClick(computerMove), 500);
    }
    checkWinner();
  }, [xIsNext, board, gameOver]);

  const checkWinner = () => {
    for (let condition of winConditions) {
      const [a, b, c] = condition;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setGameOver(true);
        if (board[a] === 'X') {
          setScores(prev => ({ ...prev, player: prev.player + 1 }));
        } else {
          setScores(prev => ({ ...prev, computer: prev.computer + 1 }));
        }
        return board[a];
      }
    }
    if (!board.includes(null)) {
      setGameOver(true);
      return 'Tie';
    }
    return null;
  };

  const findBestMove = (board) => {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = 'O';
        let score = minimax(board, 0, false);
        board[i] = null;
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    return move;
  };

  const minimax = (board, depth, isMaximizing) => {
    let result = checkWinner();
    if (result !== null) {
      return result === 'O' ? 10 - depth : result === 'X' ? depth - 10 : 0;
    }

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (!board[i]) {
          board[i] = 'O';
          let score = minimax(board, depth + 1, false);
          board[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (!board[i]) {
          board[i] = 'X';
          let score = minimax(board, depth + 1, true);
          board[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };

  const restartGame = () => {
    setBoard(initialBoard);
    setGameOver(false);
    setXIsNext(true);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Tic-Tac-Toe</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2">
            {board.map((square, i) => (
              <Square key={i} value={square} onClick={() => handleClick(i)} />
            ))}
          </div>
        </CardContent>
      </Card>
      <div>
        Score - Player: {scores.player}, Computer: {scores.computer}
      </div>
      {gameOver && (
        <div>
          {checkWinner() === 'Tie' ? "It's a tie!" : `${checkWinner()} wins!`}
          <Button onClick={restartGame} className="mt-2">Play Again</Button>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <div className="flex justify-center items-center h-screen bg-slate-100">
      <Board />
    </div>
  );
}