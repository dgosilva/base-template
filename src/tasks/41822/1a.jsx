import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from 'date-fns';

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <Input 
      placeholder="Search by name or cuisine..." 
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      onKeyPress={(e) => {
        if (e.key === 'Enter') {
          onSearch(searchTerm);
        }
      }}
    />
  );
}

function ReservationForm({ onSubmit }) {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState('19:00');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Book a Table</CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar mode="single" selected={date} onSelect={setDate} />
        <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        <Button onClick={() => onSubmit(date, time)} className="mt-4">Book Now</Button>
      </CardContent>
    </Card>
  );
}

function BookingConfirmation({ booking, onEdit, onCancel }) {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Your Reservation</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
          {`${format(booking.date, 'PPP')} at ${booking.time}`}
        </CardDescription>
        <Button onClick={onEdit} variant="outline">Edit</Button>
        <Button onClick={onCancel} variant="destructive" className="ml-2">Cancel</Button>
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [restaurants, setRestaurants] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    // Simulate fetching list of restaurants
    // TODO: Replace with actual API call to fetch restaurants
    setRestaurants([
      { id: 1, name: 'Sushi Place', cuisine: 'Japanese' },
      { id: 2, name: 'Pizza Palace', cuisine: 'Italian' },
      { id: 3, name: 'Vegan Delight', cuisine: 'Vegan' },
    ]);
  }, []);

  const handleSearch = (term) => {
    // Simulate search API call
    // TODO: Implement real search functionality
    const results = restaurants.filter(
      r => r.name.toLowerCase().includes(term.toLowerCase()) || 
           r.cuisine.toLowerCase().includes(term.toLowerCase())
    );
    setSearchResults(results);
  };

  const handleBooking = (date, time) => {
    setBooking({ date, time, restaurant: selectedRestaurant });
    // TODO: Here you would typically send this data to an API to confirm the booking
  };

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <SearchBar onSearch={handleSearch} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        {searchResults.map(restaurant => (
          <Card key={restaurant.id} onClick={() => setSelectedRestaurant(restaurant)}>
            <CardHeader>
              <CardTitle>{restaurant.name}</CardTitle>
              <CardDescription>{restaurant.cuisine}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
      {selectedRestaurant && (
        <div className="mt-4">
          <ReservationForm onSubmit={handleBooking} />
          {booking && (
            <BookingConfirmation 
              booking={booking} 
              onEdit={() => setBooking(null)} 
              onCancel={() => {
                setBooking(null);
                // TODO: Cancel booking API call
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}