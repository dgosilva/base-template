import React, { useState } from 'react';
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";

function App() {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ name: '', date: new Date(), guests: [], tasks: [] });

  const handleAddEvent = () => {
    if (newEvent.name) {
      setEvents([...events, { ...newEvent, id: Date.now() }]);
      setNewEvent({ name: '', date: new Date(), guests: [], tasks: [] });
    }
  };

  const handleRSVP = (eventId, guestName, response) => {
    // Here would be logic to update guest RSVP status in backend
    console.log(`RSVP for ${guestName} updated to ${response}`);
  };

  const handleTaskAssign = (eventId, taskName, assignee) => {
    // Here would be logic to assign tasks and save to backend
    console.log(`Task ${taskName} assigned to ${assignee}`);
  };

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-6">Event Planning Assistant</h1>
      
      <div className="mb-4">
        <Card>
          <CardHeader>
            <CardTitle>Add New Event</CardTitle>
          </CardHeader>
          <CardContent>
            <Input 
              value={newEvent.name} 
              onChange={(e) => setNewEvent({...newEvent, name: e.target.value})} 
              placeholder="Event Name" 
            />
            <Calendar 
              selected={newEvent.date} 
              onChange={(date) => setNewEvent({...newEvent, date: date})} 
            />
          </CardContent>
          <CardFooter>
            <Button onClick={handleAddEvent}>Add Event</Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
        {events.map(event => (
          <EventCard 
            key={event.id} 
            event={event} 
            onRSVP={handleRSVP} 
            onAssignTask={handleTaskAssign}
          />
        ))}
      </div>

      {/* Placeholder for Calendar View */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar 
              mode="month"
              selected={new Date()}
              onSelect={(date) => console.log('Selected Date:', date)}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function EventCard({ event, onRSVP, onAssignTask }) {
  const [guest, setGuest] = useState('');
  const [task, setTask] = useState('');
  const [assignee, setAssignee] = useState('');

  return (
    <Card>
      <CardHeader>
        <CardTitle>{event.name}</CardTitle>
        <CardDescription>{event.date.toDateString()}</CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          <Label>Guest List</Label>
          <Input 
            value={guest} 
            onChange={(e) => setGuest(e.target.value)} 
            placeholder="Add Guest"
          />
          <Button 
            className="mt-2" 
            onClick={() => onRSVP(event.id, guest, 'pending')}>
            Add Guest
          </Button>
          {event.guests.map((g, idx) => (
            <div key={idx} className="flex items-center justify-between mt-2">
              <span>{g}</span>
              <div>
                <Button onClick={() => onRSVP(event.id, g, 'yes')}>Yes</Button>
                <Button onClick={() => onRSVP(event.id, g, 'no')}>No</Button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Label>Tasks</Label>
          <Input 
            value={task} 
            onChange={(e) => setTask(e.target.value)} 
            placeholder="New Task"
          />
          <Input 
            value={assignee} 
            onChange={(e) => setAssignee(e.target.value)} 
            placeholder="Assignee"
          />
          <Button 
            className="mt-2" 
            onClick={() => onAssignTask(event.id, task, assignee)}>
            Assign Task
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default App;