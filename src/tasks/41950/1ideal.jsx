import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EventForm = ({ onSubmit }) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date());
  const [guests, setGuests] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, date, guests: guests.split(",").map((g) => g.trim()) });
    setTitle("");
    setGuests("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Event Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border"
      />
      <Input
        placeholder="Guests (comma-separated)"
        value={guests}
        onChange={(e) => setGuests(e.target.value)}
        required
      />
      <Button type="submit">Create Event</Button>
    </form>
  );
};

const EventCard = ({ event, onUpdateRSVP, onAssignTask }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{event.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Date: {event.date.toDateString()}</p>
        <p>Guests:</p>
        <ul>
          {event.guests.map((guest, index) => (
            <li key={index} className="flex items-center justify-between">
              <span>{guest}</span>
              <Select
                onValueChange={(value) => onUpdateRSVP(event.id, guest, value)}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="RSVP" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                  <SelectItem value="maybe">Maybe</SelectItem>
                </SelectContent>
              </Select>
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <Input
            placeholder="Assign task"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                onAssignTask(event.id, e.target.value);
                e.target.value = "";
              }
            }}
          />
        </div>
        {event.tasks && (
          <div className="mt-2">
            <p>Tasks:</p>
            <ul>
              {event.tasks.map((task, index) => (
                <li key={index}>{task}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const CalendarView = ({ events }) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
      <Calendar
        mode="multiple"
        selected={events.map((event) => event.date)}
        className="rounded-md border"
      />
    </div>
  );
};

export default function App() {
  const [events, setEvents] = useState([]);

  const addEvent = (newEvent) => {
    // TODO: Implement persistence
    setEvents([...events, { ...newEvent, id: Date.now(), tasks: [] }]);
  };

  const updateRSVP = (eventId, guest, status) => {
    // TODO: Implement persistence
    setEvents(
      events.map((event) =>
        event.id === eventId
          ? {
              ...event,
              guests: event.guests.map((g) =>
                g === guest ? `${g} (${status})` : g
              ),
            }
          : event
      )
    );
  };

  const assignTask = (eventId, task) => {
    // TODO: Implement persistence
    setEvents(
      events.map((event) =>
        event.id === eventId
          ? { ...event, tasks: [...(event.tasks || []), task] }
          : event
      )
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Event Planning Assistant</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Create Event</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button>New Event</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
              </DialogHeader>
              <EventForm onSubmit={addEvent} />
            </DialogContent>
          </Dialog>
          <CalendarView events={events} />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Events</h2>
          <div className="space-y-4">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onUpdateRSVP={updateRSVP}
                onAssignTask={assignTask}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}