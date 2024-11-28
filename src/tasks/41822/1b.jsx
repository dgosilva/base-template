import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Simulated restaurant data
const restaurants = [
  { id: 1, name: "Pasta Palace", cuisine: "Italian" },
  { id: 2, name: "Sushi Sensation", cuisine: "Japanese" },
  { id: 3, name: "Burger Bliss", cuisine: "American" },
];

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    // Simulate API call for restaurant search
    const results = restaurants.filter(
      (restaurant) =>
        restaurant.name.toLowerCase().includes(query.toLowerCase()) ||
        restaurant.cuisine.toLowerCase().includes(query.toLowerCase())
    );
    onSearch(results);
  };

  return (
    <div className="flex space-x-2">
      <Input
        type="text"
        placeholder="Search restaurants..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-grow"
      />
      <Button onClick={handleSearch}>Search</Button>
    </div>
  );
};

const RestaurantList = ({ restaurants, onSelect }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {restaurants.map((restaurant) => (
        <Card key={restaurant.id} className="cursor-pointer hover:shadow-lg" onClick={() => onSelect(restaurant)}>
          <CardHeader>
            <CardTitle>{restaurant.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{restaurant.cuisine} cuisine</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const ReservationForm = ({ restaurant, onReserve }) => {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState("19:00");

  const handleReserve = () => {
    // Simulate API call for reservation
    onReserve({ restaurant, date, time });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Book a table at {restaurant.name}</h3>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border"
      />
      <Select value={time} onValueChange={setTime}>
        <SelectTrigger>
          <SelectValue placeholder="Select time" />
        </SelectTrigger>
        <SelectContent>
          {["18:00", "19:00", "20:00", "21:00"].map((t) => (
            <SelectItem key={t} value={t}>
              {t}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button onClick={handleReserve}>Reserve</Button>
    </div>
  );
};

const ReservationList = ({ reservations, onEdit }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Your Reservations</h3>
      {reservations.map((reservation, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>{reservation.restaurant.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Date: {reservation.date.toDateString()}</p>
            <p>Time: {reservation.time}</p>
          </CardContent>
          <Button onClick={() => onEdit(index)}>Edit</Button>
        </Card>
      ))}
    </div>
  );
};

export default function App() {
  const [searchResults, setSearchResults] = useState(restaurants);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [editingReservation, setEditingReservation] = useState(null);

  const handleSearch = (results) => {
    setSearchResults(results);
  };

  const handleReserve = (reservation) => {
    if (editingReservation !== null) {
      const updatedReservations = [...reservations];
      updatedReservations[editingReservation] = reservation;
      setReservations(updatedReservations);
      setEditingReservation(null);
    } else {
      setReservations([...reservations, reservation]);
    }
    setSelectedRestaurant(null);
  };

  const handleEdit = (index) => {
    setSelectedRestaurant(reservations[index].restaurant);
    setEditingReservation(index);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Restaurant Reservation App</h1>
      <SearchBar onSearch={handleSearch} />
      <RestaurantList restaurants={searchResults} onSelect={setSelectedRestaurant} />
      
      <Dialog open={selectedRestaurant !== null} onOpenChange={() => setSelectedRestaurant(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Make a Reservation</DialogTitle>
          </DialogHeader>
          {selectedRestaurant && (
            <ReservationForm
              restaurant={selectedRestaurant}
              onReserve={handleReserve}
            />
          )}
        </DialogContent>
      </Dialog>

      <div className="mt-8">
        <ReservationList reservations={reservations} onEdit={handleEdit} />
      </div>
    </div>
  );
}