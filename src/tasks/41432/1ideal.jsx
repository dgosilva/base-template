import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const colors = {
  default: "bg-blue-500 hover:bg-blue-600",
  active: "bg-green-500 hover:bg-green-600",
  waiting: "bg-yellow-500 hover:bg-yellow-600",
};

const ReactionButton = ({ onReactionComplete }) => {
  const [buttonState, setButtonState] = useState("default");
  const [startTime, setStartTime] = useState(null);

  const startTest = useCallback(() => {
    setButtonState("waiting");
    const delay = Math.floor(Math.random() * 3000) + 1000; // Random delay between 1-4 seconds
    setTimeout(() => {
      setButtonState("active");
      setStartTime(Date.now());
    }, delay);
  }, []);

  const handleClick = () => {
    if (buttonState === "default") {
      startTest();
    } else if (buttonState === "active") {
      const reactionTime = Date.now() - startTime;
      setButtonState("default");
      onReactionComplete(reactionTime);
    }
  };

  return (
    <Button
      className={`w-full h-32 text-xl font-bold transition-colors ${colors[buttonState]}`}
      onClick={handleClick}
    >
      {buttonState === "default" && "Start Test"}
      {buttonState === "waiting" && "Wait..."}
      {buttonState === "active" && "Click Now!"}
    </Button>
  );
};

const ResultDisplay = ({ reactionTime, onTryAgain }) => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Your Reaction Time
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-4xl font-bold text-blue-600 mb-4">
          {reactionTime} ms
        </p>
        <Button onClick={onTryAgain} className="w-full">
          Try Again
        </Button>
      </CardContent>
    </Card>
  );
};

export default function App() {
  const [reactionTime, setReactionTime] = useState(null);

  const handleReactionComplete = (time) => {
    setReactionTime(time);
  };

  const handleTryAgain = () => {
    setReactionTime(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Reaction Speed Test
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reactionTime === null ? (
            <ReactionButton onReactionComplete={handleReactionComplete} />
          ) : (
            <ResultDisplay
              reactionTime={reactionTime}
              onTryAgain={handleTryAgain}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}