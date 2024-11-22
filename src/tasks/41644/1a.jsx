import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formatTime = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, '0')} h ${minutes.toString().padStart(2, '0')} min ${seconds.toString().padStart(2, '0')} sec`;
};

const convertTimeToSeconds = (timeStr) => {
  const [h, m, s] = timeStr.split(/[h: ]/).map(Number);
  return h * 3600 + m * 60 + s;
};

function PaceCalculator() {
  const [distance, setDistance] = useState('');
  const [unit, setUnit] = useState('km');
  const [time, setTime] = useState('00 h 00 min 00 sec');
  const [pace, setPace] = useState(null);

  useEffect(() => {
    const timeInSeconds = convertTimeToSeconds(time);
    const dist = parseFloat(distance);
    if (dist > 0 && timeInSeconds > 0) {
      const speedKmh = (dist / timeInSeconds) * 3600;
      const speedMph = speedKmh * 0.621371;
      const paceKm = timeInSeconds / dist;
      const paceMile = paceKm / 1.60934;

      setPace({
        paceKm: formatTime(Math.floor(paceKm)),
        paceMile: formatTime(Math.floor(paceMile)),
        speedKmh: speedKmh.toFixed(2),
        speedMph: speedMph.toFixed(2)
      });
    } else {
      setPace(null);
    }
  }, [distance, time, unit]);

  const handleTimeChange = (e) => {
    let value = e.target.value;
    // Simple mask enforcement
    value = value.replace(/[^0-9hms ]/g, '').replace(/(\d{2})(?=\d)/g, '$1:').replace(/:/g, ' h ').replace(/(\d{2})(?=\d)/g, '$1 min ').replace(/(\d{2})(?=\d)/g, '$1 sec');
    setTime(value.slice(0, 17));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 sm:px-6 lg:px-8">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Running Pace Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="distance">Distance</Label>
              <div className="flex items-center">
                <Input 
                  id="distance" 
                  type="number" 
                  value={distance} 
                  onChange={(e) => setDistance(e.target.value)} 
                  className="flex-grow" 
                />
                <RadioGroup value={unit} onValueChange={setUnit} className="ml-2">
                  <RadioGroupItem value="km" id="km" />
                  <Label htmlFor="km">km</Label>
                  <RadioGroupItem value="miles" id="miles" />
                  <Label htmlFor="miles">miles</Label>
                </RadioGroup>
              </div>
            </div>
            <div>
              <Label htmlFor="time">Time</Label>
              <Input 
                id="time" 
                value={time} 
                onChange={handleTimeChange} 
                placeholder="00 h 00 min 00 sec" 
              />
            </div>
            {pace && (
              <div className="grid grid-cols-2 gap-2">
                <div><strong>Pace:</strong> {pace.paceKm} /km</div>
                <div><strong>Pace:</strong> {pace.paceMile} /mile</div>
                <div><strong>Speed:</strong> {pace.speedKmh} km/h</div>
                <div><strong>Speed:</strong> {pace.speedMph} mph</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function App() {
  return <PaceCalculator />;
}