import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle,
  Button,
  Input,
  Checkbox,
  Toast,
  Toaster,
  useToast
} from "@/components/ui";

function HabitCard({ habit, onDelete, onToggle }) {
  const streak = habit.completed.filter(Boolean).length;

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{habit.name}</CardTitle>
        <CardDescription>Streak: {streak} days</CardDescription>
      </CardHeader>
      <CardContent>
        <Checkbox checked={habit.todayCompleted} onChange={() => onToggle(habit.id)} />
      </CardContent>
      <CardFooter>
        <Button onClick={() => onDelete(habit.id)}>Delete</Button>
      </CardFooter>
    </Card>
  );
}

function NewHabitForm({ onSubmit }) {
  const [habitName, setHabitName] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!habitName.trim()) {
      toast({
        title: "Error",
        description: "Habit name cannot be empty.",
        variant: "destructive"
      });
      return;
    }
    onSubmit(habitName);
    setHabitName('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input 
        value={habitName} 
        onChange={(e) => setHabitName(e.target.value)} 
        placeholder="New Habit" 
        className="mb-2"
      />
      <Button type="submit">Add Habit</Button>
    </form>
  );
}

export default function App() {
  const [habits, setHabits] = useState(() => {
    const savedHabits = localStorage.getItem('habits');
    return savedHabits ? JSON.parse(savedHabits) : [];
  });
  
  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
    
    // Check for reminders
    habits.forEach(habit => {
      if (!habit.todayCompleted && new Date().getHours() >= 20) { // 8 PM reminder
        new Notification('Reminder', { body: `Complete your habit: ${habit.name}` });
      }
    });
  }, [habits]);

  const addHabit = (name) => {
    const newHabit = {
      id: Date.now(),
      name: name,
      completed: Array(new Date().getDate()).fill(false),
      todayCompleted: false
    };
    setHabits([...habits, newHabit]);
  };

  const toggleHabit = (id) => {
    setHabits(currentHabits => 
      currentHabits.map(habit => 
        habit.id === id ? { 
          ...habit, 
          todayCompleted: !habit.todayCompleted,
          completed: [...habit.completed, !habit.todayCompleted] 
        } : habit
      )
    );
  };

  const deleteHabit = (id) => {
    setHabits(currentHabits => currentHabits.filter(habit => habit.id !== id));
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <Toaster />
      <h1 className="text-2xl font-bold mb-4">Habit Tracker</h1>
      <NewHabitForm onSubmit={addHabit} />
      {habits.map(habit => (
        <HabitCard 
          key={habit.id} 
          habit={habit} 
          onDelete={deleteHabit} 
          onToggle={toggleHabit} 
        />
      ))}
    </div>
  );
}