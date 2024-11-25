import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

// Mock data for weather
const mockWeatherData = {
  'New York': { temp: 22, humidity: 60, condition: 'Sunny' },
  'London': { temp: 15, humidity: 85, condition: 'Cloudy' },
  'Tokyo': { temp: 28, humidity: 70, condition: 'Partly Cloudy' },
  'Sydney': { temp: 19, humidity: 55, condition: 'Rainy' },
};

function WeatherCard({ city, weather }) {
  return (
    <Card className="w-full sm:max-w-sm mx-auto">
      <CardHeader>
        <CardTitle>{city}</CardTitle>
        <CardDescription>{weather.condition}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold">{weather.temp}°C</div>
        <div>Humidity: {weather.humidity}%</div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Refresh</Button>
      </CardFooter>
    </Card>
  );
}

function CitySelector({ onSelect }) {
  const [city, setCity] = useState('');

  return (
    <div className="mb-4">
      <Label htmlFor="city">Select City</Label>
      <Input 
        id="city" 
        value={city} 
        onChange={(e) => setCity(e.target.value)} 
        placeholder="Enter city name"
      />
      <Button 
        className="mt-2 w-full sm:w-auto" 
        onClick={() => onSelect(city)}
        disabled={!city.trim()}
      >
        Get Weather
      </Button>
    </div>
  );
}

export default function App() {
  const [selectedCity, setSelectedCity] = useState('');
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    if (selectedCity && mockWeatherData[selectedCity]) {
      // Simulate API call delay
      const timer = setTimeout(() => {
        setWeather(mockWeatherData[selectedCity]);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [selectedCity]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="space-y-6 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-center">Weather Widget</h1>
        <CitySelector onSelect={setSelectedCity} />
        {weather && <WeatherCard city={selectedCity} weather={weather} />}
        {!weather && selectedCity && (
          <p className="text-center">Loading weather for {selectedCity}...</p>
        )}
        {selectedCity && !weather && !mockWeatherData[selectedCity] && (
          <p className="text-center text-red-500">City not found. Try another.</p>
        )}
      </div>
    </div>
  );
}