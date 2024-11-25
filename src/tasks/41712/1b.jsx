import React, { useState, useCallback, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/modal";
import { useToast } from "@/components/ui/use-toast";

function App() {
  const [racers, setRacers] = useState([]);
  const [running, setRunning] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(null);
  const [finished, setFinished] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let interval;
    if (running) {
      interval = setInterval(() => {
        setCurrentTime(Date.now());
      }, 10);
    } else if (!running && currentTime !== null) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [running, currentTime]);

  const startRace = () => {
    setStartTime(Date.now());
    setCurrentTime(Date.now());
    setRunning(true);
    setFinished(false);
  };

  const addRacer = () => {
    setRacers(prev => [...prev, { id: Date.now(), laps: [], finished: false }]);
  };

  const lapCompleted = (id) => {
    setRacers(prev => 
      prev.map(racer => 
        racer.id === id ? { ...racer, laps: [...racer.laps, currentTime - startTime] } : racer
      )
    );
  };

  const finishRacer = (id) => {
    setRacers(prev => 
      prev.map(racer => 
        racer.id === id ? { ...racer, finished: true } : racer
      )
    );
  };

  const finishSession = () => {
    setRunning(false);
    setFinished(true);
  };

  const resetApp = () => {
    setRacers([]);
    setRunning(false);
    setFinished(false);
  };

  const copyLapsToClipboard = (laps) => {
    const text = laps.map((lap, i) => `Lap ${i + 1}: ${formatTime(lap)}`).join('\n');
    navigator.clipboard.writeText(text).then(() => {
      toast({ title: "Laps copied to clipboard!" });
    });
  };

  const formatTime = (timeInMs) => {
    const seconds = Math.floor((timeInMs / 1000) % 60).toString().padStart(2, '0');
    const minutes = Math.floor((timeInMs / (1000 * 60)) % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Race Stopwatch</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 text-center">
            <Button onClick={startRace} disabled={running}>Start Race</Button>
            <Button onClick={finishSession} disabled={!running || finished} className="ml-2">Finish Session</Button>
            <Button onClick={resetApp} className="ml-2 bg-red-500 hover:bg-red-600">Reset</Button>
          </div>
          <div>Total Time: {formatTime(currentTime - startTime)}</div>
          <Button onClick={addRacer} className="mt-4">Add Racer</Button>
          {racers.map(racer => (
            <Racer 
              key={racer.id} 
              racer={racer} 
              onLap={lapCompleted} 
              onFinish={finishRacer} 
              disabled={!running || finished || racer.finished} 
            />
          ))}
        </CardContent>
      </Card>
      {finished && <RaceResults racers={racers} onShowLaps={copyLapsToClipboard} />}
    </div>
  );
}

function Racer({ racer, onLap, onFinish, disabled }) {
  return (
    <div className="mt-4">
      <Button onClick={() => onLap(racer.id)} disabled={disabled}>Lap</Button>
      <Button onClick={() => onFinish(racer.id)} disabled={disabled} className="ml-2 bg-yellow-500 hover:bg-yellow-600">Finish</Button>
    </div>
  );
}

function RaceResults({ racers, onShowLaps }) {
  const [open, setOpen] = useState(false);
  const [selectedRacer, setSelectedRacer] = useState(null);

  const openModal = (racer) => {
    setSelectedRacer(racer);
    setOpen(true);
  };

  return (
    <>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Results</CardTitle>
        </CardHeader>
        <CardContent>
          {racers.map(racer => (
            <div key={racer.id} onClick={() => openModal(racer)} className="cursor-pointer hover:bg-gray-100 p-2">
              Racer {racer.id} - {racer.finished ? `Finished in ${formatTime(racer.laps[racer.laps.length - 1])}` : 'DNF'}
            </div>
          ))}
        </CardContent>
      </Card>
      <Modal open={open} onOpenChange={setOpen}>
        <ModalContent>
          <ModalHeader>Racer Laps</ModalHeader>
          <ModalBody>
            {selectedRacer && selectedRacer.laps.map((lap, i) => (
              <div key={i}>Lap {i + 1}: {formatTime(lap)}</div>
            ))}
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => onShowLaps(selectedRacer.laps)}>Copy Laps</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default App;