import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Bell } from "lucide-react";

const HabitItem = ({ habit, onToggle, onDelete }) => {
  return (
    <div className="flex items-center justify-between p-2 border-b">
      <div className="flex items-center space-x-2">
        <Checkbox
          checked={habit.completed}
          onCheckedChange={() => onToggle(habit.id)}
        />
        <span className={habit.completed ? "line-through" : ""}>
          {habit.name}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <Badge variant="secondary">{habit.streak} days</Badge>
        <Button variant="destructive" size="sm" onClick={() => onDelete(habit.id)}>
          Delete
        </Button>
      </div>
    </div>
  );
};

const HabitList = ({ habits, onToggle, onDelete }) => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>My Habits</CardTitle>
      </CardHeader>
      <CardContent>
        {habits.map((habit) => (
          <HabitItem
            key={habit.id}
            habit={habit}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        ))}
      </CardContent>
    </Card>
  );
};

const HabitForm = ({ onAdd }) => {
  const [habitName, setHabitName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (habitName.trim()) {
      onAdd(habitName.trim());
      setHabitName("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2 mb-4">
      <Input
        type="text"
        value={habitName}
        onChange={(e) => setHabitName(e.target.value)}
        placeholder="Enter new habit"
        className="flex-grow"
      />
      <Button type="submit">Add Habit</Button>
    </form>
  );
};

const Reminders = ({ habits }) => {
  const incompleteHabits = habits.filter((habit) => !habit.completed);

  if (incompleteHabits.length === 0) return null;

  return (
    <Alert className="mt-4">
      <Bell className="h-4 w-4" />
      <AlertTitle>Reminders</AlertTitle>
      <AlertDescription>
        Don't forget to complete these habits:
        <ul className="list-disc list-inside">
          {incompleteHabits.map((habit) => (
            <li key={habit.id}>{habit.name}</li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
};

export default function App() {
  const [habits, setHabits] = useState(() => {
    const savedHabits = localStorage.getItem("habits");
    return savedHabits ? JSON.parse(savedHabits) : [];
  });

  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits));
  }, [habits]);

  const addHabit = (name) => {
    setHabits([
      ...habits,
      { id: Date.now(), name, completed: false, streak: 0 },
    ]);
  };

  const toggleHabit = (id) => {
    setHabits(
      habits.map((habit) =>
        habit.id === id
          ? {
              ...habit,
              completed: !habit.completed,
              streak: habit.completed ? habit.streak - 1 : habit.streak + 1,
            }
          : habit
      )
    );
  };

  const deleteHabit = (id) => {
    setHabits(habits.filter((habit) => habit.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-center mb-4">Habit Tracker</h1>
        <HabitForm onAdd={addHabit} />
        <HabitList habits={habits} onToggle={toggleHabit} onDelete={deleteHabit} />
        <Reminders habits={habits} />
      </div>
    </div>
  );
}