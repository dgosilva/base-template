import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";

const TimeInput = ({ value, onChange }) => {
    const [hours, setHours] = useState("");
    const [minutes, setMinutes] = useState("");
    const [seconds, setSeconds] = useState("");
  
    useEffect(() => {
      onChange(`${hours}:${minutes}:${seconds}`);
    }, [hours, minutes, seconds, onChange]);
  
    const handleInputChange = (setter) => (e) => {
      let val = e.target.value.replace(/\D/g, ""); // Only keep digits
      if (val.length > 2) val = val.slice(0, 2); // Limit to 2 characters
      setter(val);
    };
  
    const handleBlur = (setter, value) => () => {
      if (value.length === 1) {
        setter("0" + value); // Add leading zero if necessary
      } else if (value.length === 0) {
        setter("00"); // Default to "00" if empty
      }
    };
  
    return (
      <div className="flex space-x-2">
        <Input
          type="text"
          value={hours}
          onChange={handleInputChange(setHours)}
          onBlur={handleBlur(setHours, hours)}
          className="w-16 text-center"
          placeholder="HH"
          maxLength={2}
        />
        <span className="text-2xl">:</span>
        <Input
          type="text"
          value={minutes}
          onChange={handleInputChange(setMinutes)}
          onBlur={handleBlur(setMinutes, minutes)}
          className="w-16 text-center"
          placeholder="MM"
          maxLength={2}
        />
        <span className="text-2xl">:</span>
        <Input
          type="text"
          value={seconds}
          onChange={handleInputChange(setSeconds)}
          onBlur={handleBlur(setSeconds, seconds)}
          className="w-16 text-center"
          placeholder="SS"
          maxLength={2}
        />
      </div>
    );
  };

const ResultCard = ({ title, value }) => (
  <Card className="w-full sm:w-1/2 mb-4">
    <CardHeader>
      <CardTitle className="text-lg">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-2xl font-bold">{value}</p>
    </CardContent>
  </Card>
);

export default function App() {
  const [distance, setDistance] = useState("");
  const [unit, setUnit] = useState("km");
  const [time, setTime] = useState("00:00:00");
  const [results, setResults] = useState(null);

  const calculatePace = () => {
    const [hours, minutes, seconds] = time.split(":").map(Number);
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    const distanceNum = parseFloat(distance);

    if (isNaN(distanceNum) || totalSeconds === 0) {
      setResults(null);
      return;
    }

    const distanceKm = unit === "km" ? distanceNum : distanceNum * 1.60934;
    const distanceMiles = unit === "miles" ? distanceNum : distanceNum / 1.60934;

    const pacePerKm = totalSeconds / distanceKm;
    const pacePerMile = totalSeconds / distanceMiles;
    const speedKmH = (distanceKm / totalSeconds) * 3600;
    const speedMilesH = (distanceMiles / totalSeconds) * 3600;

    setResults({
      pacePerKm: formatTime(pacePerKm),
      pacePerMile: formatTime(pacePerMile),
      speedKmH: speedKmH.toFixed(2),
      speedMilesH: speedMilesH.toFixed(2),
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Running Pace Calculator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <Label htmlFor="distance">Distance</Label>
              <div className="flex mt-1">
                <Input
                  id="distance"
                  type="number"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  className="rounded-r-none"
                />
                <RadioGroup
                  defaultValue="km"
                  onValueChange={setUnit}
                  className="flex"
                >
                  <div className="flex items-center space-x-2 bg-white border border-l-0 border-input rounded-r-md px-3">
                    <RadioGroupItem value="km" id="km" />
                    <Label htmlFor="km">km</Label>
                  </div>
                  <div className="flex items-center space-x-2 bg-white border border-l-0 border-input rounded-r-md px-3">
                    <RadioGroupItem value="miles" id="miles" />
                    <Label htmlFor="miles">miles</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            <div>
              <Label htmlFor="time">Time</Label>
              <TimeInput value={time} onChange={setTime} />
            </div>
            <Button onClick={calculatePace} className="w-full">
              Calculate
            </Button>
          </div>
        </CardContent>
      </Card>
      {results && (
        <div className="mt-8 max-w-lg mx-auto">
          <h2 className="text-xl font-semibold mb-4">Results:</h2>
          <div className="flex flex-wrap -mx-2">
            <div className="w-full sm:w-1/2 px-2 mb-4">
              <ResultCard title="Pace (min/km)" value={results.pacePerKm} />
            </div>
            <div className="w-full sm:w-1/2 px-2 mb-4">
              <ResultCard title="Pace (min/mile)" value={results.pacePerMile} />
            </div>
            <div className="w-full sm:w-1/2 px-2 mb-4">
              <ResultCard title="Speed (km/h)" value={results.speedKmH} />
            </div>
            <div className="w-full sm:w-1/2 px-2 mb-4">
              <ResultCard title="Speed (miles/h)" value={results.speedMilesH} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}