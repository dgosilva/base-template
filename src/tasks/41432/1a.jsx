import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";

function ReactionTest() {
  const [isWaiting, setIsWaiting] = useState(true);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [displayTime, setDisplayTime] = useState(null);
  const [buttonColor, setButtonColor] = useState('bg-blue-500');

  const timeoutRef = useRef(null);

  useEffect(() => {
    if (isWaiting) {
      timeoutRef.current = setTimeout(() => {
        setStartTime(Date.now());
        setButtonColor('bg-green-500');
        setIsWaiting(false);
      }, Math.random() * 3000 + 1000); // Random time between 1 to 4 seconds
    }

    return () => clearTimeout(timeoutRef.current);
  }, [isWaiting]);

  const handleClick = () => {
    if (!isWaiting) {
      setEndTime(Date.now());
      const reactionTime = endTime - startTime;
      setDisplayTime(reactionTime);
      setButtonColor('bg-red-500');
    }
  };

  const resetTest = () => {
    setDisplayTime(null);
    setStartTime(null);
    setEndTime(null);
    setIsWaiting(true);
    setButtonColor('bg-blue-500');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold">Reaction Speed Test</h1>
        {displayTime !== null && (
          <p className="text-lg mt-2">
            Your reaction time: {displayTime} ms
          </p>
        )}
      </div>
      <Button 
        onClick={displayTime === null ? handleClick : resetTest} 
        className={`w-64 h-64 rounded-full text-white text-2xl transition-colors duration-300 ${buttonColor}`}
      >
        {displayTime === null ? (isWaiting ? 'Wait for Green' : 'Click Now!') : 'Try Again'}
      </Button>
    </div>
  );
}

export default function App() {
  return <ReactionTest />;
}