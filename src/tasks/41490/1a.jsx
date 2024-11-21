import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'teal'];

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function Tile({ color, index, onClick, flipped, matched }) {
  const tileStyle = {
    backgroundColor: flipped || matched ? color : 'gray',
  };

  return (
    <Card className="w-12 h-12 sm:w-16 sm:h-16 m-1 cursor-pointer">
      <CardContent className="p-0" onClick={() => onClick(index)}>
        <div style={tileStyle} className="w-full h-full rounded"></div>
      </CardContent>
    </Card>
  );
}

function Board() {
  const [tiles, setTiles] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    const newColors = [...colors, ...colors].slice(0, 32);
    setTiles(shuffleArray(newColors.map((color, i) => ({ color, index: i, flipped: false, matched: false }))));
    setFlipped([]);
    setMatched([]);
    setScore(0);
    setGameOver(false);

    // Show tiles for 7 seconds
    setTimeout(() => {
      setTiles(prevTiles => prevTiles.map(tile => ({ ...tile, flipped: false })));
    }, 7000);
  };

  const handleTileClick = (index) => {
    if (gameOver || flipped.length === 2 || tiles[index].flipped || tiles[index].matched) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (tiles[first].color === tiles[second].color) {
        setMatched(prev => [...prev, first, second]);
        setScore(score + 1);
        setFlipped([]);
      } else {
        setTimeout(() => {
          setTiles(prevTiles => prevTiles.map((tile, idx) => 
            newFlipped.includes(idx) ? { ...tile, flipped: false } : tile
          ));
          setFlipped([]);
        }, 1000);
      }
    }
  };

  useEffect(() => {
    if (matched.length === tiles.length) {
      setGameOver(true);
    }
  }, [matched]);

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Memory Game</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Score: {score}</p>
          {gameOver ? (
            <div>
              <p>Game Over! Your score: {score}</p>
              <Button onClick={resetGame}>Try Again</Button>
            </div>
          ) : (
            <div className="grid grid-cols-8 gap-1">
              {tiles.map((tile, i) => (
                <Tile 
                  key={i} 
                  {...tile} 
                  onClick={handleTileClick}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function App() {
  return <Board />;
}