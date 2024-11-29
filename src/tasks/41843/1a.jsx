import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const activities = [
  { name: "Running", emoji: "🏃‍♂️", caloriesPerMinute: 10 },
  { name: "Swimming", emoji: "🏊‍♂️", caloriesPerMinute: 8 },
  { name: "Cycling", emoji: "🚴‍♂️", caloriesPerMinute: 7 },
  { name: "Weightlifting", emoji: "🏋️‍♂️", caloriesPerMinute: 6 },
  { name: "Yoga", emoji: "🧘‍♂️", caloriesPerMinute: 4 },
];

const DayCard = ({ day, workouts, addWorkout }) => {
  const [showForm, setShowForm] = useState(false);
  const [activity, setActivity] = useState("");
  const [duration, setDuration] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedActivity = activities.find((a) => a.name === activity);
    if (selectedActivity && duration) {
      addWorkout(day, {
        activity: selectedActivity,
        duration: parseInt(duration),
        calories: selectedActivity.caloriesPerMinute * parseInt(duration),
      });
      setShowForm(false);
      setActivity("");
      setDuration("");
    }
  };

  return (
    <Card className="w-full sm:w-64 m-2">
      <CardHeader>
        <CardTitle>{day}</CardTitle>
      </CardHeader>
      <CardContent>
        {workouts.map((workout, index) => (
          <div key={index} className="mb-2">
            <span>{workout.activity.emoji}</span>
            <span className="ml-2">{workout.activity.name}</span>
            <span className="ml-2">{workout.duration} min</span>
            <span className="ml-2">{workout.calories} cal</span>
          </div>
        ))}
        {showForm ? (
          <form onSubmit={handleSubmit}>
            <Label htmlFor="activity">Activity</Label>
            <select
              id="activity"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              className="w-full p-2 mb-2 border rounded"
            >
              <option value="">Select an activity</option>
              {activities.map((a) => (
                <option key={a.name} value={a.name}>
                  {a.emoji} {a.name}
                </option>
              ))}
            </select>
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full p-2 mb-2"
            />
            <Button type="submit">Add Workout</Button>
          </form>
        ) : (
          <Button onClick={() => setShowForm(true)}>Log Workout</Button>
        )}
      </CardContent>
    </Card>
  );
};

const WeeklyOverview = ({ weekData }) => {
  const totalCalories = weekData.reduce(
    (sum, day) => sum + day.workouts.reduce((daySum, workout) => daySum + workout.calories, 0),
    0
  );
  const totalActiveTime = weekData.reduce(
    (sum, day) => sum + day.workouts.reduce((daySum, workout) => daySum + workout.duration, 0),
    0
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Weekly Overview</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Weekly Overview</DialogTitle>
        </DialogHeader>
        <div>
          <p>Total Calories Burned: {totalCalories}</p>
          <p>Total Active Time: {totalActiveTime} minutes</p>
          {weekData.map((day) => (
            <div key={day.name} className="mt-2">
              <h3 className="font-bold">{day.name}</h3>
              {day.workouts.map((workout, index) => (
                <p key={index}>
                  {workout.activity.emoji} {workout.activity.name}: {workout.duration} min, {workout.calories} cal
                </p>
              ))}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const GoalSetting = ({ goal, setGoal, weekData }) => {
  const [newGoal, setNewGoal] = useState(goal);
  const totalCalories = weekData.reduce(
    (sum, day) => sum + day.workouts.reduce((daySum, workout) => daySum + workout.calories, 0),
    0
  );
  const progress = Math.min((totalCalories / goal) * 100, 100);

  const handleSubmit = (e) => {
    e.preventDefault();
    setGoal(parseInt(newGoal));
  };

  return (
    <Card className="w-full sm:w-64 m-2">
      <CardHeader>
        <CardTitle>Weekly Calorie Goal</CardTitle>
      </CardHeader>
      <CardContent>
        <Progress value={progress} className="w-full mb-2" />
        <p>{totalCalories} / {goal} calories</p>
        <form onSubmit={handleSubmit} className="mt-2">
          <Label htmlFor="goal">Set New Goal</Label>
          <Input
            id="goal"
            type="number"
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            className="w-full p-2 mb-2"
          />
          <Button type="submit">Update Goal</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default function App() {
  const [weekData, setWeekData] = useState(() => {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    return days.map((day) => ({ name: day, workouts: [] }));
  });
  const [goal, setGoal] = useState(2000);

  useEffect(() => {
    const storedData = localStorage.getItem("fitnessData");
    if (storedData) {
      const { weekData: storedWeekData, goal: storedGoal } = JSON.parse(storedData);
      setWeekData(storedWeekData);
      setGoal(storedGoal);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("fitnessData", JSON.stringify({ weekData, goal }));
  }, [weekData, goal]);

  const addWorkout = (day, workout) => {
    setWeekData((prevData) =>
      prevData.map((d) => (d.name === day ? { ...d, workouts: [...d.workouts, workout] } : d))
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Fitness Tracker 💪</h1>
      <div className="flex flex-wrap justify-center">
        {weekData.map((day) => (
          <DayCard key={day.name} day={day.name} workouts={day.workouts} addWorkout={addWorkout} />
        ))}
      </div>
      <div className="flex flex-wrap justify-center mt-4">
        <GoalSetting goal={goal} setGoal={setGoal} weekData={weekData} />
        <WeeklyOverview weekData={weekData} />
      </div>
    </div>
  );
}