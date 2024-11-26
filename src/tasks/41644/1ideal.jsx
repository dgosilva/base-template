import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const TimeInput = ({ value, onChange }) => {
  const handleChange = (e) => {
    const { value } = e.target;
    // Remove non-digit characters and format as HH:MM:SS
    const masked = value.replace(/[^\d]/g, "").slice(0, 6);
    const formatted = masked.replace(/^(\d{0,2})(\d{0,2})(\d{0,2}).*/, (_, h, m, s) => {
      if (s) return `${h}:${m}:${s}`;
      if (m) return `${h}:${m}`;
      return h;
    });
    onChange(formatted);
  };

  return <Input type="text" value={value} onChange={handleChange} placeholder="HH:MM:SS" />;
};

const ResultDisplay = ({ result }) => {
  if (!result) return null;

  return (
    <div className="mt-4 p-4 bg-gray-100 rounded-md">
      <h3 className="font-semibold mb-2">Results:</h3>
      <ul className="list-disc pl-5">
        {Object.entries(result).map(([key, value]) => (
          <li key={key}>
            {key}: {value}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default function App() {
  const [calculationType, setCalculationType] = useState("pace");
  const [distanceUnit, setDistanceUnit] = useState("km");
  const [paceUnit, setPaceUnit] = useState("min/km");
  const [distance, setDistance] = useState("");
  const [time, setTime] = useState("");
  const [pace, setPace] = useState("");
  const [result, setResult] = useState(null);

  const calculatePace = () => {
    const [hours, minutes, seconds] = time.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes + seconds / 60;
    let distanceValue = parseFloat(distance);

    // Convert distance to kilometers if it's in miles
    if (distanceUnit === "mi") {
      distanceValue *= 1.60934;
    }

    const paceMinKm = totalMinutes / distanceValue;
    const paceMinMile = paceMinKm / 1.60934;
    const speedKmH = 60 / paceMinKm;
    const speedMiH = speedKmH / 1.60934;

    setResult({
      "Pace (min/km)": paceMinKm.toFixed(2),
      "Pace (min/mile)": paceMinMile.toFixed(2),
      "Speed (km/h)": speedKmH.toFixed(2),
      "Speed (mph)": speedMiH.toFixed(2),
    });
  };

  const calculateTime = () => {
    let distanceValue = parseFloat(distance);
    let paceValue = parseFloat(pace);

    // Convert distance and pace to kilometers and min/km if in miles
    if (distanceUnit === "mi") {
      distanceValue *= 1.60934;
    }
    if (paceUnit === "min/mi") {
      paceValue *= 1.60934;
    }

    const totalMinutes = distanceValue * paceValue;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);
    const seconds = Math.round((totalMinutes % 1) * 60);

    const speedKmH = 60 / paceValue;
    const speedMiH = speedKmH / 1.60934;

    setResult({
      "Time": `${hours.toString().padStart(2, "0")} H ${minutes.toString().padStart(2, "0")} min ${seconds.toString().padStart(2, "0")} sec`,
      "Speed (km/h)": speedKmH.toFixed(2),
      "Speed (mph)": speedMiH.toFixed(2),
    });
  };

  const handleCalculate = () => {
    if (calculationType === "pace") {
      calculatePace();
    } else {
      calculateTime();
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Running Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            {/* Calculation type selection */}
            <div>
              <Label>Calculation Type</Label>
              <RadioGroup
                value={calculationType}
                onValueChange={setCalculationType}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pace" id="pace" />
                  <Label htmlFor="pace">Pace</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="time" id="time" />
                  <Label htmlFor="time">Time</Label>
                </div>
              </RadioGroup>
            </div>

             {/* Distance input and unit selection */}
            <div>
              <Label htmlFor="distance">Distance</Label>
              <div className="flex space-x-2">
                <Input
                  id="distance"
                  type="number"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  placeholder="Enter distance"
                />
                <Select value={distanceUnit} onValueChange={setDistanceUnit}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="km">km</SelectItem>
                    <SelectItem value="mi">mi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

             {/* Conditional rendering for time or pace input based on calculation type */}
            {calculationType === "pace" ? (
              <div>
                <Label htmlFor="time">Time</Label>
                <TimeInput value={time} onChange={setTime} />
              </div>
            ) : (
              <div>
                <Label htmlFor="pace">Pace</Label>
                <div className="flex space-x-2">
                  <Input
                    id="pace"
                    type="number"
                    value={pace}
                    onChange={(e) => setPace(e.target.value)}
                    placeholder="Enter pace"
                  />
                  <Select value={paceUnit} onValueChange={setPaceUnit}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="min/km">min/km</SelectItem>
                      <SelectItem value="min/mi">min/mi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <Button onClick={handleCalculate} type="button">Calculate</Button>
          </form>

          <ResultDisplay result={result} />
        </CardContent>
      </Card>
    </div>
  );
}