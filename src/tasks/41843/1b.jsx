import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

function App() {
  const [activities, setActivities] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const addActivity = (newActivity) => {
    setActivities([...activities, { ...newActivity, id: Date.now() }]);
  };

  const totalCalories = activities.reduce((sum, a) => sum + a.calories, 0);
  const totalTime = activities.reduce((sum, a) => sum + a.time, 0);

  return (
    <div className="flex flex-col items-center p-4 space-y-4 sm:space-y-6">
      <h1 className="text-2xl font-bold">🏋️‍♂️ Fitness Tracker</h1>
      <ActivityForm onAdd={addActivity} />
      <Stats calories={totalCalories} time={totalTime} />
      <Button onClick={() => setDialogOpen(true)}>View Weekly Overview</Button>
      <ActivityList activities={activities} />
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Weekly Overview</DialogTitle>
            <DialogDescription>
              Here's your week at a glance. Keep up the good work! 💪
            </DialogDescription>
          </DialogHeader>
          <WeeklyOverview activities={activities} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ActivityForm({ onAdd }) {
  const [activity, setActivity] = useState({ name: '', calories: 0, time: 0 });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activity.name && activity.calories > 0 && activity.time > 0) {
      onAdd(activity);
      setActivity({ name: '', calories: 0, time: 0 });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-2">
          <input 
            type="text" 
            value={activity.name} 
            onChange={(e) => setActivity({...activity, name: e.target.value})}
            placeholder="Activity Name" 
            className="w-full p-2 border rounded"
          />
          <input 
            type="number" 
            value={activity.calories} 
            onChange={(e) => setActivity({...activity, calories: parseInt(e.target.value)})}
            placeholder="Calories Burned" 
            className="w-full p-2 border rounded"
          />
          <input 
            type="number" 
            value={activity.time} 
            onChange={(e) => setActivity({...activity, time: parseInt(e.target.value)})}
            placeholder="Time (min)" 
            className="w-full p-2 border rounded"
          />
          <Button type="submit">Add Activity</Button>
        </form>
      </CardContent>
    </Card>
  );
}

function Stats({ calories, time }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Total Calories Burned: {calories} 🍏</p>
        <p>Total Active Time: {time} min ⏱️</p>
      </CardContent>
    </Card>
  );
}

function ActivityList({ activities }) {
  return (
    <div className="w-full max-w-lg space-y-2">
      {activities.map((activity) => (
        <ActivityItem key={activity.id} activity={activity} />
      ))}
    </div>
  );
}

function ActivityItem({ activity }) {
  return (
    <Card>
      <CardContent>
        <p>{activity.name} 🏃‍♀️</p>
        <p>Calories: {activity.calories} 🔥</p>
        <p>Time: {activity.time} min</p>
      </CardContent>
    </Card>
  );
}

function WeeklyOverview({ activities }) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  const thisWeek = Array.from({length: 7}, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - today.getDay() + i);
    return date;
  });

  return (
    <div className="grid grid-cols-7 gap-2 text-center">
      {thisWeek.map((day, idx) => {
        const dayActivities = activities.filter(a => new Date(a.id).getDate() === day.getDate());
        const dayCalories = dayActivities.reduce((sum, a) => sum + a.calories, 0);
        return (
          <div key={idx}>
            <p>{days[idx]}</p>
            <p>{dayCalories} cal</p>
          </div>
        );
      })}
    </div>
  );
}

export default App;