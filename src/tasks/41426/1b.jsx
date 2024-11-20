import React, { useState } from 'react';
import { Button } from "@/components/ui/button";

const LikeDislike = ({ onSelect }) => {
  const [selected, setSelected] = useState(null);

  const handleSelection = (type) => {
    setSelected(type);
    onSelect(type);
  };

  return (
    <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
      <Button 
        variant={selected === 'like' ? "secondary" : "outline"}
        onClick={() => handleSelection('like')}
      >
        Like
      </Button>
      <Button 
        variant={selected === 'dislike' ? "secondary" : "outline"}
        onClick={() => handleSelection('dislike')}
      >
        Dislike
      </Button>
    </div>
  );
};

export default function App() {
  const [choice, setChoice] = useState(null);

  const handleLikeDislike = (selection) => {
    setChoice(selection);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center py-20">
      <div className="max-w-sm w-full p-4">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Like or Dislike?</h1>
        </div>
        <LikeDislike onSelect={handleLikeDislike} />
        {choice && (
          <p className="mt-6 text-center text-lg">
            You selected: <strong>{choice}</strong>
          </p>
        )}
      </div>
    </div>
  );
}