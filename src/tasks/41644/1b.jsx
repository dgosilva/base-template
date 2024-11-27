import React, { useState } from 'react';
// import { Button, Card, CardContent, CardHeader, CardTitle, Input, RadioGroup, RadioGroupItem } from "@/components/ui";

const RunningCalculator = () => {
  const [calculationType, setCalculationType] = useState('pace');
  const [distance, setDistance] = useState('');
  const [time, setTime] = useState('');
  const [pace, setPace] = useState('');
  const [unit, setUnit] = useState('km');
  const [result, setResult] = useState(null);

  const timeMask = [/\d/, /\d/, ':', /\d/, /\d/, ':', /\d/, /\d/];

  const calculatePace = () => {
    const dist = unit === 'km' ? parseFloat(distance) : parseFloat(distance) * 1.60934;
    const [hours, minutes, seconds] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + seconds / 60;
    const paceInMinPerKm = totalMinutes / dist;
    const paceInMinPerMile = paceInMinPerKm * 1.60934;
    const speedKmh = dist / (totalMinutes / 60);
    const speedMph = speedKmh / 1.60934;

    setResult({
      paceKm: `${Math.floor(paceInMinPerKm)}:${Math.round((paceInMinPerKm % 1) * 60)}`,
      paceMile: `${Math.floor(paceInMinPerMile)}:${Math.round((paceInMinPerMile % 1) * 60)}`,
      speedKmh: speedKmh.toFixed(2),
      speedMph: speedMph.toFixed(2)
    });
  };

  const calculateTime = () => {
    const dist = unit === 'km' ? parseFloat(distance) : parseFloat(distance) * 1.60934;
    const [paceMin, paceSec] = pace.split(':').map(Number);
    const paceInMinPerKm = paceMin + paceSec / 60;
    const totalTimeInSec = dist * paceInMinPerKm * 60;
    const hours = Math.floor(totalTimeInSec / 3600);
    const minutes = Math.floor((totalTimeInSec % 3600) / 60);
    const seconds = Math.round(totalTimeInSec % 60);
    const speedKmh = dist / (totalTimeInSec / 3600);
    const speedMph = speedKmh / 1.60934;

    setResult({
      time: `${hours} H ${minutes} min ${seconds} sec`,
      speedKmh: speedKmh.toFixed(2),
      speedMph: speedMph.toFixed(2)
    });
  };

  const handleCalculate = () => {
    if (calculationType === 'pace') {
      calculatePace();
    } else {
      calculateTime();
    }
  };

  return (
    <div className="flex justify-center p-4 sm:p-8">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Running Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup onValueChange={setCalculationType} defaultValue="pace" className="flex flex-col space-y-2">
            <RadioGroupItem value="pace" id="pace">
              Calculate Pace
            </RadioGroupItem>
            <RadioGroupItem value="time" id="time">
              Calculate Time
            </RadioGroupItem>
          </RadioGroup>

          <div>
            <label htmlFor="distance" className="block text-sm font-medium mb-1">Distance</label>
            <Input 
              id="distance" 
              type="number" 
              value={distance} 
              onChange={(e) => setDistance(e.target.value)} 
              placeholder="Enter distance"
            />
          </div>

          <RadioGroup onValueChange={setUnit} defaultValue="km" className="flex space-x-4">
            <RadioGroupItem value="km" id="km">
              km
            </RadioGroupItem>
            <RadioGroupItem value="miles" id="miles">
              miles
            </RadioGroupItem>
          </RadioGroup>

          {calculationType === 'pace' ? (
            <div>
              <label htmlFor="time" className="block text-sm font-medium mb-1">Time</label>
              <Input 
                id="time" 
                value={time} 
                onChange={(e) => setTime(e.target.value)} 
                placeholder="HH:MM:SS"
                mask={timeMask}
              />
            </div>
          ) : (
            <div>
              <label htmlFor="pace" className="block text-sm font-medium mb-1">Pace</label>
              <Input 
                id="pace" 
                value={pace} 
                onChange={(e) => setPace(e.target.value)} 
                placeholder="MM:SS"
              />
            </div>
          )}

          <Button onClick={handleCalculate}>Calculate</Button>

          {result && (
            <div className="space-y-2">
              {calculationType === 'pace' ? (
                <>
                  <p>Pace: {result.paceKm} min/km</p>
                  <p>Pace: {result.paceMile} min/mile</p>
                </>
              ) : (
                <p>Time: {result.time}</p>
              )}
              <p>Speed: {result.speedKmh} km/h</p>
              <p>Speed: {result.speedMph} mph</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default function App() {
  return <RunningCalculator />;
}