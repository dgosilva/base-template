import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const formatTime = (time) => {
  const minutes = Math.floor(time / 60000);
  const seconds = Math.floor((time % 60000) / 1000);
  const milliseconds = Math.floor((time % 1000) / 10);
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}.${milliseconds.toString().padStart(2, "0")}`;
};

const RacerCard = ({ racer, onLap, onFinish }) => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle>{racer.name}</CardTitle>
    </CardHeader>
    <CardContent>
      <p>Current Lap: {formatTime(racer.currentLapTime)}</p>
      <p>Total Laps: {racer.laps.length}</p>
      <div className="mt-4 space-x-2">
        <Button onClick={onLap}>Lap</Button>
        <Button onClick={onFinish} variant="secondary">
          Finish
        </Button>
      </div>
    </CardContent>
  </Card>
);

const LapModal = ({ racer, isOpen, onClose }) => {
  const copyToClipboard = () => {
    const lapsText = racer.laps
      .map((lap, index) => `Lap ${index + 1}: ${formatTime(lap)}`)
      .join("\n");
    navigator.clipboard.writeText(lapsText);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{racer.name}'s Laps</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {racer.laps.map((lap, index) => (
            <p key={index}>
              Lap {index + 1}: {formatTime(lap)}
            </p>
          ))}
        </div>
        <Button onClick={copyToClipboard} className="mt-4">
          Copy to Clipboard
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default function App() {
  const [sessionTime, setSessionTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [racers, setRacers] = useState([]);
  const [selectedRacer, setSelectedRacer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setSessionTime((prevTime) => prevTime + 10);
        setRacers((prevRacers) =>
          prevRacers.map((racer) =>
            racer.finished
              ? racer
              : {
                  ...racer,
                  currentLapTime: racer.currentLapTime + 10,
                }
          )
        );
      }, 10);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const startSession = () => {
    setIsRunning(true);
  };

  const endSession = () => {
    setIsRunning(false);
  };

  const resetApp = () => {
    setSessionTime(0);
    setIsRunning(false);
    setRacers([]);
    setSelectedRacer(null);
    setIsModalOpen(false);
  };

  const addRacer = () => {
    const newRacer = {
      id: Date.now(),
      name: `Racer ${racers.length + 1}`,
      laps: [],
      currentLapTime: 0,
      finished: false,
    };
    setRacers((prevRacers) => [...prevRacers, newRacer]);
  };

  const handleLap = useCallback((racerId) => {
    setRacers((prevRacers) =>
      prevRacers.map((racer) =>
        racer.id === racerId
          ? {
              ...racer,
              laps: [...racer.laps, racer.currentLapTime],
              currentLapTime: 0,
            }
          : racer
      )
    );
  }, []);

  const handleFinish = useCallback((racerId) => {
    setRacers((prevRacers) =>
      prevRacers.map((racer) =>
        racer.id === racerId
          ? {
              ...racer,
              laps: [...racer.laps, racer.currentLapTime],
              finished: true,
            }
          : racer
      )
    );
  }, []);

  const openLapModal = (racer) => {
    setSelectedRacer(racer);
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Race Stopwatch</h1>
      <div className="mb-4">
        <p className="text-2xl font-semibold">
          Session Time: {formatTime(sessionTime)}
        </p>
      </div>
      <div className="mb-4 space-x-2">
        <Button onClick={startSession} disabled={isRunning}>
          Start Session
        </Button>
        <Button onClick={endSession} disabled={!isRunning}>
          End Session
        </Button>
        <Button onClick={addRacer}>Add Racer</Button>
        <Button onClick={resetApp} variant="destructive">
          Reset
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {racers.map((racer) => (
          <RacerCard
            key={racer.id}
            racer={racer}
            onLap={() => handleLap(racer.id)}
            onFinish={() => handleFinish(racer.id)}
          />
        ))}
      </div>
      {!isRunning && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Finished Racers</h2>
          <div className="space-y-2">
            {racers
              .filter((racer) => racer.finished)
              .map((racer) => (
                <Button
                  key={racer.id}
                  onClick={() => openLapModal(racer)}
                  variant="outline"
                  className="w-full text-left"
                >
                  {racer.name} - {racer.laps.length} laps
                </Button>
              ))}
          </div>
        </div>
      )}
      {selectedRacer && (
        <LapModal
          racer={selectedRacer}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}