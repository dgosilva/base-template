import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data for cities and weather
const cities = [
  { id: 1, name: "New York" },
  { id: 2, name: "London" },
  { id: 3, name: "Tokyo" },
  { id: 4, name: "Sydney" },
];

const mockWeatherData = {
  1: { temp: 22, humidity: 60, condition: "Partly Cloudy" },
  2: { temp: 18, humidity: 75, condition: "Rainy" },
  3: { temp: 28, humidity: 55, condition: "Sunny" },
  4: { temp: 25, humidity: 65, condition: "Clear" },
};

const WeatherIcon = ({ condition }) => {
  const iconMap = {
    "Partly Cloudy": "☁️",
    "Rainy": "🌧️",
    "Sunny": "☀️",
    "Clear": "🌤️",
  };

  // Render the icon for the given condition, or a question mark if not found
  return <span className="text-4xl">{iconMap[condition] || "❓"}</span>;
};

const WeatherCard = ({ cityId }) => {
  const weatherData = mockWeatherData[cityId];

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          {cities.find((city) => city.id === cityId)?.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          <WeatherIcon condition={weatherData.condition} />
          <div className="text-4xl font-bold">{weatherData.temp}°C</div>
          <div className="text-lg">{weatherData.condition}</div>
          <div className="text-sm text-gray-500">
            Humidity: {weatherData.humidity}%
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function App() {
  const [selectedCity, setSelectedCity] = useState(cities[0].id);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-8">Weather Widget</h1>
      <div className="w-full max-w-sm mb-8">
        <Select onValueChange={(value) => setSelectedCity(Number(value))}> {/* Dropdown to select a city */}
          <SelectTrigger>
            <SelectValue placeholder="Select a city" />
          </SelectTrigger>
          <SelectContent>
            {cities.map((city) => (
              <SelectItem key={city.id} value={city.id.toString()}>
                {city.name} {/* Display each city in the dropdown */}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <WeatherCard cityId={selectedCity} /> {/* Display the WeatherCard for the selected city */}
    </div>
  );
}