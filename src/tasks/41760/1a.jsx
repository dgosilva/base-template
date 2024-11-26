import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

const TaskStatus = {
  NOT_STARTED: "not_started",
  IN_PROGRESS: "in_progress",
  BREAK: "break",
  COMPLETED: "completed",
};

const TaskCard = ({ task, onTaskClick, isActive }) => {
  const getStatusIcon = () => {
    switch (task.status) {
      case TaskStatus.NOT_STARTED:
        return "🔵";
      case TaskStatus.IN_PROGRESS:
        return "🟢";
      case TaskStatus.BREAK:
        return "🟠";
      case TaskStatus.COMPLETED:
        return "✅";
      default:
        return "";
    }
  };

  return (
    <Card
      className={`mb-2 cursor-pointer ${
        isActive ? "border-2 border-blue-500" : ""
      }`}
      onClick={() => onTaskClick(task)}
    >
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>{task.title}</span>
          <span>{getStatusIcon()}</span>
        </CardTitle>
      </CardHeader>
    </Card>
  );
};

const TaskDescription = ({ task, onClose }) => {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>{task.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{task.description}</p>
      </CardContent>
      <Button onClick={onClose} className="mt-2">
        Close
      </Button>
    </Card>
  );
};

const Timer = ({ workInterval, breakInterval, onTimerEnd }) => {
  const [timeLeft, setTimeLeft] = useState(workInterval * 60);
  const [isWorking, setIsWorking] = useState(true);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsWorking((prev) => !prev);
      setTimeLeft(isWorking ? breakInterval * 60 : workInterval * 60);
      onTimerEnd();
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, isWorking, workInterval, breakInterval, onTimerEnd]);

  const toggleTimer = () => setIsRunning((prev) => !prev);
  const resetTimer = () => {
    setIsRunning(false);
    setIsWorking(true);
    setTimeLeft(workInterval * 60);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="text-center">
      <h2
        className={`text-4xl font-bold mb-4 ${
          timeLeft <= 30 ? "text-red-500" : ""
        }`}
      >
        {formatTime(timeLeft)}
      </h2>
      <div className="space-x-2">
        <Button onClick={toggleTimer}>{isRunning ? "Pause" : "Start"}</Button>
        <Button onClick={resetTimer}>Reset</Button>
      </div>
    </div>
  );
};

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [workInterval, setWorkInterval] = useState(25);
  const [breakInterval, setBreakInterval] = useState(5);

  const addTask = () => {
    if (newTaskTitle.trim() !== "") {
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          title: newTaskTitle,
          description: newTaskDescription,
          status: TaskStatus.NOT_STARTED,
        },
      ]);
      setNewTaskTitle("");
      setNewTaskDescription("");
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  const startTask = (task) => {
    if (activeTask) {
      return;
    }
    const updatedTasks = tasks.map((t) =>
      t.id === task.id
        ? { ...t, status: TaskStatus.IN_PROGRESS }
        : { ...t, status: t.status === TaskStatus.IN_PROGRESS ? TaskStatus.NOT_STARTED : t.status }
    );
    setTasks(updatedTasks);
    setActiveTask(task);
    setSelectedTask(null);
  };

  const handleTimerEnd = () => {
    if (activeTask) {
      const updatedTasks = tasks.map((t) =>
        t.id === activeTask.id
          ? {
              ...t,
              status:
                t.status === TaskStatus.IN_PROGRESS
                  ? TaskStatus.BREAK
                  : TaskStatus.COMPLETED,
            }
          : t
      );
      setTasks(updatedTasks);
      setActiveTask(
        updatedTasks.find((t) => t.id === activeTask.id).status ===
          TaskStatus.COMPLETED
          ? null
          : updatedTasks.find((t) => t.id === activeTask.id)
      );
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Pomodoro Task Manager</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Timer Settings</h2>
          <div className="mb-4">
            <label className="block mb-2">Work Interval (minutes)</label>
            <Slider
              value={[workInterval]}
              onValueChange={(value) => setWorkInterval(value[0])}
              max={60}
              step={1}
            />
            <span>{workInterval} minutes</span>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Break Interval (minutes)</label>
            <Slider
              value={[breakInterval]}
              onValueChange={(value) => setBreakInterval(value[0])}
              max={30}
              step={1}
            />
            <span>{breakInterval} minutes</span>
          </div>
          <Timer
            workInterval={workInterval}
            breakInterval={breakInterval}
            onTimerEnd={handleTimerEnd}
          />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Add New Task</h2>
          <Input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Task title"
            className="mb-2"
          />
          <Input
            type="text"
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            placeholder="Task description"
            className="mb-2"
          />
          <Button onClick={addTask}>Add Task</Button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Tasks</h2>
          {tasks
            .filter((task) => task.status !== TaskStatus.COMPLETED)
            .map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onTaskClick={handleTaskClick}
                isActive={activeTask && activeTask.id === task.id}
              />
            ))}
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Completed Tasks</h2>
          {tasks
            .filter((task) => task.status === TaskStatus.COMPLETED)
            .map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onTaskClick={handleTaskClick}
                isActive={false}
              />
            ))}
        </div>
      </div>
      {selectedTask && (
        <TaskDescription
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
      {selectedTask && selectedTask.status === TaskStatus.NOT_STARTED && (
        <Button onClick={() => startTask(selectedTask)} className="mt-2">
          Start Task
        </Button>
      )}
    </div>
  );
}